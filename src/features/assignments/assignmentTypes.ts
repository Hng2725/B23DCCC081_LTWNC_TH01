export type Priority = 'low' | 'medium' | 'high'

export interface Assignment {
  id: string
  subject: string
  title: string
  deadline: string // định dạng YYYY-MM-DD
  priority: Priority
  completed: boolean
}

// Dữ liệu người dùng nhập khi thêm bài: không có id và completed
export type NewAssignment = Omit<Assignment, 'id' | 'completed'>

export type AssignmentId = Assignment['id']

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'Cao',
}
