/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Seviye, Rol, Hedef, IMAGES } from '../data/gameData.ts';
import { PixelSceneImage } from './PixelSceneImage.tsx';
import { Zap, AlertTriangle, ShieldCheck } from 'lucide-react';

interface StartScreenProps {
  seviye: Seviye;
  setSeviye: (s: Seviye) => void;
  rol: Rol;
  setRol: (r: Rol) => void;
  hedef: Hedef;
  setHedef: (h: Hedef) => void;
  onStart: () => void;
}

export function StartScreen({
  seviye,
  setSeviye,
  rol,
  setRol,
  hedef,
  setHedef,
  onStart,
}: StartScreenProps) {
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col bg-[#0B0F19] min-h-screen">
      {/* Pixel Art Scene - Top Half */}
      <PixelSceneImage src={IMAGES.startHeader} alt="Ilgaz Şehir Hastanesi Girişi">
        {/* Top Badges */}
        <div className="p-3 flex justify-between items-center pointer-events-auto">
          <div className="bg-[#151D2C]/90 border-2 border-[#3A4256] px-2.5 py-1 text-xs font-pixel text-[#F2E6C9] flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 bg-[#2FA4A9] inline-block animate-pulse"></span>
            <span>GİRİŞ / 07:48</span>
          </div>
          <div className="bg-[#151D2C]/90 border-2 border-[#C8553D] px-2 py-0.5 text-xs font-pixel text-[#C8553D] shadow-md tracking-wider">
            RADYOLOJİ V1.0
          </div>
        </div>

        {/* Bottom Bar over pixel scene */}
        <div className="absolute bottom-2 left-3 right-3 flex justify-between items-center pointer-events-auto">
          <div className="bg-[#151D2C]/90 border-2 border-[#3A4256] px-2.5 py-1 text-[11px] font-pixel text-[#A6B2C8] flex items-center gap-1.5 backdrop-blur-xs">
            <AlertTriangle className="w-3.5 h-3.5 text-[#E8A33D]" />
            <span className="truncate max-w-[200px] sm:max-w-none text-[#F2E6C9]">
              Ilgaz Şehir Hastanesi • Ana Giriş Kapısı
            </span>
          </div>
          <div className="bg-[#151D2C]/90 border-2 border-[#2FA4A9] px-2 py-0.5 text-xs font-pixel text-[#2FA4A9] text-center">
            <span className="block text-[9px] uppercase text-[#A6B2C8]">NÖBET GÜNÜ</span>
            #01
          </div>
        </div>
      </PixelSceneImage>

      {/* Dark Framed Panel - Bottom Half */}
      <div className="p-4 sm:p-5 bg-[#1B2233] border-x-2 border-b-2 border-[#3A4256] flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {/* Header Title */}
          <div>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-[#151D2C] border-2 border-[#E8A33D] flex items-center justify-center text-[#E8A33D]">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-pixel font-bold tracking-wide text-[#F2E6C9]">
                  RadyoAI
                </h1>
              </div>
              <span className="font-pixel text-[11px] px-2.5 py-1 bg-[#151D2C] border-2 border-[#E8A33D] text-[#E8A33D] tracking-wider uppercase">
                KLİNİK KARAR SİMÜLASYONU
              </span>
            </div>
            <p className="mt-2 text-sm text-[#A6B2C8] font-body italic border-l-2 border-[#2FA4A9] pl-3 py-0.5">
              &ldquo;Modeli sen onaylıyorsun.{' '}
              <span className="text-[#E8A33D] font-semibold">
                Sonuçlarına da sen katlanıyorsun.
              </span>
              &rdquo;
            </p>
          </div>

          <div className="h-[1px] bg-[#3A4256] my-2" />

          {/* Question 01: Seviye */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-pixel">
              <span className="text-[#2FA4A9]">01. SEVİYEN?</span>
              <span className="text-[#A6B2C8] text-[11px] font-body">{seviye}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                data-cy="seviye-yeni"
                onClick={() => setSeviye('Yeni başladım')}
                className={`min-h-[48px] px-2 py-2 text-xs font-pixel rounded transition-colors border-2 ${
                  seviye === 'Yeni başladım'
                    ? 'bg-[#2FA4A9] text-[#0B101B] border-[#2FA4A9] font-bold shadow-sm'
                    : 'bg-[#1A2538] text-[#F2E6C9] border-[#3A4256] hover:border-[#A6B2C8]'
                }`}
              >
                Yeni başladım
              </button>
              <button
                type="button"
                data-cy="seviye-orta"
                onClick={() => setSeviye('Biraz biliyorum')}
                className={`min-h-[48px] px-2 py-2 text-xs font-pixel rounded transition-colors border-2 ${
                  seviye === 'Biraz biliyorum'
                    ? 'bg-[#2FA4A9] text-[#0B101B] border-[#2FA4A9] font-bold shadow-sm'
                    : 'bg-[#1A2538] text-[#F2E6C9] border-[#3A4256] hover:border-[#A6B2C8]'
                }`}
              >
                Biraz biliyorum
              </button>
              <button
                type="button"
                data-cy="seviye-deneyimli"
                onClick={() => setSeviye('Deneyimliyim')}
                className={`min-h-[48px] px-2 py-2 text-xs font-pixel rounded transition-colors border-2 ${
                  seviye === 'Deneyimliyim'
                    ? 'bg-[#2FA4A9] text-[#0B101B] border-[#2FA4A9] font-bold shadow-sm'
                    : 'bg-[#1A2538] text-[#F2E6C9] border-[#3A4256] hover:border-[#A6B2C8]'
                }`}
              >
                Deneyimliyim
              </button>
            </div>
          </div>

          {/* Question 02: Rol */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-pixel">
              <span className="text-[#2FA4A9]">02. ROLÜN?</span>
              <span className="text-[#A6B2C8] text-[11px] font-body">{rol}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                data-cy="rol-ogrenci"
                onClick={() => setRol('Öğrenci')}
                className={`min-h-[48px] px-2 py-2 text-xs font-pixel rounded transition-colors border-2 ${
                  rol === 'Öğrenci'
                    ? 'bg-[#2FA4A9] text-[#0B101B] border-[#2FA4A9] font-bold shadow-sm'
                    : 'bg-[#1A2538] text-[#F2E6C9] border-[#3A4256] hover:border-[#A6B2C8]'
                }`}
              >
                Öğrenci
              </button>
              <button
                type="button"
                data-cy="rol-yazilimci"
                onClick={() => setRol('Yazılımcı')}
                className={`min-h-[48px] px-2 py-2 text-xs font-pixel rounded transition-colors border-2 ${
                  rol === 'Yazılımcı'
                    ? 'bg-[#2FA4A9] text-[#0B101B] border-[#2FA4A9] font-bold shadow-sm'
                    : 'bg-[#1A2538] text-[#F2E6C9] border-[#3A4256] hover:border-[#A6B2C8]'
                }`}
              >
                Yazılımcı
              </button>
              <button
                type="button"
                data-cy="rol-saglik"
                onClick={() => setRol('Sağlık çalışanı')}
                className={`min-h-[48px] px-2 py-2 text-xs font-pixel rounded transition-colors border-2 ${
                  rol === 'Sağlık çalışanı'
                    ? 'bg-[#2FA4A9] text-[#0B101B] border-[#2FA4A9] font-bold shadow-sm'
                    : 'bg-[#1A2538] text-[#F2E6C9] border-[#3A4256] hover:border-[#A6B2C8]'
                }`}
              >
                Sağlık çalışanı
              </button>
            </div>
          </div>

          {/* Question 03: Hedef */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-pixel">
              <span className="text-[#2FA4A9]">03. HEDEFİN?</span>
              <span className="text-[#A6B2C8] text-[11px] font-body">{hedef}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                data-cy="hedef-ogrenmek"
                onClick={() => setHedef('Öğrenmek')}
                className={`min-h-[48px] px-2 py-2 text-xs font-pixel rounded transition-colors border-2 ${
                  hedef === 'Öğrenmek'
                    ? 'bg-[#2FA4A9] text-[#0B101B] border-[#2FA4A9] font-bold shadow-sm'
                    : 'bg-[#1A2538] text-[#F2E6C9] border-[#3A4256] hover:border-[#A6B2C8]'
                }`}
              >
                Öğrenmek
              </button>
              <button
                type="button"
                data-cy="hedef-sinamak"
                onClick={() => setHedef('Kendimi sınamak')}
                className={`min-h-[48px] px-2 py-2 text-xs font-pixel rounded transition-colors border-2 ${
                  hedef === 'Kendimi sınamak'
                    ? 'bg-[#2FA4A9] text-[#0B101B] border-[#2FA4A9] font-bold shadow-sm'
                    : 'bg-[#1A2538] text-[#F2E6C9] border-[#3A4256] hover:border-[#A6B2C8]'
                }`}
              >
                Kendimi sınamak
              </button>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-5 pb-1">
          <button
            type="button"
            data-cy="btn-basla"
            onClick={onStart}
            className="w-full min-h-[52px] bg-[#2FA4A9] hover:bg-[#289297] active:scale-[0.99] text-[#0B101B] font-pixel font-bold text-base tracking-wider rounded border-2 border-[#2FA4A9] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>SİMÜLASYONU BAŞLAT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
