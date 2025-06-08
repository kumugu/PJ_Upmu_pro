export type PresetColor =
  | '#3B82F6'
  | '#F59E0B'
  | '#EF4444'
  | '#10B981'
  | '#8B5CF6'
  | '#EC4899'
  | '#F43F5E'
  | '#6366F1'
  | '#F97316'
  | '#22D3EE'
  | string;

export const PRESET_COLORS: PresetColor[] = [
  '#3B82F6',
  '#F59E0B',
  '#EF4444',
  '#10B981',
  '#8B5CF6',
  '#EC4899',
  '#F43F5E',
  '#6366F1',
  '#F97316',
  '#22D3EE',
];

export type WorkIcon =
  | 'briefcase'
  | 'calendar'
  | 'clock'
  | 'check'
  | 'star'
  | 'user'
  | 'settings'
  | 'folder'
  | 'tag'
  | 'mail'
  | string;

export const WORK_ICONS: WorkIcon[] = [
  'briefcase',
  'calendar',
  'clock',
  'check',
  'star',
  'user',
  'settings',
  'folder',
  'tag',
  'mail',
];

// 체크리스트 항목 타입
export interface ChecklistItem {
  id: string;
  time: string;
  task: string;
  mandatory: boolean;
  category?: string;
  estimatedDuration?: number;
  order?: number;
}

// 임시 데이터용 (id 없이)
export interface ChecklistItemData {
  id: string;
  time: string;
  task: string;
  mandatory: boolean;
  category?: string;
  estimatedDuration?: number;
  order?: number;
}
