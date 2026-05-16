import { titleCase } from '../../utils/formatters'

const variantMap = {
  // Status badges
  ACTIVE: 'bg-green-100 text-green-700',
  INACTIVE: 'bg-gray-100 text-gray-600',
  ON_LEAVE: 'bg-yellow-100 text-yellow-700',
  TERMINATED: 'bg-red-100 text-red-700',

  // Leave status
  PENDING: 'bg-yellow-100 text-yellow-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-600',

  // Attendance status
  PRESENT: 'bg-green-100 text-green-700',
  ABSENT: 'bg-red-100 text-red-700',
  LATE: 'bg-orange-100 text-orange-700',
  HALF_DAY: 'bg-blue-100 text-blue-700',
  HOLIDAY: 'bg-purple-100 text-purple-700',
  WEEKEND: 'bg-gray-100 text-gray-500',

  // Generic
  success: 'bg-green-100 text-green-700',
  error: 'bg-red-100 text-red-700',
  warning: 'bg-yellow-100 text-yellow-700',
  info: 'bg-blue-100 text-blue-700',
  default: 'bg-gray-100 text-gray-600',
  primary: 'bg-indigo-100 text-indigo-700',
}

const Badge = ({ label, variant, className = '' }) => {
  const colorClass = variantMap[variant] || variantMap[label] || variantMap.default

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} ${className}`}
    >
      {label ? titleCase(String(label)) : titleCase(String(variant || ''))}
    </span>
  )
}

export default Badge
