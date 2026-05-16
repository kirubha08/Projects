import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FaPlus, FaCheck, FaTimes, FaCalendarTimes } from 'react-icons/fa'
import toast from 'react-hot-toast'
import {
  fetchMyLeaves,
  fetchPendingLeaves,
  applyLeave,
  approveLeave,
  rejectLeave,
  selectMyLeaves,
  selectPendingLeaves,
  selectLeaveLoading,
} from '../../features/leaves/leaveSlice'
import { leaveSchema } from '../../utils/validators'
import { LEAVE_TYPES, LEAVE_STATUS } from '../../utils/constants'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import Table from '../../components/common/Table'
import Input, { Select, Textarea } from '../../components/common/Input'
import Modal from '../../components/common/Modal'
import { formatDate } from '../../utils/formatters'
import { useAuth } from '../../hooks/useAuth'

// Demo data
const DEMO_MY_LEAVES = [
  { id: 1, leaveType: 'ANNUAL', startDate: '2025-05-20', endDate: '2025-05-22', reason: 'Family vacation', status: 'APPROVED', appliedOn: '2025-05-10', approvedBy: 'Manager' },
  { id: 2, leaveType: 'SICK', startDate: '2025-04-15', endDate: '2025-04-16', reason: 'Fever and cold', status: 'APPROVED', appliedOn: '2025-04-15' },
  { id: 3, leaveType: 'EMERGENCY', startDate: '2025-05-30', endDate: '2025-05-31', reason: 'Family emergency', status: 'PENDING', appliedOn: '2025-05-14' },
]

const DEMO_PENDING = [
  { id: 4, employeeName: 'Priya Sharma', employeeCode: 'EMP002', leaveType: 'ANNUAL', startDate: '2025-05-25', endDate: '2025-05-27', reason: 'Personal work', appliedOn: '2025-05-12', status: 'PENDING' },
  { id: 5, employeeName: 'Ravi Kumar', employeeCode: 'EMP001', leaveType: 'SICK', startDate: '2025-05-18', endDate: '2025-05-18', reason: 'Not feeling well', appliedOn: '2025-05-16', status: 'PENDING' },
]

const LeavePage = () => {
  const dispatch = useDispatch()
  const { canApproveLeaves } = useAuth()

  const myLeaves = useSelector(selectMyLeaves)
  const pendingLeaves = useSelector(selectPendingLeaves)
  const loading = useSelector(selectLeaveLoading)

  const [activeTab, setActiveTab] = useState('my')
  const [applyOpen, setApplyOpen] = useState(false)
  const [rejectId, setRejectId] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(leaveSchema) })

  useEffect(() => {
    dispatch(fetchMyLeaves())
    if (canApproveLeaves) {
      dispatch(fetchPendingLeaves())
    }
  }, [dispatch, canApproveLeaves])

  const handleApply = async (data) => {
    setSubmitting(true)
    const result = await dispatch(applyLeave(data))
    if (applyLeave.fulfilled.match(result)) {
      toast.success('Leave application submitted!')
      reset()
      setApplyOpen(false)
    } else {
      toast.error(result.payload || 'Failed to apply leave')
    }
    setSubmitting(false)
  }

  const handleApprove = async (id) => {
    const result = await dispatch(approveLeave({ id, data: { comment: 'Approved' } }))
    if (approveLeave.fulfilled.match(result)) {
      toast.success('Leave approved')
      dispatch(fetchPendingLeaves())
    } else {
      toast.error(result.payload || 'Failed to approve')
    }
  }

  const handleReject = async () => {
    if (!rejectId) return
    const result = await dispatch(rejectLeave({ id: rejectId, data: { reason: rejectReason } }))
    if (rejectLeave.fulfilled.match(result)) {
      toast.success('Leave rejected')
      dispatch(fetchPendingLeaves())
    } else {
      toast.error(result.payload || 'Failed to reject')
    }
    setRejectId(null)
    setRejectReason('')
  }

  const displayMyLeaves = myLeaves.length > 0 ? myLeaves : DEMO_MY_LEAVES
  const displayPending = pendingLeaves.length > 0 ? pendingLeaves : DEMO_PENDING

  const myLeaveColumns = [
    { title: 'Type', key: 'leaveType', render: (v) => LEAVE_TYPES.find(t => t.value === v)?.label || v },
    { title: 'From', key: 'startDate', render: (v) => formatDate(v) },
    { title: 'To', key: 'endDate', render: (v) => formatDate(v) },
    { title: 'Applied On', key: 'appliedOn', render: (v) => formatDate(v) },
    { title: 'Reason', key: 'reason', render: (v) => <span className="max-w-xs truncate block">{v}</span> },
    { title: 'Status', key: 'status', render: (v) => <Badge variant={v} label={v} /> },
  ]

  const pendingColumns = [
    {
      title: 'Employee',
      key: 'employeeName',
      render: (v, row) => (
        <div>
          <p className="font-medium text-sm">{v}</p>
          <p className="text-xs text-gray-400 font-mono">{row.employeeCode}</p>
        </div>
      ),
    },
    { title: 'Type', key: 'leaveType', render: (v) => LEAVE_TYPES.find(t => t.value === v)?.label || v },
    { title: 'From', key: 'startDate', render: (v) => formatDate(v) },
    { title: 'To', key: 'endDate', render: (v) => formatDate(v) },
    { title: 'Reason', key: 'reason', render: (v) => <span className="max-w-xs truncate block">{v}</span> },
    {
      title: 'Actions',
      key: 'id',
      render: (id) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleApprove(id)}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
          >
            <FaCheck className="h-3 w-3" /> Approve
          </button>
          <button
            onClick={() => setRejectId(id)}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
          >
            <FaTimes className="h-3 w-3" /> Reject
          </button>
        </div>
      ),
    },
  ]

  const tabs = [
    { id: 'my', label: 'My Leaves' },
    { id: 'apply', label: 'Apply Leave' },
    ...(canApproveLeaves ? [{ id: 'pending', label: `Pending Approvals ${displayPending.length > 0 ? `(${displayPending.length})` : ''}` }] : []),
  ]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Leave Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track leave requests</p>
        </div>
        <Button variant="primary" icon={FaPlus} onClick={() => setActiveTab('apply')}>
          Apply Leave
        </Button>
      </div>

      {/* Tabs */}
      <Card noPadding>
        <div className="border-b border-gray-100">
          <nav className="flex px-6 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* My Leaves */}
          {activeTab === 'my' && (
            <Table
              columns={myLeaveColumns}
              data={displayMyLeaves}
              loading={loading}
              emptyMessage="You haven't applied for any leaves yet."
            />
          )}

          {/* Apply Leave */}
          {activeTab === 'apply' && (
            <div className="max-w-lg">
              <h3 className="section-title mb-4">Apply for Leave</h3>
              <form onSubmit={handleSubmit(handleApply)} className="space-y-4">
                <Select
                  label="Leave Type"
                  error={errors.leaveType?.message}
                  required
                  {...register('leaveType')}
                >
                  <option value="">Select leave type</option>
                  {LEAVE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </Select>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Start Date"
                    type="date"
                    error={errors.startDate?.message}
                    required
                    {...register('startDate')}
                  />
                  <Input
                    label="End Date"
                    type="date"
                    error={errors.endDate?.message}
                    required
                    {...register('endDate')}
                  />
                </div>
                <Textarea
                  label="Reason"
                  placeholder="Please provide a brief reason for your leave request..."
                  rows={4}
                  error={errors.reason?.message}
                  required
                  {...register('reason')}
                />
                <Button type="submit" variant="primary" loading={submitting}>
                  Submit Application
                </Button>
              </form>
            </div>
          )}

          {/* Pending Approvals */}
          {activeTab === 'pending' && canApproveLeaves && (
            <Table
              columns={pendingColumns}
              data={displayPending}
              loading={loading}
              emptyMessage="No pending leave requests."
            />
          )}
        </div>
      </Card>

      {/* Reject modal */}
      <Modal
        isOpen={!!rejectId}
        onClose={() => setRejectId(null)}
        title="Reject Leave Request"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRejectId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleReject}>Reject</Button>
          </>
        }
      >
        <Textarea
          label="Reason for Rejection"
          placeholder="Please provide a reason..."
          rows={3}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>
    </div>
  )
}

export default LeavePage
