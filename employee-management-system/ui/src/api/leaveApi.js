import axiosInstance from './axios'

export const leaveApi = {
  getAll: (params) =>
    axiosInstance.get('/leaves', { params }),

  getMyLeaves: (params) =>
    axiosInstance.get('/leaves/my', { params }),

  getById: (id) =>
    axiosInstance.get(`/leaves/${id}`),

  apply: (data) =>
    axiosInstance.post('/leaves', data),

  update: (id, data) =>
    axiosInstance.put(`/leaves/${id}`, data),

  cancel: (id) =>
    axiosInstance.put(`/leaves/${id}/cancel`),

  approve: (id, data) =>
    axiosInstance.put(`/leaves/${id}/approve`, data),

  reject: (id, data) =>
    axiosInstance.put(`/leaves/${id}/reject`, data),

  getPending: () =>
    axiosInstance.get('/leaves/pending'),

  getLeaveTypes: () =>
    axiosInstance.get('/leaves/types'),

  getBalance: (employeeId) =>
    axiosInstance.get(`/leaves/balance/${employeeId}`),
}
