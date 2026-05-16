import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaBars,
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaChevronDown,
} from 'react-icons/fa'
import { useAuth } from '../../hooks/useAuth'
import { getInitials } from '../../utils/formatters'

const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const fullName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || user.email
    : 'User'

  const role = user?.role || (user?.roles && user.roles[0]) || 'EMPLOYEE'

  const handleLogout = () => {
    setDropdownOpen(false)
    logout()
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm z-10 sticky top-0">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left — hamburger on mobile */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <FaBars className="h-5 w-5" />
        </button>

        {/* Page title (breadcrumb area) */}
        <div className="hidden lg:block">
          <p className="text-sm text-gray-500">
            Welcome back, <span className="font-semibold text-gray-800">{fullName}</span>
          </p>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
            <FaBell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {getInitials(fullName)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-800 leading-tight">{fullName}</p>
                <p className="text-xs text-gray-400 leading-tight">{role.replace('_', ' ')}</p>
              </div>
              <FaChevronDown
                className={`h-3 w-3 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">{fullName}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false)
                        navigate('/settings')
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FaCog className="h-4 w-4 text-gray-400" />
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        setDropdownOpen(false)
                        navigate('/settings')
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FaUser className="h-4 w-4 text-gray-400" />
                      Profile
                    </button>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FaSignOutAlt className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
