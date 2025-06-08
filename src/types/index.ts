// 모든 타입을 통합하여 export

// 데이터베이스 타입 export
export * from './database';

// 업무 관련 타입 export
export * from './work';

// UI 컴포넌트 타입 export
export * from './ui';

// API 요청/응답 타입 export
export * from './api';

// 자주 사용되는 타입들의 별칭
export type {
  WorkCategoryRow as WorkCategoryDB,
  WorkTypeRow as WorkTypeDB, 
  WorkSessionRow as WorkSessionDB
} from './database';

export type {
  WorkCategory,
  WorkType,
  WorkSession,
  ChecklistItem,
  ChecklistTemplate,
  EmergencyContact,
  WorkIssue,
  ChecklistProgress
} from './work';

export type {
  ButtonProps,
  InputProps,
  CardProps,
  ModalProps,
  Toast,
  ChartData,
  ChartOptions
} from './ui';

export type {
  ApiResponse,
  PaginatedResponse,
  CreateCategoryRequest,
  CreateWorkTypeRequest,
  StartSessionRequest,
  EndSessionRequest,
  StatsQuery,
  StatsResponse
} from './api';

// 타입 변환 헬퍼
export const toWorkCategory = (row: import('./database').WorkCategoryRow): import('./work').WorkCategory => ({
  ...row,
  sessionCount: 0,
  totalHours: 0
});

export const toWorkType = (row: import('./database').WorkTypeRow): import('./work').WorkType => ({
  ...row,
  checklist: [],
  emergencyContacts: [],
  sessionCount: 0,
  totalHours: 0,
  averageSessionTime: 0
});

export const toWorkSession = (row: import('./database').WorkSessionRow): import('./work').WorkSession => ({
  ...row,
  duration: row.end_time 
    ? (new Date(row.end_time).getTime() - new Date(row.start_time).getTime()) / (1000 * 60 * 60)
    : undefined
});