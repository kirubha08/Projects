import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const Pagination = ({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const start = currentPage * pageSize + 1
  const end = Math.min((currentPage + 1) * pageSize, totalElements)

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let startPage = Math.max(0, currentPage - Math.floor(maxVisible / 2))
    let endPage = Math.min(totalPages - 1, startPage + maxVisible - 1)

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(0, endPage - maxVisible + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }

  if (totalPages <= 1 && totalElements <= pageSize) return null

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium">{start}</span> to{' '}
          <span className="font-medium">{end}</span> of{' '}
          <span className="font-medium">{totalElements}</span> results
        </p>
        {onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size} / page
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <FaChevronLeft className="h-3.5 w-3.5" />
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`min-w-[2rem] h-8 px-2 rounded-lg text-sm font-medium transition-colors ${
              page === currentPage
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {page + 1}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <FaChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}

export default Pagination
