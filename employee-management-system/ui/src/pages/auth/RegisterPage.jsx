import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { FaUser, FaEnvelope, FaLock, FaBriefcase } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { authApi } from '../../api/authApi'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { useState } from 'react'

const registerSchema = z
  .object({
    firstName: z.string().min(1, 'First name required'),
    lastName: z.string().min(1, 'Last name required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'At least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

const RegisterPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await authApi.register(data)
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                <FaBriefcase className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
            <p className="text-indigo-200 text-sm mt-1">Employee Management System</p>
          </div>

          <div className="px-8 py-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="John"
                  leftIcon={FaUser}
                  error={errors.firstName?.message}
                  required
                  {...register('firstName')}
                />
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  error={errors.lastName?.message}
                  required
                  {...register('lastName')}
                />
              </div>
              <Input
                label="Email"
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
                placeholder="Min. 8 characters"
                error={errors.password?.message}
                required
                {...register('password')}
              />
              <Input
                label="Confirm Password"
                type="password"
                leftIcon={FaLock}
                placeholder="Re-enter password"
                error={errors.confirmPassword?.message}
                required
                {...register('confirmPassword')}
              />

              <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
                Create Account
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
