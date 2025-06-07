export interface Database {
    WorkCategory: WorkCategory;
    WorkType: WorkType;
    WorkSession: WorkSession;
    Salary: Salary;
    UserSettings: UserSettings;
}


export interface WorkCategory {
    id: string;
    user_id: string;
    name: string;
    color: string;
    created_at?: string;
}

export interface WorkType {
    id: string;
    user_id: string;
    category_id?: string;
    color: string;
    name: string;
    hourly_rate?: number;
    daily_rate?: number;
    checklist?: ChecklistItem[];
    emergency_contacts?: EmergencyContact[];
    created_at?: string;
}

export interface WorkSession {
    id: string;
    user_id: string;
    work_type_id: string;
    start_time: string;
    end_time?: string;
    status: '진행중' | '완료' | '중단';
    issues?: WorkIssue[];
    checklist_progress?: ChecklistProgress;
    created_at?: string;
}

export interface Salary {
    id: string;
    user_id: string;
    period_type: '일급' | '주급' | '월급';
    period_start: string;
    period_end: string;
    total_amount: number;
    details: SalaryDetails;
    created_at?: string;
}

export interface UserSettings {
    user_id: string;
    theme: 'light' | 'dark';
    notifications: {
        email: boolean;
        push: boolean;
        sound: boolean;
    };
    work_preferences: {
        default_work_type?: string;
    };
    created_at?: string;
}

// 보조 타입
export interface ChecklistItem {
    time: string;
    task: string;
    mandatory: boolean;
}

export interface EmergencyContact {
    name: string;
    phone: string;
    role: string;
}

interface WorkIssue {
    time: string;
    type: string;
    description: string;
    resolved: boolean;
}

interface ChecklistProgress {
    completed: number[];
    pending: number[];
}

interface SalaryDetails {
    work_days: number;
    hours: number;
    base_pay: number;
    overtime_pay: number;
    deductions: number;
}