import type { ReportData } from './types';
import { gradeLabel, gradeColor } from './engine';

function fmt(n: number | null, dec = 1): string {
  return n !== null ? n.toFixed(dec) : '—';
}

function arabicDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ar-EG', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function statusDot(status: string | null): string {
  if (status === 'submitted' || status === 'approved')
    return '<span style="color:#34d399">✓</span>';
  if (status === 'draft') return '<span style="color:#f59e0b">◑</span>';
  return '<span style="color:#475569">—</span>';
}

function rankBadge(rank: number, ei: number | null): string {
  if (ei === null) return `<span style="color:#475569">${rank}</span>`;
  const medals: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };
  return medals[rank] ? medals[rank] : `<span style="color:#94a3b8">${rank}</span>`;
}

export function generateReportHTML(data: ReportData): string {
  const { meta, candidates, stats } = data;
  const printDate = arabicDate(meta.generatedAt);

  /* ── CSS ────────────────────────────────────────────────── */
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --gold: #d4a017;
      --gold-light: #f59e0b;
      --dark: #0f172a;
      --slate: #1e293b;
      --border: #334155;
      --muted: #64748b;
      --text: #1e293b;
      --bg: #ffffff;
    }

    body {
      font-family: 'Cairo', sans-serif;
      direction: rtl;
      background: var(--bg);
      color: var(--text);
      font-size: 11pt;
    }

    /* ── Page Setup ── */
    @page {
      size: A4;
      margin: 0;
    }
    @page :first {
      margin: 0;
    }

    /* ── Cover Page ── */
    .cover-page {
      width: 210mm;
      height: 297mm;
      background: linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      page-break-after: always;
      position: relative;
      overflow: hidden;
      color: white;
    }
    .cover-page::before {
      content: '';
      position: absolute;
      top: -100px; right: -100px;
      width: 400px; height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(212,160,23,0.15) 0%, transparent 70%);
    }
    .cover-page::after {
      content: '';
      position: absolute;
      bottom: -80px; left: -80px;
      width: 300px; height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%);
    }
    .cover-gold-line {
      width: 80mm;
      height: 3px;
      background: linear-gradient(90deg, transparent, #d4a017, transparent);
      margin: 16px auto;
    }
    .cover-logo-area {
      width: 90mm;
      height: 22mm;
      border: 2px solid rgba(212,160,23,0.4);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 32px;
      background: rgba(212,160,23,0.05);
    }
    .cover-logo-text {
      font-size: 18pt;
      font-weight: 900;
      color: #d4a017;
      letter-spacing: 2px;
    }
    .cover-title {
      font-size: 28pt;
      font-weight: 900;
      color: white;
      text-align: center;
      line-height: 1.3;
    }
    .cover-subtitle {
      font-size: 13pt;
      color: rgba(255,255,255,0.65);
      text-align: center;
      margin-top: 8px;
    }
    .cover-meta-box {
      margin-top: 48px;
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 12px;
      padding: 20px 40px;
      background: rgba(255,255,255,0.04);
      text-align: center;
      min-width: 120mm;
    }
    .cover-meta-row {
      display: flex;
      justify-content: space-between;
      gap: 32px;
      margin-bottom: 10px;
      font-size: 10pt;
      color: rgba(255,255,255,0.7);
    }
    .cover-meta-label { color: rgba(255,255,255,0.4); }
    .cover-meta-value { color: white; font-weight: 700; }
    .cover-confidential {
      position: absolute;
      bottom: 20mm;
      font-size: 9pt;
      color: rgba(255,255,255,0.25);
      letter-spacing: 4px;
      text-transform: uppercase;
    }

    /* ── Report Pages ── */
    .report-page {
      width: 210mm;
      min-height: 297mm;
      padding: 15mm 15mm 20mm;
      page-break-after: always;
      position: relative;
    }
    .report-page:last-child {
      page-break-after: avoid;
    }

    /* ── Page Header ── */
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 8px;
      border-bottom: 2px solid #d4a017;
      margin-bottom: 16px;
    }
    .page-header-title {
      font-size: 10pt;
      font-weight: 700;
      color: #0f172a;
    }
    .page-header-meta {
      font-size: 8pt;
      color: #94a3b8;
      text-align: left;
    }
    .page-header-logo {
      font-size: 11pt;
      font-weight: 900;
      color: #d4a017;
    }

    /* ── Page Footer ── */
    .page-footer {
      position: absolute;
      bottom: 8mm;
      right: 15mm;
      left: 15mm;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid #e2e8f0;
      padding-top: 6px;
      font-size: 8pt;
      color: #94a3b8;
    }

    /* ── Section Title ── */
    .section-title {
      font-size: 13pt;
      font-weight: 900;
      color: #0f172a;
      margin-bottom: 12px;
      padding-right: 10px;
      border-right: 4px solid #d4a017;
    }

    /* ── Stats Grid ── */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 20px;
    }
    .stat-card {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 12px;
      text-align: center;
      background: #f8fafc;
    }
    .stat-value {
      font-size: 22pt;
      font-weight: 900;
      color: #0f172a;
    }
    .stat-label {
      font-size: 8pt;
      color: #64748b;
      margin-top: 2px;
    }
    .stat-sub {
      font-size: 7pt;
      color: #94a3b8;
      margin-top: 1px;
    }

    /* ── Grade Distribution ── */
    .grade-bars {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 20px;
    }
    .grade-bar-row {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 9pt;
    }
    .grade-bar-label { width: 60px; text-align: right; color: #475569; }
    .grade-bar-track {
      flex: 1;
      height: 12px;
      background: #f1f5f9;
      border-radius: 6px;
      overflow: hidden;
    }
    .grade-bar-fill {
      height: 100%;
      border-radius: 6px;
    }
    .grade-bar-count { width: 30px; color: #0f172a; font-weight: 700; }

    /* ── Results Table ── */
    .results-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.5pt;
      margin-bottom: 6px;
    }
    .results-table th {
      background: #0f172a;
      color: white;
      padding: 7px 6px;
      text-align: center;
      font-weight: 700;
      font-size: 7.5pt;
    }
    .results-table th:first-child { text-align: right; border-radius: 0 4px 4px 0; }
    .results-table th:last-child { border-radius: 4px 0 0 4px; }
    .results-table td {
      padding: 6px;
      text-align: center;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
    }
    .results-table td:first-child { text-align: right; }
    .results-table tr:nth-child(even) td { background: #f8fafc; }
    .results-table tr:hover td { background: #fef3c7; }
    .candidate-name { font-weight: 700; color: #0f172a; font-size: 9pt; }
    .candidate-code { color: #94a3b8; font-size: 7.5pt; }
    .candidate-org  { color: #64748b; font-size: 8pt; }

    .grade-badge {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 20px;
      font-size: 7.5pt;
      font-weight: 700;
    }

    /* ── Page Break Controls ── */
    .no-break { page-break-inside: avoid; }
    .page-break { page-break-before: always; }

    /* ── Watermark ── */
    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-35deg);
      font-size: 60pt;
      font-weight: 900;
      color: rgba(212,160,23,0.04);
      white-space: nowrap;
      pointer-events: none;
      z-index: 0;
    }
  `;

  /* ── Cover Page HTML ── */
  const coverHTML = `
    <div class="cover-page">
      <div class="cover-logo-area">
        <span class="cover-logo-text">EGEA</span>
      </div>
      <div class="cover-gold-line"></div>
      <h1 class="cover-title">${meta.title}</h1>
      <p class="cover-subtitle">${meta.subtitle}</p>
      <div class="cover-gold-line"></div>
      <div class="cover-meta-box">
        <div class="cover-meta-row">
          <span><span class="cover-meta-label">الدورة: </span><span class="cover-meta-value">${meta.cycle}</span></span>
          <span><span class="cover-meta-label">عدد المرشحين: </span><span class="cover-meta-value">${meta.totalCandidates}</span></span>
        </div>
        <div class="cover-meta-row">
          <span><span class="cover-meta-label">أعدّه: </span><span class="cover-meta-value">${meta.generatedBy}</span></span>
          <span><span class="cover-meta-label">تاريخ الإصدار: </span><span class="cover-meta-value">${printDate}</span></span>
        </div>
      </div>
      <div class="cover-confidential">CONFIDENTIAL · سري</div>
    </div>
  `;

  /* ── Summary Page ── */
  const total = stats.excellent + stats.veryGood + stats.good + stats.needsDev;
  const pct = (n: number) => total > 0 ? Math.round((n / total) * 100) : 0;

  const summaryHTML = `
    <div class="report-page">
      <div class="watermark">EGEA</div>

      <div class="page-header">
        <span class="page-header-logo">EGEA</span>
        <span class="page-header-title">الملخص التنفيذي</span>
        <span class="page-header-meta">${printDate}</span>
      </div>

      <h2 class="section-title">إحصائيات عامة</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value" style="color:#d4a017">${meta.totalCandidates}</div>
          <div class="stat-label">إجمالي المرشحين</div>
          <div class="stat-sub">${stats.phase2Count} في المرحلة الثانية</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" style="color:#34d399">${stats.avgEI !== null ? stats.avgEI.toFixed(1) : '—'}</div>
          <div class="stat-label">متوسط EI Score</div>
          <div class="stat-sub">من 100 نقطة</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" style="color:#f59e0b">${stats.excellent}</div>
          <div class="stat-label">تقييم ممتاز</div>
          <div class="stat-sub">≥ 85 نقطة</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" style="color:#60a5fa">${stats.completed}</div>
          <div class="stat-label">اكتملت تقييماتهم</div>
          <div class="stat-sub">OJT + FEP + FV</div>
        </div>
      </div>

      <h2 class="section-title" style="margin-top:20px">توزيع التقديرات</h2>
      <div class="grade-bars">
        ${[
          { label: 'ممتاز', count: stats.excellent, color: '#34d399', pct: pct(stats.excellent) },
          { label: 'جيد جداً', count: stats.veryGood, color: '#f59e0b', pct: pct(stats.veryGood) },
          { label: 'جيد', count: stats.good, color: '#60a5fa', pct: pct(stats.good) },
          { label: 'يحتاج تطوير', count: stats.needsDev, color: '#f87171', pct: pct(stats.needsDev) },
        ].map(g => `
          <div class="grade-bar-row no-break">
            <span class="grade-bar-label">${g.label}</span>
            <div class="grade-bar-track">
              <div class="grade-bar-fill" style="width:${g.pct}%;background:${g.color}"></div>
            </div>
            <span class="grade-bar-count">${g.count}</span>
            <span style="color:#94a3b8;font-size:8pt">${g.pct}%</span>
          </div>
        `).join('')}
      </div>

      <div class="page-footer">
        <span>جائزة مصر للتميز الحكومي — EGEA</span>
        <span>صفحة 2</span>
        <span>سري ومحدود التداول</span>
      </div>
    </div>
  `;

  /* ── Results Pages (chunked ~25 rows per page) ── */
  const ROWS_PER_PAGE = 22;
  const chunks: typeof candidates[] = [];
  for (let i = 0; i < candidates.length; i += ROWS_PER_PAGE) {
    chunks.push(candidates.slice(i, i + ROWS_PER_PAGE));
  }

  const tableHeader = `
    <thead>
      <tr>
        <th style="width:4%">#</th>
        <th style="width:22%;text-align:right">المرشح</th>
        <th style="width:16%;text-align:right">الجهة</th>
        <th style="width:8%">Phase 1<br><small>/40</small></th>
        <th style="width:7%">360°<br><small>/100</small></th>
        <th style="width:7%">OJT</th>
        <th style="width:7%">FEP</th>
        <th style="width:7%">FV</th>
        <th style="width:10%">EI Score<br><small>/100</small></th>
        <th style="width:12%">التقدير</th>
      </tr>
    </thead>
  `;

  const resultsPages = chunks.map((chunk, pageIdx) => {
    const startRank = pageIdx * ROWS_PER_PAGE;
    const rows = chunk.map((c, i) => {
      const rank = startRank + i + 1;
      const color = gradeColor(c.ei);
      const label = gradeLabel(c.ei);
      const bgBadge = c.ei === null ? '#f1f5f9'
        : c.ei >= 85 ? '#d1fae5' : c.ei >= 70 ? '#fef3c7' : c.ei >= 55 ? '#dbeafe' : '#fee2e2';
      return `
        <tr class="no-break">
          <td>${rankBadge(rank, c.ei)}</td>
          <td>
            <div class="candidate-name">${c.name}</div>
            <div class="candidate-code">${c.code}</div>
          </td>
          <td><span class="candidate-org">${c.organization}</span></td>
          <td>${fmt(c.p1Total)}</td>
          <td>${fmt(c.s360)}</td>
          <td>${statusDot(c.ojtStatus)} ${fmt(c.ojt)}</td>
          <td>${statusDot(c.fepStatus)} ${fmt(c.fep)}</td>
          <td>${statusDot(c.fvStatus)} ${fmt(c.fv)}</td>
          <td style="font-weight:900;font-size:11pt;color:${color}">${fmt(c.ei)}</td>
          <td>
            <span class="grade-badge" style="background:${bgBadge};color:${color}">${label}</span>
          </td>
        </tr>
      `;
    }).join('');

    return `
      <div class="report-page">
        <div class="watermark">EGEA</div>
        <div class="page-header">
          <span class="page-header-logo">EGEA</span>
          <span class="page-header-title">نتائج المرشحين — مرتبة حسب EI Score</span>
          <span class="page-header-meta">${printDate}</span>
        </div>
        <table class="results-table">
          ${tableHeader}
          <tbody>${rows}</tbody>
        </table>
        <div class="page-footer">
          <span>جائزة مصر للتميز الحكومي — EGEA</span>
          <span>صفحة ${pageIdx + 3}</span>
          <span>سري ومحدود التداول</span>
        </div>
      </div>
    `;
  }).join('');

  /* ── Full HTML Document ── */
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>${meta.title} — ${meta.cycle}</title>
  <style>${css}</style>
</head>
<body>
  ${coverHTML}
  ${summaryHTML}
  ${resultsPages}
  <script>
    // Auto-print when opened from report generator
    if (window.location.search.includes('autoprint=1')) {
      window.onload = () => setTimeout(() => window.print(), 800);
    }
  </script>
</body>
</html>`;
}
