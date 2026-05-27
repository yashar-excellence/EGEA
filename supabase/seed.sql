-- ============================================================
-- EGEA · Seed Data Script
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. CREATE TABLES (if not exist)
-- ============================================================

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

-- ============================================================
-- 2. CLEAR OLD SEED DATA (safe re-run)
-- ============================================================
DELETE FROM fv_submissions;
DELETE FROM fep_submissions;
DELETE FROM ojt_submissions;
DELETE FROM assessment_360;
DELETE FROM phase1_scores;
DELETE FROM candidates;

-- ============================================================
-- 3. INSERT CANDIDATES
-- ============================================================
INSERT INTO candidates (id, code, name, role, organization, category, level, cycle, phase) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'EGEA-2024-001', 'أحمد محمد السيد',     'مدير إدارة',           'وزارة التربية والتعليم',        'تميز فردي', 'مدير',          'الدورة الثانية', 2),
  ('c1000000-0000-0000-0000-000000000002', 'EGEA-2024-002', 'سارة عبدالله النجار', 'رئيس قسم',             'وزارة الصحة والسكان',           'تميز فردي', 'رئيس قسم',      'الدورة الثانية', 2),
  ('c1000000-0000-0000-0000-000000000003', 'EGEA-2024-003', 'خالد إبراهيم فاروق',  'مدير عام',             'هيئة الاستثمار',                'تميز فردي', 'مدير عام',      'الدورة الثانية', 2),
  ('c1000000-0000-0000-0000-000000000004', 'EGEA-2024-004', 'منى حسن عثمان',       'رئيس قسم',             'وزارة المالية',                 'تميز فردي', 'رئيس قسم',      'الدورة الثانية', 2),
  ('c1000000-0000-0000-0000-000000000005', 'EGEA-2024-005', 'محمود علي رشاد',      'مدير إدارة',           'الجهاز المركزي للتنظيم',        'تميز فردي', 'مدير',          'الدورة الثانية', 2),
  ('c1000000-0000-0000-0000-000000000006', 'EGEA-2024-006', 'نورا طارق حمدي',      'مسؤول أول',            'وزارة الاتصالات',               'تميز فردي', 'مسؤول أول',     'الدورة الثانية', 2),
  ('c1000000-0000-0000-0000-000000000007', 'EGEA-2024-007', 'عمر صالح درويش',      'مدير إدارة',           'وزارة التضامن الاجتماعي',       'تميز فردي', 'مدير',          'الدورة الثانية', 1),
  ('c1000000-0000-0000-0000-000000000008', 'EGEA-2024-008', 'ريم وليد منصور',      'رئيس قسم',             'هيئة قناة السويس',              'تميز فردي', 'رئيس قسم',      'الدورة الثانية', 1);

-- ============================================================
-- 4. PHASE 1 SCORES  (max per tool: EPR=5, APT=5, B5=5, SJT=10, CBI=15 → total/40 × 40%)
-- ============================================================
INSERT INTO phase1_scores (candidate_id, epr, apt, b5, sjt, cbi, total) VALUES
  ('c1000000-0000-0000-0000-000000000001', 4.5, 4.0, 4.2, 8.5, 13.0, 34.2),
  ('c1000000-0000-0000-0000-000000000002', 5.0, 4.5, 4.8, 9.0, 14.0, 37.3),
  ('c1000000-0000-0000-0000-000000000003', 3.8, 3.5, 4.0, 7.5, 11.5, 30.3),
  ('c1000000-0000-0000-0000-000000000004', 4.8, 4.6, 4.5, 9.5, 13.5, 36.9),
  ('c1000000-0000-0000-0000-000000000005', 4.2, 3.8, 3.9, 8.0, 12.0, 31.9),
  ('c1000000-0000-0000-0000-000000000006', 4.0, 4.2, 4.1, 8.8, 12.8, 33.9),
  ('c1000000-0000-0000-0000-000000000007', 3.5, 3.2, 3.8, 7.0, 10.5, 28.0),
  ('c1000000-0000-0000-0000-000000000008', 4.3, 4.0, 4.4, 8.2, 13.2, 34.1);

-- ============================================================
-- 5. ASSESSMENT 360  (score out of 100, weight 10%)
-- ============================================================
INSERT INTO assessment_360 (candidate_id, score, provider) VALUES
  ('c1000000-0000-0000-0000-000000000001', 82.0, 'LEVID 360'),
  ('c1000000-0000-0000-0000-000000000002', 91.0, 'LEVID 360'),
  ('c1000000-0000-0000-0000-000000000003', 74.0, 'LEVID 360'),
  ('c1000000-0000-0000-0000-000000000004', 88.0, 'LEVID 360'),
  ('c1000000-0000-0000-0000-000000000005', 79.0, 'LEVID 360'),
  ('c1000000-0000-0000-0000-000000000006', 85.0, 'LEVID 360');

-- ============================================================
-- 6. OJT SUBMISSIONS  (score out of 100, weight 10%)
-- ============================================================
INSERT INTO ojt_submissions (candidate_id, assessor_id, total_score, status, submitted_at) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'assessor-1', 88.5, 'submitted', NOW() - INTERVAL '3 days'),
  ('c1000000-0000-0000-0000-000000000002', 'assessor-1', 93.0, 'submitted', NOW() - INTERVAL '2 days'),
  ('c1000000-0000-0000-0000-000000000003', 'assessor-2', 76.0, 'submitted', NOW() - INTERVAL '5 days'),
  ('c1000000-0000-0000-0000-000000000004', 'assessor-1', 90.5, 'submitted', NOW() - INTERVAL '1 day'),
  ('c1000000-0000-0000-0000-000000000005', 'assessor-2', 72.0, 'draft',     NULL);

-- ============================================================
-- 7. FEP SUBMISSIONS  (score out of 100, weight 15%)
-- ============================================================
INSERT INTO fep_submissions (candidate_id, total_score, status, submitted_at) VALUES
  ('c1000000-0000-0000-0000-000000000001', 85.0, 'submitted', NOW() - INTERVAL '2 days'),
  ('c1000000-0000-0000-0000-000000000002', 94.0, 'submitted', NOW() - INTERVAL '1 day'),
  ('c1000000-0000-0000-0000-000000000003', 78.0, 'submitted', NOW() - INTERVAL '4 days'),
  ('c1000000-0000-0000-0000-000000000006', 81.0, 'draft',     NULL);

-- ============================================================
-- 8. FV SUBMISSIONS  (score out of 100, weight 25%)
-- ============================================================
INSERT INTO fv_submissions (candidate_id, assessor_id, total_score, status, submitted_at) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'assessor-1', 87.0, 'submitted', NOW() - INTERVAL '1 day'),
  ('c1000000-0000-0000-0000-000000000002', 'assessor-1', 96.0, 'submitted', NOW()),
  ('c1000000-0000-0000-0000-000000000004', 'assessor-2', 89.0, 'submitted', NOW() - INTERVAL '2 days');

-- ============================================================
-- DONE ✓
-- Expected EI Scores (approx):
--   أحمد السيد:   34.2×0.4 + 82×0.1 + 88.5×0.1 + 85×0.15 + 87×0.25  ≈ 67.7
--   سارة النجار:  37.3×0.4 + 91×0.1 + 93×0.1  + 94×0.15 + 96×0.25   ≈ 76.7
--   خالد فاروق:   30.3×0.4 + 74×0.1 + 76×0.1  + 78×0.15 + 0×0.25    ≈ 38.1
--   منى عثمان:    36.9×0.4 + 88×0.1 + 90.5×0.1 + 0×0.15 + 89×0.25   ≈ 55.9
-- ============================================================
