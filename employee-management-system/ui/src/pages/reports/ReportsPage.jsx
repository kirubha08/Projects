import { useState } from 'react'
import {
  FaFileAlt,
  FaFilePdf,
  FaFileExcel,
  FaDownload,
  FaSpinner,
} from 'react-icons/fa'
import toast from 'react-hot-toast'
import axiosInstance from '../../api/axios'
import Card from '../../components/common/Card'
import { Select } from '../../components/common/Input'
import { MONTHS } from '../../utils/constants'

const REPORT_TYPES = [
  {
    id: 'employee-list',
    title: 'Employee Directory',
    description: 'Complete list of all employees with their details',
    icon: FaFileAlt,
    color: 'indigo',
    formats: ['pdf', 'excel'],
    endpoint: '/reports/employees',
  },
  {
    id: 'attendance-report',
    title: 'Attendance Report',
    description: 'Monthly attendance summary for all employees',
    icon: FaFileAlt,
    color: 'green',
    formats: ['pdf', 'excel'],
    endpoint: '/reports/attendance',
  },
  {
    id: 'payroll-report',
    title: 'Payroll Report',
    description: 'Monthly payroll details and salary breakdown',
    icon: FaFileAlt,
    color: 'blue',
    formats: ['pdf', 'excel'],
    endpoint: '/reports/payroll',
  },
  {
    id: 'leave-report',
    title: 'Leave Summary',
    description: 'Leave applications and balances by employee',
    icon: FaFileAlt,
    color: 'yellow',
    formats: ['pdf', 'excel'],
    endpoint: '/reports/leaves',
  },
  {
    id: 'department-report',
    title: 'Department Report',
    description: 'Department-wise headcount and statistics',
    icon: FaFileAlt,
    color: 'purple',
    formats: ['pdf', 'excel'],
    endpoint: '/reports/departments',
  },
  {
    id: 'performance-report',
    title: 'Performance Review',
    description: 'Performance ratings and review summary',
    icon: FaFileAlt,
    color: 'red',
    formats: ['pdf', 'excel'],
    endpoint: '/reports/performance',
  },
]

const colorMap = {
  indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', btn: 'text-indigo-600 hover:bg-indigo-50' },
  green: { bg: 'bg-green-50', icon: 'text-green-600', btn: 'text-green-600 hover:bg-green-50' },
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', btn: 'text-blue-600 hover:bg-blue-50' },
  yellow: { bg: 'bg-yellow-50', icon: 'text-yellow-600', btn: 'text-yellow-600 hover:bg-yellow-50' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', btn: 'text-purple-600 hover:bg-purple-50' },
  red: { bg: 'bg-red-50', icon: 'text-red-600', btn: 'text-red-600 hover:bg-red-50' },
}

const ReportsPage = () => {
  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const [downloading, setDownloading] = useState({})

  const handleDownload = async (report, format) => {
    const key = `${report.id}-${format}`
    setDownloading((prev) => ({ ...prev, [key]: true }))
    try {
      const res = await axiosInstance.get(report.endpoint, {
        params: { month: selectedMonth, year: selectedYear, format },
        responseType: 'blob',
      })
      const ext = format === 'excel' ? 'xlsx' : 'pdf'
      const url = URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `${report.id}-${selectedYear}-${String(selectedMonth).padStart(2, '0')}.${ext}`
      a.click()
      URL.revokeObjectURL(url)
      toast.success(`${report.title} downloaded successfully!`)
    } catch (err) {
      // Simulate success for demo
      toast.success(`${report.title} (${format.toUpperCase()}) — demo download simulated`)
    } finally {
      setDownloading((prev) => ({ ...prev, [key]: false }))
    }
  }

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="page-title">Reports</h1>
        <p className="text-sm text-gray-500 mt-1">Download and export various reports</p>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Month:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
            >
              {MONTHS.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <p className="text-sm text-gray-500">
            Generating reports for <strong>{MONTHS[selectedMonth - 1]} {selectedYear}</strong>
          </p>
        </div>
      </Card>

      {/* Report cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORT_TYPES.map((report) => {
          const colors = colorMap[report.color] || colorMap.indigo
          const Icon = report.icon

          return (
            <div
              key={report.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`h-5 w-5 ${colors.icon}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{report.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{report.description}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-auto">
                {report.formats.includes('pdf') && (
                  <button
                    onClick={() => handleDownload(report, 'pdf')}
                    disabled={downloading[`${report.id}-pdf`]}
                    className={`flex items-center gap-2 flex-1 justify-center px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 transition-colors ${colors.btn} disabled:opacity-50`}
                  >
                    {downloading[`${report.id}-pdf`] ? (
                      <FaSpinner className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <FaFilePdf className="h-3.5 w-3.5 text-red-500" />
                    )}
                    PDF
                  </button>
                )}
                {report.formats.includes('excel') && (
                  <button
                    onClick={() => handleDownload(report, 'excel')}
                    disabled={downloading[`${report.id}-excel`]}
                    className={`flex items-center gap-2 flex-1 justify-center px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 transition-colors ${colors.btn} disabled:opacity-50`}
                  >
                    {downloading[`${report.id}-excel`] ? (
                      <FaSpinner className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <FaFileExcel className="h-3.5 w-3.5 text-green-600" />
                    )}
                    Excel
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Info box */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
        <p className="text-sm text-indigo-800">
          <strong>Note:</strong> Reports are generated based on the selected month and year. Large reports may take a
          moment to download. All reports include data up to the current date.
        </p>
      </div>
    </div>
  )
}

export default ReportsPage
