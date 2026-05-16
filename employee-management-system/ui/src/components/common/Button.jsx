import { FaSpinner } from 'react-icons/fa'

const variants = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 border-transparent',
  secondary: 'bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500 border-gray-300',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border-transparent',
  success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 border-transparent',
  warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500 border-transparent',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-400 border-transparent',
  link: 'bg-transparent text-indigo-600 hover:text-indigo-800 focus:ring-indigo-500 border-transparent underline-offset-2 hover:underline p-0',
}

const sizes = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

  const variantClass = variants[variant] || variants.primary
  const sizeClass = variant === 'link' ? '' : sizes[size] || sizes.md

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <FaSpinner className="animate-spin mr-2 h-4 w-4" />
          {children}
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon className={`h-4 w-4 ${children ? 'mr-2' : ''}`} />
          )}
          {children}
          {Icon && iconPosition === 'right' && (
            <Icon className={`h-4 w-4 ${children ? 'ml-2' : ''}`} />
          )}
        </>
      )}
    </button>
  )
}

export default Button
