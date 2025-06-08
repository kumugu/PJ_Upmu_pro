'use client';

import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { ChecklistItem, ChecklistItemData } from '../../lib/types/work-types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  FiMove, 
  FiPlus, 
  FiTrash2, 
  FiEdit3, 
  FiClock, 
  FiStar,
  FiCheck,
  FiX,
  FiSave
} from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';

interface ChecklistEditorProps {
  items: ChecklistItemData[];
  onChange: (items: ChecklistItemData[]) => void;
  workTypeName?: string;
  readOnly?: boolean;
}

export function ChecklistEditor({ items, onChange, workTypeName, readOnly = false }: ChecklistEditorProps) {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Partial<ChecklistItemData>>({
    time: '09:00',
    task: '',
    mandatory: true,
    category: '',
    estimatedDuration: 30
  });

  // 드래그 앤 드롭 핸들러
  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination || readOnly) return;

    const reorderedItems = Array.from(items);
    const [reorderedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, reorderedItem);

    // 순서 재설정
    const itemsWithNewOrder = reorderedItems.map((item, index) => ({
      ...item,
      order: index
    }));

    onChange(itemsWithNewOrder);
  }, [items, onChange, readOnly]);

  // 새 항목 추가
  const handleAddItem = useCallback(() => {
    if (!newItem.task?.trim()) return;

    const item: ChecklistItemData = {
      id: uuidv4(),
      time: newItem.time || '09:00',
      task: newItem.task,
      mandatory: newItem.mandatory || false,
      category: newItem.category || '',
      estimatedDuration: newItem.estimatedDuration || 30,
      order: items.length
    };

    onChange([...items, item]);
    setNewItem({
      time: newItem.time,
      task: '',
      mandatory: true,
      category: newItem.category,
      estimatedDuration: 30
    });
  }, [newItem, items, onChange]);

  // 항목 수정
  const handleUpdateItem = useCallback((itemId: string, updates: Partial<ChecklistItemData>) => {
    const updatedItems = items.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    );
    onChange(updatedItems);
  }, [items, onChange]);

  // 항목 삭제
  const handleDeleteItem = useCallback((itemId: string) => {
    const filteredItems = items
      .filter(item => item.id !== itemId)
      .map((item, index) => ({ ...item, order: index }));
    onChange(filteredItems);
  }, [items, onChange]);

  // 통계 계산
  const stats = {
    totalItems: items.length,
    mandatoryItems: items.filter(item => item.mandatory).length,
    optionalItems: items.filter(item => !item.mandatory).length,
    totalEstimatedTime: items.reduce((sum, item) => sum + (item.estimatedDuration || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            체크리스트 편집기
          </h3>
          {workTypeName && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {workTypeName} 업무용
            </p>
          )}
        </div>
        
        {/* 통계 */}
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>총 {stats.totalItems}개</span>
          <span>필수 {stats.mandatoryItems}개</span>
          <span>선택 {stats.optionalItems}개</span>
          <span>예상 {Math.floor(stats.totalEstimatedTime / 60)}시간 {stats.totalEstimatedTime % 60}분</span>
        </div>
      </div>

      {/* 새 항목 추가 폼 */}
      {!readOnly && (
        <Card className="p-4">
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              새 작업 추가
            </h4>
            
            <div className="grid grid-cols-12 gap-3">
              {/* 시간 */}
              <div className="col-span-2">
                <input
                  type="time"
                  value={newItem.time}
                  onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* 작업 내용 */}
              <div className="col-span-4">
                <input
                  type="text"
                  placeholder="작업 내용을 입력하세요"
                  value={newItem.task}
                  onChange={(e) => setNewItem({ ...newItem, task: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
                />
              </div>

              {/* 카테고리 */}
              <div className="col-span-2">
                <input
                  type="text"
                  placeholder="카테고리"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* 예상 시간 */}
              <div className="col-span-2">
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="480"
                    value={newItem.estimatedDuration}
                    onChange={(e) => setNewItem({ ...newItem, estimatedDuration: parseInt(e.target.value) || 30 })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                  <span className="text-xs text-gray-500">분</span>
                </div>
              </div>

              {/* 필수/선택 & 추가 버튼 */}
              <div className="col-span-2 flex items-center gap-2">
                <label className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={newItem.mandatory}
                    onChange={(e) => setNewItem({ ...newItem, mandatory: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-gray-600 dark:text-gray-400">필수</span>
                </label>
                <Button
                  onClick={handleAddItem}
                  size="sm"
                  disabled={!newItem.task?.trim()}
                  className="ml-auto"
                >
                  <FiPlus size={14} />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* 체크리스트 항목들 */}
      <Card className="p-4">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FiEdit3 size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">아직 체크리스트 항목이 없습니다.</p>
            <p className="text-xs">위에서 새 작업을 추가해보세요.</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="checklist-items">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`space-y-2 ${snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2' : ''}`}
                >
                  {items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                      isDragDisabled={readOnly}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`
                            p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800
                            ${snapshot.isDragging ? 'shadow-lg rotate-2' : ''}
                            ${item.mandatory ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-gray-300'}
                          `}
                        >
                          <ChecklistItemRow
                            item={item}
                            isEditing={editingItem === item.id}
                            onEdit={() => setEditingItem(editingItem === item.id ? null : item.id)}
                            onUpdate={(updates) => handleUpdateItem(item.id, updates)}
                            onDelete={() => handleDeleteItem(item.id)}
                            dragHandleProps={provided.dragHandleProps}
                            readOnly={readOnly}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </Card>
    </div>
  );
}

// 개별 체크리스트 항목 컴포넌트
interface ChecklistItemRowProps {
  item: ChecklistItemData;
  isEditing: boolean;
  onEdit: () => void;
  onUpdate: (updates: Partial<ChecklistItemData>) => void;
  onDelete: () => void;
  dragHandleProps?: any;
  readOnly?: boolean;
}

function ChecklistItemRow({ 
  item, 
  isEditing, 
  onEdit, 
  onUpdate, 
  onDelete, 
  dragHandleProps, 
  readOnly = false 
}: ChecklistItemRowProps) {
  const [editData, setEditData] = useState(item);

  const handleSave = () => {
    onUpdate(editData);
    onEdit();
  };

  const handleCancel = () => {
    setEditData(item);
    onEdit();
  };

  if (isEditing && !readOnly) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-12 gap-3">
          {/* 시간 */}
          <div className="col-span-2">
            <input
              type="time"
              value={editData.time}
              onChange={(e) => setEditData({ ...editData, time: e.target.value })}
              className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
            />
          </div>

          {/* 작업 내용 */}
          <div className="col-span-4">
            <input
              type="text"
              value={editData.task}
              onChange={(e) => setEditData({ ...editData, task: e.target.value })}
              className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
            />
          </div>

          {/* 카테고리 */}
          <div className="col-span-2">
            <input
              type="text"
              value={editData.category || ''}
              onChange={(e) => setEditData({ ...editData, category: e.target.value })}
              className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
            />
          </div>

          {/* 예상 시간 */}
          <div className="col-span-2">
            <input
              type="number"
              value={editData.estimatedDuration}
              onChange={(e) => setEditData({ ...editData, estimatedDuration: parseInt(e.target.value) || 30 })}
              className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
            />
          </div>

          {/* 버튼 */}
          <div className="col-span-2 flex items-center gap-1">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={editData.mandatory}
                onChange={(e) => setEditData({ ...editData, mandatory: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="text-xs">필수</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={handleCancel}>
            <FiX size={14} />
          </Button>
          <Button size="sm" onClick={handleSave}>
            <FiSave size={14} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* 드래그 핸들 */}
      {!readOnly && (
        <div
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        >
          <FiMove size={16} />
        </div>
      )}

      {/* 시간 */}
      <div className="flex items-center gap-2 text-sm">
        <FiClock size={14} className="text-gray-400" />
        <span className="font-mono text-gray-600 dark:text-gray-400 min-w-[50px]">
          {item.time}
        </span>
      </div>

      {/* 필수/선택 표시 */}
      <div className="flex items-center">
        {item.mandatory ? (
          <FiStar size={14} className="text-red-500" title="필수 항목" />
        ) : (
          <FiCheck size={14} className="text-gray-400" title="선택 항목" />
        )}
      </div>

      {/* 작업 내용 */}
      <div className="flex-1">
        <div className="text-sm text-gray-900 dark:text-gray-100">
          {item.task}
        </div>
        {item.category && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {item.category}
          </div>
        )}
      </div>

      {/* 예상 시간 */}
      <div className="text-xs text-gray-500 dark:text-gray-400 min-w-[60px]">
        {item.estimatedDuration}분
      </div>

      {/* 액션 버튼 */}
      {!readOnly && (
        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" onClick={onEdit}>
            <FiEdit3 size={14} />
          </Button>
          <Button size="sm" variant="ghost" onClick={onDelete}>
            <FiTrash2 size={14} />
          </Button>
        </div>
      )}
    </div>
  );
}