import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  FaCalendarCheck,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
} from 'react-icons/fa'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isToday } from 'date-fns'
import toast from 'react-hot-toast'
import { fetchAttendance, selectAttendance, selectAttendanceLoading } from '../../features/attendance/attendanceSlice'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Table from '../../components/common/Table'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatDate, formatTime } from '../../utils/formatters'
import { ATTENDANCE_STATUS } from '../../utils/constants'

// Demo attendance data
const DEMO_ATTENDANCE = [
  { id: 1, date: '2025-05-16', employeeName: 'Ravi Kumar', employeeCode: 'EMP001', checkIn: '09:02', checkOut: '18:15', workingHours: 9.2, status: 'PRESENT' },
  { id: 2, date: '2025-05-16', employeeName: 'Priya Sharma', employeeCode: 'EMP002', checkIn: '09:45', checkOut: '18:00', workingHours: 8.25, status: 'LATE' },
  { id: 3, date: '2025-05-16', employeeName: 'Arjun Mehta', employeeCode: 'EMP003', checkIn: null, checkOut: null, workingHours: 0, status: 'ABSENT' },
  { id: 4, date: '2025-05-16', employeeName: 'Suresh Patel', employeeCode: 'EMP004', checkIn: '09:10', checkOut: '13:00', workingHours: 3.83, status: 'HALF_DAY' },
  { id: 5, date: '2025-05-16', employeeName: 'Deepa Nair', employeeCode: 'EMP005', checkIn: null, checkOut: null, workingHours: 0, status: 'ON_LEAVE' },
]

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const statusColorMap = {
  PRESENT: 'bg-green-500',
  ABSENT: 'bg-red-500',
  LATE: 'bg-orange-500',
  HALF_DAY: 'bg-blue-400',
  ON_LEAVE: 'bg-yellow-500',
  HOLIDAY: 'bg-purple-400',
  WEEKEND: 'bg-gray-200',
}

const AttendancePage = () => {
  const dispatch = useDispatch()
  const attendance = useSelector(selectAttendance)
  const loading = useSelector(selectAttendanceLoading)

  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [viewMode, setViewMode] = useState('table') // 'table' | 'calendar'

  useEffect(() => {
    dispatch(fetchAttendance({
      month: format(currentMonth, 'yyyy-MM'),
    }))
  }, [dispatch, currentMonth])

  const displayData = attendance.length > 0 ? attendance : DEMO_ATTENDANCE

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startDayOffset = getDay(monthStart)

  const columns = [
    {
      title: 'Employee',
      key: 'employeeName',
      render: (val, row) => (
        <div>
          <p className="font-medium text-gray-900 text-sm">{val}</p>
          <p className="text-xs text-gray-400 font-mono">{row.employeeCode}</p>
        </div>
      ),
    },
    { title: 'Date', key: 'date', render: (v) => formatDate(v) },
    { title: 'Check In', key: 'checkIn', render: (v) => v || '—' },
    { title: 'Check Out', key: 'checkOut', render: (v) => v || '—' },
    { title: 'Hours', key: 'workingHours', render: (v) => v ? `${Number(v).toFixed(1)}h` : '—' },
    { title: 'Status', key: 'status', render: (v) => <Badge variant={v} label={v} /> },
  ]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Attendance</h1>
          <p className="text-sm text-gray-500 mt-1">
            {format(currentMonth, 'MMMM yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 text-sm font-medium transition-colors ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-2 text-sm font-medium transition-colors ${viewMode === 'calendar' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 border border-gray-200 transition-colors"
        >
          <FaChevronLeft className="h-3.5 w-3.5" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900 min-w-[160px] text-center">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 border border-gray-200 transition-colors"
        >
          <FaChevronRight className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => setCurrentMonth(new Date())}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Today
        </button>
      </div>

      {/* Status legend */}
      <div className="flex flex-wrap gap-4">
        {Object.entries(statusColorMap).map(([status, color]) => (
          <div key={status} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${color}`} />
            <span className="text-xs text-gray-600">{status.replace('_', ' ')}</span>
          </div>
        ))}
      </div>

      {viewMode === 'calendar' ? (
        /* Calendar View */
        <Card noPadding>
          <div className="p-4">
            <div className="grid grid-cols-7 mb-2">
              {DAY_LABELS.map((d) => (
                <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startDayOffset }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {days.map((day) => {
                const dayStr = format(day, 'yyyy-MM-dd')
                const dayOfWeek = getDay(day)
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
                const today = isToday(day)

                return (
                  <div
                    key={dayStr}
                    className={`
                      aspect-square flex flex-col items-center justify-center rounded-lg text-sm
                      ${today ? 'ring-2 ring-indigo-500' : ''}
                      ${isWeekend ? 'bg-gray-50' : 'hover:bg-gray-50'}
                      transition-colors cursor-default
                    `}
                  >
                    <span className={`font-medium ${today ? 'text-indigo-600' : 'text-gray-700'}`}>
                      {format(day, 'd')}
                    </span>
                    {isWeekend && (
                      <div className="w-2 h-2 rounded-full bg-gray-300 mt-1" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </Card>
      ) : (
        /* Table View */
        <Card noPadding>
          <Table
            columns={columns}
            data={displayData}
            loading={loading}
            emptyMessage="No attendance records found."
          />
        </Card>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Present', count: displayData.filter(d => d.status === 'PRESENT').length, color: 'text-green-600 bg-green-50' },
          { label: 'Absent', count: displayData.filter(d => d.status === 'ABSENT').length, color: 'text-red-600 bg-red-50' },
          { label: 'Late', count: displayData.filter(d => d.status === 'LATE').length, color: 'text-orange-600 bg-orange-50' },
          { label: 'On Leave', count: displayData.filter(d => d.status === 'ON_LEAVE').length, color: 'text-yellow-600 bg-yellow-50' },
        ].map(({ label, count, color }) => (
          <div key={label} className={`rounded-xl p-4 ${color.split(' ')[1]}`}>
            <p className={`text-2xl font-bold ${color.split(' ')[0]}`}>{count}</p>
            <p className="text-sm font-medium text-gray-600 mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AttendancePage
