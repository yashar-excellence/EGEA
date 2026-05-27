import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard · لوحة الإدارة',
  description: 'لوحة تحكم إدارة جائزة مصر للتميز الحكومي',
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">لوحة الإدارة</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass rounded-xl p-6">
            <div className="text-gold-400 text-4xl font-bold mb-2">150</div>
            <div className="text-white/70">مرشح إجمالي</div>
          </div>
          <div className="glass rounded-xl p-6">
            <div className="text-emerald-400 text-4xl font-bold mb-2">85</div>
            <div className="text-white/70">تم التقييم</div>
          </div>
          <div className="glass rounded-xl p-6">
            <div className="text-blue-400 text-4xl font-bold mb-2">65</div>
            <div className="text-white/70">مقيّم نشط</div>
          </div>
        </div>

        <div className="mt-8 glass rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">آخر النشاطات</h2>
          <div className="space-y-3">
            {[
              { user: 'محمد علي', action: 'أكمل تقييم OJT', time: 'منذ 5 دقائق' },
              { user: 'أحمد حسن', action: 'أضاف تقييم FEP', time: 'منذ 15 دقيقة' },
              { user: 'سارة أحمد', action: 'قامت بزيارة ميدانية', time: 'منذ ساعة' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 text-sm">
                    {item.user[0]}
                  </div>
                  <div>
                    <div className="text-white font-medium">{item.user}</div>
                    <div className="text-white/50 text-sm">{item.action}</div>
                  </div>
                </div>
                <div className="text-white/30 text-sm">{item.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
