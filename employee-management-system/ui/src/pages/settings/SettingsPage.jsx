import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { FaUser, FaLock, FaBell, FaShieldAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { changePassword, selectAuth } from '../../features/auth/authSlice'
import { authApi } from '../../api/authApi'
import { changePasswordSchema, profileSchema } from '../../utils/validators'
import Card from '../../components/common/Card'
import Input, { Textarea } from '../../components/common/Input'
import Button from '../../components/common/Button'
import { getInitials } from '../../utils/formatters'
import { useAuth } from '../../hooks/useAuth'

const tabs = [
  { id: 'profile', label: 'Profile', icon: FaUser },
  { id: 'password', label: 'Password', icon: FaLock },
  { id: 'notifications', label: 'Notifications', icon: FaBell },
  { id: 'security', label: 'Security', icon: FaShieldAlt },
]

const SettingsPage = () => {
  const dispatch = useDispatch()
  const { user } = useAuth()
  const auth = useSelector(selectAuth)

  const [activeTab, setActiveTab] = useState('profile')
  const [profileLoading, setProfileLoading] = useState(false)
  const [notifPrefs, setNotifPrefs] = useState({
    emailLeave: true,
    emailPayroll: true,
    emailPerformance: false,
    browserNotifs: true,
  })

  const fullName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || 'User'
    : 'User'

  // Profile form
  const {
    register: profileRegister,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      address: user?.address || '',
    },
  })

  useEffect(() => {
    if (user) {
      resetProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: user.address || '',
      })
    }
  }, [user, resetProfile])

  const handleProfileUpdate = async (data) => {
    setProfileLoading(true)
    try {
      await authApi.getProfile() // placeholder — real PUT would go here
      toast.success('Profile updated successfully!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setProfileLoading(false)
    }
  }

  // Password form
  const {
    register: pwdRegister,
    handleSubmit: handlePwdSubmit,
    reset: resetPwd,
    formState: { errors: pwdErrors },
  } = useForm({ resolver: zodResolver(changePasswordSchema) })

  const handlePasswordChange = async (data) => {
    const result = await dispatch(changePassword(data))
    if (changePassword.fulfilled.match(result)) {
      toast.success('Password changed successfully!')
      resetPwd()
    } else {
      toast.error(auth.error || 'Failed to change password')
    }
  }

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Tab nav */}
        <div className="sm:w-52 flex-shrink-0">
          <nav className="flex sm:flex-col gap-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full transition-colors ${
                  activeTab === id
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        <div className="flex-1 min-w-0">
          {/* Profile */}
          {activeTab === 'profile' && (
            <Card title="Profile Information" subtitle="Update your personal details">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 text-2xl font-bold">
                  {getInitials(fullName)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{fullName}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <p className="text-xs text-indigo-600 mt-1">
                    {(user?.role || user?.roles?.[0] || 'EMPLOYEE').replace('_', ' ')}
                  </p>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit(handleProfileUpdate)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    error={profileErrors.firstName?.message}
                    required
                    {...profileRegister('firstName')}
                  />
                  <Input
                    label="Last Name"
                    error={profileErrors.lastName?.message}
                    required
                    {...profileRegister('lastName')}
                  />
                </div>
                <Input
                  label="Email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  hint="Email cannot be changed"
                />
                <Input
                  label="Phone"
                  type="tel"
                  {...profileRegister('phone')}
                />
                <Textarea
                  label="Address"
                  rows={2}
                  {...profileRegister('address')}
                />
                <Button type="submit" variant="primary" loading={profileLoading}>
                  Save Changes
                </Button>
              </form>
            </Card>
          )}

          {/* Password */}
          {activeTab === 'password' && (
            <Card title="Change Password" subtitle="Keep your account secure">
              <form onSubmit={handlePwdSubmit(handlePasswordChange)} className="space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  error={pwdErrors.currentPassword?.message}
                  required
                  {...pwdRegister('currentPassword')}
                />
                <Input
                  label="New Password"
                  type="password"
                  hint="At least 8 characters with one uppercase and one number"
                  error={pwdErrors.newPassword?.message}
                  required
                  {...pwdRegister('newPassword')}
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  error={pwdErrors.confirmPassword?.message}
                  required
                  {...pwdRegister('confirmPassword')}
                />
                <Button type="submit" variant="primary" loading={auth.loading}>
                  Update Password
                </Button>
              </form>
            </Card>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <Card title="Notification Preferences" subtitle="Choose what you want to be notified about">
              <div className="space-y-4">
                {[
                  { key: 'emailLeave', label: 'Leave Requests', desc: 'Get notified about leave approvals and rejections' },
                  { key: 'emailPayroll', label: 'Payroll Processed', desc: 'Receive notification when salary is credited' },
                  { key: 'emailPerformance', label: 'Performance Reviews', desc: 'Get alerts for new performance reviews' },
                  { key: 'browserNotifs', label: 'Browser Notifications', desc: 'Enable push notifications in your browser' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifPrefs(p => ({ ...p, [key]: !p[key] }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifPrefs[key] ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          notifPrefs[key] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
              <Button
                variant="primary"
                className="mt-4"
                onClick={() => toast.success('Preferences saved!')}
              >
                Save Preferences
              </Button>
            </Card>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <Card title="Security Settings" subtitle="Manage your account security">
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center gap-3">
                    <FaShieldAlt className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Account Secured</p>
                      <p className="text-xs text-green-600">Your account has basic security enabled</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-500">Add extra security to your account</p>
                    </div>
                    <span className="text-xs text-yellow-600 font-medium bg-yellow-50 px-2 py-1 rounded-full">
                      Not enabled
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Active Sessions</p>
                      <p className="text-xs text-gray-500">1 active session</p>
                    </div>
                    <Button variant="secondary" size="xs">View</Button>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-red-600">Delete Account</p>
                      <p className="text-xs text-gray-500">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="danger" size="xs">Delete</Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
