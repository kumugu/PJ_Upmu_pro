'use client'

import { DayPicker, DayPickerProps } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

type CalendarProps = DayPickerProps & {
  className?: string
}

export function Calendar({ className, ...props }: CalendarProps) {
  return (
    <div className={className}>
      <DayPicker {...props} />
    </div>
  )
}
