import { useCallback, useState } from 'react'
import { Modal } from './components/Modal'
import { AssignmentForm } from './features/assignments/components/AssignmentForm'
import { AssignmentList } from './features/assignments/components/AssignmentList'
import type { NewAssignment } from './features/assignments/assignmentTypes'
import { useAssignments } from './features/assignments/useAssignments'
import { FilterBar } from './features/filter/components/FilterBar'

function App() {
  const { assignments, status, error, filter, counts, add, toggle, remove, changeFilter } = useAssignments()
  const [isFormOpen, setIsFormOpen] = useState(false)

  const closeForm = useCallback(() => setIsFormOpen(false), [])

  const handleAdd = (data: NewAssignment) => {
    add(data)
    closeForm()
  }

  return (
    <main className="container">
      <header className="header">
        <h1>Student Deadline Tracker</h1>
        <button type="button" className="btn-primary" onClick={() => setIsFormOpen(true)}>
          + Thêm bài tập
        </button>
      </header>

      <FilterBar current={filter} counts={counts} onChange={changeFilter} />
      <AssignmentList
        assignments={assignments}
        status={status}
        error={error}
        onToggle={toggle}
        onDelete={remove}
      />

      <Modal open={isFormOpen} title="Thêm bài tập" onClose={closeForm}>
        <AssignmentForm onAdd={handleAdd} onCancel={closeForm} />
      </Modal>
    </main>
  )
}

export default App
