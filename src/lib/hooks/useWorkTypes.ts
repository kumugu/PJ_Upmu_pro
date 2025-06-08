'use client';

import { useState, useEffect, useCallback } from 'react';
import { WorkType } from '../types/work';
import { WorkTypeInsert, WorkTypeUpdate } from '../types/database';
import { getSupabaseClient, requireAuth } from '../supabase';
import toast from 'react-hot-toast';

// 업무 유형 관리를 위한 커스텀 훅
export function useWorkTypes(categoryId?: string) {
  // 상태 관리
  const [workTypes, setWorkTypes] = useState<WorkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = getSupabaseClient();

  // 업무 유형 목록 로드
  const loadWorkTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 인증된 사용자 확인
      const user = await requireAuth();
      
      // 기본 쿼리 생성
      let query = supabase
        .from('work_types')
        .select(`
          *,
          work_categories:work_categories(*),
          checklist_templates:checklist_templates(count)
        `)
        .eq('user_id', user.id);

      // 특정 카테고리의 업무 유형만 필터링
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // 업무 유형별 통계 계산
      const workTypesWithStats = data.map(workType => ({
        ...workType,
        category: workType.work_categories,
        checklistTemplateCount: workType.checklist_templates?.[0]?.count || 0,
        // 추가 통계 필드
        sessionCount: 0, // 실제로는 work_sessions 테이블에서 계산해야 함
        totalHours: 0,   // 실제로는 work_sessions 테이블에서 계산해야 함
        totalEarnings: 0 // 실제로는 계산해야 함
      }));

      setWorkTypes(workTypesWithStats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '업무 유형을 불러오는데 실패했습니다.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Load work types error:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase, categoryId]);

  // 업무 유형 생성
  const createWorkType = useCallback(async (workTypeData: WorkTypeInsert): Promise<WorkType | null> => {
    try {
      const user = await requireAuth();

      // 입력 데이터 검증
      if (!workTypeData.name?.trim()) {
        toast.error('업무 유형 이름을 입력해주세요.');
        return null;
      }

      const { data, error } = await supabase
        .from('work_types')
        .insert([
          {
            user_id: user.id,
            ...workTypeData,
            created_at: new Date().toISOString(),
            6
            updated_at: new Date().toISOString()
          }
        ])
        .select(`
          *,
          work_categories:work_categories(*)
        `)
        .single();

      if (error) throw error;

      const newWorkType: WorkType = {
        ...data,
        category: data.work_categories,
        checklistTemplateCount: 0,
        sessionCount: 0,
        totalHours: 0,
        totalEarnings: 0
      };

      // 로컬 상태 즉시 업데이트
      setWorkTypes(prev => [newWorkType, ...prev]);
      toast.success('업무 유형이 생성되었습니다.');
      return newWorkType;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '업무 유형 생성에 실패했습니다.';
      toast.error(errorMessage);
      console.error('Create work type error:', err);
      return null;
    }
  }, [supabase]);

  // 업무 유형 수정
  const updateWorkType = useCallback(async (id: string, updateData: WorkTypeUpdate): Promise<boolean> => {
    try {
      const user = await requireAuth();

      // 입력 데이터 검증
      if (updateData.name !== undefined && !updateData.name?.trim()) {
        toast.error('업무 유형 이름을 입력해주세요.');
        return false;
      }

      const { data, error } = await supabase
        .from('work_types')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select(`
          *,
          work_categories:work_categories(*)
        `)
        .single();

      if (error) throw error;

      // 로컬 상태 업데이트
      setWorkTypes(prev => 
        prev.map(workType => 
          workType.id === id 
            ? { 
                ...workType, 
                ...data,
                category: data.work_categories
              } 
            : workType
        )
      );
      toast.success('업무 유형이 수정되었습니다.');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '업무 유형 수정에 실패했습니다.';
      toast.error(errorMessage);
      console.error('Update work type error:', err);
      return false;
    }
  }, [supabase]);

  // 업무 유형 삭제
  const deleteWorkType = useCallback(async (id: string): Promise<boolean> => {
    try {
      const user = await requireAuth();

      // 먼저 해당 업무 유형에 속한 체크리스트 템플릿이 있는지 확인
      const { data: templates, error: checkError } = await supabase
        .from('checklist_templates')
        .select('id')
        .eq('work_type_id', id)
        .eq('user_id', user.id)
        .limit(1);

      if (checkError) throw checkError;

      if (templates && templates.length > 0) {
        toast.error('이 업무 유형에 속한 체크리스트 템플릿이 있어 삭제할 수 없습니다. 먼저 체크리스트 템플릿을 삭제해주세요.');
        return false;
      }

      // 업무 세션 확인
      const { data: sessions, error: sessionCheckError } = await supabase
        .from('work_sessions')
        .select('id')
        .eq('work_type_id', id)
        .eq('user_id', user.id)
        .limit(1);

      if (sessionCheckError) throw sessionCheckError;

      if (sessions && sessions.length > 0) {
        toast.error('이 업무 유형에 속한 업무 세션이 있어 삭제할 수 없습니다.');
        return false;
      }

      // 삭제 실행
      const { error } = await supabase
        .from('work_types')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // 로컬 상태에서 제거
      setWorkTypes(prev => prev.filter(workType => workType.id !== id));
      toast.success('업무 유형이 삭제되었습니다.');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '업무 유형 삭제에 실패했습니다.';
      toast.error(errorMessage);
      console.error('Delete work type error:', err);
      return false;
    }
  }, [supabase]);

  // 업무 유형 복제
  const duplicateWorkType = useCallback(async (id: string): Promise<WorkType | null> => {
    try {
      const originalWorkType = getWorkTypeById(id);
      if (!originalWorkType) {
        toast.error('복제할 업무 유형을 찾을 수 없습니다.');
        return null;
      }

      const duplicateData: WorkTypeInsert = {
        category_id: originalWorkType.category_id,
        name: `${originalWorkType.name} (복사본)`,
        color: originalWorkType.color,
        icon: originalWorkType.icon,
        hourly_rate: originalWorkType.hourly_rate,
        daily_rate: originalWorkType.daily_rate,
        description: originalWorkType.description
      };

      return await createWorkType(duplicateData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '업무 유형 복제에 실패했습니다.';
      toast.error(errorMessage);
      console.error('Duplicate work type error:', err);
      return null;
    }
  }, [createWorkType]);

  // 업무 유형 검색
  const searchWorkTypes = useCallback((query: string) => {
    if (!query.trim()) return workTypes;
    
    const lowercaseQuery = query.toLowerCase();
    return workTypes.filter(workType =>
      workType.name.toLowerCase().includes(lowercaseQuery) ||
      workType.description?.toLowerCase().includes(lowercaseQuery) ||
      workType.category?.name.toLowerCase().includes(lowercaseQuery)
    );
  }, [workTypes]);

  // 특정 업무 유형 조회
  const getWorkTypeById = useCallback((id: string) => {
    return workTypes.find(workType => workType.id === id);
  }, [workTypes]);

  // 카테고리별 업무 유형 조회
  const getWorkTypesByCategory = useCallback((categoryId: string) => {
    return workTypes.filter(workType => workType.category_id === categoryId);
  }, [workTypes]);

  // 색상별 업무 유형 조회
  const getWorkTypesByColor = useCallback((color: string) => {
    return workTypes.filter(workType => workType.color === color);
  }, [workTypes]);

  // 급여 타입별 업무 유형 조회
  const getWorkTypesByPaymentType = useCallback((type: 'hourly' | 'daily') => {
    return workTypes.filter(workType => 
      type === 'hourly' ? workType.hourly_rate : workType.daily_rate
    );
  }, [workTypes]);

  // 급여 계산 헬퍼
  const calculateEarnings = useCallback((workTypeId: string, hours: number, days?: number) => {
    const workType = getWorkTypeById(workTypeId);
    if (!workType) return 0;

    if (workType.daily_rate && days) {
      return workType.daily_rate * days;
    } else if (workType.hourly_rate) {
      return workType.hourly_rate * hours;
    }
    return 0;
  }, [getWorkTypeById]);

  // 예상 일급 계산
  const calculateDailyEarnings = useCallback((workTypeId: string, hoursPerDay: number = 8) => {
    const workType = getWorkTypeById(workTypeId);
    if (!workType) return 0;

    if (workType.daily_rate) {
      return workType.daily_rate;
    } else if (workType.hourly_rate) {
      return workType.hourly_rate * hoursPerDay;
    }
    return 0;
  }, [getWorkTypeById]);

  // 업무 유형 통계 계산
  const calculateWorkTypeStats = useCallback(async (workTypeId: string) => {
    try {
      const user = await requireAuth();

      // 세션 통계 조회
      const { data: sessions, error } = await supabase
        .from('work_sessions')
        .select('id, start_time, end_time, status')
        .eq('work_type_id', workTypeId)
        .eq('user_id', user.id);

      if (error) throw error;

      const stats = {
        totalSessions: sessions.length,
        completedSessions: sessions.filter(s => s.status === 'completed').length,
        totalHours: sessions.reduce((total, session) => {
          if (session.end_time && session.start_time) {
            const start = new Date(session.start_time);
            const end = new Date(session.end_time);
            return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          }
          return total;
        }, 0),
        completionRate: sessions.length > 0 
          ? sessions.filter(s => s.status === 'completed').length / sessions.length * 100
          : 0
      };

      return stats;
    } catch (err) {
      console.error('Calculate work type stats error:', err);
      return {
        totalSessions: 0,
        completedSessions: 0,
        totalHours: 0,
        completionRate: 0
      };
    }
  }, [supabase]);

  // 업무 유형 정렬
  const sortWorkTypes = useCallback((sortBy: 'name' | 'created_at' | 'category' | 'hourly_rate' | 'daily_rate', order: 'asc' | 'desc' = 'asc') => {
    return [...workTypes].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'created_at':
          aValue = new Date(a.created_at || 0);
          bValue = new Date(b.created_at || 0);
          break;
        case 'category':
          aValue = a.category?.name?.toLowerCase() || '';
          bValue = b.category?.name?.toLowerCase() || '';
          break;
        case 'hourly_rate':
          aValue = a.hourly_rate || 0;
          bValue = b.hourly_rate || 0;
          break;
        case 'daily_rate':
          aValue = a.daily_rate || 0;
          bValue = b.daily_rate || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [workTypes]);

  // 업무 유형 필터링
  const filterWorkTypes = useCallback((filters: {
    categoryId?: string;
    hasHourlyRate?: boolean;
    hasDailyRate?: boolean;
    color?: string;
    minRate?: number;
    maxRate?: number;
  }) => {
    return workTypes.filter(workType => {
      if (filters.categoryId && workType.category_id !== filters.categoryId) return false;
      if (filters.hasHourlyRate !== undefined && Boolean(workType.hourly_rate) !== filters.hasHourlyRate) return false;
      if (filters.hasDailyRate !== undefined && Boolean(workType.daily_rate) !== filters.hasDailyRate) return false;
      if (filters.color && workType.color !== filters.color) return false;
      
      if (filters.minRate !== undefined) {
        const rate = workType.hourly_rate || workType.daily_rate || 0;
        if (rate < filters.minRate) return false;
      }
      
      if (filters.maxRate !== undefined) {
        const rate = workType.hourly_rate || workType.daily_rate || 0;
        if (rate > filters.maxRate) return false;
      }

      return true;
    });
  }, [workTypes]);

  // 실시간 구독 설정
  useEffect(() => {
    loadWorkTypes();

    // 실시간 변경사항 구독
    const channel = supabase
      .channel('work_types_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'work_types'
        },
        (payload) => {
          console.log('Work type change detected:', payload);
          // 변경사항에 따라 로컬 상태 업데이트
          if (payload.eventType === 'INSERT') {
            loadWorkTypes(); // 새로운 데이터 추가 시 전체 다시 로드
          } else if (payload.eventType === 'DELETE') {
            setWorkTypes(prev => prev.filter(wt => wt.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            loadWorkTypes(); // 업데이트 시 전체 다시 로드 (관계 데이터 포함)
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadWorkTypes, supabase]);

  return {
    // 상태
    workTypes,
    loading,
    error,

    // CRUD 작업
    loadWorkTypes,
    createWorkType,
    updateWorkType,
    deleteWorkType,
    duplicateWorkType,

    // 조회 함수
    searchWorkTypes,
    getWorkTypeById,
    getWorkTypesByCategory,
    getWorkTypesByColor,
    getWorkTypesByPaymentType,

    // 유틸리티 함수
    calculateEarnings,
    calculateDailyEarnings,
    calculateWorkTypeStats,
    sortWorkTypes,
    filterWorkTypes,

    // 통계 (derived state)
    totalWorkTypes: workTypes.length,
    workTypesWithHourlyRate: workTypes.filter(wt => wt.hourly_rate).length,
    workTypesWithDailyRate: workTypes.filter(wt => wt.daily_rate).length,
    averageHourlyRate: workTypes.length > 0 
      ? workTypes.reduce((sum, wt) => sum + (wt.hourly_rate || 0), 0) / workTypes.length 
      : 0,
    averageDailyRate: workTypes.length > 0 
      ? workTypes.reduce((sum, wt) => sum + (wt.daily_rate || 0), 0) / workTypes.length 
      : 0
  };
}

// 업무 유형 관련 유틸리티 훅들

// 단일 업무 유형 관리 훅
export function useWorkType(id?: string) {
  const { workTypes, getWorkTypeById, updateWorkType, deleteWorkType } = useWorkTypes();
  
  const workType = id ? getWorkTypeById(id) : null;
  
  return {
    workType,
    loading: !workType && !!id,
    updateWorkType: (data: WorkTypeUpdate) => id ? updateWorkType(id, data) : Promise.resolve(false),
    deleteWorkType: () => id ? deleteWorkType(id) : Promise.resolve(false)
  };
}

// 업무 유형 선택 훅
export function useWorkTypeSelector() {
  const [selectedWorkTypeIds, setSelectedWorkTypeIds] = useState<string[]>([]);
  const { workTypes } = useWorkTypes();

  const selectedWorkTypes = workTypes.filter(wt => selectedWorkTypeIds.includes(wt.id));

  const toggleSelection = (id: string) => {
    setSelectedWorkTypeIds(prev => 
      prev.includes(id) 
        ? prev.filter(wid => wid !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedWorkTypeIds(workTypes.map(wt => wt.id));
  };

  const clearSelection = () => {
    setSelectedWorkTypeIds([]);
  };

  return {
    selectedWorkTypeIds,
    selectedWorkTypes,
    toggleSelection,
    selectAll,
    clearSelection,
    hasSelection: selectedWorkTypeIds.length > 0,
    selectionCount: selectedWorkTypeIds.length
  };
}