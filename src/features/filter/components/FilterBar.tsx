import { isFilterStatus } from '../../../utils/typeGuards'
import { FILTER_LABELS, type FilterStatus } from '../filterSlice'

interface FilterBarProps {
  current: FilterStatus
  counts: Record<FilterStatus, number>
  onChange: (value: FilterStatus) => void
}

const FILTER_OPTIONS = Object.keys(FILTER_LABELS).filter(isFilterStatus)

export function FilterBar({ current, counts, onChange }: FilterBarProps) {
  return (
    <div className="filter">
      {FILTER_OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          className={option === current ? 'active' : ''}
          onClick={() => onChange(option)}
        >
          {FILTER_LABELS[option]} ({counts[option]})
        </button>
      ))}
    </div>
  )
}
