import Link from 'next/link';
import Image from 'next/image';

export function LogoLink({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  return (
    <Link href="/" className="flex items-center group">
      <Image
        src={variant === 'dark' ? '/logo-dark.png' : '/logo-light.png'}
        alt="جائزة مصر للتميز الحكومي"
        width={180}
        height={60}
        className="h-12 w-auto object-contain"
        priority
      />
    </Link>
  );
}

export function LogoSmall({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  return (
    <Image
      src={variant === 'dark' ? '/logo-dark.png' : '/logo-light.png'}
      alt="EGEA"
      width={120}
      height={40}
      className="h-8 w-auto object-contain"
    />
  );
}
