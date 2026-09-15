import { useState, type ChangeEvent, type FormEvent } from 'react'
import type { FormErrors } from '../types/common'

interface UseFormOptions<T> {
  initialValues: T
  validate: (values: T) => FormErrors<T>
  onSubmit: (values: T) => void
}

// Custom hook generic: dùng được cho mọi form có các field kiểu string
export function useForm<T extends Record<string, string>>({
  initialValues,
  validate,
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<FormErrors<T>>({})

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = e.target.name as keyof T
    setValues((prev) => ({ ...prev, [name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const reset = () => {
    setValues(initialValues)
    setErrors({})
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validationErrors = validate(values)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    onSubmit(values)
    reset()
  }

  return { values, errors, handleChange, handleSubmit, reset }
}
