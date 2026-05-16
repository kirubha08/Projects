const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-2',
  xl: 'h-16 w-16 border-4',
}

const LoadingSpinner = ({ size = 'md', className = '', text }) => {
  const sizeClass = sizes[size] || sizes.md

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`${sizeClass} rounded-full border-indigo-200 border-t-indigo-600 animate-spin`}
      />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  )
}

export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <LoadingSpinner size="xl" text="Loading..." />
  </div>
)

export default LoadingSpinner
