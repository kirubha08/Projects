import axiosInstance from './axios'

export const dashboardApi = {
  getStats: () =>
    axiosInstance.get('/dashboard/stats'),

  getDepartmentHeadcount: () =>
    axiosInstance.get('/dashboard/department-headcount'),

  getAttendanceSummary: () =>
    axiosInstance.get('/dashboard/attendance-summary'),

  getRecentActivities: () =>
    axiosInstance.get('/dashboard/activities'),

  getPendingApprovals: () =>
    axiosInstance.get('/dashboard/pending-approvals'),
}
