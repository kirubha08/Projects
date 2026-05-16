import axiosInstance from './axios'

export const performanceApi = {
  getAll: (params) =>
    axiosInstance.get('/performance', { params }),

  getById: (id) =>
    axiosInstance.get(`/performance/${id}`),

  getByEmployee: (employeeId, params) =>
    axiosInstance.get(`/performance/employee/${employeeId}`, { params }),

  create: (data) =>
    axiosInstance.post('/performance', data),

  update: (id, data) =>
    axiosInstance.put(`/performance/${id}`, data),

  delete: (id) =>
    axiosInstance.delete(`/performance/${id}`),

  getScores: (employeeId) =>
    axiosInstance.get(`/performance/scores/${employeeId}`),
}
