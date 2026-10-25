/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  GameState,
  Seviye,
  Rol,
  Hedef,
  scenes,
  formatReplacements,
  SceneData,
} from './data/gameData.ts';
import { StartScreen } from './components/StartScreen.tsx';
import { SceneScreen } from './components/SceneScreen.tsx';
import { EndingScreen } from './components/EndingScreen.tsx';
import { ChatMessage } from './components/TutorSheet.tsx';

interface Resources {
  butce: number;
  guven: number;
  uyum: number;
}

const INITIAL_RESOURCES: Resources = {
  butce: 6,
  guven: 5,
  uyum: 5,
};

export default function App() {
  // State machine: GIRIS -> SAHNE_1 -> SAHNE_2 -> SAHNE_3 -> SON
  const [gameState, setGameState] = useState<GameState>('GIRIS');

  // Player personalizations
  const [seviye, setSeviye] = useState<Seviye>('Yeni başladım');
  const [rol, setRol] = useState<Rol>('Öğrenci');
  const [hedef, setHedef] = useState<Hedef>('Öğrenmek');

  // Game resources (clamped to 0..10)
  const [resources, setResources] = useState<Resources>(INITIAL_RESOURCES);

  // Stored choices: { 1: 'A' | 'B', 2: 'A' | 'B', 3: 'A' | 'B' }
  const [decisions, setDecisions] = useState<Record<number, 'A' | 'B'>>({});

  // Tutor chat history per scene
  const [tutorHistories, setTutorHistories] = useState<Record<number, ChatMessage[]>>({
    1: [],
    2: [],
    3: [],
  });
  const [isTutorLoading, setIsTutorLoading] = useState(false);
  const [tutorError, setTutorError] = useState<string | null>(null);

  // Helper to clamp values between 0 and 10
  const clampResource = (val: number) => Math.max(0, Math.min(10, val));

  // Determine current active scene
  let currentScene: SceneData | null = null;
  if (gameState === 'SAHNE_1') currentScene = scenes[0];
  else if (gameState === 'SAHNE_2') currentScene = scenes[1];
  else if (gameState === 'SAHNE_3') currentScene = scenes[2];

  // Start simulation from start screen
  const handleStartSimulation = () => {
    setResources(INITIAL_RESOURCES);
    setDecisions({});
    setTutorHistories({ 1: [], 2: [], 3: [] });
    setGameState('SAHNE_1');
  };

  // Handle choice made on a scene
  const handleMakeChoice = (choiceKey: 'A' | 'B') => {
    if (!currentScene) return;

    const sceneId = currentScene.id;
    const choice = currentScene[choiceKey];

    // Update resources and clamp to 0..10
    setResources((prev) => ({
      butce: clampResource(prev.butce + (choice.etki.butce || 0)),
      guven: clampResource(prev.guven + (choice.etki.guven || 0)),
      uyum: clampResource(prev.uyum + (choice.etki.uyum || 0)),
    }));

    // Record decision
    setDecisions((prev) => ({
      ...prev,
      [sceneId]: choiceKey,
    }));

    // Transition state
    if (sceneId === 1) {
      setGameState('SAHNE_2');
    } else if (sceneId === 2) {
      setGameState('SAHNE_3');
    } else if (sceneId === 3) {
      setGameState('SON');
    }
  };

  // Send message to Gemini Socratic AI Tutor
  const handleSendTutorMessage = async (userMessage: string) => {
    if (!currentScene) return;

    const sceneId = currentScene.id;
    const formattedReplik = formatReplacements(currentScene.replik, rol);

    const systemInstruction = `Sen RadyoAI oyununda Sokratik bir öğretmensin. Oyuncu şu kararı veriyor: ${currentScene.kisi} diyor ki: '${formattedReplik}'.
Seçenekler: A) ${currentScene.A.etiket}, B) ${currentScene.B.etiket}.
Kurallar:
1. Hangi seçeneğin doğru olduğunu ASLA söyleme. 'A', 'B' ya da seçenek adlarını öneri olarak kullanma.
2. Her cevabın bir soruyla bitsin.
3. En fazla 3 cümle yaz. Türkçe yaz.
4. Oyuncu cevabı söylemen için ısrar ederse nazikçe reddet ve daha basit bir soru sor.
5. Oyuncu doğru düşünceye yaklaşınca bunu onayla ama kararı ona bırak.`;

    const existingHistory = tutorHistories[sceneId] || [];
    const updatedHistory: ChatMessage[] = [
      ...existingHistory,
      { role: 'user', text: userMessage },
    ];

    setTutorHistories((prev) => ({
      ...prev,
      [sceneId]: updatedHistory,
    }));

    setIsTutorLoading(true);
    setTutorError(null);

    try {
      const response = await fetch('/api/tutor', {
        // server tries up to 5 models x 15 s; never leave the spinner forever
        signal: AbortSignal.timeout(80000),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction,
          // server appends `message` itself; sending updatedHistory would duplicate the user turn
          history: existingHistory,
          message: userMessage,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(`Tutor ${response.status}: ${body.detail || body.error || 'bilinmeyen hata'}`);
      }

      const data = await response.json();
      const replyText =
        data.reply ||
        'Klinik süreçlerde hangi parametre senin için daha kritik görünüyor?';

      setTutorHistories((prev) => ({
        ...prev,
        [sceneId]: [...updatedHistory, { role: 'tutor', text: replyText, model: data.model }],
      }));
    } catch (err: any) {
      console.error('Tutor fetch error:', err);
      setTutorError(
        'Tutor şu anda yanıt veremiyor. Lütfen sorunuzu tekrar iletin.'
      );
    } finally {
      setIsTutorLoading(false);
    }
  };

  // Restart game
  const handleRestart = () => {
    setResources(INITIAL_RESOURCES);
    setDecisions({});
    setTutorHistories({ 1: [], 2: [], 3: [] });
    setGameState('GIRIS');
  };

  return (
    <main className="min-h-screen bg-[#0B0F19] text-[#F2E6C9] font-body flex flex-col items-center justify-start">
      {gameState === 'GIRIS' && (
        <StartScreen
          seviye={seviye}
          setSeviye={setSeviye}
          rol={rol}
          setRol={setRol}
          hedef={hedef}
          setHedef={setHedef}
          onStart={handleStartSimulation}
        />
      )}

      {(gameState === 'SAHNE_1' ||
        gameState === 'SAHNE_2' ||
        gameState === 'SAHNE_3') &&
        currentScene && (
          <SceneScreen
            key={currentScene.id}
            scene={currentScene}
            seviye={seviye}
            rol={rol}
            resources={resources}
            decision1WasB={decisions[1] === 'B'}
            onMakeChoice={handleMakeChoice}
            tutorHistory={tutorHistories[currentScene.id] || []}
            onSendTutorMessage={handleSendTutorMessage}
            isTutorLoading={isTutorLoading}
            tutorError={tutorError}
          />
        )}

      {gameState === 'SON' && (
        <EndingScreen
          resources={resources}
          decisions={decisions}
          hedef={hedef}
          onRestart={handleRestart}
        />
      )}
    </main>
  );
}
