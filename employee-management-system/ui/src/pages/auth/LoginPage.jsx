import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { FaEnvelope, FaLock, FaBriefcase } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { login, selectAuth } from '../../features/auth/authSlice'
import { loginSchema } from '../../utils/validators'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading, error, isAuthenticated } = useSelector(selectAuth)

  const from = location.state?.from?.pathname || '/dashboard'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const onSubmit = async (data) => {
    const result = await dispatch(login(data))
    if (login.fulfilled.match(result)) {
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-700 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <FaBriefcase className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white">EMS Portal</h2>
            <p className="text-indigo-200 text-sm mt-1">Employee Management System</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">Sign in to your account</h3>
            <p className="text-sm text-gray-500 mb-6">Enter your credentials to continue</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Email address"
                type="email"
                leftIcon={FaEnvelope}
                placeholder="you@company.com"
                error={errors.email?.message}
                required
                {...register('email')}
              />

              <Input
                label="Password"
                type="password"
                leftIcon={FaLock}
                placeholder="Enter your password"
                error={errors.password?.message}
                required
                {...register('password')}
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <button type="button" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Demo credentials:{' '}
                <span className="font-medium text-gray-700">admin@ems.com</span> /{' '}
                <span className="font-medium text-gray-700">Admin@123</span>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-indigo-300 text-sm mt-6">
          &copy; {new Date().getFullYear()} EMS. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default LoginPage
