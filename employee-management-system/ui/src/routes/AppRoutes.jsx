import { Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'

// Auth Pages
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'

// App Pages
import DashboardPage from '../pages/dashboard/DashboardPage'
import EmployeeListPage from '../pages/employees/EmployeeListPage'
import EmployeeProfilePage from '../pages/employees/EmployeeProfilePage'
import AddEditEmployeePage from '../pages/employees/AddEditEmployeePage'
import DepartmentPage from '../pages/departments/DepartmentPage'
import AttendancePage from '../pages/attendance/AttendancePage'
import LeavePage from '../pages/leaves/LeavePage'
import PayrollPage from '../pages/payroll/PayrollPage'
import PerformancePage from '../pages/performance/PerformancePage'
import ReportsPage from '../pages/reports/ReportsPage'
import SettingsPage from '../pages/settings/SettingsPage'
import AdminPage from '../pages/admin/AdminPage'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/employees"
        element={
          <PrivateRoute>
            <EmployeeListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/employees/new"
        element={
          <PrivateRoute>
            <AddEditEmployeePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/employees/:id/edit"
        element={
          <PrivateRoute>
            <AddEditEmployeePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/employees/:id"
        element={
          <PrivateRoute>
            <EmployeeProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/departments"
        element={
          <PrivateRoute>
            <DepartmentPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <PrivateRoute>
            <AttendancePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/leaves"
        element={
          <PrivateRoute>
            <LeavePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/payroll"
        element={
          <PrivateRoute>
            <PayrollPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/performance"
        element={
          <PrivateRoute>
            <PerformancePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <PrivateRoute>
            <ReportsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <SettingsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminPage />
          </PrivateRoute>
        }
      />

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default AppRoutes
