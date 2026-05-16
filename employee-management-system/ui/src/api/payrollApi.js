import axiosInstance from './axios'

export const payrollApi = {
  getAll: (params) =>
    axiosInstance.get('/payroll', { params }),

  getById: (id) =>
    axiosInstance.get(`/payroll/${id}`),

  getByEmployee: (employeeId, params) =>
    axiosInstance.get(`/payroll/employee/${employeeId}`, { params }),

  generate: (data) =>
    axiosInstance.post('/payroll/generate', data),

  downloadPayslip: (id) =>
    axiosInstance.get(`/payroll/${id}/download`, { responseType: 'blob' }),

  getMonthly: (params) =>
    axiosInstance.get('/payroll/monthly', { params }),

  processPayroll: (data) =>
    axiosInstance.post('/payroll/process', data),
}
