// Supabase 테이블 스키마와 정확히 일치하는 타입들

export interface Database {
  public: {
    Tables: {
      work_categories: {
        Row: WorkCategoryRow;
        Insert: WorkCategoryInsert;
        Update: WorkCategoryUpdate;
      };
      work_types: {
        Row: WorkTypeRow;
        Insert: WorkTypeInsert;
        Update: WorkTypeUpdate;
      };
      work_sessions: {
        Row: WorkSessionRow;
        Insert: WorkSessionInsert;
        Update: WorkSessionUpdate;
      };
      checklist_templates: {
        Row: ChecklistTemplateRow;
        Insert: ChecklistTemplateInsert;
        Update: ChecklistTemplateUpdate;
      };
      checklist_items: {
        Row: ChecklistItemRow;
        Insert: ChecklistItemInsert;
        Update: ChecklistItemUpdate;
      };
      session_progress: {
        Row: SessionProgressRow;
        Insert: SessionProgressInsert;
        Update: SessionProgressUpdate;
      };
      salaries: {
        Row: SalaryRow;
        Insert: SalaryInsert;
        Update: SalaryUpdate;
      };
      user_settings: {
        Row: UserSettingsRow;
        Insert: UserSettingsInsert;
        Update: UserSettingsUpdate;
      };
    };
  };
}

// 기본 테이블 Row 타입들
export interface WorkCategoryRow {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkTypeRow {
  id: string;
  user_id: string;
  category_id?: string;
  name: string;
  color: string;
  icon?: string;
  hourly_rate?: number;
  daily_rate?: number;
  notification_time?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkSessionRow {
  id: string;
  user_id: string;
  work_type_id: string;
  start_time: string;
  end_time?: string;
  status: 'active' | 'completed' | 'paused';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ChecklistTemplateRow {
  id: string;
  user_id: string;
  work_type_id: string;
  name: string;
  version: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChecklistItemRow {
  id: string;
  template_id: string;
  time: string;
  task: string;
  mandatory: boolean;
  category: 'safety' | 'preparation' | 'execution' | 'cleanup';
  estimated_duration?: number;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface SessionProgressRow {
  id: string;
  session_id: string;
  checklist_item_id: string;
  status: 'pending' | 'completed' | 'skipped';
  completed_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SalaryRow {
  id: string;
  user_id: string;
  period_type: 'daily' | 'weekly' | 'monthly';
  period_start: string;
  period_end: string;
  total_amount: number;
  work_days: number;
  total_hours: number;
  base_pay: number;
  overtime_pay: number;
  deductions: number;
  created_at: string;
  updated_at: string;
}

export interface UserSettingsRow {
  user_id: string;
  theme: 'light' | 'dark';
  notifications_email: boolean;
  notifications_push: boolean;
  notifications_sound: boolean;
  default_work_type?: string;
  created_at: string;
  updated_at: string;
}

// Insert 타입들 (created_at, updated_at 제외)
export type WorkCategoryInsert = Omit<WorkCategoryRow, 'id' | 'created_at' | 'updated_at'>;
export type WorkTypeInsert = Omit<WorkTypeRow, 'id' | 'created_at' | 'updated_at'>;
export type WorkSessionInsert = Omit<WorkSessionRow, 'id' | 'created_at' | 'updated_at'>;
export type ChecklistTemplateInsert = Omit<ChecklistTemplateRow, 'id' | 'created_at' | 'updated_at'>;
export type ChecklistItemInsert = Omit<ChecklistItemRow, 'id' | 'created_at' | 'updated_at'>;
export type SessionProgressInsert = Omit<SessionProgressRow, 'id' | 'created_at' | 'updated_at'>;
export type SalaryInsert = Omit<SalaryRow, 'id' | 'created_at' | 'updated_at'>;
export type UserSettingsInsert = Omit<UserSettingsRow, 'created_at' | 'updated_at'>;

// Update 타입들 (모든 필드 optional, id 제외)
export type WorkCategoryUpdate = Partial<Omit<WorkCategoryRow, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
export type WorkTypeUpdate = Partial<Omit<WorkTypeRow, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
export type WorkSessionUpdate = Partial<Omit<WorkSessionRow, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
export type ChecklistTemplateUpdate = Partial<Omit<ChecklistTemplateRow, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
export type ChecklistItemUpdate = Partial<Omit<ChecklistItemRow, 'id' | 'created_at' | 'updated_at'>>;
export type SessionProgressUpdate = Partial<Omit<SessionProgressRow, 'id' | 'created_at' | 'updated_at'>>;
export type SalaryUpdate = Partial<Omit<SalaryRow, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
export type UserSettingsUpdate = Partial<Omit<UserSettingsRow, 'user_id' | 'created_at' | 'updated_at'>>;