import axiosInstance from './axios'

export const departmentApi = {
  getAll: (params) =>
    axiosInstance.get('/departments', { params }),

  getById: (id) =>
    axiosInstance.get(`/departments/${id}`),

  create: (data) =>
    axiosInstance.post('/departments', data),

  update: (id, data) =>
    axiosInstance.put(`/departments/${id}`, data),

  delete: (id) =>
    axiosInstance.delete(`/departments/${id}`),

  getEmployees: (id) =>
    axiosInstance.get(`/departments/${id}/employees`),
}
