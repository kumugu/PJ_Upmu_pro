// API 요청/응답 타입들

import { WorkCategory, WorkType, WorkSession, ChecklistItem, ChecklistTemplate, EmergencyContact } from './work';

// API 응답 기본 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 업무 카테고리 API
export interface CreateCategoryRequest {
  name: string;
  color: string;
  icon?: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: string;
}

export type CategoryResponse = ApiResponse<WorkCategory>;
export type CategoriesResponse = ApiResponse<WorkCategory[]>;

// 업무 유형 API
export interface CreateWorkTypeRequest {
  categoryId?: string;
  name: string;
  color: string;
  icon?: string;
  hourlyRate?: number;
  dailyRate?: number;
  checklist?: ChecklistItem[];
  emergencyContacts?: EmergencyContact[];
}

export interface UpdateWorkTypeRequest extends Partial<CreateWorkTypeRequest> {
  id: string;
}

export type WorkTypeResponse = ApiResponse<WorkType>;
export type WorkTypesResponse = ApiResponse<WorkType[]>;

// 체크리스트 API
export interface CreateChecklistTemplateRequest {
  workTypeId: string;
  name: string;
  items: ChecklistItemRequest[];
}

export interface ChecklistItemRequest {
  time: string;
  task: string;
  mandatory: boolean;
  category?: string;
  estimatedDuration?: number;
  order?: number;
}

export interface UpdateChecklistTemplateRequest {
  id: string;
  name?: string;
  items?: ChecklistItemRequest[];
  isActive?: boolean;
}

export type ChecklistTemplateResponse = ApiResponse<ChecklistTemplate>;
export type ChecklistTemplatesResponse = ApiResponse<ChecklistTemplate[]>;

// 업무 세션 API
export interface StartSessionRequest {
  workTypeId: string;
  notes?: string;
}

export interface UpdateSessionRequest {
  sessionId: string;
  status?: 'active' | 'completed' | 'paused';
  notes?: string;
  checklistProgress?: {
    items: {
      itemId: string;
      status: 'pending' | 'completed' | 'skipped';
      notes?: string;
    }[];
  };
}

export interface EndSessionRequest {
  sessionId: string;
  notes?: string;
  issues?: {
    time: string;
    type: string;
    severity: string;
    description: string;
    resolved: boolean;
  }[];
}

export type SessionResponse = ApiResponse<WorkSession>;
export type SessionsResponse = PaginatedResponse<WorkSession>;

// 통계 API
export interface StatsQuery {
  startDate?: string;
  endDate?: string;
  workTypeId?: string;
  categoryId?: string;
}

export interface StatsResponse extends ApiResponse {
  data: {
    daily: DailyStats[];
    weekly: WeeklyStats[];
    monthly: MonthlyStats[];
    summary: WorkStats;
  };
}

interface DailyStats {
  date: string;
  sessions: number;
  hours: number;
  earnings: number;
  completionRate: number;
}

interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  totalHours: number;
  totalEarnings: number;
  completionRate: number;
}

interface MonthlyStats {
  month: string;
  year: number;
  totalHours: number;
  totalEarnings: number;
  completionRate: number;
  workDays: number;
}

interface WorkStats {
  totalSessions: number;
  totalHours: number;
  averageSessionTime: number;
  completionRate: number;
  earnings: number;
}

// 파일 업로드 API
export interface UploadRequest {
  file: File;
  type: 'avatar' | 'document' | 'export';
}

export interface UploadResponse extends ApiResponse {
  data: {
    url: string;
    filename: string;
    size: number;
    type: string;
  };
}

// 데이터 내보내기 API
export interface ExportRequest {
  format: 'csv' | 'pdf' | 'excel';
  startDate: string;
  endDate: string;
  includeCharts?: boolean;
  workTypeIds?: string[];
}

export interface ExportResponse extends ApiResponse {
  data: {
    downloadUrl: string;
    filename: string;
    expiresAt: string;
  };
}

// 알림 API
export interface NotificationRequest {
  type: 'work_start' | 'work_end' | 'break_time' | 'checklist_reminder' | 'daily_summary';
  title: string;
  message: string;
  workTypeId?: string;
  scheduledTime?: string;
}

export interface NotificationResponse extends ApiResponse {
  data: {
    id: string;
    sent: boolean;
    scheduledTime?: string;
  };
}

// 사용자 설정 API
export interface UpdateSettingsRequest {
  theme?: 'light' | 'dark';
  notifications_email?: boolean;
  notifications_push?: boolean;
  notifications_sound?: boolean;
  default_work_type?: string;
}

export interface SettingsResponse extends ApiResponse {
  data: {
    theme: string;
    notifications_email: boolean;
    notifications_push: boolean;
    notifications_sound: boolean;
    default_work_type?: string;
  };
}

// 인증 API
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse extends ApiResponse {
  data: {
    user: {
      id: string;
      email: string;
      name?: string;
    };
    session: {
      token: string;
      expires: string;
    };
  };
}