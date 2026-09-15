import type { Assignment } from '../features/assignments/assignmentTypes'

const MS_PER_DAY = 86_400_000

// "YYYY-MM-DD" -> Date lúc 00:00 giờ địa phương
function parseDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

// Date -> "YYYY-MM-DD"
export function toDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Ngày hôm nay cộng thêm n ngày (n âm = lùi lại)
export function addDays(n: number): string {
  const date = startOfDay(new Date())
  date.setDate(date.getDate() + n)
  return toDateString(date)
}

// "YYYY-MM-DD" -> "DD/MM/YYYY"
export function formatDate(value: string): string {
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

// Số ngày còn lại tới hạn nộp (âm nếu đã quá hạn)
export function getDaysLeft(deadline: string, today: Date = new Date()): number {
  const diff = parseDate(deadline).getTime() - startOfDay(today).getTime()
  return Math.round(diff / MS_PER_DAY)
}

export function formatDaysLeft(days: number): string {
  if (days > 0) return `Còn ${days} ngày`
  if (days === 0) return 'Hôm nay là hạn chót'
  return `Quá hạn ${-days} ngày`
}

export function isOverdue(assignment: Assignment): boolean {
  return !assignment.completed && getDaysLeft(assignment.deadline) < 0
}
