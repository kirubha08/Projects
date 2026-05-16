import axiosInstance from './axios'

export const attendanceApi = {
  getAll: (params) =>
    axiosInstance.get('/attendance', { params }),

  getByEmployee: (employeeId, params) =>
    axiosInstance.get(`/attendance/employee/${employeeId}`, { params }),

  getMonthly: (params) =>
    axiosInstance.get('/attendance/monthly', { params }),

  checkIn: (data) =>
    axiosInstance.post('/attendance/check-in', data),

  checkOut: (data) =>
    axiosInstance.post('/attendance/check-out', data),

  update: (id, data) =>
    axiosInstance.put(`/attendance/${id}`, data),

  getToday: () =>
    axiosInstance.get('/attendance/today'),

  getSummary: (params) =>
    axiosInstance.get('/attendance/summary', { params }),
}
