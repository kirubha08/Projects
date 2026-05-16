const Card = ({ children, className = '', title, subtitle, action, noPadding = false }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
      {(title || action) && (
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-6'}>{children}</div>
    </div>
  )
}

export const StatCard = ({ title, value, icon: Icon, color = 'indigo', change, subtitle }) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-50',
      icon: 'text-indigo-600',
      text: 'text-indigo-600',
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      text: 'text-green-600',
    },
    yellow: {
      bg: 'bg-yellow-50',
      icon: 'text-yellow-600',
      text: 'text-yellow-600',
    },
    red: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      text: 'text-red-600',
    },
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      text: 'text-blue-600',
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      text: 'text-purple-600',
    },
  }

  const colors = colorMap[color] || colorMap.indigo

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value ?? '—'}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
          )}
          {change !== undefined && (
            <p
              className={`mt-1 text-xs font-medium ${
                change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {change >= 0 ? '+' : ''}
              {change}% from last month
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${colors.bg}`}>
            <Icon className={`h-6 w-6 ${colors.icon}`} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Card
