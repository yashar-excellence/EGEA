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
    return '<span style="color:#16a34a;font-weight:900">✓</span>';
  if (status === 'draft') return '<span style="color:#d97706">◑</span>';
  return '<span style="color:#cbd5e1">—</span>';
}

function rankBadge(rank: number, ei: number | null): string {
  if (ei === null) return `<span style="color:#94a3b8;font-size:9pt">${rank}</span>`;
  if (rank === 1) return `<span style="font-size:14pt">🥇</span>`;
  if (rank === 2) return `<span style="font-size:14pt">🥈</span>`;
  if (rank === 3) return `<span style="font-size:14pt">🥉</span>`;
  return `<span style="color:#64748b;font-weight:700;font-size:9pt">${rank}</span>`;
}

function gradeStyle(ei: number | null): { bg: string; color: string; border: string } {
  if (ei === null) return { bg: '#f1f5f9', color: '#94a3b8', border: '#e2e8f0' };
  if (ei >= 85) return { bg: '#dcfce7', color: '#15803d', border: '#86efac' };
  if (ei >= 70) return { bg: '#fef9c3', color: '#a16207', border: '#fde047' };
  if (ei >= 55) return { bg: '#dbeafe', color: '#1d4ed8', border: '#93c5fd' };
  return { bg: '#fee2e2', color: '#dc2626', border: '#fca5a5' };
}

export function generateReportHTML(data: ReportData): string {
  const { meta, candidates, stats } = data;
  const printDate = arabicDate(meta.generatedAt);

  /* ══════════════════════════════════════════════════════════
     CSS — A4 pages, cover, header, footer, table, grade badges
     ══════════════════════════════════════════════════════════ */
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');

    *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

    body {
      font-family: 'Cairo', sans-serif;
      direction: rtl;
      background: #e2e8f0;
      color: #1e293b;
      font-size: 10pt;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ── A4 wrapper — centers each page in browser ── */
    .page-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      padding: 24px 0 48px;
    }

    @media print {
      body { background: white; }
      .page-wrap { gap: 0; padding: 0; }
      .no-print { display: none !important; }
    }

    /* ── @page rules ── */
    @page { size: A4; margin: 0; }

    /* ═══════════════════════════════════
       COVER PAGE
       ═══════════════════════════════════ */
    .cover-page {
      width: 210mm;
      height: 297mm;
      background: linear-gradient(145deg, #0a0f1e 0%, #0f172a 40%, #1a2744 70%, #0f172a 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      page-break-after: always;
      break-after: page;
      position: relative;
      overflow: hidden;
      color: white;
      flex-shrink: 0;
    }

    /* corner decorations */
    .cover-page::before {
      content: '';
      position: absolute;
      top: -60px; right: -60px;
      width: 320px; height: 320px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(212,160,23,0.18) 0%, transparent 65%);
    }
    .cover-page::after {
      content: '';
      position: absolute;
      bottom: -60px; left: -60px;
      width: 260px; height: 260px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(52,211,153,0.10) 0%, transparent 65%);
    }

    /* top accent bar */
    .cover-top-bar {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 6px;
      background: linear-gradient(90deg, #d4a017, #f59e0b, #d4a017);
    }
    .cover-bottom-bar {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg, transparent, #d4a017, transparent);
    }

    .cover-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      z-index: 1;
      padding: 0 20mm;
      width: 100%;
    }

    .cover-logo-box {
      border: 2px solid rgba(212,160,23,0.5);
      border-radius: 16px;
      padding: 14px 36px;
      background: rgba(212,160,23,0.06);
      margin-bottom: 28px;
    }
    .cover-logo-text {
      font-size: 22pt;
      font-weight: 900;
      color: #d4a017;
      letter-spacing: 6px;
      display: block;
    }
    .cover-logo-sub {
      font-size: 8pt;
      color: rgba(212,160,23,0.6);
      letter-spacing: 2px;
      display: block;
      margin-top: 2px;
    }

    .cover-divider {
      width: 60mm;
      height: 2px;
      background: linear-gradient(90deg, transparent, #d4a017, transparent);
      margin: 20px 0;
    }

    .cover-main-title {
      font-size: 26pt;
      font-weight: 900;
      color: #ffffff;
      line-height: 1.25;
      margin-bottom: 10px;
    }
    .cover-sub-title {
      font-size: 12pt;
      color: rgba(255,255,255,0.55);
      line-height: 1.5;
    }

    .cover-meta-table {
      margin-top: 44px;
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 14px;
      overflow: hidden;
      width: 100%;
      max-width: 130mm;
      background: rgba(255,255,255,0.03);
    }
    .cover-meta-row {
      display: flex;
      border-bottom: 1px solid rgba(255,255,255,0.07);
    }
    .cover-meta-row:last-child { border-bottom: none; }
    .cover-meta-label {
      flex: 0 0 35%;
      padding: 10px 14px;
      font-size: 8.5pt;
      color: rgba(255,255,255,0.38);
      background: rgba(255,255,255,0.02);
      border-left: 1px solid rgba(255,255,255,0.07);
    }
    .cover-meta-value {
      flex: 1;
      padding: 10px 14px;
      font-size: 9pt;
      font-weight: 700;
      color: rgba(255,255,255,0.9);
    }

    .cover-stamp {
      position: absolute;
      bottom: 14mm;
      left: 0; right: 0;
      text-align: center;
      font-size: 8pt;
      color: rgba(255,255,255,0.18);
      letter-spacing: 5px;
    }

    /* ═══════════════════════════════════
       REPORT PAGES
       ═══════════════════════════════════ */
    .report-page {
      width: 210mm;
      min-height: 297mm;
      background: white;
      position: relative;
      page-break-after: always;
      break-after: page;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
    }
    .report-page:last-child {
      page-break-after: avoid;
      break-after: avoid;
    }

    .page-inner {
      padding: 14mm 14mm 22mm;
      flex: 1;
    }

    /* ── Page Header ── */
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
      padding-bottom: 8px;
      border-bottom: 3px solid #d4a017;
    }
    .ph-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .ph-logo {
      font-size: 13pt;
      font-weight: 900;
      color: #d4a017;
      letter-spacing: 2px;
      padding: 3px 10px;
      border: 1.5px solid #d4a017;
      border-radius: 6px;
    }
    .ph-title {
      font-size: 10pt;
      font-weight: 700;
      color: #0f172a;
    }
    .ph-left {
      text-align: left;
      font-size: 7.5pt;
      color: #94a3b8;
      line-height: 1.4;
    }

    /* ── Page Footer ── */
    .page-footer {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 18mm;
      padding: 0 14mm;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid #e2e8f0;
      background: #f8fafc;
    }
    .pf-center {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      font-size: 8pt;
      color: #94a3b8;
    }
    .pf-side { font-size: 7.5pt; color: #94a3b8; }
    .pf-page {
      background: #0f172a;
      color: white;
      font-size: 8pt;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 20px;
    }

    /* ── Section heading ── */
    .section-heading {
      font-size: 12pt;
      font-weight: 900;
      color: #0f172a;
      padding-right: 12px;
      border-right: 4px solid #d4a017;
      margin-bottom: 14px;
    }

    /* ── KPI Grid ── */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 22px;
    }
    .kpi-card {
      border-radius: 10px;
      padding: 14px 10px;
      text-align: center;
      border: 1.5px solid;
    }
    .kpi-value { font-size: 24pt; font-weight: 900; }
    .kpi-label { font-size: 8pt; margin-top: 3px; }
    .kpi-sub   { font-size: 7pt; margin-top: 2px; opacity: 0.6; }

    /* ── Grade Distribution ── */
    .dist-section { margin-bottom: 22px; }
    .dist-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 9px;
      font-size: 9pt;
    }
    .dist-label { width: 72px; text-align: right; font-weight: 600; color: #475569; }
    .dist-track {
      flex: 1;
      height: 14px;
      background: #f1f5f9;
      border-radius: 7px;
      overflow: hidden;
    }
    .dist-fill { height: 100%; border-radius: 7px; }
    .dist-num  { width: 28px; font-weight: 900; color: #0f172a; }
    .dist-pct  { width: 36px; color: #94a3b8; font-size: 8pt; }

    /* ── Top 3 Highlights ── */
    .top3-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 22px;
    }
    .top3-card {
      border-radius: 10px;
      border: 1.5px solid;
      padding: 12px;
      text-align: center;
      position: relative;
    }
    .top3-medal { font-size: 22pt; margin-bottom: 6px; }
    .top3-name  { font-size: 9.5pt; font-weight: 900; color: #0f172a; }
    .top3-org   { font-size: 8pt; color: #64748b; margin-top: 2px; }
    .top3-score { font-size: 18pt; font-weight: 900; margin-top: 8px; }
    .top3-grade { font-size: 8pt; margin-top: 3px; }

    /* ── Results Table ── */
    .results-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8pt;
    }
    .results-table thead tr {
      background: #0f172a;
    }
    .results-table th {
      color: white;
      padding: 8px 5px;
      text-align: center;
      font-weight: 700;
      font-size: 7.5pt;
      white-space: nowrap;
    }
    .results-table th.col-name { text-align: right; padding-right: 10px; }
    .results-table td {
      padding: 7px 5px;
      text-align: center;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
    }
    .results-table td.col-name { text-align: right; padding-right: 10px; }
    .results-table tbody tr:nth-child(even) td { background: #f8fafc; }
    .results-table tbody tr:nth-child(1) td { background: #fffbeb; }
    .results-table tbody tr:nth-child(2) td { background: #f8fafc; }
    .results-table tbody tr:nth-child(3) td { background: #fff7ed; }

    .cand-name { font-weight: 700; color: #0f172a; font-size: 8.5pt; }
    .cand-code { color: #94a3b8; font-size: 7pt; }
    .cand-org  { color: #475569; font-size: 7.5pt; }

    .ei-score { font-weight: 900; font-size: 11pt; }

    .grade-pill {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 20px;
      font-size: 7.5pt;
      font-weight: 700;
      border: 1px solid;
      white-space: nowrap;
    }

    /* ── Page break controls ── */
    .no-break { page-break-inside: avoid; break-inside: avoid; }
    .force-break { page-break-before: always; break-before: page; }

    /* ── Watermark ── */
    .wm {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-size: 70pt;
      font-weight: 900;
      color: rgba(212,160,23,0.035);
      pointer-events: none;
      user-select: none;
      white-space: nowrap;
      z-index: 0;
    }
    .page-inner > * { position: relative; z-index: 1; }

    /* ── Print toolbar (browser only) ── */
    .print-toolbar {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 10px;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 10px 16px;
      z-index: 9999;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    }
    .print-toolbar button {
      font-family: 'Cairo', sans-serif;
      font-size: 10pt;
      font-weight: 700;
      padding: 8px 20px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
    }
    .btn-print { background: #d4a017; color: #0f172a; }
    .btn-close { background: #334155; color: white; }
    @media print { .print-toolbar { display: none; } }
  `;

  /* ══════════════════════════════════════════════════════════
     COVER PAGE
     ══════════════════════════════════════════════════════════ */
  const coverHTML = `
  <div class="cover-page">
    <div class="cover-top-bar"></div>
    <div class="cover-bottom-bar"></div>
    <div class="cover-content">
      <div class="cover-logo-box">
        <span class="cover-logo-text">EGEA</span>
        <span class="cover-logo-sub">منصة التميز الحكومي المصري</span>
      </div>
      <div class="cover-divider"></div>
      <h1 class="cover-main-title">${meta.title}</h1>
      <p class="cover-sub-title">${meta.subtitle}</p>
      <div class="cover-divider"></div>
      <div class="cover-meta-table">
        <div class="cover-meta-row">
          <span class="cover-meta-label">الدورة</span>
          <span class="cover-meta-value">${meta.cycle}</span>
        </div>
        <div class="cover-meta-row">
          <span class="cover-meta-label">إجمالي المرشحين</span>
          <span class="cover-meta-value">${meta.totalCandidates} مرشح</span>
        </div>
        <div class="cover-meta-row">
          <span class="cover-meta-label">أعدّه</span>
          <span class="cover-meta-value">${meta.generatedBy}</span>
        </div>
        <div class="cover-meta-row">
          <span class="cover-meta-label">تاريخ الإصدار</span>
          <span class="cover-meta-value">${printDate}</span>
        </div>
      </div>
    </div>
    <div class="cover-stamp">CONFIDENTIAL &nbsp;·&nbsp; سري &nbsp;·&nbsp; محدود التداول</div>
  </div>`;

  /* ══════════════════════════════════════════════════════════
     SUMMARY PAGE (page 2)
     ══════════════════════════════════════════════════════════ */
  const total = stats.excellent + stats.veryGood + stats.good + stats.needsDev;
  const pct = (n: number) => total > 0 ? Math.round((n / total) * 100) : 0;

  const top3 = candidates.filter(c => c.ei !== null).slice(0, 3);
  const top3HTML = top3.length > 0 ? `
    <h2 class="section-heading" style="margin-top:22px">المراكز الثلاثة الأولى</h2>
    <div class="top3-grid">
      ${top3.map((c, i) => {
        const gs = gradeStyle(c.ei);
        const medals = ['🥇','🥈','🥉'];
        const borders = ['#d4a017','#94a3b8','#d97706'];
        return `
        <div class="top3-card no-break" style="border-color:${borders[i]};background:${gs.bg}">
          <div class="top3-medal">${medals[i]}</div>
          <div class="top3-name">${c.name}</div>
          <div class="top3-org">${c.organization}</div>
          <div class="top3-score" style="color:${gs.color}">${fmt(c.ei)}</div>
          <div class="top3-grade" style="color:${gs.color}">${gradeLabel(c.ei)}</div>
        </div>`;
      }).join('')}
    </div>` : '';

  const summaryHTML = `
  <div class="report-page">
    <div class="wm">EGEA</div>
    <div class="page-inner">
      <div class="page-header">
        <div class="ph-right">
          <span class="ph-logo">EGEA</span>
          <span class="ph-title">الملخص التنفيذي</span>
        </div>
        <div class="ph-left">
          ${meta.cycle}<br>
          ${printDate}
        </div>
      </div>

      <h2 class="section-heading">إحصائيات عامة</h2>
      <div class="kpi-grid">
        <div class="kpi-card" style="border-color:#fde68a;background:#fffbeb">
          <div class="kpi-value" style="color:#d4a017">${meta.totalCandidates}</div>
          <div class="kpi-label" style="color:#92400e">إجمالي المرشحين</div>
          <div class="kpi-sub" style="color:#b45309">${stats.phase2Count} في المرحلة الثانية</div>
        </div>
        <div class="kpi-card" style="border-color:#a7f3d0;background:#f0fdf4">
          <div class="kpi-value" style="color:#15803d">${stats.avgEI !== null ? stats.avgEI.toFixed(1) : '—'}</div>
          <div class="kpi-label" style="color:#166534">متوسط EI Score</div>
          <div class="kpi-sub" style="color:#166534">من 100 نقطة</div>
        </div>
        <div class="kpi-card" style="border-color:#fde68a;background:#fefce8">
          <div class="kpi-value" style="color:#a16207">${stats.excellent}</div>
          <div class="kpi-label" style="color:#713f12">تقدير ممتاز ≥85</div>
          <div class="kpi-sub" style="color:#713f12">من ${total} لديهم نتائج</div>
        </div>
        <div class="kpi-card" style="border-color:#bfdbfe;background:#eff6ff">
          <div class="kpi-value" style="color:#1d4ed8">${stats.completed}</div>
          <div class="kpi-label" style="color:#1e40af">اكتملت تقييماتهم</div>
          <div class="kpi-sub" style="color:#1e40af">OJT + FEP + FV</div>
        </div>
      </div>

      <h2 class="section-heading">توزيع التقديرات</h2>
      <div class="dist-section">
        ${[
          { label: 'ممتاز',        count: stats.excellent, color: '#16a34a', bg: '#dcfce7', p: pct(stats.excellent) },
          { label: 'جيد جداً',    count: stats.veryGood,  color: '#d97706', bg: '#fef3c7', p: pct(stats.veryGood)  },
          { label: 'جيد',          count: stats.good,      color: '#2563eb', bg: '#dbeafe', p: pct(stats.good)      },
          { label: 'يحتاج تطوير', count: stats.needsDev,  color: '#dc2626', bg: '#fee2e2', p: pct(stats.needsDev)  },
        ].map(g => `
          <div class="dist-row no-break">
            <span class="dist-label">${g.label}</span>
            <div class="dist-track">
              <div class="dist-fill" style="width:${g.p}%;background:${g.color}"></div>
            </div>
            <span class="dist-num">${g.count}</span>
            <span class="dist-pct">${g.p}%</span>
          </div>`).join('')}
      </div>

      ${top3HTML}
    </div>
    <div class="page-footer">
      <span class="pf-side">جائزة مصر للتميز الحكومي — EGEA</span>
      <span class="pf-center">الملخص التنفيذي</span>
      <span class="pf-page">٢</span>
    </div>
  </div>`;

  /* ══════════════════════════════════════════════════════════
     RESULTS PAGES — paginated 20 rows each
     ══════════════════════════════════════════════════════════ */
  const ROWS_PER_PAGE = 20;
  const chunks: typeof candidates[] = [];
  for (let i = 0; i < candidates.length; i += ROWS_PER_PAGE)
    chunks.push(candidates.slice(i, i + ROWS_PER_PAGE));

  const thStyle = 'style="padding:8px 5px;font-weight:700;font-size:7.5pt;color:white;background:#0f172a;text-align:center;white-space:nowrap"';

  const resultsPages = chunks.map((chunk, pageIdx) => {
    const startRank = pageIdx * ROWS_PER_PAGE;
    const rows = chunk.map((c, i) => {
      const rank = startRank + i + 1;
      const gs = gradeStyle(c.ei);
      const eiColor = gradeColor(c.ei);
      return `
        <tr class="no-break">
          <td style="text-align:center;font-size:13pt">${rankBadge(rank, c.ei)}</td>
          <td class="col-name">
            <div class="cand-name">${c.name}</div>
            <div class="cand-code">${c.code}</div>
            <div class="cand-org">${c.organization}</div>
          </td>
          <td style="text-align:center">${c.phase === 2
            ? '<span style="background:#fef3c7;color:#b45309;padding:2px 6px;border-radius:10px;font-size:7pt;font-weight:700">مرحلة ٢</span>'
            : '<span style="background:#f1f5f9;color:#64748b;padding:2px 6px;border-radius:10px;font-size:7pt">مرحلة ١</span>'}</td>
          <td style="text-align:center;font-weight:700;color:#b45309">${fmt(c.p1Total)}<br><span style="font-weight:400;color:#94a3b8;font-size:6.5pt">/40</span></td>
          <td style="text-align:center;font-weight:700;color:#7c3aed">${fmt(c.s360)}<br><span style="font-weight:400;color:#94a3b8;font-size:6.5pt">/100</span></td>
          <td style="text-align:center">${statusDot(c.ojtStatus)}<br><span style="font-size:7pt;color:#374151">${fmt(c.ojt)}</span></td>
          <td style="text-align:center">${statusDot(c.fepStatus)}<br><span style="font-size:7pt;color:#374151">${fmt(c.fep)}</span></td>
          <td style="text-align:center">${statusDot(c.fvStatus)}<br><span style="font-size:7pt;color:#374151">${fmt(c.fv)}</span></td>
          <td style="text-align:center">
            <span class="ei-score" style="color:${eiColor}">${fmt(c.ei)}</span>
          </td>
          <td style="text-align:center">
            <span class="grade-pill" style="background:${gs.bg};color:${gs.color};border-color:${gs.border}">
              ${gradeLabel(c.ei)}
            </span>
          </td>
        </tr>`;
    }).join('');

    return `
  <div class="report-page">
    <div class="wm">EGEA</div>
    <div class="page-inner">
      <div class="page-header">
        <div class="ph-right">
          <span class="ph-logo">EGEA</span>
          <span class="ph-title">نتائج المرشحين — مرتبة حسب Excellence Index</span>
        </div>
        <div class="ph-left">${meta.cycle}<br>${printDate}</div>
      </div>
      <table class="results-table">
        <thead>
          <tr>
            <th ${thStyle} style="width:4%;text-align:center">#</th>
            <th ${thStyle} style="width:22%;text-align:right" class="col-name">المرشح</th>
            <th ${thStyle} style="width:7%">المرحلة</th>
            <th ${thStyle} style="width:8%">Phase 1</th>
            <th ${thStyle} style="width:7%">360°</th>
            <th ${thStyle} style="width:7%">OJT</th>
            <th ${thStyle} style="width:7%">FEP</th>
            <th ${thStyle} style="width:7%">FV</th>
            <th ${thStyle} style="width:9%">EI Score</th>
            <th ${thStyle} style="width:12%">التقدير</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="page-footer">
      <span class="pf-side">جائزة مصر للتميز الحكومي — EGEA</span>
      <span class="pf-center">نتائج المرشحين · سري ومحدود التداول</span>
      <span class="pf-page">${pageIdx + 3}</span>
    </div>
  </div>`;
  }).join('');

  /* ══════════════════════════════════════════════════════════
     FULL DOCUMENT
     ══════════════════════════════════════════════════════════ */
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${meta.title} · ${meta.cycle}</title>
  <style>${css}</style>
</head>
<body>
  <!-- Print Toolbar (hidden on print) -->
  <div class="print-toolbar no-print">
    <button class="btn-print" onclick="window.print()">🖨️ طباعة</button>
    <button class="btn-close" onclick="window.close()">✕ إغلاق</button>
  </div>

  <div class="page-wrap">
    ${coverHTML}
    ${summaryHTML}
    ${resultsPages}
  </div>

  <script>
    if (new URLSearchParams(location.search).get('print') === '1') {
      window.addEventListener('load', () => setTimeout(() => window.print(), 900));
    }
  </script>
</body>
</html>`;
}
