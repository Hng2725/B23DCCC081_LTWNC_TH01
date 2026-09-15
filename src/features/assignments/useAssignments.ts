import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setFilter, type FilterStatus } from '../filter/filterSlice'
import {
  addAssignment,
  deleteAssignment,
  fetchAssignments,
  selectAssignmentsError,
  selectAssignmentsStatus,
  selectFilterCounts,
  selectFilteredAssignments,
  selectFilterStatus,
  toggleAssignment,
} from './assignmentsSlice'
import type { AssignmentId, NewAssignment } from './assignmentTypes'

// Gói toàn bộ logic của feature assignments: component chỉ việc gọi hook này
export function useAssignments() {
  const dispatch = useAppDispatch()
  const assignments = useAppSelector(selectFilteredAssignments)
  const status = useAppSelector(selectAssignmentsStatus)
  const error = useAppSelector(selectAssignmentsError)
  const filter = useAppSelector(selectFilterStatus)
  const counts = useAppSelector(selectFilterCounts)

  // Lấy dữ liệu mẫu khi app khởi động
  useEffect(() => {
    dispatch(fetchAssignments())
  }, [dispatch])

  const add = useCallback((data: NewAssignment) => dispatch(addAssignment(data)), [dispatch])
  const toggle = useCallback((id: AssignmentId) => dispatch(toggleAssignment(id)), [dispatch])
  const remove = useCallback((id: AssignmentId) => dispatch(deleteAssignment(id)), [dispatch])
  const changeFilter = useCallback((value: FilterStatus) => dispatch(setFilter(value)), [dispatch])

  return { assignments, status, error, filter, counts, add, toggle, remove, changeFilter }
}
