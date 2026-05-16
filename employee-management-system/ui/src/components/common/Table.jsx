import LoadingSpinner from './LoadingSpinner'

const Table = ({ columns, data, loading, emptyMessage = 'No data found', className = '' }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                scope="col"
                className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap ${col.headerClassName || ''}`}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-sm text-gray-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={row.id || rowIdx}
                className="hover:bg-indigo-50 transition-colors"
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={`px-4 py-3 text-sm text-gray-700 ${col.className || ''}`}
                  >
                    {col.render ? col.render(row[col.key], row, rowIdx) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table
