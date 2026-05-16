import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  FaUsers,
  FaCalendarCheck,
  FaCalendarTimes,
  FaClipboardList,
  FaUserPlus,
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { dashboardApi } from '../../api/dashboardApi'
import { StatCard } from '../../components/common/Card'
import Card from '../../components/common/Card'
import BarChartWrapper from '../../components/charts/BarChartWrapper'
import PieChartWrapper from '../../components/charts/PieChartWrapper'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Badge from '../../components/common/Badge'
import { formatDate } from '../../utils/formatters'
import { useAuth } from '../../hooks/useAuth'

// Fallback demo data
const DEMO_STATS = {
  totalEmployees: 248,
  presentToday: 201,
  onLeave: 18,
  pendingApprovals: 12,
}

const DEMO_DEPT_DATA = [
  { name: 'Engineering', count: 72 },
  { name: 'Sales', count: 45 },
  { name: 'HR', count: 18 },
  { name: 'Finance', count: 22 },
  { name: 'Marketing', count: 31 },
  { name: 'Operations', count: 60 },
]

const DEMO_ATTENDANCE_DATA = [
  { name: 'Present', value: 201 },
  { name: 'Absent', value: 18 },
  { name: 'On Leave', value: 18 },
  { name: 'Late', value: 11 },
]

const DEMO_RECENT = [
  { id: 1, type: 'leave', text: 'Ravi Kumar applied for Annual Leave', time: '10 min ago', status: 'PENDING' },
  { id: 2, type: 'employee', text: 'Priya Sharma joined Engineering dept.', time: '1 hr ago', status: 'ACTIVE' },
  { id: 3, type: 'leave', text: "Arjun Mehta's leave request approved", time: '3 hr ago', status: 'APPROVED' },
  { id: 4, type: 'payroll', text: 'May 2025 payroll processed', time: 'Yesterday', status: 'APPROVED' },
  { id: 5, type: 'employee', text: 'Suresh Patel profile updated', time: '2 days ago', status: 'ACTIVE' },
]

const DashboardPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats().then((r) => r.data),
    retry: false,
    staleTime: 60000,
  })

  const { data: deptData } = useQuery({
    queryKey: ['department-headcount'],
    queryFn: () => dashboardApi.getDepartmentHeadcount().then((r) => r.data),
    retry: false,
  })

  const { data: attendanceData } = useQuery({
    queryKey: ['attendance-summary'],
    queryFn: () => dashboardApi.getAttendanceSummary().then((r) => r.data),
    retry: false,
  })

  const stats = statsData || DEMO_STATS
  const departmentChart = deptData || DEMO_DEPT_DATA
  const attendanceChart = attendanceData || DEMO_ATTENDANCE_DATA

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: FaUsers,
      color: 'indigo',
      action: () => navigate('/employees'),
    },
    {
      title: 'Present Today',
      value: stats.presentToday,
      icon: FaCalendarCheck,
      color: 'green',
      action: () => navigate('/attendance'),
    },
    {
      title: 'On Leave',
      value: stats.onLeave,
      icon: FaCalendarTimes,
      color: 'yellow',
      action: () => navigate('/leaves'),
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: FaClipboardList,
      color: 'red',
      action: () => navigate('/leaves'),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <button
          onClick={() => navigate('/employees/new')}
          className="btn-primary gap-2"
        >
          <FaUserPlus className="h-4 w-4" />
          Add Employee
        </button>
      </div>

      {/* Stats cards */}
      {statsLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading statistics..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div
              key={card.title}
              onClick={card.action}
              className="cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <StatCard
                title={card.title}
                value={card.value}
                icon={card.icon}
                color={card.color}
              />
            </div>
          ))}
        </div>
      )}

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Department Headcount" subtitle="Employee distribution by department">
          <BarChartWrapper
            data={departmentChart}
            bars={[{ dataKey: 'count', fill: '#4f46e5', name: 'Employees' }]}
            xAxisKey="name"
            height={260}
          />
        </Card>

        <Card title="Today's Attendance" subtitle="Attendance status breakdown">
          <PieChartWrapper
            data={attendanceChart}
            height={260}
            innerRadius={60}
            colors={['#16a34a', '#dc2626', '#f59e0b', '#f97316']}
          />
        </Card>
      </div>

      {/* Recent activity */}
      <Card title="Recent Activity" subtitle="Latest system events">
        <ul className="divide-y divide-gray-100">
          {DEMO_RECENT.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <FaClipboardList className="h-3.5 w-3.5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-700">{item.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </div>
              <Badge variant={item.status} label={item.status} />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

export default DashboardPage
