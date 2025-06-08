'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { ChecklistItem, ChecklistItemFormData } from '../../types/work-settings'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Card } from '../ui/Card'
import { 
  FiMoreVertical, 
  FiPlus, 
  FiTrash2, 
  FiEdit3, 
  FiClock, 
  FiStar,
  FiCheck
} from 'react-icons/fi'

interface ChecklistBuilderProps {
  items: ChecklistItemFormData[]
  onChange: (items: ChecklistItemFormData[]) => void
  className?: string
}

export function ChecklistBuilder({ items, onChange, className }: ChecklistBuilderProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [newItem, setNewItem] = useState<ChecklistItemFormData>({
    title: '',
    description: '',
    is_required: false,
    estimated_minutes: 5,
    icon: ''
  })

  // 새 항목 추가
  const handleAddItem = () => {
    if (!newItem.title.trim()) return

    const itemWithId = {
      ...newItem,
      id: crypto.randomUUID()
    }
    
    onChange([...items, itemWithId])
    setNewItem({
      title: '',
      description: '',
      is_required: false,
      estimated_minutes: 5,
      icon: ''
    })
  }

  // 항목 수정
  const handleUpdateItem = (index: number, updatedItem: ChecklistItemFormData) => {
    const newItems = [...items]
    newItems[index] = updatedItem
    onChange(newItems)
    setEditingIndex(null)
  }

  // 항목 삭제
  const handleDeleteItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    onChange(newItems)
  }

  // 드래그 앤 드롭 처리
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const newItems = Array.from(items)
    const [reorderedItem] = newItems.splice(result.source.index, 1)
    newItems.splice(result.destination.index, 0, reorderedItem)

    onChange(newItems)
  }

  // 총 예상 시간 계산
  const totalEstimatedTime = items.reduce((total, item) => total + item.estimated_minutes, 0)

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 헤더 정보 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">체크리스트 항목</h3>
          <p className="text-sm text-gray-500">
            총 {items.length}개 항목 • 예상 소요시간: {Math.floor(totalEstimatedTime / 60)}시간 {totalEstimatedTime % 60}분
          </p>
        </div>
      </div>

      {/* 새 항목 추가 폼 */}
      <Card className="p-4 bg-gray-50">
        <h4 className="font-medium text-gray-900 mb-3">새 항목 추가</h4>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              placeholder="항목 제목"
              value={newItem.title}
              onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
            />
            <Input
              placeholder="설명 (선택사항)"
              value={newItem.description}
              onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
            />
            <div className="flex items-center space-x-2">
              <FiClock className="text-gray-400" />
              <Input
                type="number"
                placeholder="시간(분)"
                min="1"
                max="480"
                value={newItem.estimated_minutes}
                onChange={(e) => setNewItem(prev => ({ 
                  ...prev, 
                  estimated_minutes: parseInt(e.target.value) || 5 
                }))}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newItem.is_required}
                onChange={(e) => setNewItem(prev => ({ ...prev, is_required: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">필수 항목</span>
              <FiStar className="text-yellow-500 w-4 h-4" />
            </label>
            <Button onClick={handleAddItem} disabled={!newItem.title.trim()}>
              <FiPlus className="w-4 h-4 mr-2" />
              추가
            </Button>
          </div>
        </div>
      </Card>

      {/* 체크리스트 항목들 */}
      {items.length === 0 ? (
        <Card className="p-8 text-center text-gray-500">
          <FiCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>아직 체크리스트 항목이 없습니다.</p>
          <p className="text-sm">위의 폼을 사용하여 첫 번째 항목을 추가해보세요.</p>
        </Card>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="checklist-items">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                {items.map((item, index) => (
                  <Draggable key={index} draggableId={index.toString()} index={index}>
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`p-4 transition-shadow ${
                          snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {/* 드래그 핸들 */}
                          <div
                            {...provided.dragHandleProps}
                            className="mt-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                          >
                            <FiMoreVertical className="w-5 h-5" />
                          </div>

                          <div className="flex-1 min-w-0">
                            {editingIndex === index ? (
                              /* 편집 모드 */
                              <EditItemForm
                                item={item}
                                onSave={(updatedItem) => handleUpdateItem(index, updatedItem)}
                                onCancel={() => setEditingIndex(null)}
                              />
                            ) : (
                              /* 표시 모드 */
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <h5 className="font-medium text-gray-900">{item.title}</h5>
                                    {item.is_required && (
                                      <FiStar className="w-4 h-4 text-yellow-500" />
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                      {item.estimated_minutes}분
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setEditingIndex(index)}
                                    >
                                      <FiEdit3 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteItem(index)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <FiTrash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                                {item.description && (
                                  <p className="text-sm text-gray-600">{item.description}</p>
                                )}
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>#{index + 1}</span>
                                  <span>{item.is_required ? '필수' : '선택'} 항목</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  )
}

// 항목 편집 폼 컴포넌트
interface EditItemFormProps {
  item: ChecklistItemFormData
  onSave: (item: ChecklistItemFormData) => void
  onCancel: () => void
}

function EditItemForm({ item, onSave, onCancel }: EditItemFormProps) {
  const [formData, setFormData] = useState<ChecklistItemFormData>(item)

  const handleSave = () => {
    if (!formData.title.trim()) return
    onSave(formData)
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          placeholder="항목 제목"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        />
        <Input
          placeholder="설명 (선택사항)"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FiClock className="text-gray-400" />
            <Input
              type="number"
              placeholder="시간(분)"
              min="1"
              max="480"
              value={formData.estimated_minutes}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                estimated_minutes: parseInt(e.target.value) || 5 
              }))}
              className="w-20"
            />
          </div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_required}
              onChange={(e) => setFormData(prev => ({ ...prev, is_required: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">필수</span>
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            취소
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!formData.title.trim()}>
            저장
          </Button>
        </div>
      </div>
    </div>
  )
}