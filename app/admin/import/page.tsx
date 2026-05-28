'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Upload, CheckCircle2, AlertCircle,
  FileText, Users, BarChart2, Download, Loader2,
} from 'lucide-react';
import { Header } from '@/components/landing/Header';

type TabKey = 'candidates' | 'phase1' | '360';
type Status = 'idle' | 'parsing' | 'uploading' | 'done' | 'error';

interface Result {
  inserted: number;
  notFound?: string[];
  error?: string;
}

// ─── CSV parser ───────────────────────────────────────────────
function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? '']));
  });
}

// ─── Download sample CSV ──────────────────────────────────────
function downloadSample(tab: TabKey) {
  const samples: Record<TabKey, string> = {
    candidates: 'code,name,role,organization,category,level,cycle,phase\nEGEA-2024-001,أحمد محمد,مدير إدارة,وزارة التربية,قيادي,الأول,الدورة الثانية,2\nEGEA-2024-002,سارة عبدالله,متخصص,وزارة الصحة,فني,الثاني,الدورة الثانية,2',
    phase1: 'candidate_code,epr,apt,b5,sjt,cbi\nEGEA-2024-001,4.5,3.8,4.2,8.5,12.3\nEGEA-2024-002,3.9,4.1,3.5,7.8,11.2',
    '360': 'candidate_code,score,provider\nEGEA-2024-001,82.5,LEVID 360\nEGEA-2024-002,76.0,LEVID 360',
  };
  const blob = new Blob([samples[tab]], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sample_${tab}.csv`;
  a.click();
}

// ─── Tab config ───────────────────────────────────────────────
const TABS: { key: TabKey; label: string; labelEn: string; icon: any; color: string; endpoint: string; fields: string[] }[] = [
  {
    key: 'candidates', label: 'بيانات المرشحين', labelEn: 'Candidates Import',
    icon: Users, color: 'gold',
    endpoint: '/api/import/candidates',
    fields: ['code', 'name', 'role', 'organization', 'category', 'level', 'cycle', 'phase'],
  },
  {
    key: 'phase1', label: 'درجات المرحلة الأولى', labelEn: 'Phase 1 Outsource',
    icon: BarChart2, color: 'amber',
    endpoint: '/api/import/phase1',
    fields: ['candidate_code', 'epr', 'apt', 'b5', 'sjt', 'cbi'],
  },
  {
    key: '360', label: 'تقييم 360° — LEVID', labelEn: '360 Assessment',
    icon: FileText, color: 'purple',
    endpoint: '/api/import/assessment360',
    fields: ['candidate_code', 'score', 'provider'],
  },
];

const colorMap: Record<string, string> = {
  gold: 'text-gold-400 bg-gold-500/10 border-gold-500/20',
  amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
};
const iconColorMap: Record<string, string> = {
  gold: 'text-gold-400', amber: 'text-amber-400', purple: 'text-purple-400',
};

export default function ImportPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('candidates');
  const [status, setStatus] = useState<Status>('idle');
  const [preview, setPreview] = useState<Record<string, string>[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const tab = TABS.find(t => t.key === activeTab)!;

  const handleFile = (file: File) => {
    if (!file) return;
    setStatus('parsing');
    setResult(null);
    const reader = new FileReader();
    reader.onload = e => {
      const rows = parseCSV(e.target?.result as string);
      setPreview(rows.slice(0, 5));
      setStatus('idle');
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleUpload = async () => {
    if (preview.length === 0) return;
    setStatus('uploading');
    try {
      // Re-read full file
      const file = fileRef.current?.files?.[0];
      if (!file) return;
      const text = await file.text();
      const rows = parseCSV(text);

      const res = await fetch(tab.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setResult(json);
      setStatus('done');
    } catch (e: any) {
      setResult({ inserted: 0, error: e.message });
      setStatus('error');
    }
  };

  const reset = () => {
    setStatus('idle');
    setPreview([]);
    setResult(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-16">

        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="flex items-center gap-2 text-white/50 hover:text-white mb-2 transition text-sm">
              <ArrowRight className="w-4 h-4" /> العودة للوحة التحكم
            </Link>
            <h1 className="text-3xl font-bold text-white">استيراد البيانات</h1>
            <p className="text-white/40 mt-1">رفع بيانات المرشحين والدرجات من ملفات CSV</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1.5 glass rounded-2xl w-fit">
          {TABS.map(t => {
            const Icon = t.icon;
            const active = activeTab === t.key;
            return (
              <button key={t.key} onClick={() => { setActiveTab(t.key); reset(); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active ? `${colorMap[t.color]} border` : 'text-white/50 hover:text-white'
                }`}>
                <Icon className={`w-4 h-4 ${active ? iconColorMap[t.color] : ''}`} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Required Columns */}
        <div className="glass-crystal rounded-2xl p-5 mb-5 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-bold text-sm">الأعمدة المطلوبة في الـ CSV</h2>
            <button onClick={() => downloadSample(activeTab)}
              className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition px-3 py-1.5 rounded-lg glass">
              <Download className="w-3.5 h-3.5" /> تحميل نموذج CSV
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tab.fields.map(f => (
              <span key={f} className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${colorMap[tab.color]}`}>
                {f}
              </span>
            ))}
          </div>
          {tab.key === 'phase1' && (
            <p className="text-white/30 text-xs mt-3">
              • EPR, APT, B5: من 5 نقاط &nbsp;|&nbsp; SJT: من 10 &nbsp;|&nbsp; CBI: من 15 &nbsp;|&nbsp; المجموع: من 40
            </p>
          )}
          {tab.key === '360' && (
            <p className="text-white/30 text-xs mt-3">• score: من 100 &nbsp;|&nbsp; provider: اختياري (افتراضي: LEVID 360)</p>
          )}
        </div>

        {/* Drop Zone */}
        {status !== 'done' && (
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            className="glass-crystal rounded-2xl p-10 mb-5 border-2 border-dashed border-white/20 hover:border-white/40 transition-all cursor-pointer text-center group"
          >
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            {status === 'parsing' ? (
              <Loader2 className="w-10 h-10 text-gold-400 animate-spin mx-auto mb-3" />
            ) : (
              <Upload className="w-10 h-10 text-white/20 group-hover:text-white/40 mx-auto mb-3 transition" />
            )}
            <p className="text-white/60 text-sm">اسحب ملف CSV هنا أو اضغط للاختيار</p>
            <p className="text-white/25 text-xs mt-1">يدعم ملفات .csv بترميز UTF-8</p>
          </div>
        )}

        {/* Preview */}
        {preview.length > 0 && status !== 'done' && (
          <div className="glass-crystal rounded-2xl overflow-hidden mb-5 border border-white/10">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
              <span className="text-white/60 text-sm">معاينة أول {preview.length} صفوف</span>
              <span className="text-white/30 text-xs">من ملف: {fileRef.current?.files?.[0]?.name}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10">
                    {Object.keys(preview[0]).map(k => (
                      <th key={k} className="text-right text-white/40 px-4 py-2 font-mono">{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i} className="border-b border-white/5">
                      {Object.values(row).map((v, j) => (
                        <td key={j} className="px-4 py-2 text-white/70 font-mono">{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 flex items-center justify-between">
              <button onClick={reset} className="text-white/40 hover:text-white text-xs transition">إلغاء</button>
              <button
                onClick={handleUpload}
                disabled={status === 'uploading'}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 text-slate-950 font-bold hover:opacity-90 transition disabled:opacity-50 text-sm"
              >
                {status === 'uploading'
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> جاري الرفع...</>
                  : <><Upload className="w-4 h-4" /> رفع البيانات</>}
              </button>
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className={`glass-crystal rounded-2xl p-6 border ${
            status === 'done' ? 'border-emerald-500/30' : 'border-red-500/30'
          }`}>
            {status === 'done' ? (
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-emerald-400 font-bold text-lg">تم الاستيراد بنجاح!</h3>
                  <p className="text-white/60 text-sm mt-1">
                    تم إدخال / تحديث <span className="text-white font-bold">{result.inserted}</span> سجل
                  </p>
                  {result.notFound && result.notFound.length > 0 && (
                    <div className="mt-3">
                      <p className="text-amber-400 text-xs font-bold mb-1">
                        ⚠️ {result.notFound.length} كود غير موجود في النظام:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.notFound.map(c => (
                          <span key={c} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-xs font-mono">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3 mt-4">
                    <button onClick={reset}
                      className="px-4 py-2 rounded-xl glass text-white/70 hover:text-white text-sm transition">
                      استيراد مرة أخرى
                    </button>
                    <Link href="/admin"
                      className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 text-sm transition">
                      العودة للوحة التحكم
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <AlertCircle className="w-8 h-8 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-red-400 font-bold">حدث خطأ</h3>
                  <p className="text-white/50 text-sm mt-1">{result.error}</p>
                  <button onClick={reset} className="mt-3 px-4 py-2 rounded-xl glass text-white/70 hover:text-white text-sm transition">
                    حاول مرة أخرى
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
