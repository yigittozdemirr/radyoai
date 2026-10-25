/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface PixelSceneImageProps {
  src: string;
  alt: string;
  className?: string;
  children?: React.ReactNode;
}

export function PixelSceneImage({ src, alt, className = '', children }: PixelSceneImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative w-full h-[380px] sm:h-[410px] bg-[#1B2233] overflow-hidden select-none border-b-2 border-[#3A4256] ${className}`}>
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ imageRendering: 'pixelated' }}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#1B2233] text-[#A6B2C8]">
          <span className="font-pixel text-xl text-[#2FA4A9]">[ RADYOAI GÖRÜNTÜ ]</span>
          <span className="text-xs text-[#A6B2C8] mt-1 font-body">{alt}</span>
        </div>
      )}

      {/* CRT Scanline Overlay */}
      <div className="absolute inset-0 crt-scanlines pointer-events-none z-10 opacity-70" />

      {/* Vignette border */}
      <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(11,15,25,0.7)] pointer-events-none z-10" />

      {/* Children overlays (Badges, tags, speech bubble) */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {children}
      </div>
    </div>
  );
}
