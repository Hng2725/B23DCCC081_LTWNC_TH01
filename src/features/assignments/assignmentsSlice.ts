import { createAsyncThunk, createSelector, createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import type { AsyncStatus } from '../../types/common'
import { getDaysLeft, isOverdue } from '../../utils/date'
import { isAssignmentArray } from '../../utils/typeGuards'
import type { FilterStatus } from '../filter/filterSlice'
import { fetchAssignmentsAPI } from './assignmentsAPI'
import type { Assignment, AssignmentId, NewAssignment } from './assignmentTypes'

interface AssignmentsState {
  items: Assignment[]
  status: AsyncStatus
  error: string | null
}

const initialState: AssignmentsState = {
  items: [],
  status: 'idle',
  error: null,
}

export const fetchAssignments = createAsyncThunk<
  Assignment[],
  void,
  { state: RootState; rejectValue: string }
>(
  'assignments/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAssignmentsAPI()
      if (!isAssignmentArray(response.data)) {
        return rejectWithValue('Dữ liệu trả về không hợp lệ')
      }
      return response.data
    } catch {
      return rejectWithValue('Không thể tải danh sách bài tập')
    }
  },
  {
    // Chỉ gọi API một lần (tránh gọi lại khi StrictMode chạy effect 2 lần)
    condition: (_, { getState }) => getState().assignments.status === 'idle',
  },
)

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    addAssignment: {
      reducer(state, action: PayloadAction<Assignment>) {
        state.items.push(action.payload)
      },
      prepare(payload: NewAssignment) {
        return { payload: { ...payload, id: nanoid(), completed: false } }
      },
    },
    toggleAssignment(state, action: PayloadAction<AssignmentId>) {
      const item = state.items.find((a) => a.id === action.payload)
      if (item) item.completed = !item.completed
    },
    deleteAssignment(state, action: PayloadAction<AssignmentId>) {
      state.items = state.items.filter((a) => a.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Đã xảy ra lỗi'
      })
  },
})

export const { addAssignment, toggleAssignment, deleteAssignment } = assignmentsSlice.actions
export default assignmentsSlice.reducer

// ----- Selectors -----
export const selectAllAssignments = (state: RootState) => state.assignments.items
export const selectAssignmentsStatus = (state: RootState) => state.assignments.status
export const selectAssignmentsError = (state: RootState) => state.assignments.error
export const selectFilterStatus = (state: RootState) => state.filter.status

function matchesFilter(assignment: Assignment, filter: FilterStatus): boolean {
  switch (filter) {
    case 'all':
      return true
    case 'pending':
      return !assignment.completed && getDaysLeft(assignment.deadline) >= 0
    case 'overdue':
      return isOverdue(assignment)
    case 'completed':
      return assignment.completed
  }
}

export const selectFilteredAssignments = createSelector(
  [selectAllAssignments, selectFilterStatus],
  (items, filter) =>
    items
      .filter((a) => matchesFilter(a, filter))
      .sort((a, b) => a.deadline.localeCompare(b.deadline)),
)

export const selectFilterCounts = createSelector(
  [selectAllAssignments],
  (items): Record<FilterStatus, number> => ({
    all: items.length,
    pending: items.filter((a) => matchesFilter(a, 'pending')).length,
    overdue: items.filter((a) => matchesFilter(a, 'overdue')).length,
    completed: items.filter((a) => matchesFilter(a, 'completed')).length,
  }),
)
