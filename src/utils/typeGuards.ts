import type { Assignment, Priority } from '../features/assignments/assignmentTypes'
import { FILTER_LABELS, type FilterStatus } from '../features/filter/filterSlice'

const PRIORITIES: Priority[] = ['low', 'medium', 'high']

export function isPriority(value: unknown): value is Priority {
  return typeof value === 'string' && PRIORITIES.includes(value as Priority)
}

export function isAssignment(value: unknown): value is Assignment {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.id === 'string' &&
    typeof v.subject === 'string' &&
    typeof v.title === 'string' &&
    typeof v.deadline === 'string' &&
    isPriority(v.priority) &&
    typeof v.completed === 'boolean'
  )
}

export function isAssignmentArray(value: unknown): value is Assignment[] {
  return Array.isArray(value) && value.every(isAssignment)
}

export function isFilterStatus(value: string): value is FilterStatus {
  return value in FILTER_LABELS
}
