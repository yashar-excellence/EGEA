import Link from 'next/link';
import { Award, Crown } from 'lucide-react';

export function LogoLink() {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gold-400 to-amber-600 rounded-xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity" />
        <div className="relative w-10 h-10 bg-gradient-to-br from-gold-400 to-amber-600 rounded-xl flex items-center justify-center">
          <Crown className="w-6 h-6 text-slate-950" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-gold-400 font-bold text-xl leading-none tracking-tight">EGEA</span>
        <span className="text-white/40 text-xs tracking-wider uppercase">Excellence Platform</span>
      </div>
    </Link>
  );
}

export function LogoSmall() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-amber-600 rounded-lg flex items-center justify-center">
        <Award className="w-5 h-5 text-slate-950" />
      </div>
      <span className="text-gold-400 font-bold">EGEA</span>
    </div>
  );
}
