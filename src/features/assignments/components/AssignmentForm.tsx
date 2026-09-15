import { useForm } from '../../../hooks/useForm'
import type { FormErrors } from '../../../types/common'
import { isPriority } from '../../../utils/typeGuards'
import { PRIORITY_LABELS, type NewAssignment, type Priority } from '../assignmentTypes'

interface AssignmentFormProps {
  onAdd: (data: NewAssignment) => void
  onCancel: () => void
}

const initialValues: NewAssignment = {
  subject: '',
  title: '',
  deadline: '',
  priority: 'medium',
}

function validate(values: NewAssignment): FormErrors<NewAssignment> {
  const errors: FormErrors<NewAssignment> = {}
  if (!values.subject.trim()) errors.subject = 'Vui lòng nhập môn học'
  if (!values.title.trim()) errors.title = 'Vui lòng nhập tên bài tập'
  if (!values.deadline) errors.deadline = 'Vui lòng chọn hạn nộp'
  if (!isPriority(values.priority)) errors.priority = 'Độ ưu tiên không hợp lệ'
  return errors
}

export function AssignmentForm({ onAdd, onCancel }: AssignmentFormProps) {
  const { values, errors, handleChange, handleSubmit } = useForm<NewAssignment>({
    initialValues,
    validate,
    onSubmit: (data) => onAdd({ ...data, subject: data.subject.trim(), title: data.title.trim() }),
  })

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="form__field">
        <label htmlFor="subject">Môn học</label>
        <input id="subject" name="subject" value={values.subject} onChange={handleChange} autoFocus />
        {errors.subject && <small className="text-danger">{errors.subject}</small>}
      </div>

      <div className="form__field">
        <label htmlFor="title">Tên bài tập</label>
        <input id="title" name="title" value={values.title} onChange={handleChange} />
        {errors.title && <small className="text-danger">{errors.title}</small>}
      </div>

      <div className="form__field">
        <label htmlFor="deadline">Hạn nộp</label>
        <input id="deadline" name="deadline" type="date" value={values.deadline} onChange={handleChange} />
        {errors.deadline && <small className="text-danger">{errors.deadline}</small>}
      </div>

      <div className="form__field">
        <label htmlFor="priority">Độ ưu tiên</label>
        <select id="priority" name="priority" value={values.priority} onChange={handleChange}>
          {(Object.keys(PRIORITY_LABELS) as Priority[]).map((p) => (
            <option key={p} value={p}>
              {PRIORITY_LABELS[p]}
            </option>
          ))}
        </select>
        {errors.priority && <small className="text-danger">{errors.priority}</small>}
      </div>

      <div className="form__actions">
        <button type="button" onClick={onCancel}>
          Huỷ
        </button>
        <button type="submit" className="btn-primary">
          Thêm
        </button>
      </div>
    </form>
  )
}
