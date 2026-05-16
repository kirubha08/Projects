import { useState, useEffect } from 'react'
import { FaShieldAlt, FaUser, FaEdit, FaHistory, FaKey } from 'react-icons/fa'
import toast from 'react-hot-toast'
import axiosInstance from '../../api/axios'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import { Select } from '../../components/common/Input'
import Modal from '../../components/common/Modal'
import { formatDateTime, getInitials } from '../../utils/formatters'
import { ROLES } from '../../utils/constants'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const DEMO_USERS = [
  { id: 1, name: 'Ravi Kumar', email: 'ravi@ems.com', role: 'EMPLOYEE', status: 'ACTIVE', lastLogin: '2025-05-16T09:02:00' },
  { id: 2, name: 'Priya Sharma', email: 'priya@ems.com', role: 'HR_MANAGER', status: 'ACTIVE', lastLogin: '2025-05-16T08:45:00' },
  { id: 3, name: 'Admin User', email: 'admin@ems.com', role: 'ADMIN', status: 'ACTIVE', lastLogin: '2025-05-16T10:00:00' },
  { id: 4, name: 'Arjun Mehta', email: 'arjun@ems.com', role: 'EMPLOYEE', status: 'ACTIVE', lastLogin: '2025-05-15T17:30:00' },
  { id: 5, name: 'Deepa Nair', email: 'deepa@ems.com', role: 'EMPLOYEE', status: 'INACTIVE', lastLogin: '2025-05-10T11:00:00' },
]

const DEMO_AUDIT = [
  { id: 1, action: 'LOGIN', user: 'admin@ems.com', detail: 'Successful login', timestamp: '2025-05-16T10:00:00', ipAddress: '192.168.1.10' },
  { id: 2, action: 'CREATE_EMPLOYEE', user: 'hr@ems.com', detail: 'Created employee Arjun Mehta', timestamp: '2025-05-16T09:30:00', ipAddress: '192.168.1.11' },
  { id: 3, action: 'APPROVE_LEAVE', user: 'hr@ems.com', detail: 'Approved leave for Ravi Kumar', timestamp: '2025-05-16T09:15:00', ipAddress: '192.168.1.11' },
  { id: 4, action: 'UPDATE_EMPLOYEE', user: 'admin@ems.com', detail: 'Updated Priya Sharma profile', timestamp: '2025-05-15T16:00:00', ipAddress: '192.168.1.10' },
  { id: 5, action: 'PROCESS_PAYROLL', user: 'admin@ems.com', detail: 'Processed payroll for May 2025', timestamp: '2025-05-15T14:00:00', ipAddress: '192.168.1.10' },
]

const actionColorMap = {
  LOGIN: 'bg-blue-50 text-blue-700',
  LOGOUT: 'bg-gray-100 text-gray-600',
  CREATE_EMPLOYEE: 'bg-green-50 text-green-700',
  UPDATE_EMPLOYEE: 'bg-yellow-50 text-yellow-700',
  DELETE_EMPLOYEE: 'bg-red-50 text-red-700',
  APPROVE_LEAVE: 'bg-green-50 text-green-700',
  REJECT_LEAVE: 'bg-red-50 text-red-700',
  PROCESS_PAYROLL: 'bg-purple-50 text-purple-700',
}

const AdminPage = () => {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState(DEMO_USERS)
  const [auditLogs, setAuditLogs] = useState(DEMO_AUDIT)
  const [loading, setLoading] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [newRole, setNewRole] = useState('')

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard')
      toast.error('Access denied. Admin only.')
    }
  }, [isAdmin, navigate])

  const loadData = async () => {
    setLoading(true)
    try {
      const [usersRes, logsRes] = await Promise.allSettled([
        axiosInstance.get('/admin/users'),
        axiosInstance.get('/admin/audit-logs'),
      ])
      if (usersRes.status === 'fulfilled' && usersRes.value.data?.length) {
        setUsers(usersRes.value.data)
      }
      if (logsRes.status === 'fulfilled' && logsRes.value.data?.length) {
        setAuditLogs(logsRes.value.data)
      }
    } catch {
      // Use demo data
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleRoleUpdate = async () => {
    if (!editUser || !newRole) return
    try {
      await axiosInstance.put(`/admin/users/${editUser.id}/role`, { role: newRole })
      setUsers(u => u.map(usr => usr.id === editUser.id ? { ...usr, role: newRole } : usr))
      toast.success(`Role updated to ${newRole}`)
    } catch {
      toast.error('Failed to update role (demo)')
      setUsers(u => u.map(usr => usr.id === editUser.id ? { ...usr, role: newRole } : usr))
    }
    setEditUser(null)
    setNewRole('')
  }

  const userColumns = [
    {
      title: 'User',
      key: 'name',
      render: (v, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
            {getInitials(v)}
          </div>
          <div>
            <p className="font-medium text-sm text-gray-900">{v}</p>
            <p className="text-xs text-gray-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      key: 'role',
      render: (v) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          v === 'ADMIN' ? 'bg-red-100 text-red-700'
          : v === 'HR_MANAGER' ? 'bg-purple-100 text-purple-700'
          : 'bg-blue-100 text-blue-700'
        }`}>
          {v.replace('_', ' ')}
        </span>
      ),
    },
    { title: 'Status', key: 'status', render: (v) => <Badge variant={v} label={v} /> },
    { title: 'Last Login', key: 'lastLogin', render: (v) => formatDateTime(v) },
    {
      title: 'Actions',
      key: 'id',
      render: (id, row) => (
        <button
          onClick={() => { setEditUser(row); setNewRole(row.role) }}
          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800"
        >
          <FaKey className="h-3 w-3" /> Change Role
        </button>
      ),
    },
  ]

  const auditColumns = [
    {
      title: 'Action',
      key: 'action',
      render: (v) => (
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${actionColorMap[v] || 'bg-gray-100 text-gray-600'}`}>
          {v.replace(/_/g, ' ')}
        </span>
      ),
    },
    { title: 'User', key: 'user' },
    { title: 'Detail', key: 'detail', render: (v) => <span className="text-sm">{v}</span> },
    { title: 'Timestamp', key: 'timestamp', render: (v) => formatDateTime(v) },
    { title: 'IP Address', key: 'ipAddress', render: (v) => <span className="font-mono text-xs">{v}</span> },
  ]

  if (!isAdmin) return null

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
          <FaShieldAlt className="h-5 w-5 text-red-600" />
        </div>
        <div>
          <h1 className="page-title">Admin Panel</h1>
          <p className="text-sm text-gray-500">System administration and user management</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: users.length, color: 'bg-indigo-50 text-indigo-700' },
          { label: 'Admins', value: users.filter(u => u.role === 'ADMIN').length, color: 'bg-red-50 text-red-700' },
          { label: 'HR Managers', value: users.filter(u => u.role === 'HR_MANAGER').length, color: 'bg-purple-50 text-purple-700' },
          { label: 'Employees', value: users.filter(u => u.role === 'EMPLOYEE').length, color: 'bg-blue-50 text-blue-700' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`rounded-xl p-4 ${color.split(' ')[0]}`}>
            <p className={`text-2xl font-bold ${color.split(' ')[1]}`}>{value}</p>
            <p className="text-sm text-gray-600 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Card noPadding>
        <div className="border-b border-gray-100">
          <nav className="flex px-6 gap-1">
            {[
              { id: 'users', label: 'User Roles', icon: FaUser },
              { id: 'audit', label: 'Audit Logs', icon: FaHistory },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  activeTab === id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-0">
          {activeTab === 'users' && (
            <Table
              columns={userColumns}
              data={users}
              loading={loading}
              emptyMessage="No users found."
            />
          )}
          {activeTab === 'audit' && (
            <Table
              columns={auditColumns}
              data={auditLogs}
              loading={loading}
              emptyMessage="No audit logs found."
            />
          )}
        </div>
      </Card>

      {/* Role change modal */}
      <Modal
        isOpen={!!editUser}
        onClose={() => setEditUser(null)}
        title="Change User Role"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditUser(null)}>Cancel</Button>
            <Button variant="primary" onClick={handleRoleUpdate}>Save</Button>
          </>
        }
      >
        {editUser && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Changing role for <strong>{editUser.name}</strong>
            </p>
            <Select
              label="New Role"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              {Object.values(ROLES).map((r) => (
                <option key={r} value={r}>{r.replace('_', ' ')}</option>
              ))}
            </Select>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default AdminPage
