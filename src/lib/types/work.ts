import { WorkCategoryRow, WorkTypeRow, WorkSessionRow } from "./database";

// 비즈니스 로직용 확장 타입들
export interface WorkCategory extends WorkCategoryRow {
  workTypes?: WorkType[];
  sessionCount?: number;
  totalHours?: number;
  lastUsed?: string;
}

export interface WorkType extends WorkTypeRow {
  category?: WorkCategory;
  checklist?: ChecklistItem[];
  emergencyContacts?: EmergencyContact[];
  sessionCount?: number;
  totalHours?: number;
  averageSessionTime?: number;
  lastUsed?: string;
}

export interface WorkSession extends WorkSessionRow {
  workType?: WorkType;
  duration?: number;
  checklistProgress?: ChecklistProgress;
  issues?: WorkIssue[];
  earnings?: number;
}

// 체크리스트 관련 타입들
export interface ChecklistItem {
  id: string;
  templateId: string;
  time: string;
  task: string;
  mandatory: boolean;
  category: 'safety' | 'preparation' | 'execution' | 'cleanup';
  estimatedDuration?: number;
  order: number;
  icon?: string;
  description?: string;
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  workTypeId: string;
  items: ChecklistItem[];
  totalEstimatedTime: number;
  version: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistProgress {
  sessionId: string;
  templateId: string;
  items: ChecklistProgressItem[];
  completionRate: number;
  estimatedCompletionTime?: string;
}

export interface ChecklistProgressItem {
  itemId: string;
  status: 'pending' | 'completed' | 'skipped';
  completedAt?: string;
  notes?: string;
  duration?: number;
}

// 업무 이슈 및 메모
export interface WorkIssue {
  id: string;
  sessionId: string;
  time: string;
  type: 'safety' | 'equipment' | 'delay' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  resolved: boolean;
  resolvedAt?: string;
  reportedBy?: string;
  images?: string[];
}

// 비상 연락처
export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  role: string;
  workTypeId: string;
  primary: boolean;
  email?: string;
  notes?: string;
}

// 색상 및 아이콘 시스템
export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export const WORK_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
  '#F97316', '#6366F1', '#14B8A6', '#EAB308'
] as const;

export const WORK_ICONS = [
  'briefcase', 'hammer', 'cog', 'truck', 'headphones',
  'clipboard', 'phone', 'heart', 'shield', 'clock',
  'user', 'building', 'wrench', 'laptop', 'camera'
] as const;

export type WorkColor = typeof WORK_COLORS[number];
export type WorkIcon = typeof WORK_ICONS[number];

// 업무 통계 타입들
export interface WorkStats {
  totalSessions: number;
  totalHours: number;
  averageSessionTime: number;
  completionRate: number;
  productivityScore: number;
  trend: 'up' | 'down' | 'stable';
  todayHours: number;
  weekHours: number;
  monthHours: number;
}

export interface DailyStats {
  date: string;
  sessions: number;
  hours: number;
  earnings: number;
  completionRate: number;
  workTypes: string[];
  issues: number;
}

export interface WeeklyStats {
  weekStart: string;
  weekEnd: string;
  dailyStats: DailyStats[];
  totalHours: number;
  totalEarnings: number;
  averageCompletionRate: number;
  mostUsedWorkType: string;
  productivityTrend: 'increasing' | 'decreasing' | 'stable';
}

export interface MonthlyStats {
  month: string;
  year: number;
  weeklyStats: WeeklyStats[];
  totalHours: number;
  totalEarnings: number;
  averageCompletionRate: number;
  workDays: number;
  averageHoursPerDay: number;
}

// 타이머 관련 타입들
export interface TimerState {
  sessionId?: string;
  workTypeId?: string;
  startTime?: string;
  currentTime: number;
  isRunning: boolean;
  isPaused: boolean;
  totalTime: number;
  status: 'idle' | 'running' | 'paused' | 'completed';
}

export interface TimerConfig {
  autoStart: boolean;
  showNotifications: boolean;
  playSound: boolean;
  warningMinutes: number;
  targetMinutes?: number;
}

// 알림 관련 타입들
export interface WorkNotification {
  id: string;
  type: 'work_start' | 'work_end' | 'break_time' | 'checklist_reminder' | 'daily_summary';
  title: string;
  message: string;
  workTypeId?: string;
  scheduledTime: string;
  sent: boolean;
  action?: {
    label: string;
    url: string;
  };
}

export interface NotificationSettings {
  workReminders: boolean;
  breakReminders: boolean;
  dailySummary: boolean;
  weeklyReport: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  reminderMinutes: number;
}

// 데이터 내보내기 타입들
export interface ExportOptions {
  format: 'csv' | 'pdf' | 'excel';
  dateRange: {
    start: string;
    end: string;
  };
  includeDetails: boolean;
  includeCharts: boolean;
  workTypeIds?: string[];
  categoryIds?: string[];
}

export interface ExportData {
  sessions: WorkSession[];
  categories: WorkCategory[];
  workTypes: WorkType[];
  stats: WorkStats;
  generatedAt: string;
}

// PWA 관련 타입들
export interface PWAInstallPrompt {
  isInstallable: boolean;
  canInstall: boolean;
  isInstalled: boolean;
  platform: 'web' | 'android' | 'ios' | 'desktop';
}

export interface ServiceWorkerMessage {
  type: 'sync' | 'notification' | 'update' | 'cache';
  data?: any;
  timestamp: number;
}