import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store'

// Dùng 2 hook này thay cho useDispatch/useSelector để có sẵn kiểu dữ liệu
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
