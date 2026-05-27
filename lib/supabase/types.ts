export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      candidates: {
        Row: {
          id: string;
          code: string;
          name: string;
          role: string;
          organization: string;
          category: string;
          level: string;
          cycle: string;
          phase: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['candidates']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['candidates']['Insert']>;
      };
      phase1_scores: {
        Row: {
          id: string;
          candidate_id: string;
          epr: number | null;
          apt: number | null;
          b5: number | null;
          sjt: number | null;
          cbi: number | null;
          total: number | null;
          imported_at: string;
        };
        Insert: Omit<Database['public']['Tables']['phase1_scores']['Row'], 'id' | 'imported_at'>;
        Update: Partial<Database['public']['Tables']['phase1_scores']['Insert']>;
      };
      assessment_360: {
        Row: {
          id: string;
          candidate_id: string;
          score: number | null;
          provider: string;
          imported_at: string;
        };
        Insert: Omit<Database['public']['Tables']['assessment_360']['Row'], 'id' | 'imported_at'>;
        Update: Partial<Database['public']['Tables']['assessment_360']['Insert']>;
      };
      ojt_submissions: {
        Row: {
          id: string;
          candidate_id: string;
          assessor_id: string;
          data: Json;
          total_score: number | null;
          status: 'draft' | 'submitted' | 'approved';
          submitted_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['ojt_submissions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['ojt_submissions']['Insert']>;
      };
      fep_submissions: {
        Row: {
          id: string;
          candidate_id: string;
          data: Json;
          total_score: number | null;
          status: 'draft' | 'submitted' | 'approved';
          submitted_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['fep_submissions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['fep_submissions']['Insert']>;
      };
      fv_submissions: {
        Row: {
          id: string;
          candidate_id: string;
          assessor_id: string;
          data: Json;
          total_score: number | null;
          status: 'draft' | 'submitted' | 'approved';
          submitted_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['fv_submissions']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['fv_submissions']['Insert']>;
      };
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'admin' | 'chief_assessor' | 'assessor' | 'viewer';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
    };
  };
}
