/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { SceneData, Rol, formatReplacements } from '../data/gameData.ts';
import { X, Send, Bot, User, Loader2, Sparkles, AlertCircle } from 'lucide-react';

export interface ChatMessage {
  role: 'user' | 'tutor';
  text: string;
  model?: string;
}

interface TutorSheetProps {
  scene: SceneData;
  rol: Rol;
  history: ChatMessage[];
  onSendMessage: (msg: string) => Promise<void>;
  isLoading: boolean;
  errorMessage: string | null;
  onClose: () => void;
}

export function TutorSheet({
  scene,
  rol,
  history,
  onSendMessage,
  isLoading,
  errorMessage,
  onClose,
}: TutorSheetProps) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const msg = inputText.trim();
    setInputText('');
    onSendMessage(msg);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#1B2233] border-t-2 sm:border-2 border-[#3A4256] rounded-t-lg sm:rounded-lg shadow-2xl flex flex-col h-[85vh] max-h-[650px] overflow-hidden">
        {/* Tutor Header */}
        <div className="px-4 py-3 bg-[#151D2C] border-b-2 border-[#3A4256] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#2FA4A9]/20 border border-[#2FA4A9] flex items-center justify-center text-[#2FA4A9]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="font-pixel text-sm font-bold text-[#F2E6C9] flex items-center gap-2">
                <span>SOKRATİK AI TUTOR</span>
                <span className="text-[10px] text-[#2FA4A9] bg-[#2FA4A9]/10 px-1.5 py-0.2 border border-[#2FA4A9]/40 rounded font-normal">
                  RadyoAI Danışmanı
                </span>
              </div>
              <div className="text-[11px] text-[#A6B2C8] font-body line-clamp-1">
                Karakter: {scene.kisi}
              </div>
            </div>
          </div>

          <button
            type="button"
            data-cy="tutor-kapat"
            onClick={onClose}
            className="p-1.5 text-[#A6B2C8] hover:text-[#F2E6C9] hover:bg-[#1A2538] rounded border border-transparent hover:border-[#3A4256] transition-colors cursor-pointer"
            aria-label="Tutor kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational banner */}
        <div className="bg-[#151D2C]/60 px-4 py-2 border-b border-[#3A4256] text-[11px] font-body text-[#A6B2C8] flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#2FA4A9] shrink-0" />
          <span>
            Tutor doğru cevabı doğrudan vermez. Karar vermene yardımcı olacak Sokratik sorular sorar.
          </span>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 font-body text-sm">
          {history.length === 0 && (
            <div className="bg-[#151D2C] border-2 border-[#3A4256] p-3 rounded text-xs text-[#A6B2C8] space-y-1">
              <p className="font-semibold text-[#F2E6C9] font-pixel">
                {scene.kisi} bir karar bekliyor:
              </p>
              <p className="italic text-[#E8A33D]">
                &ldquo;{formatReplacements(scene.replik, rol)}&rdquo;
              </p>
              <p className="pt-1 text-[#A6B2C8]">
                İki seçenek arasında kaldın mı? Aklındaki tereddüdü veya riskleri bana sorabilirsin.
              </p>
            </div>
          )}

          {history.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'tutor' && (
                <div className="w-7 h-7 rounded shrink-0 bg-[#2FA4A9]/20 border border-[#2FA4A9] flex items-center justify-center text-[#2FA4A9] text-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                {...(msg.role === 'tutor' ? { 'data-cy': 'tutor-mesaj' } : {})}
                className={`max-w-[85%] rounded px-3 py-2 text-sm leading-relaxed border ${
                  msg.role === 'user'
                    ? 'bg-[#2FA4A9] text-[#0B101B] border-[#2FA4A9] font-medium'
                    : 'bg-[#151D2C] text-[#F2E6C9] border-[#3A4256]'
                }`}
              >
                {msg.text}
                {msg.model && (
                  <div data-cy="tutor-model" className="mt-1 text-[10px] text-[#A6B2C8]/70 font-pixel">
                    {msg.model}
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded shrink-0 bg-[#3A4256] flex items-center justify-center text-[#F2E6C9] text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-xs text-[#2FA4A9] font-pixel">
              <div className="w-7 h-7 rounded bg-[#2FA4A9]/20 border border-[#2FA4A9] flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <span>Tutor düşünüyor...</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-[#C8553D]/15 border-2 border-[#C8553D] rounded text-xs text-[#F2E6C9] flex items-center gap-2 font-body">
              <AlertCircle className="w-4 h-4 text-[#C8553D] shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="p-3 bg-[#151D2C] border-t-2 border-[#3A4256] flex items-center gap-2"
        >
          <input
            type="text"
            data-cy="tutor-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tutor'a soru sor veya düşünceni paylaş..."
            disabled={isLoading}
            className="flex-1 min-h-[44px] bg-[#1A2538] border-2 border-[#3A4256] focus:border-[#2FA4A9] focus:outline-hidden px-3 text-sm font-body text-[#F2E6C9] placeholder-[#A6B2C8]/60 rounded"
          />
          <button
            type="submit"
            data-cy="tutor-gonder"
            disabled={isLoading || !inputText.trim()}
            className="min-h-[44px] px-4 bg-[#2FA4A9] hover:bg-[#289297] disabled:opacity-50 disabled:cursor-not-allowed text-[#0B101B] font-pixel font-bold text-xs rounded border-2 border-[#2FA4A9] transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>GÖNDER</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
