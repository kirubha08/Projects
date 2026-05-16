import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '../features/auth/authSlice'
import Layout from '../components/layout/Layout'

const PrivateRoute = ({ children, roles }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Layout>{children}</Layout>
}

export default PrivateRoute
