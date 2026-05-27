CREATE TABLE IF NOT EXISTS candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  organization TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'تميز فردي',
  level TEXT NOT NULL DEFAULT 'مدير',
  cycle TEXT NOT NULL DEFAULT 'الدورة الثانية',
  phase INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS phase1_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  epr NUMERIC,
  apt NUMERIC,
  b5 NUMERIC,
  sjt NUMERIC,
  cbi NUMERIC,
  total NUMERIC,
  imported_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assessment_360 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  score NUMERIC,
  provider TEXT DEFAULT 'LEVID 360',
  imported_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ojt_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  assessor_id TEXT NOT NULL DEFAULT 'assessor-1',
  data JSONB DEFAULT '{}',
  total_score NUMERIC,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','submitted','approved')),
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fep_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  data JSONB DEFAULT '{}',
  total_score NUMERIC,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','submitted','approved')),
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fv_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  assessor_id TEXT NOT NULL DEFAULT 'assessor-1',
  data JSONB DEFAULT '{}',
  total_score NUMERIC,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','submitted','approved')),
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

DELETE FROM fv_submissions;
DELETE FROM fep_submissions;
DELETE FROM ojt_submissions;
DELETE FROM assessment_360;
DELETE FROM phase1_scores;
DELETE FROM candidates;

INSERT INTO candidates (id, code, name, role, organization, category, level, cycle, phase) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'EGEA-2024-001', 'أحمد محمد السيد',     'مدير إدارة',  'وزارة التربية والتعليم',   'تميز فردي', 'مدير',      'الدورة الثانية', 2),
  ('c1000000-0000-0000-0000-000000000002', 'EGEA-2024-002', 'سارة عبدالله النجار', 'رئيس قسم',    'وزارة الصحة والسكان',      'تميز فردي', 'رئيس قسم',  'الدورة الثانية', 2),
  ('c1000000-0000-0000-0000-000000000003', 'EGEA-2024-003', 'خالد إبراهيم فاروق',  'مدير عام',    'هيئة الاستثمار',           'تميز فردي', 'مدير عام',  'الدورة الثانية', 2),
  ('c1000000-0000-0000-0000-000000000004', 'EGEA-2024-004', 'منى حسن عثمان',       'رئيس قسم',    'وزارة المالية',            'تميز فردي', 'رئيس قسم',  'الدورة الثانية', 2),
  ('c1000000-0000-0000-0000-000000000005', 'EGEA-2024-005', 'محمود علي رشاد',      'مدير إدارة',  'الجهاز المركزي للتنظيم',   'تميز فردي', 'مدير',      'الدورة الثانية', 2),
  ('c1000000-0000-0000-0000-000000000006', 'EGEA-2024-006', 'نورا طارق حمدي',      'مسؤول أول',   'وزارة الاتصالات',          'تميز فردي', 'مسؤول أول', 'الدورة الثانية', 2),
  ('c1000000-0000-0000-0000-000000000007', 'EGEA-2024-007', 'عمر صالح درويش',      'مدير إدارة',  'وزارة التضامن الاجتماعي',  'تميز فردي', 'مدير',      'الدورة الثانية', 1),
  ('c1000000-0000-0000-0000-000000000008', 'EGEA-2024-008', 'ريم وليد منصور',      'رئيس قسم',    'هيئة قناة السويس',         'تميز فردي', 'رئيس قسم',  'الدورة الثانية', 1);

INSERT INTO phase1_scores (candidate_id, epr, apt, b5, sjt, cbi, total) VALUES
  ('c1000000-0000-0000-0000-000000000001', 4.5, 4.0, 4.2, 8.5, 13.0, 34.2),
  ('c1000000-0000-0000-0000-000000000002', 5.0, 4.5, 4.8, 9.0, 14.0, 37.3),
  ('c1000000-0000-0000-0000-000000000003', 3.8, 3.5, 4.0, 7.5, 11.5, 30.3),
  ('c1000000-0000-0000-0000-000000000004', 4.8, 4.6, 4.5, 9.5, 13.5, 36.9),
  ('c1000000-0000-0000-0000-000000000005', 4.2, 3.8, 3.9, 8.0, 12.0, 31.9),
  ('c1000000-0000-0000-0000-000000000006', 4.0, 4.2, 4.1, 8.8, 12.8, 33.9),
  ('c1000000-0000-0000-0000-000000000007', 3.5, 3.2, 3.8, 7.0, 10.5, 28.0),
  ('c1000000-0000-0000-0000-000000000008', 4.3, 4.0, 4.4, 8.2, 13.2, 34.1);

INSERT INTO assessment_360 (candidate_id, score, provider) VALUES
  ('c1000000-0000-0000-0000-000000000001', 82.0, 'LEVID 360'),
  ('c1000000-0000-0000-0000-000000000002', 91.0, 'LEVID 360'),
  ('c1000000-0000-0000-0000-000000000003', 74.0, 'LEVID 360'),
  ('c1000000-0000-0000-0000-000000000004', 88.0, 'LEVID 360'),
  ('c1000000-0000-0000-0000-000000000005', 79.0, 'LEVID 360'),
  ('c1000000-0000-0000-0000-000000000006', 85.0, 'LEVID 360');

INSERT INTO ojt_submissions (candidate_id, assessor_id, total_score, status, submitted_at) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 88.5, 'submitted', NOW() - '3 days'::INTERVAL),
  ('c1000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 93.0, 'submitted', NOW() - '2 days'::INTERVAL),
  ('c1000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', 76.0, 'submitted', NOW() - '5 days'::INTERVAL),
  ('c1000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 90.5, 'submitted', NOW() - '1 day'::INTERVAL),
  ('c1000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000002', 72.0, 'draft',     NULL);

INSERT INTO fep_submissions (candidate_id, total_score, status, submitted_at) VALUES
  ('c1000000-0000-0000-0000-000000000001', 85.0, 'submitted', NOW() - '2 days'::INTERVAL),
  ('c1000000-0000-0000-0000-000000000002', 94.0, 'submitted', NOW() - '1 day'::INTERVAL),
  ('c1000000-0000-0000-0000-000000000003', 78.0, 'submitted', NOW() - '4 days'::INTERVAL),
  ('c1000000-0000-0000-0000-000000000006', 81.0, 'draft',     NULL);

INSERT INTO fv_submissions (candidate_id, assessor_id, total_score, status, submitted_at) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 87.0, 'submitted', NOW() - '1 day'::INTERVAL),
  ('c1000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 96.0, 'submitted', NOW()),
  ('c1000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002', 89.0, 'submitted', NOW() - '2 days'::INTERVAL);
