import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import employeeReducer from '../features/employees/employeeSlice'
import departmentReducer from '../features/departments/departmentSlice'
import attendanceReducer from '../features/attendance/attendanceSlice'
import leaveReducer from '../features/leaves/leaveSlice'
import payrollReducer from '../features/payroll/payrollSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    departments: departmentReducer,
    attendance: attendanceReducer,
    leaves: leaveReducer,
    payroll: payrollReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/loginSuccess'],
      },
    }),
})
