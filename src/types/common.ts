// Kiểu dữ liệu chung, dùng generic để tái sử dụng cho nhiều loại dữ liệu

export interface ApiResponse<T> {
  data: T
  message: string
}

export type AsyncStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

// Mỗi field của form có thể có (hoặc không) một thông báo lỗi
export type FormErrors<T> = Partial<Record<keyof T, string>>
