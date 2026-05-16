import axiosInstance from './axios'

export const employeeApi = {
  getAll: (params) =>
    axiosInstance.get('/employees', { params }),

  getById: (id) =>
    axiosInstance.get(`/employees/${id}`),

  create: (data) =>
    axiosInstance.post('/employees', data),

  update: (id, data) =>
    axiosInstance.put(`/employees/${id}`, data),

  delete: (id) =>
    axiosInstance.delete(`/employees/${id}`),

  search: (query) =>
    axiosInstance.get('/employees/search', { params: { q: query } }),

  getDocuments: (id) =>
    axiosInstance.get(`/employees/${id}/documents`),

  uploadDocument: (id, formData) =>
    axiosInstance.post(`/employees/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteDocument: (employeeId, docId) =>
    axiosInstance.delete(`/employees/${employeeId}/documents/${docId}`),

  getPayslips: (id, params) =>
    axiosInstance.get(`/employees/${id}/payslips`, { params }),
}
