import Link from 'next/link';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">403</h1>
        <p className="text-xl text-white/70 mb-2">غير مصرح</p>
        <p className="text-white/50 mb-8">
          ليس لديك صلاحية للوصول إلى هذه الصفحة
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-500 text-slate-950 font-bold hover:bg-gold-400 transition"
        >
          <ArrowRight className="w-4 h-4" />
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
