import type { ApiResponse } from '../../types/common'
import { addDays } from '../../utils/date'
import type { Assignment } from './assignmentTypes'

// Giả lập độ trễ mạng: trả về dữ liệu bất kỳ sau `ms` mili giây
function fakeRequest<T>(data: T, ms = 800): Promise<ApiResponse<T>> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ data, message: 'OK' }), ms)
  })
}

// Hạn nộp tính theo ngày hiện tại để luôn có đủ các trường hợp
export function fetchAssignmentsAPI(): Promise<ApiResponse<Assignment[]>> {
  const sample: Assignment[] = [
    { id: '1', subject: 'Lập trình Web', title: 'Bài tập Redux Toolkit', deadline: addDays(3), priority: 'high', completed: false },
    { id: '2', subject: 'Cơ sở dữ liệu', title: 'Thiết kế ERD quản lý thư viện', deadline: addDays(0), priority: 'medium', completed: false },
    { id: '3', subject: 'Toán rời rạc', title: 'Bài tập chương 3', deadline: addDays(-2), priority: 'low', completed: false },
    { id: '4', subject: 'Mạng máy tính', title: 'Báo cáo cấu hình VLAN', deadline: addDays(7), priority: 'medium', completed: false },
    { id: '5', subject: 'Tiếng Anh', title: 'Viết essay 300 từ', deadline: addDays(-5), priority: 'low', completed: true },
    { id: '6', subject: 'Lập trình Web', title: 'Custom hook và HOC', deadline: addDays(-1), priority: 'high', completed: false },
  ]
  return fakeRequest(sample)
}
