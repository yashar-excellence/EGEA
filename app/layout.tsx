import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import { SessionProvider } from '@/components/providers/SessionProvider';
import './globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'EGEA Excellence Platform · منصة التميز الحكومي',
  description: 'منصة التميز الحكومي المصري — فئة التميز الفردي',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className={`${cairo.className} antialiased min-h-screen bg-slate-950`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
