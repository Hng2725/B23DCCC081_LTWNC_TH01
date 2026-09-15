import { configureStore } from '@reduxjs/toolkit'
import assignmentsReducer from '../features/assignments/assignmentsSlice'
import filterReducer from '../features/filter/filterSlice'

export const store = configureStore({
  reducer: {
    assignments: assignmentsReducer,
    filter: filterReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
