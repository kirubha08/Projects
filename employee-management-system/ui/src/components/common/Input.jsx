import { forwardRef } from 'react'

const Input = forwardRef(
  (
    {
      label,
      error,
      hint,
      required,
      type = 'text',
      className = '',
      containerClassName = '',
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {LeftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LeftIcon className="h-4 w-4 text-gray-400" />
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={`
              block w-full rounded-lg border text-sm shadow-sm
              placeholder-gray-400
              focus:outline-none focus:ring-1
              transition-colors
              ${LeftIcon ? 'pl-9' : 'pl-3'}
              ${RightIcon ? 'pr-9' : 'pr-3'}
              py-2
              ${
                error
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              }
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              ${className}
            `}
            {...props}
          />
          {RightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <RightIcon className="h-4 w-4 text-gray-400" />
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export const Select = forwardRef(
  ({ label, error, hint, required, className = '', containerClassName = '', children, ...props }, ref) => {
    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`
            block w-full rounded-lg border text-sm shadow-sm px-3 py-2
            focus:outline-none focus:ring-1
            bg-white
            ${
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
            }
            disabled:bg-gray-50 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        >
          {children}
        </select>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'

export const Textarea = forwardRef(
  ({ label, error, hint, required, className = '', containerClassName = '', rows = 3, ...props }, ref) => {
    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={`
            block w-full rounded-lg border text-sm shadow-sm px-3 py-2
            placeholder-gray-400
            focus:outline-none focus:ring-1
            resize-vertical
            ${
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
            }
            disabled:bg-gray-50 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Input
