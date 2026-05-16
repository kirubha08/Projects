import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { selectAuth, selectUser, selectIsAuthenticated, logout } from '../features/auth/authSlice'
import { ROLES } from '../utils/constants'

export const useAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const auth = useSelector(selectAuth)
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const hasRole = (role) => {
    if (!user) return false
    if (Array.isArray(user.roles)) {
      return user.roles.includes(role)
    }
    return user.role === role
  }

  const isAdmin = hasRole(ROLES.ADMIN)
  const isHRManager = hasRole(ROLES.HR_MANAGER)
  const isEmployee = hasRole(ROLES.EMPLOYEE)

  const canManageEmployees = isAdmin || isHRManager
  const canApproveLeaves = isAdmin || isHRManager
  const canViewPayroll = isAdmin || isHRManager
  const canManageDepartments = isAdmin

  return {
    user,
    isAuthenticated,
    loading: auth.loading,
    error: auth.error,
    token: auth.token,
    logout: handleLogout,
    hasRole,
    isAdmin,
    isHRManager,
    isEmployee,
    canManageEmployees,
    canApproveLeaves,
    canViewPayroll,
    canManageDepartments,
  }
}
