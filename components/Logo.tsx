'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { LOGO_DARK, LOGO_LIGHT } from '@/lib/logoData';

function useTheme() {
  const [isLight, setIsLight] = useState(false);
  useEffect(() => {
    const check = () => setIsLight(document.documentElement.classList.contains('light-mode'));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return isLight;
}

export function LogoLink() {
  const isLight = useTheme();
  return (
    <Link href="/" className="flex items-center group">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={isLight ? LOGO_LIGHT : LOGO_DARK}
        alt="جائزة مصر للتميز الحكومي"
        className="h-20 w-auto object-contain"
      />
    </Link>
  );
}

export function LogoSmall() {
  const isLight = useTheme();
  /* eslint-disable-next-line @next/next/no-img-element */
  return (
    <img
      src={isLight ? LOGO_LIGHT : LOGO_DARK}
      alt="EGEA"
      className="h-16 w-auto object-contain"
    />
  );
}
