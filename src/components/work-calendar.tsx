'use client'
import { Calendar } from "./ui/calendar"
import { WorkType } from "../types/database"

interface WorkSession {
  start_time: string
  work_type_id: string
}

interface WorkCalendarProps {
  workSessions: WorkSession[]
  workTypes: WorkType[]
}

export function WorkCalendar({ workSessions, workTypes }: WorkCalendarProps) {
  const selectedDates = workSessions.map((s) => new Date(s.start_time))

  const modifiersStyles = Object.fromEntries(
    workSessions.map((session) => {
      const date = new Date(session.start_time).toDateString()
      const color = workTypes.find((t) => t.id === session.work_type_id)?.color || '#ccc'
      return [new Date(date), { backgroundColor: color + '33', border: `1px solid ${color}` }]
    })
  )

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <Calendar
        mode="multiple"
        selected={selectedDates}
        modifiersStyles={modifiersStyles}
        className="w-full"
      />
    </div>
  )
}
