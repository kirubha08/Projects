import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FaStar, FaPlus, FaChartLine } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { performanceApi } from '../../api/performanceApi'
import { performanceSchema } from '../../utils/validators'
import { PERFORMANCE_RATINGS } from '../../utils/constants'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import Table from '../../components/common/Table'
import Input, { Select, Textarea } from '../../components/common/Input'
import Modal from '../../components/common/Modal'
import LineChartWrapper from '../../components/charts/LineChartWrapper'
import { formatDate } from '../../utils/formatters'
import { useAuth } from '../../hooks/useAuth'

const DEMO_REVIEWS = [
  { id: 1, employeeName: 'Ravi Kumar', reviewPeriod: 'Q1 2025', rating: 4, achievements: 'Delivered project on time', improvements: 'Communication skills', status: 'COMPLETED', reviewedOn: '2025-04-01' },
  { id: 2, employeeName: 'Priya Sharma', reviewPeriod: 'Q1 2025', rating: 5, achievements: 'Excellent team collaboration', improvements: 'Documentation', status: 'COMPLETED', reviewedOn: '2025-04-02' },
  { id: 3, employeeName: 'Arjun Mehta', reviewPeriod: 'Q1 2025', rating: 3, achievements: 'Met targets', improvements: 'Time management', status: 'COMPLETED', reviewedOn: '2025-04-03' },
]

const DEMO_SCORE_DATA = [
  { name: 'Q1 2024', score: 3.5 },
  { name: 'Q2 2024', score: 3.8 },
  { name: 'Q3 2024', score: 4.0 },
  { name: 'Q4 2024', score: 4.2 },
  { name: 'Q1 2025', score: 4.4 },
]

const StarRating = ({ value }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <FaStar
        key={s}
        className={`h-4 w-4 ${s <= value ? 'text-yellow-400' : 'text-gray-200'}`}
      />
    ))}
  </div>
)

const PerformancePage = () => {
  const { canManageEmployees } = useAuth()
  const [reviews, setReviews] = useState(DEMO_REVIEWS)
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(performanceSchema) })

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    setLoading(true)
    try {
      const res = await performanceApi.getAll()
      if (res.data?.length > 0) setReviews(res.data)
    } catch {
      // Use demo data
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      await performanceApi.create(data)
      toast.success('Performance review submitted!')
      setModalOpen(false)
      reset()
      loadReviews()
    } catch {
      toast.error('Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '—'

  const columns = [
    { title: 'Employee', key: 'employeeName', render: (v) => <span className="font-medium">{v}</span> },
    { title: 'Review Period', key: 'reviewPeriod' },
    { title: 'Rating', key: 'rating', render: (v) => <StarRating value={v} /> },
    { title: 'Achievements', key: 'achievements', render: (v) => <span className="max-w-xs truncate block text-sm">{v || '—'}</span> },
    { title: 'Improvements', key: 'improvements', render: (v) => <span className="max-w-xs truncate block text-sm">{v || '—'}</span> },
    { title: 'Reviewed On', key: 'reviewedOn', render: (v) => formatDate(v) },
    { title: 'Status', key: 'status', render: (v) => <Badge variant={v === 'COMPLETED' ? 'APPROVED' : 'PENDING'} label={v} /> },
  ]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Performance</h1>
          <p className="text-sm text-gray-500 mt-1">Performance reviews and evaluations</p>
        </div>
        {canManageEmployees && (
          <Button variant="primary" icon={FaPlus} onClick={() => setModalOpen(true)}>
            New Review
          </Button>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Average Rating</p>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-3xl font-bold text-gray-900">{avgRating}</p>
            <FaStar className="h-6 w-6 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Total Reviews</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{reviews.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Pending Reviews</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {reviews.filter(r => r.status !== 'COMPLETED').length}
          </p>
        </div>
      </div>

      {/* Score trend */}
      <Card title="Performance Score Trend" subtitle="Average rating across review periods">
        <LineChartWrapper
          data={DEMO_SCORE_DATA}
          lines={[{ dataKey: 'score', stroke: '#4f46e5', name: 'Avg Rating' }]}
          xAxisKey="name"
          height={240}
        />
      </Card>

      {/* Reviews table */}
      <Card title="Review History" noPadding>
        <Table
          columns={columns}
          data={reviews}
          loading={loading}
          emptyMessage="No performance reviews found."
        />
      </Card>

      {/* Add review modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New Performance Review"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" loading={submitting} onClick={handleSubmit(onSubmit)}>
              Submit Review
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Employee ID"
              placeholder="Employee ID"
              error={errors.employeeId?.message}
              required
              {...register('employeeId')}
            />
            <Input
              label="Review Period"
              placeholder="e.g. Q2 2025"
              error={errors.reviewPeriod?.message}
              required
              {...register('reviewPeriod')}
            />
          </div>
          <Select
            label="Rating"
            error={errors.rating?.message}
            required
            {...register('rating')}
          >
            <option value="">Select rating</option>
            {PERFORMANCE_RATINGS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </Select>
          <Textarea
            label="Goals"
            placeholder="Goals set for this period..."
            rows={2}
            {...register('goals')}
          />
          <Textarea
            label="Achievements"
            placeholder="Key achievements during this period..."
            rows={2}
            {...register('achievements')}
          />
          <Textarea
            label="Areas for Improvement"
            placeholder="Areas that need improvement..."
            rows={2}
            {...register('improvements')}
          />
          <Textarea
            label="Comments"
            placeholder="Additional comments..."
            rows={2}
            {...register('comments')}
          />
        </form>
      </Modal>
    </div>
  )
}

export default PerformancePage
