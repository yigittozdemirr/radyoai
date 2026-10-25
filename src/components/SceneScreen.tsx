/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  SceneData,
  Rol,
  Seviye,
  formatReplacements,
  IMAGES,
  ChoiceImpact,
} from '../data/gameData.ts';
import { PixelSceneImage } from './PixelSceneImage.tsx';
import { ResultSheet } from './ResultSheet.tsx';
import { TutorSheet, ChatMessage } from './TutorSheet.tsx';
import {
  Clock,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

interface Resources {
  butce: number;
  guven: number;
  uyum: number;
}

interface SceneScreenProps {
  scene: SceneData;
  seviye: Seviye;
  rol: Rol;
  resources: Resources;
  decision1WasB: boolean;
  onMakeChoice: (choiceKey: 'A' | 'B', isTimeout?: boolean) => void;
  // Tutor props
  tutorHistory: ChatMessage[];
  onSendTutorMessage: (msg: string) => Promise<void>;
  isTutorLoading: boolean;
  tutorError: string | null;
}

export function SceneScreen({
  scene,
  seviye,
  rol,
  resources,
  decision1WasB,
  onMakeChoice,
  tutorHistory,
  onSendTutorMessage,
  isTutorLoading,
  tutorError,
}: SceneScreenProps) {
  // Timer for "Deneyimliyim"
  const isDeneyimli = seviye === 'Deneyimliyim';
  const [timeLeft, setTimeLeft] = useState(60);

  // Hint box: open by default if "Yeni başladım"
  const [hintOpen, setHintOpen] = useState(seviye === 'Yeni başladım');

  // Tutor sheet visibility
  const [tutorOpen, setTutorOpen] = useState(false);

  // Result sheet state
  const [activeResult, setActiveResult] = useState<{
    neOldu: string;
    neden: string;
    etki: ChoiceImpact;
    isTimeout: boolean;
    choiceKey: 'A' | 'B';
  } | null>(null);

  // Reset timer and hint box state on scene change
  useEffect(() => {
    setTimeLeft(60);
    setHintOpen(seviye === 'Yeni başladım');
    setActiveResult(null);
  }, [scene.id, seviye]);

  // Countdown timer effect
  useEffect(() => {
    if (!isDeneyimli || activeResult !== null) return;

    if (timeLeft <= 0) {
      // Trigger choice B automatically
      handleChoice('B', true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isDeneyimli, timeLeft, activeResult]);

  const handleChoice = (choiceKey: 'A' | 'B', isTimeout = false) => {
    const choice = scene[choiceKey];
    let neOlduText = formatReplacements(choice.neOldu, rol);

    if (isTimeout) {
      neOlduText = `Süre doldu: kararsızlık da bir karardır. ${neOlduText}`;
    }

    const nedenText = formatReplacements(choice.neden, rol);

    setActiveResult({
      neOldu: neOlduText,
      neden: nedenText,
      etki: choice.etki,
      isTimeout,
      choiceKey,
    });
  };

  const handleResultContinue = () => {
    if (!activeResult) return;
    const { choiceKey, isTimeout } = activeResult;
    setActiveResult(null);
    onMakeChoice(choiceKey, isTimeout);
  };

  const formattedReplik = formatReplacements(scene.replik, rol);

  return (
    <div
      data-cy={`sahne-${scene.id}`}
      className="w-full max-w-lg mx-auto flex flex-col bg-[#0B0F19] min-h-screen"
    >
      {/* Top Half: Pixel Art Scene (~410px) */}
      <PixelSceneImage src={IMAGES.sceneBg} alt={scene.kisi}>
        {/* Top Header Overlay Bar */}
        <div className="p-3 flex justify-between items-center pointer-events-auto gap-2">
          {/* Visitor badge */}
          <div className="bg-[#151D2C]/90 border-2 border-[#3A4256] px-2.5 py-1 text-xs font-pixel text-[#F2E6C9] flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#2FA4A9] inline-block"></span>
            <span>ZİYARETÇİ {scene.id}/3</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Timer for Deneyimliyim */}
            {isDeneyimli && (
              <div className="bg-[#151D2C]/90 border-2 border-[#E8A33D] px-2.5 py-1 text-xs font-pixel text-[#E8A33D] flex items-center gap-1 shadow-md">
                <Clock className="w-3.5 h-3.5" />
                <span data-cy="sayac">{timeLeft}s</span>
              </div>
            )}

            {/* Tutor Button */}
            <button
              type="button"
              data-cy="tutor-ac"
              onClick={() => setTutorOpen(true)}
              className="bg-[#151D2C]/90 border-2 border-[#2FA4A9] hover:bg-[#2FA4A9] text-[#2FA4A9] hover:text-[#0B101B] px-2.5 py-1 text-xs font-pixel rounded transition-colors flex items-center gap-1 cursor-pointer shadow-md"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Tutor&apos;a sor</span>
            </button>
          </div>
        </div>

        {/* Delayed Consequence on Scene 3 */}
        {scene.id === 3 && decision1WasB && (
          <div className="mx-3 mt-1 pointer-events-auto">
            <div
              data-cy="kvkk-uyari"
              className="bg-[#C8553D]/95 border-2 border-[#C8553D] text-[#F2E6C9] p-2 rounded text-xs font-body shadow-lg flex items-start gap-2 animate-in fade-in"
            >
              <AlertTriangle className="w-4 h-4 text-[#F2E6C9] shrink-0 mt-0.5" />
              <span className="leading-snug">
                KVKK sorumlusu kapıda: &ldquo;Eğitim verisinde hasta adları olduğu bildirildi. Açıklama bekliyoruz.&rdquo;
              </span>
            </div>
          </div>
        )}

        {/* Character Name Tag in Scene */}
        <div className="absolute bottom-28 left-4 pointer-events-auto">
          <div className="bg-[#151D2C]/95 border-2 border-[#3A4256] px-2.5 py-1 text-xs font-pixel shadow-md inline-flex items-center gap-1.5">
            <span className="text-[#2FA4A9] font-bold">• {scene.unvan}</span>
            <span className="text-[#F2E6C9]">{scene.isim}</span>
          </div>
        </div>

        {/* Speech Bubble in Scene */}
        <div className="absolute bottom-2 left-3 right-3 pointer-events-auto">
          <div className="bg-[#151D2C]/95 border-2 border-[#3A4256] p-3 rounded-lg shadow-xl relative backdrop-blur-xs">
            <div className="flex items-start gap-2">
              <MessageSquare className="w-4 h-4 text-[#E8A33D] shrink-0 mt-0.5" />
              <p
                data-cy="replik"
                className="text-xs sm:text-sm font-body text-[#F2E6C9] leading-relaxed"
              >
                &ldquo;{formattedReplik}&rdquo;
              </p>
            </div>
            {/* Small triangle arrow on top of bubble pointing to character */}
            <div className="absolute -top-2 left-6 w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-[#3A4256]"></div>
          </div>
        </div>
      </PixelSceneImage>

      {/* Dark Framed Panel - Bottom Half */}
      <div className="p-4 sm:p-5 bg-[#1B2233] border-x-2 border-b-2 border-[#3A4256] flex-1 flex flex-col justify-between space-y-4">
        {/* Resources Bar */}
        <div className="grid grid-cols-3 gap-2">
          {/* Bütçe */}
          <div className="bg-[#151D2C] border-2 border-[#3A4256] p-2 rounded">
            <div className="flex items-center justify-between text-xs font-pixel mb-1">
              <span className="text-[#A6B2C8] flex items-center gap-1">
                <span>💰</span> BÜTÇE
              </span>
              <span className="font-bold text-[#F2E6C9]">
                <span data-cy="kaynak-butce">{resources.butce}</span>/10
              </span>
            </div>
            {/* Meter Bar */}
            <div className="w-full bg-[#0B0F19] h-1.5 rounded-full overflow-hidden border border-[#3A4256]">
              <div
                className="bg-[#2FA4A9] h-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, resources.butce * 10))}%` }}
              />
            </div>
          </div>

          {/* Güven */}
          <div className="bg-[#151D2C] border-2 border-[#3A4256] p-2 rounded">
            <div className="flex items-center justify-between text-xs font-pixel mb-1">
              <span className="text-[#A6B2C8] flex items-center gap-1">
                <span>💛</span> GÜVEN
              </span>
              <span className="font-bold text-[#F2E6C9]">
                <span data-cy="kaynak-guven">{resources.guven}</span>/10
              </span>
            </div>
            {/* Meter Bar */}
            <div className="w-full bg-[#0B0F19] h-1.5 rounded-full overflow-hidden border border-[#3A4256]">
              <div
                className="bg-[#E8A33D] h-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, resources.guven * 10))}%` }}
              />
            </div>
          </div>

          {/* Uyum */}
          <div className="bg-[#151D2C] border-2 border-[#3A4256] p-2 rounded">
            <div className="flex items-center justify-between text-xs font-pixel mb-1">
              <span className="text-[#A6B2C8] flex items-center gap-1">
                <span>⚖</span> UYUM
              </span>
              <span className="font-bold text-[#F2E6C9]">
                <span data-cy="kaynak-uyum">{resources.uyum}</span>/10
              </span>
            </div>
            {/* Meter Bar */}
            <div className="w-full bg-[#0B0F19] h-1.5 rounded-full overflow-hidden border border-[#3A4256]">
              <div
                className="bg-[#2FA4A9] h-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, resources.uyum * 10))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Hint Box (ipucu-kutusu) */}
        <div
          data-cy="ipucu-kutusu"
          className="bg-[#151D2C] border-2 border-[#3A4256] rounded overflow-hidden transition-all"
        >
          <button
            type="button"
            onClick={() => setHintOpen((prev) => !prev)}
            className="w-full px-3 py-2 flex items-center justify-between text-xs font-pixel text-[#E8A33D] hover:bg-[#1A2538] transition-colors cursor-pointer select-none"
          >
            <div className="flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-[#E8A33D]" />
              <span>İPUCU {hintOpen ? '(Kapat)' : '(Tıkla & Oku)'}</span>
            </div>
            {hintOpen ? (
              <ChevronUp className="w-4 h-4 text-[#A6B2C8]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#A6B2C8]" />
            )}
          </button>
          {hintOpen && (
            <div className="px-3 pb-3 pt-1 border-t border-[#3A4256]/60 text-xs font-body text-[#A6B2C8] leading-relaxed">
              {scene.ipucu}
            </div>
          )}
        </div>

        {/* Choices Section */}
        {/*
          CRITICAL REQUIREMENT:
          "Both choice buttons must look identical so the UI never hints at the right answer.
          Do NOT copy their sample texts, the colored A/B button styles or the subtitles under choices
          ('Güvenli & Etik Yöntem', 'Hukuki risk')."
          Buttons must be at least 48px tall.
        */}
        <div className="space-y-2.5 pt-1">
          {/* Choice A Button */}
          <button
            type="button"
            data-cy="secim-A"
            onClick={() => handleChoice('A')}
            className="w-full min-h-[50px] p-3 bg-[#1A2538] hover:bg-[#202d44] active:bg-[#151D2C] text-[#F2E6C9] border-2 border-[#3A4256] hover:border-[#A6B2C8] rounded flex items-center justify-between gap-3 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded bg-[#151D2C] border-2 border-[#3A4256] group-hover:border-[#A6B2C8] flex items-center justify-center font-pixel text-xs font-bold text-[#A6B2C8] group-hover:text-[#F2E6C9]">
                A
              </span>
              <span className="font-pixel text-xs sm:text-sm text-[#F2E6C9]">
                {scene.A.etiket}
              </span>
            </div>
            <span className="font-pixel text-xs text-[#A6B2C8] group-hover:text-[#2FA4A9] shrink-0">
              SEÇ →
            </span>
          </button>

          {/* Choice B Button (Identical styling) */}
          <button
            type="button"
            data-cy="secim-B"
            onClick={() => handleChoice('B')}
            className="w-full min-h-[50px] p-3 bg-[#1A2538] hover:bg-[#202d44] active:bg-[#151D2C] text-[#F2E6C9] border-2 border-[#3A4256] hover:border-[#A6B2C8] rounded flex items-center justify-between gap-3 text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded bg-[#151D2C] border-2 border-[#3A4256] group-hover:border-[#A6B2C8] flex items-center justify-center font-pixel text-xs font-bold text-[#A6B2C8] group-hover:text-[#F2E6C9]">
                B
              </span>
              <span className="font-pixel text-xs sm:text-sm text-[#F2E6C9]">
                {scene.B.etiket}
              </span>
            </div>
            <span className="font-pixel text-xs text-[#A6B2C8] group-hover:text-[#2FA4A9] shrink-0">
              SEÇ →
            </span>
          </button>
        </div>
      </div>

      {/* Result Bottom Sheet */}
      {activeResult && (
        <ResultSheet
          neOldu={activeResult.neOldu}
          neden={activeResult.neden}
          etki={activeResult.etki}
          isTimeout={activeResult.isTimeout}
          onContinue={handleResultContinue}
        />
      )}

      {/* Socratic Tutor Sheet */}
      {tutorOpen && (
        <TutorSheet
          scene={scene}
          rol={rol}
          history={tutorHistory}
          onSendMessage={onSendTutorMessage}
          isLoading={isTutorLoading}
          errorMessage={tutorError}
          onClose={() => setTutorOpen(false)}
        />
      )}
    </div>
  );
}
