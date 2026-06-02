'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Artificial delay to show the high-fidelity branding
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1800);

    const removeTimer = setTimeout(() => {
      setShouldRender(false);
    }, 2300);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020617] transition-all duration-700 ease-in-out',
        !isVisible && 'opacity-0 pointer-events-none'
      )}
    >
      <div className="relative flex flex-col items-center gap-8">
        {/* Animated Logo Container */}
        <div className="relative h-24 w-24 sm:h-32 sm:w-32 animate-in zoom-in duration-1000">
          <div className="absolute inset-0 bg-accent/20 rounded-full blur-3xl animate-pulse" />
          <Image
            src="/criteria.svg"
            alt="Criteria Logo"
            fill
            className="relative z-10"
            priority
          />
        </div>

        {/* Text Animation */}
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-white text-3xl sm:text-5xl font-black tracking-tighter uppercase animate-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-both">
            Criteria
          </h1>
          <div className="h-0.5 w-12 bg-accent rounded-full animate-in zoom-in duration-700 delay-500 fill-mode-both" />
          <p className="text-accent/60 text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] animate-in fade-in duration-1000 delay-700 fill-mode-both">
            High Precision Engine
          </p>
        </div>

        {/* Loading Indicator */}
        <div className="absolute bottom-[-100px] flex gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce" />
          <div className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce delay-150" />
          <div className="h-1.5 w-1.5 rounded-full bg-accent animate-bounce delay-300" />
        </div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-8 left-8 h-12 w-12 border-t-2 border-l-2 border-accent/20 rounded-tl-xl" />
      <div className="absolute bottom-8 right-8 h-12 w-12 border-b-2 border-r-2 border-accent/20 rounded-br-xl" />
    </div>
  );
}
