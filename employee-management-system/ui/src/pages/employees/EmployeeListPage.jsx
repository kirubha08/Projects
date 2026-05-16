import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaUserPlus, FaEdit, FaTrash, FaEye, FaFilter } from 'react-icons/fa'
import toast from 'react-hot-toast'
import {
  fetchEmployees,
  deleteEmployee,
  selectEmployees,
  selectEmployeeLoading,
  selectEmployeePagination,
} from '../../features/employees/employeeSlice'
import { fetchDepartments, selectDepartments } from '../../features/departments/departmentSlice'
import Table from '../../components/common/Table'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import SearchBar from '../../components/common/SearchBar'
import Pagination from '../../components/common/Pagination'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Card from '../../components/common/Card'
import { useDebounce } from '../../hooks/useDebounce'
import { useAuth } from '../../hooks/useAuth'
import { getInitials, formatDate } from '../../utils/formatters'
import { EMPLOYEE_STATUS } from '../../utils/constants'

const EmployeeListPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { canManageEmployees } = useAuth()

  const employees = useSelector(selectEmployees)
  const loading = useSelector(selectEmployeeLoading)
  const pagination = useSelector(selectEmployeePagination)
  const departments = useSelector(selectDepartments)

  const [search, setSearch] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const debouncedSearch = useDebounce(search, 400)

  useEffect(() => {
    dispatch(fetchDepartments())
  }, [dispatch])

  const loadEmployees = useCallback(() => {
    dispatch(
      fetchEmployees({
        page,
        size: pageSize,
        search: debouncedSearch || undefined,
        department: departmentFilter || undefined,
        status: statusFilter || undefined,
      })
    )
  }, [dispatch, page, pageSize, debouncedSearch, departmentFilter, statusFilter])

  useEffect(() => {
    loadEmployees()
  }, [loadEmployees])

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    const result = await dispatch(deleteEmployee(deleteTarget.id))
    if (deleteEmployee.fulfilled.match(result)) {
      toast.success('Employee deleted successfully')
    } else {
      toast.error(result.payload || 'Failed to delete employee')
    }
    setDeleteLoading(false)
    setDeleteTarget(null)
  }

  const columns = [
    {
      title: 'Emp Code',
      key: 'employeeCode',
      render: (val) => (
        <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
          {val || '—'}
        </span>
      ),
    },
    {
      title: 'Employee',
      key: 'firstName',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold flex-shrink-0">
            {getInitials(`${row.firstName || ''} ${row.lastName || ''}`)}
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">
              {row.firstName} {row.lastName}
            </p>
            <p className="text-xs text-gray-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Department',
      key: 'departmentName',
      render: (val) => val || '—',
    },
    {
      title: 'Designation',
      key: 'designation',
      render: (val) => val || '—',
    },
    {
      title: 'Joining Date',
      key: 'joiningDate',
      render: (val) => formatDate(val),
    },
    {
      title: 'Status',
      key: 'status',
      render: (val) => <Badge variant={val} label={val} />,
    },
    {
      title: 'Actions',
      key: 'id',
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate(`/employees/${row.id}`)}
            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="View Profile"
          >
            <FaEye className="h-3.5 w-3.5" />
          </button>
          {canManageEmployees && (
            <>
              <button
                onClick={() => navigate(`/employees/${row.id}/edit`)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit"
              >
                <FaEdit className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setDeleteTarget(row)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <FaTrash className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="text-sm text-gray-500 mt-1">
            {pagination.totalElements} total employees
          </p>
        </div>
        {canManageEmployees && (
          <Button
            variant="primary"
            icon={FaUserPlus}
            onClick={() => navigate('/employees/new')}
          >
            Add Employee
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card noPadding>
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name, email, or code..."
            className="flex-1 min-w-0"
          />

          <div className="flex gap-3">
            <select
              value={departmentFilter}
              onChange={(e) => { setDepartmentFilter(e.target.value); setPage(0) }}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0) }}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
            >
              <option value="">All Status</option>
              {Object.keys(EMPLOYEE_STATUS).map((s) => (
                <option key={s} value={s}>
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Table
          columns={columns}
          data={employees}
          loading={loading}
          emptyMessage="No employees found. Try adjusting your filters."
        />

        <Pagination
          currentPage={page}
          totalPages={pagination.totalPages || 1}
          totalElements={pagination.totalElements}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => { setPageSize(size); setPage(0) }}
        />
      </Card>

      {/* Delete confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteTarget?.firstName} ${deleteTarget?.lastName}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  )
}

export default EmployeeListPage
