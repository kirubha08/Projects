import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const LineChartWrapper = ({
  data,
  lines = [{ dataKey: 'value', stroke: '#4f46e5', name: 'Value' }],
  xAxisKey = 'name',
  height = 300,
  showGrid = true,
  showLegend = true,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
          {lines.map((line, idx) => (
            <Line
              key={idx}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.stroke || '#4f46e5'}
              name={line.name}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default LineChartWrapper
