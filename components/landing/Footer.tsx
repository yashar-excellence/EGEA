'use client';

import { LogoSmall } from '@/components/Logo';
import { Heart, Github, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <LogoSmall />
          
          {/* Copyright */}
          <div className="text-white/50 text-sm text-center">
            © 2025 EGEA Excellence Platform · جميع الحقوق محفوظة
            <div className="mt-2 flex items-center justify-center gap-1 text-xs">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-red-500 fill-red-500" />
              <span>by INUVAIRA</span>
            </div>
          </div>
          
          {/* Links */}
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-lg glass flex items-center justify-center text-white/50 hover:text-gold-400 hover:bg-white/10 transition-all">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-lg glass flex items-center justify-center text-white/50 hover:text-gold-400 hover:bg-white/10 transition-all">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
