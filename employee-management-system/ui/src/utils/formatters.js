import { format, parseISO, isValid } from 'date-fns'

/**
 * Format a date string or Date object to a readable format
 */
export const formatDate = (date, formatStr = 'dd MMM yyyy') => {
  if (!date) return '—'
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    return isValid(d) ? format(d, formatStr) : '—'
  } catch {
    return '—'
  }
}

/**
 * Format datetime
 */
export const formatDateTime = (date) => formatDate(date, 'dd MMM yyyy, HH:mm')

/**
 * Format time only
 */
export const formatTime = (date) => formatDate(date, 'HH:mm')

/**
 * Format currency (INR)
 */
export const formatCurrency = (amount, currency = 'INR') => {
  if (amount === null || amount === undefined) return '—'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format a number with commas
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '—'
  return new Intl.NumberFormat('en-IN').format(num)
}

/**
 * Format percentage
 */
export const formatPercent = (value, decimals = 1) => {
  if (value === null || value === undefined) return '—'
  return `${Number(value).toFixed(decimals)}%`
}

/**
 * Get initials from a name
 */
export const getInitials = (name) => {
  if (!name) return '??'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('')
}

/**
 * Capitalize first letter of each word
 */
export const titleCase = (str) => {
  if (!str) return ''
  return str
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Format month and year
 */
export const formatMonthYear = (date) => formatDate(date, 'MMMM yyyy')

/**
 * Get current year
 */
export const currentYear = () => new Date().getFullYear()

/**
 * Get current month (1-indexed)
 */
export const currentMonth = () => new Date().getMonth() + 1
