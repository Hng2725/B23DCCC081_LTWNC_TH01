import { createContext, useContext, type ReactNode } from 'react'
import { formatDate, formatDaysLeft, getDaysLeft, isOverdue } from '../../../utils/date'
import { PRIORITY_LABELS, type Assignment, type AssignmentId } from '../assignmentTypes'

// Compound Component: AssignmentCard chia sẻ dữ liệu bài tập cho các component con qua Context
const AssignmentContext = createContext<Assignment | null>(null)

function useAssignmentContext(): Assignment {
  const assignment = useContext(AssignmentContext)
  if (!assignment) {
    throw new Error('Các component AssignmentCard.* phải nằm trong <AssignmentCard>')
  }
  return assignment
}

interface RootProps {
  assignment: Assignment
  children: ReactNode
}

export function AssignmentCard({ assignment, children }: RootProps) {
  const className = [
    'card',
    assignment.completed && 'card--done',
    isOverdue(assignment) && 'card--overdue',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <AssignmentContext.Provider value={assignment}>
      <li className={className}>{children}</li>
    </AssignmentContext.Provider>
  )
}

function Subject() {
  const { subject } = useAssignmentContext()
  return <span className="card__subject">{subject}</span>
}

function Title() {
  const { title } = useAssignmentContext()
  return <span className="card__title">{title}</span>
}

function Deadline() {
  const assignment = useAssignmentContext()
  const { deadline } = assignment
  return (
    <span className="card__deadline">
      Hạn: {formatDate(deadline)} —{' '}
      <b className={isOverdue(assignment) ? 'text-danger' : ''}>{formatDaysLeft(getDaysLeft(deadline))}</b>
    </span>
  )
}

function Priority() {
  const { priority } = useAssignmentContext()
  return <span className={`badge badge--${priority}`}>Ưu tiên: {PRIORITY_LABELS[priority]}</span>
}

function Status() {
  const assignment = useAssignmentContext()
  if (assignment.completed) return <span className="badge badge--done">Đã hoàn thành</span>
  if (isOverdue(assignment)) return <span className="badge badge--overdue">Quá hạn</span>
  return <span className="badge">Chưa hoàn thành</span>
}

interface ActionsProps {
  onToggle: (id: AssignmentId) => void
  onDelete: (id: AssignmentId) => void
}

function Actions({ onToggle, onDelete }: ActionsProps) {
  const { id, title, completed } = useAssignmentContext()

  const handleDelete = () => {
    if (window.confirm(`Xoá bài tập "${title}"?`)) onDelete(id)
  }

  return (
    <div className="card__actions">
      <label>
        <input type="checkbox" checked={completed} onChange={() => onToggle(id)} /> Hoàn thành
      </label>
      <button type="button" className="btn-delete" onClick={handleDelete}>
        Xoá
      </button>
    </div>
  )
}

// Gắn các component con vào component cha: <AssignmentCard.Title />, ...
AssignmentCard.Subject = Subject
AssignmentCard.Title = Title
AssignmentCard.Deadline = Deadline
AssignmentCard.Priority = Priority
AssignmentCard.Status = Status
AssignmentCard.Actions = Actions
