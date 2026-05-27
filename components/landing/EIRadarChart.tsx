'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { subject: 'EPR', A: 88, fullMark: 100 },
  { subject: 'APT', A: 90, fullMark: 100 },
  { subject: 'B5', A: 85, fullMark: 100 },
  { subject: 'SJT', A: 92, fullMark: 100 },
  { subject: 'CBI', A: 88, fullMark: 100 },
  { subject: '360', A: 87, fullMark: 100 },
  { subject: 'OJT', A: 88, fullMark: 100 },
  { subject: 'FEP', A: 85, fullMark: 100 },
  { subject: 'FV', A: 87, fullMark: 100 },
];

export function EIRadarChart() {
  return (
    <div className="w-80 h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 500 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Excellence Index"
            dataKey="A"
            stroke="#fbbf24"
            strokeWidth={3}
            fill="url(#radarGradient)"
            fillOpacity={0.6}
          />
          <defs>
            <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0.3} />
            </linearGradient>
          </defs>
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
