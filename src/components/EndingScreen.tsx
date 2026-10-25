/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Hedef,
  sonlar,
  okumaOnerileri,
  IMAGES,
  scenes,
} from '../data/gameData.ts';
import { PixelSceneImage } from './PixelSceneImage.tsx';
import {
  RotateCcw,
  BookOpen,
  Award,
  AlertOctagon,
  CheckCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface Resources {
  butce: number;
  guven: number;
  uyum: number;
}

interface EndingScreenProps {
  resources: Resources;
  decisions: Record<number, 'A' | 'B'>;
  hedef: Hedef;
  onRestart: () => void;
}

export function EndingScreen({
  resources,
  decisions,
  hedef,
  onRestart,
}: EndingScreenProps) {
  // Ending rule: guven >= 5 AND uyum >= 5 -> good ending, otherwise bad ending
  const isGood = resources.guven >= 5 && resources.uyum >= 5;
  const currentSon = isGood ? sonlar.iyi : sonlar.kotu;
  const endingImage = isGood ? IMAGES.goodEnding : IMAGES.badEnding;

  // Calculate score: number of A choices
  const score = Object.values(decisions).filter((d) => d === 'A').length;

  // Bad decision lines from scenes
  const badDecisionLines: string[] = [];
  scenes.forEach((sc) => {
    if (decisions[sc.id] === 'B' && sc.B.sonSatiri) {
      badDecisionLines.push(sc.B.sonSatiri);
    }
  });

  return (
    <div
      data-cy={isGood ? 'son-iyi' : 'son-kotu'}
      className="w-full max-w-lg mx-auto flex flex-col bg-[#0B0F19] min-h-screen pb-6"
    >
      {/* Top Pixel Art Banner */}
      <PixelSceneImage
        src={endingImage}
        alt={currentSon.baslik}
        className="h-[360px] sm:h-[390px]"
      >
        {/* Top Badges */}
        <div className="p-3 flex justify-between items-center pointer-events-auto">
          <div
            className={`px-2.5 py-1 text-xs font-pixel rounded border-2 shadow-md ${
              isGood
                ? 'bg-[#151D2C]/90 border-[#2FA4A9] text-[#2FA4A9]'
                : 'bg-[#151D2C]/90 border-[#C8553D] text-[#C8553D]'
            }`}
          >
            {isGood ? 'SONUÇ: BAŞARILI' : 'DURUM: MÜHÜRLENDİ'}
          </div>

          <div
            className={`px-2.5 py-1 text-xs font-pixel rounded border-2 shadow-md ${
              isGood
                ? 'bg-[#151D2C]/90 border-[#2FA4A9] text-[#2FA4A9]'
                : 'bg-[#151D2C]/90 border-[#C8553D] text-[#C8553D]'
            }`}
          >
            {isGood ? 'STATUS: ONAYLANDI' : 'CEZA: KVKK VE ETİK İHLALİ'}
          </div>
        </div>

        {/* Bottom Banner inside image */}
        <div className="absolute bottom-2 left-3 right-3 flex justify-between items-center pointer-events-auto">
          <div className="bg-[#151D2C]/90 border-2 border-[#3A4256] px-2.5 py-1 text-[11px] font-pixel text-[#A6B2C8]">
            {isGood ? 'KLİNİK: AKTİF' : 'LABORATUVAR KAPALI'}
          </div>
          <div className="bg-[#151D2C]/90 border-2 border-[#3A4256] px-2 py-0.5 text-xs font-pixel text-[#E8A33D]">
            {isGood ? 'DOĞRULUK & GÜVEN YÜKSEK' : 'DURDURMA KARARI #404'}
          </div>
        </div>
      </PixelSceneImage>

      {/* Dark Framed Panel - Content */}
      <div className="p-4 sm:p-5 bg-[#1B2233] border-x-2 border-b-2 border-[#3A4256] flex-1 flex flex-col space-y-4">
        {/* Title and Summary */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {isGood ? (
              <span className="text-xs font-pixel px-2 py-0.5 bg-[#2FA4A9]/20 border border-[#2FA4A9] text-[#2FA4A9] rounded">
                ETİK & UYUMLU
              </span>
            ) : (
              <span className="text-xs font-pixel px-2 py-0.5 bg-[#C8553D]/20 border border-[#C8553D] text-[#C8553D] rounded">
                AĞIR İHLAL & İFLAS
              </span>
            )}
          </div>

          <h2
            className={`text-xl sm:text-2xl font-pixel font-bold tracking-wide ${
              isGood ? 'text-[#2FA4A9]' : 'text-[#C8553D]'
            }`}
          >
            {currentSon.baslik}
          </h2>

          <div className="bg-[#151D2C] border-2 border-[#3A4256] p-3 rounded">
            <p className="text-sm font-body text-[#F2E6C9] leading-relaxed">
              &ldquo;{currentSon.metin}&rdquo;
            </p>
          </div>
        </div>

        {/* Final Resources Bar */}
        <div className="bg-[#151D2C] border-2 border-[#3A4256] p-3 rounded space-y-2">
          <div className="text-xs font-pixel text-[#A6B2C8]">NİHAİ KAYNAK DEĞERLERİ</div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-1.5 bg-[#1A2538] border border-[#3A4256] rounded">
              <span className="block text-[10px] text-[#A6B2C8] font-pixel">💰 BÜTÇE</span>
              <span className="font-pixel text-base font-bold text-[#F2E6C9]">
<span data-cy="son-butce">{resources.butce}</span>/10
              </span>
            </div>
            <div className="text-center p-1.5 bg-[#1A2538] border border-[#3A4256] rounded">
              <span className="block text-[10px] text-[#A6B2C8] font-pixel">💛 GÜVEN</span>
              <span className="font-pixel text-base font-bold text-[#F2E6C9]">
<span data-cy="son-guven">{resources.guven}</span>/10
              </span>
            </div>
            <div className="text-center p-1.5 bg-[#1A2538] border border-[#3A4256] rounded">
              <span className="block text-[10px] text-[#A6B2C8] font-pixel">⚖ UYUM</span>
              <span className="font-pixel text-base font-bold text-[#F2E6C9]">
<span data-cy="son-uyum">{resources.uyum}</span>/10
              </span>
            </div>
          </div>
        </div>

        {/* Bad Decision Lines (for Bad Ending) */}
        {!isGood && badDecisionLines.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-pixel text-[#C8553D] flex items-center gap-1.5">
              <AlertOctagon className="w-4 h-4" />
              <span>SONUCA YOL AÇAN KARARLAR (KIRMIZI İŞARETLİ):</span>
            </div>
            <div className="space-y-2">
              {badDecisionLines.map((line, idx) => (
                <div
                  key={idx}
                  data-cy="son-satiri"
                  className="bg-[#151D2C] border-2 border-[#C8553D]/70 p-3 rounded text-xs font-body text-[#F2E6C9] flex items-start gap-2 shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-[#C8553D] mt-1 shrink-0" />
                  <span className="leading-snug">{line}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Good Decisions Summary (for Good Ending) */}
        {isGood && (
          <div className="space-y-2">
            <div className="text-xs font-pixel text-[#2FA4A9] flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              <span>VERİLEN SAĞLIKLI KARARLAR:</span>
            </div>
            <div className="space-y-1.5">
              {scenes.map((sc) => {
                const isA = decisions[sc.id] === 'A';
                return (
                  <div
                    key={sc.id}
                    className="bg-[#151D2C] border border-[#3A4256] p-2.5 rounded text-xs font-body text-[#A6B2C8] flex items-center justify-between"
                  >
                    <span>
                      {sc.kisi}:{' '}
                      <span className="text-[#F2E6C9] font-medium">
                        {isA ? sc.A.etiket : sc.B.etiket}
                      </span>
                    </span>
                    <span
                      className={`text-[10px] font-pixel px-1.5 py-0.5 rounded ${
                        isA
                          ? 'text-[#2FA4A9] bg-[#2FA4A9]/10'
                          : 'text-[#E8A33D] bg-[#E8A33D]/10'
                      }`}
                    >
                      {isA ? 'Etik / Güvenli' : 'Riskli'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Score Card (when hedef is "Kendimi sınamak") */}
        {hedef === 'Kendimi sınamak' && (
          <div
            data-cy="puan"
            className="bg-[#151D2C] border-2 border-[#E8A33D] p-3.5 rounded flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-[#E8A33D]/20 border border-[#E8A33D] flex items-center justify-center text-[#E8A33D]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="block text-xs font-pixel text-[#A6B2C8]">
                  SİMÜLASYON TEST SKORU
                </span>
                <span className="text-base font-pixel font-bold text-[#F2E6C9]">
                  Puan: {score}/3
                </span>
              </div>
            </div>
            <div className="text-right text-xs font-body text-[#A6B2C8]">
              {score === 3
                ? 'Mükemmel Etik & Klinik Yönetim'
                : score === 2
                ? 'Başarılı ancak risk alındı'
                : 'Ciddi risk ve ihmaller mevcut'}
            </div>
          </div>
        )}

        {/* Reading Recommendations Card (when hedef is "Öğrenmek") */}
        {hedef === 'Öğrenmek' && (
          <div
            data-cy="okuma-onerileri"
            className="bg-[#151D2C] border-2 border-[#2FA4A9] p-3.5 rounded space-y-2.5"
          >
            <div className="flex items-center gap-2 text-xs font-pixel text-[#2FA4A9]">
              <BookOpen className="w-4 h-4" />
              <span>OKUMA ÖNERİLERİ (ÖĞRENME KÖŞESİ)</span>
            </div>
            <div className="space-y-2">
              {okumaOnerileri.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#1A2538] border border-[#3A4256] hover:border-[#2FA4A9] p-2.5 rounded text-xs font-body text-[#F2E6C9] flex items-center justify-between transition-colors"
                >
                  <span className="pr-2 leading-snug">
                    {index + 1}. {item}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#2FA4A9] shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Restart Button */}
        <div className="pt-2">
          <button
            type="button"
            data-cy="btn-yeniden"
            onClick={onRestart}
            className={`w-full min-h-[50px] font-pixel font-bold text-sm tracking-wider rounded border-2 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.99] ${
              isGood
                ? 'bg-[#2FA4A9] hover:bg-[#289297] text-[#0B101B] border-[#2FA4A9]'
                : 'bg-[#C8553D] hover:bg-[#b04832] text-[#F2E6C9] border-[#C8553D]'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>YENİDEN OYNA</span>
          </button>
        </div>
      </div>
    </div>
  );
}
