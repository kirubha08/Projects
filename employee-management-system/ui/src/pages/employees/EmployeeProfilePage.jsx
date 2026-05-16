import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaEdit, FaArrowLeft, FaDownload, FaFileAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { fetchEmployeeById, selectSelectedEmployee, selectEmployeeLoading } from '../../features/employees/employeeSlice'
import { employeeApi } from '../../api/employeeApi'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Table from '../../components/common/Table'
import { formatDate, formatCurrency, getInitials } from '../../utils/formatters'
import { useAuth } from '../../hooks/useAuth'

const tabs = ['Info', 'Attendance', 'Documents', 'Payslips']

const EmployeeProfilePage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { canManageEmployees } = useAuth()

  const employee = useSelector(selectSelectedEmployee)
  const loading = useSelector(selectEmployeeLoading)

  const [activeTab, setActiveTab] = useState('Info')
  const [documents, setDocuments] = useState([])
  const [payslips, setPayslips] = useState([])
  const [tabLoading, setTabLoading] = useState(false)

  useEffect(() => {
    dispatch(fetchEmployeeById(id))
  }, [dispatch, id])

  useEffect(() => {
    if (activeTab === 'Documents') {
      loadDocuments()
    } else if (activeTab === 'Payslips') {
      loadPayslips()
    }
  }, [activeTab, id])

  const loadDocuments = async () => {
    setTabLoading(true)
    try {
      const res = await employeeApi.getDocuments(id)
      setDocuments(res.data || [])
    } catch {
      setDocuments([])
    } finally {
      setTabLoading(false)
    }
  }

  const loadPayslips = async () => {
    setTabLoading(true)
    try {
      const res = await employeeApi.getPayslips(id)
      setPayslips(res.data || [])
    } catch {
      setPayslips([])
    } finally {
      setTabLoading(false)
    }
  }

  if (loading && !employee) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="xl" text="Loading profile..." />
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Employee not found.</p>
        <Button variant="secondary" onClick={() => navigate('/employees')} className="mt-4">
          Back to Employees
        </Button>
      </div>
    )
  }

  const fullName = `${employee.firstName || ''} ${employee.lastName || ''}`.trim()

  const docColumns = [
    { title: 'Document Name', key: 'name' },
    { title: 'Type', key: 'type' },
    { title: 'Uploaded On', key: 'uploadedAt', render: (v) => formatDate(v) },
    {
      title: 'Action',
      key: 'url',
      render: (url) =>
        url ? (
          <a href={url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline text-sm flex items-center gap-1">
            <FaDownload className="h-3 w-3" /> Download
          </a>
        ) : '—',
    },
  ]

  const payslipColumns = [
    { title: 'Month', key: 'month', render: (v) => formatDate(v, 'MMMM yyyy') },
    { title: 'Basic Salary', key: 'basicSalary', render: (v) => formatCurrency(v) },
    { title: 'Gross Pay', key: 'grossPay', render: (v) => formatCurrency(v) },
    { title: 'Net Pay', key: 'netPay', render: (v) => formatCurrency(v) },
    { title: 'Status', key: 'status', render: (v) => <Badge variant={v} label={v} /> },
    {
      title: 'Action',
      key: 'id',
      render: (id) => (
        <button className="text-indigo-600 hover:underline text-sm flex items-center gap-1">
          <FaFileAlt className="h-3 w-3" /> View
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/employees')}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <FaArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <h1 className="page-title">{fullName}</h1>
          <p className="text-sm text-gray-500">{employee.designation || 'Employee'}</p>
        </div>
        {canManageEmployees && (
          <Button
            variant="primary"
            icon={FaEdit}
            onClick={() => navigate(`/employees/${id}/edit`)}
          >
            Edit Profile
          </Button>
        )}
      </div>

      {/* Profile card */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700 text-3xl font-bold flex-shrink-0">
            {getInitials(fullName)}
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Emp Code</p>
              <p className="text-sm font-semibold text-gray-900 mt-1 font-mono">
                {employee.employeeCode || '—'}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Department</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">{employee.departmentName || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Joining Date</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">{formatDate(employee.joiningDate)}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Status</p>
              <div className="mt-1">
                <Badge variant={employee.status} label={employee.status} />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Card noPadding>
        <div className="border-b border-gray-100">
          <nav className="flex px-6 gap-1" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  activeTab === tab
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Info Tab */}
          {activeTab === 'Info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="section-title border-b border-gray-100 pb-2">Personal Information</h4>
                {[
                  { label: 'Full Name', value: fullName },
                  { label: 'Email', value: employee.email },
                  { label: 'Phone', value: employee.phone },
                  { label: 'Date of Birth', value: formatDate(employee.dateOfBirth) },
                  { label: 'Gender', value: employee.gender },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-sm text-gray-500">{label}</span>
                    <span className="text-sm font-medium text-gray-900">{value || '—'}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h4 className="section-title border-b border-gray-100 pb-2">Employment Details</h4>
                {[
                  { label: 'Employee Code', value: employee.employeeCode },
                  { label: 'Department', value: employee.departmentName },
                  { label: 'Designation', value: employee.designation },
                  { label: 'Employment Type', value: employee.employmentType?.replace('_', ' ') },
                  { label: 'Salary', value: formatCurrency(employee.salary) },
                  { label: 'Joining Date', value: formatDate(employee.joiningDate) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-sm text-gray-500">{label}</span>
                    <span className="text-sm font-medium text-gray-900">{value || '—'}</span>
                  </div>
                ))}
              </div>

              {(employee.address || employee.emergencyContact) && (
                <div className="md:col-span-2 space-y-4">
                  <h4 className="section-title border-b border-gray-100 pb-2">Contact & Address</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Address', value: employee.address },
                      { label: 'City', value: employee.city },
                      { label: 'State', value: employee.state },
                      { label: 'PIN Code', value: employee.pincode },
                      { label: 'Emergency Contact', value: employee.emergencyContact },
                      { label: 'Emergency Phone', value: employee.emergencyPhone },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between">
                        <span className="text-sm text-gray-500">{label}</span>
                        <span className="text-sm font-medium text-gray-900">{value || '—'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === 'Attendance' && (
            <div>
              <p className="text-sm text-gray-500 mb-4">Recent attendance records for this employee.</p>
              <Table
                columns={[
                  { title: 'Date', key: 'date', render: (v) => formatDate(v) },
                  { title: 'Check In', key: 'checkIn', render: (v) => v || '—' },
                  { title: 'Check Out', key: 'checkOut', render: (v) => v || '—' },
                  { title: 'Hours', key: 'workingHours', render: (v) => v ? `${v}h` : '—' },
                  { title: 'Status', key: 'status', render: (v) => <Badge variant={v} label={v} /> },
                ]}
                data={[]}
                loading={tabLoading}
                emptyMessage="No attendance records found."
              />
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'Documents' && (
            <div>
              <Table
                columns={docColumns}
                data={documents}
                loading={tabLoading}
                emptyMessage="No documents uploaded."
              />
            </div>
          )}

          {/* Payslips Tab */}
          {activeTab === 'Payslips' && (
            <div>
              <Table
                columns={payslipColumns}
                data={payslips}
                loading={tabLoading}
                emptyMessage="No payslips found."
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default EmployeeProfilePage
