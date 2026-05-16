import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const BarChartWrapper = ({
  data,
  bars = [{ dataKey: 'value', fill: '#4f46e5', name: 'Value' }],
  xAxisKey = 'name',
  height = 300,
  showGrid = true,
  showLegend = true,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          {showLegend && <Legend wrapperStyle={{ fontSize: '12px' }} />}
          {bars.map((bar, idx) => (
            <Bar
              key={idx}
              dataKey={bar.dataKey}
              fill={bar.fill || '#4f46e5'}
              name={bar.name}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BarChartWrapper
