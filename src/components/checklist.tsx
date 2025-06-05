import React from 'react'
import { ChecklistItem } from '../types/database'

interface ChecklistProps {
  items: ChecklistItem[]
  progress: number[]
  onUpdate: (progress: number[]) => void
}

export function Checklist({ items, progress, onUpdate }: ChecklistProps) {
  const toggleItem = (index: number) => {
    if (progress.includes(index)) {
      onUpdate(progress.filter(i => i !== index))
    } else {
      onUpdate([...progress, index])
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">체크리스트</h3>
      <ul className="space-y-1">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={progress.includes(idx)} 
              onChange={() => toggleItem(idx)} 
            />
            <span>{item.time} - {item.task}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
