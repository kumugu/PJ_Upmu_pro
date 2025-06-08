'use client';

import React, { useState } from 'react';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { ColorPicker } from '@/src/components/work-settings/ColorPicker';
import { IconPicker } from '@/src/components/work-settings/IconPicker';
import { ChecklistEditor } from '@/src/components/work-settings/ChecklistEditor';
import { useWorkCategories } from '@/src/lib/hooks/useWorkCategoires';
import { useWorkTypes } from '@/lib/hooks/useWorkTypes';
import { useChecklistTemplates } from '@/lib/hooks/useChecklistTemplates';
import { CategoryFormData, WorkTypeFormData } from '@/lib/types/work-types';
import { ChecklistItemData } from '@/lib/types/database-types';
import { 
  FiPlus, 
  FiEdit3, 
  FiTrash2, 
  FiSettings,
  FiFolder,
  FiBriefcase,
  FiList,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';
import { IconWithColor } from '@/components/work-settings/IconPicker';

export default function WorkSettingsPage() {
  const [activeTab, setActiveTab] = useState<'categories' | 'workTypes' | 'templates'>('categories');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showWorkTypeForm, setShowWorkTypeForm] = useState(false);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingWorkType, setEditingWorkType] = useState<string | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  // 훅들
  const { categories, loading: categoriesLoading, createCategory, updateCategory, deleteCategory } = useWorkCategories();
  const { workTypes, loading: workTypesLoading, createWorkType, updateWorkType, deleteWorkType } = useWorkTypes();
  const { templates, loading: templatesLoading, createTemplate, updateTemplate, deleteTemplate } = useChecklistTemplates();

  // 탭 정의
  const tabs = [
    { id: 'categories', label: '업무 카테고리', icon: FiFolder, count: categories.length },
    { id: 'workTypes', label: '업무 유형', icon: FiBriefcase, count: workTypes.length },
    { id: 'templates', label: '체크리스트 템플릿', icon: FiList, count: templates.length }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              <FiSettings className="text-blue-600" />
              업무 설정
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              업무 카테고리, 유형, 체크리스트 템플릿을 관리하세요
            </p>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <Card className="p-1">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all
                  ${activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
                <span className={`
                  px-2 py-0.5 rounded-full text-xs
                  ${activeTab === tab.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                  }
                `}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* 탭 컨텐츠 */}
        {activeTab === 'categories' && (
          <CategoriesTab
            categories={categories}
            loading={categoriesLoading}
            showForm={showCategoryForm}
            editingId={editingCategory}
            onShowForm={setShowCategoryForm}
            onEdit={setEditingCategory}
            onCreate={createCategory}
            onUpdate={updateCategory}
            onDelete={deleteCategory}
          />
        )}

        {activeTab === 'workTypes' && (
          <WorkTypesTab
            workTypes={workTypes}
            categories={categories}
            loading={workTypesLoading}
            showForm={showWorkTypeForm}
            editingId={editingWorkType}
            selectedCategoryId={selectedCategoryId}
            onShowForm={setShowWorkTypeForm}
            onEdit={setEditingWorkType}
            onCategoryFilter={setSelectedCategoryId}
            onCreate={createWorkType}
            onUpdate={updateWorkType}
            onDelete={deleteWorkType}
          />
        )}

        {activeTab === 'templates' && (
          <TemplatesTab
            templates={templates}
            workTypes={workTypes}
            loading={templatesLoading}
            showForm={showTemplateForm}
            editingId={editingTemplate}
            onShowForm={setShowTemplateForm}
            onEdit={setEditingTemplate}
            onCreate={createTemplate}
            onUpdate={updateTemplate}
            onDelete={deleteTemplate}
          />
        )}
      </div>
    </div>
  );
}

// 카테고리 탭 컴포넌트
interface CategoriesTabProps {
  categories: any[];
  loading: boolean;
  showForm: boolean;
  editingId: string | null;
  onShowForm: (show: boolean) => void;
  onEdit: (id: string | null) => void;
  onCreate: (data: CategoryFormData) => Promise<any>;
  onUpdate: (id: string, data: Partial<CategoryFormData>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

function CategoriesTab({ 
  categories, 
  loading, 
  showForm, 
  editingId, 
  onShowForm, 
  onEdit, 
  onCreate, 
  onUpdate, 
  onDelete 
}: CategoriesTabProps) {
  return (
    <div className="space-y-6">
      {/* 액션 버튼 */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          업무 카테고리 관리
        </h2>
        <Button onClick={() => onShowForm(true)}>
          <FiPlus size={16} />
          새 카테고리 추가
        </Button>
      </div>

      {/* 카테고리 폼 */}
      {showForm && (
        <CategoryForm
          onSubmit={async (data) => {
            await onCreate(data);
            onShowForm(false);
          }}
          onCancel={() => onShowForm(false)}
        />
      )}

      {/* 카테고리 목록 */}
      <Card className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400 mt-2">로딩 중...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FiFolder size={32} className="mx-auto mb-2 opacity-50" />
            <p>아직 생성된 카테고리가 없습니다.</p>
            <p className="text-sm">새 카테고리를 추가해보세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                isEditing={editingId === category.id}
                onEdit={() => onEdit(editingId === category.id ? null : category.id)}
                onUpdate={(data) => onUpdate(category.id, data)}
                onDelete={() => onDelete(category.id)}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// 카테고리 폼 컴포넌트
interface CategoryFormProps {
  initialData?: CategoryFormData;
  onSubmit: (data: CategoryFormData) => void;
  onCancel: () => void;
}

function CategoryForm({ initialData, onSubmit, onCancel }: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: initialData?.name || '',
    color: initialData?.color || '#3B82F6',
    icon: initialData?.icon || 'FiBriefcase'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSubmit(formData);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {initialData ? '카테고리 수정' : '새 카테고리 추가'}
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                카테고리 이름
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="예: 개발 업무, 디자인 작업 등"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                required
              />
            </div>

            {/* 미리보기 */}
            <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">미리보기</div>
              <div className="flex items-center gap-3">
                <IconWithColor icon={formData.icon} color={formData.color} size={20} />
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {formData.name || '카테고리 이름'}
                </span>
              </div>
            </div>
          </div>

          {/* 색상 선택 */}
          <div>
            <ColorPicker
              color={formData.color}
              onChange={(color) => setFormData({ ...formData, color })}
            />
          </div>

          {/* 아이콘 선택 */}
          <div>
            <IconPicker
              selectedIcon={formData.icon}
              onIconSelect={(icon) => setFormData({ ...formData, icon })}
            />
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onCancel}>
            취소
          </Button>
          <Button type="submit" disabled={!formData.name.trim()}>
            {initialData ? '수정' : '생성'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

// 카테고리 카드 컴포넌트
interface CategoryCardProps {
  category: any;
  isEditing: boolean;
  onEdit: () => void;
  onUpdate: (data: Partial<CategoryFormData>) => void;
  onDelete: () => void;
}

function CategoryCard({ category, isEditing, onEdit, onUpdate, onDelete }: CategoryCardProps) {
  if (isEditing) {
    return (
      <CategoryForm
        initialData={category}
        onSubmit={onUpdate}
        onCancel={onEdit}
      />
    );
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 flex-1">
          <IconWithColor icon={category.icon} color={category.color} size={24} />
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              {category.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              업무 유형 {category.workTypeCount || 0}개
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" onClick={onEdit}>
            <FiEdit3 size={14} />
          </Button>
          <Button size="sm" variant="ghost" onClick={onDelete}>
            <FiTrash2 size={14} />
          </Button>
        </div>
      </div>
    </Card>
  );
}
