import Link from 'next/link';

export function LogoLink({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  return (
    <Link href="/" className="flex items-center group">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={variant === 'dark' ? '/logo-dark.png' : '/logo-light.png'}
        alt="جائزة مصر للتميز الحكومي"
        className="h-12 w-auto object-contain"
      />
    </Link>
  );
}

export function LogoSmall({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  /* eslint-disable-next-line @next/next/no-img-element */
  return (
    <img
      src={variant === 'dark' ? '/logo-dark.png' : '/logo-light.png'}
      alt="EGEA"
      className="h-8 w-auto object-contain"
    />
  );
}
