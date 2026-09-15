import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type FilterStatus = 'all' | 'pending' | 'overdue' | 'completed'

export const FILTER_LABELS: Record<FilterStatus, string> = {
  all: 'Tất cả',
  pending: 'Chưa hoàn thành',
  overdue: 'Quá hạn',
  completed: 'Đã hoàn thành',
}

interface FilterState {
  status: FilterStatus
}

const initialState: FilterState = {
  status: 'all',
}

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<FilterStatus>) {
      state.status = action.payload
    },
  },
})

export const { setFilter } = filterSlice.actions
export default filterSlice.reducer
