/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChoiceOption, ChoiceImpact } from '../data/gameData.ts';
import { ArrowRight, CheckCircle2, AlertOctagon, HelpCircle } from 'lucide-react';

interface ResultSheetProps {
  neOldu: string;
  neden: string;
  etki: ChoiceImpact;
  isTimeout?: boolean;
  onContinue: () => void;
}

export function ResultSheet({
  neOldu,
  neden,
  etki,
  isTimeout = false,
  onContinue,
}: ResultSheetProps) {
  return (
    <div
      data-cy="sonuc-panel"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="w-full max-w-lg bg-[#1B2233] border-t-2 sm:border-2 border-[#3A4256] rounded-t-lg sm:rounded-lg shadow-2xl flex flex-col overflow-hidden max-h-[85vh]">
        {/* Header Bar */}
        <div className="px-4 py-3 bg-[#151D2C] border-b-2 border-[#3A4256] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isTimeout ? (
              <AlertOctagon className="w-5 h-5 text-[#C8553D]" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-[#2FA4A9]" />
            )}
            <span className="font-pixel text-sm font-bold tracking-wider text-[#F2E6C9]">
              {isTimeout ? 'SÜRE DOLDU' : 'KARAR ETKİSİ VE ANALİZ'}
            </span>
          </div>

          {/* Resource Impact Tags */}
          <div className="flex items-center gap-1.5 text-xs font-pixel">
            {etki.butce !== undefined && (
              <span
                className={`px-1.5 py-0.5 rounded border text-[11px] ${
                  etki.butce > 0
                    ? 'border-[#2FA4A9] text-[#2FA4A9] bg-[#2FA4A9]/10'
                    : 'border-[#C8553D] text-[#C8553D] bg-[#C8553D]/10'
                }`}
              >
                Bütçe {etki.butce > 0 ? `+${etki.butce}` : etki.butce}
              </span>
            )}
            {etki.guven !== undefined && (
              <span
                className={`px-1.5 py-0.5 rounded border text-[11px] ${
                  etki.guven > 0
                    ? 'border-[#2FA4A9] text-[#2FA4A9] bg-[#2FA4A9]/10'
                    : 'border-[#C8553D] text-[#C8553D] bg-[#C8553D]/10'
                }`}
              >
                Güven {etki.guven > 0 ? `+${etki.guven}` : etki.guven}
              </span>
            )}
            {etki.uyum !== undefined && (
              <span
                className={`px-1.5 py-0.5 rounded border text-[11px] ${
                  etki.uyum > 0
                    ? 'border-[#2FA4A9] text-[#2FA4A9] bg-[#2FA4A9]/10'
                    : 'border-[#C8553D] text-[#C8553D] bg-[#C8553D]/10'
                }`}
              >
                Uyum {etki.uyum > 0 ? `+${etki.uyum}` : etki.uyum}
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {/* Ne Oldu Box */}
          <div className="bg-[#151D2C] border-2 border-[#3A4256] p-3.5 rounded">
            <div className="flex items-center gap-1.5 text-xs font-pixel text-[#E8A33D] mb-1.5">
              <span>⚡</span>
              <span>NE OLDU?</span>
            </div>
            <p
              data-cy="ne-oldu"
              className="text-sm font-body text-[#F2E6C9] leading-relaxed"
            >
              {neOldu}
            </p>
          </div>

          {/* Neden Box */}
          <div className="bg-[#151D2C] border-2 border-[#3A4256] p-3.5 rounded">
            <div className="flex items-center gap-1.5 text-xs font-pixel text-[#2FA4A9] mb-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>NEDEN? (KLİNİK & ETİK GEREKÇE)</span>
            </div>
            <p
              data-cy="neden"
              className="text-sm font-body text-[#A6B2C8] leading-relaxed"
            >
              {neden}
            </p>
          </div>
        </div>

        {/* Continue Button */}
        <div className="p-4 bg-[#151D2C] border-t-2 border-[#3A4256]">
          <button
            type="button"
            data-cy="btn-devam"
            onClick={onContinue}
            className="w-full min-h-[48px] bg-[#2FA4A9] hover:bg-[#289297] active:scale-[0.99] text-[#0B101B] font-pixel font-bold text-sm tracking-wider rounded border-2 border-[#2FA4A9] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <span>DEVAM</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
