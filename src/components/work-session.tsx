'use client'
import { useState, useEffect } from 'react'
import { Checklist } from './checklist'
import { EmergencyContacts } from './emergency-contacts'
import { Button } from './ui/button'
import { WorkType } from '../types/database'

export function WorkSessionManager({ workType }: { workType: WorkType }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [checklistProgress, setChecklistProgress] = useState<number[]>([])

  useEffect(() => {
    // 알림 설정 (생략)
  }, [workType])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {/* 업무 진행 단계 표시 */}
        {['준비', '진행중', '완료'].map((step, index) => (
          <div 
            key={step}
            className={`p-4 rounded-lg ${index <= currentStep ? 'bg-blue-100 border-blue-300' : 'bg-gray-100'}`}
          >
            {step}
          </div>
        ))}
      </div>

      {/* UI 컴포넌트 호출 시 이름 맞춤 */}
      <Checklist
        items={workType.checklist || []}
        progress={checklistProgress}
        onUpdate={setChecklistProgress}
      />

      <EmergencyContacts contacts={workType.emergency_contacts || []} />

      <div className="flex justify-end gap-4">
        <Button onClick={() => setCurrentStep(0)}>
          업무 중단
        </Button>
        <Button 
          onClick={() => setCurrentStep(prev => Math.min(prev + 1, 2))}
          disabled={currentStep === 2}
        >
          {currentStep === 2 ? '업무 완료' : '다음 단계'}
        </Button>
      </div>
    </div>
  )
}
