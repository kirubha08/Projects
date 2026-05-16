import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaMoneyBillWave, FaDownload, FaEye, FaFileInvoice } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { fetchPayroll, selectPayroll, selectPayrollLoading } from '../../features/payroll/payrollSlice'
import { payrollApi } from '../../api/payrollApi'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import { Select } from '../../components/common/Input'
import { formatDate, formatCurrency } from '../../utils/formatters'
import { MONTHS } from '../../utils/constants'
import { useAuth } from '../../hooks/useAuth'

const DEMO_PAYROLL = [
  { id: 1, employeeName: 'Ravi Kumar', employeeCode: 'EMP001', department: 'Engineering', month: '2025-05-01', basicSalary: 60000, hra: 12000, allowances: 5000, deductions: 8000, grossPay: 77000, netPay: 69000, status: 'PAID' },
  { id: 2, employeeName: 'Priya Sharma', employeeCode: 'EMP002', department: 'HR', month: '2025-05-01', basicSalary: 45000, hra: 9000, allowances: 3000, deductions: 6000, grossPay: 57000, netPay: 51000, status: 'PAID' },
  { id: 3, employeeName: 'Arjun Mehta', employeeCode: 'EMP003', department: 'Sales', month: '2025-05-01', basicSalary: 52000, hra: 10400, allowances: 4000, deductions: 7500, grossPay: 66400, netPay: 58900, status: 'PENDING' },
  { id: 4, employeeName: 'Deepa Nair', employeeCode: 'EMP004', department: 'Finance', month: '2025-05-01', basicSalary: 48000, hra: 9600, allowances: 3500, deductions: 6800, grossPay: 61100, netPay: 54300, status: 'PAID' },
  { id: 5, employeeName: 'Suresh Patel', employeeCode: 'EMP005', department: 'Operations', month: '2025-05-01', basicSalary: 38000, hra: 7600, allowances: 2500, deductions: 5500, grossPay: 48100, netPay: 42600, status: 'PROCESSING' },
]

const PayrollPage = () => {
  const dispatch = useDispatch()
  const { canViewPayroll } = useAuth()
  const payroll = useSelector(selectPayroll)
  const loading = useSelector(selectPayrollLoading)

  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())

  useEffect(() => {
    dispatch(fetchPayroll({ month: selectedMonth, year: selectedYear }))
  }, [dispatch, selectedMonth, selectedYear])

  const displayData = payroll.length > 0 ? payroll : DEMO_PAYROLL

  const totalNetPay = displayData.reduce((sum, row) => sum + (row.netPay || 0), 0)
  const totalGrossPay = displayData.reduce((sum, row) => sum + (row.grossPay || 0), 0)
  const paidCount = displayData.filter(r => r.status === 'PAID').length

  const handleDownload = async (id) => {
    try {
      const res = await payrollApi.downloadPayslip(id)
      const url = URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `payslip-${id}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Download failed. Please try again.')
    }
  }

  const columns = [
    {
      title: 'Employee',
      key: 'employeeName',
      render: (v, row) => (
        <div>
          <p className="font-medium text-sm text-gray-900">{v}</p>
          <p className="text-xs text-gray-400 font-mono">{row.employeeCode}</p>
        </div>
      ),
    },
    { title: 'Department', key: 'department' },
    { title: 'Basic Salary', key: 'basicSalary', render: (v) => formatCurrency(v) },
    { title: 'HRA', key: 'hra', render: (v) => formatCurrency(v) },
    { title: 'Allowances', key: 'allowances', render: (v) => formatCurrency(v) },
    { title: 'Deductions', key: 'deductions', render: (v) => <span className="text-red-600">{formatCurrency(v)}</span> },
    { title: 'Gross Pay', key: 'grossPay', render: (v) => <span className="font-medium">{formatCurrency(v)}</span> },
    { title: 'Net Pay', key: 'netPay', render: (v) => <span className="font-bold text-green-700">{formatCurrency(v)}</span> },
    { title: 'Status', key: 'status', render: (v) => <Badge variant={v === 'PAID' ? 'APPROVED' : v === 'PENDING' ? 'PENDING' : 'info'} label={v} /> },
    {
      title: 'Payslip',
      key: 'id',
      render: (id) => (
        <button
          onClick={() => handleDownload(id)}
          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <FaDownload className="h-3 w-3" /> Download
        </button>
      ),
    },
  ]

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Payroll</h1>
          <p className="text-sm text-gray-500 mt-1">Monthly payroll management</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Total Net Pay</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalNetPay)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Total Gross Pay</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalGrossPay)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Paid Employees</p>
          <p className="text-2xl font-bold text-green-700 mt-1">
            {paidCount} / {displayData.length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card noPadding>
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
          >
            {MONTHS.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          {canViewPayroll && (
            <Button variant="primary" size="sm">
              Process Payroll
            </Button>
          )}
        </div>

        <Table
          columns={columns}
          data={displayData}
          loading={loading}
          emptyMessage="No payroll records found for this period."
        />
      </Card>
    </div>
  )
}

export default PayrollPage
