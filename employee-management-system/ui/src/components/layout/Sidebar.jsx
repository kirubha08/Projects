import { NavLink, useLocation } from 'react-router-dom'
import {
  FaHome,
  FaUsers,
  FaBuilding,
  FaCalendarCheck,
  FaCalendarTimes,
  FaMoneyBillWave,
  FaChartLine,
  FaFileAlt,
  FaCog,
  FaShieldAlt,
  FaTimes,
  FaBriefcase,
} from 'react-icons/fa'
import { useAuth } from '../../hooks/useAuth'

const navItems = [
  { to: '/dashboard', icon: FaHome, label: 'Dashboard' },
  { to: '/employees', icon: FaUsers, label: 'Employees' },
  { to: '/departments', icon: FaBuilding, label: 'Departments' },
  { to: '/attendance', icon: FaCalendarCheck, label: 'Attendance' },
  { to: '/leaves', icon: FaCalendarTimes, label: 'Leave' },
  { to: '/payroll', icon: FaMoneyBillWave, label: 'Payroll' },
  { to: '/performance', icon: FaChartLine, label: 'Performance' },
  { to: '/reports', icon: FaFileAlt, label: 'Reports' },
  { to: '/settings', icon: FaCog, label: 'Settings' },
]

const adminItems = [
  { to: '/admin', icon: FaShieldAlt, label: 'Admin Panel' },
]

const Sidebar = ({ isOpen, onClose }) => {
  const { isAdmin } = useAuth()
  const location = useLocation()

  const allItems = [...navItems, ...(isAdmin ? adminItems : [])]

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-64 bg-indigo-900 flex flex-col
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-indigo-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-400 rounded-lg flex items-center justify-center">
              <FaBriefcase className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-base leading-tight">EMS</h1>
              <p className="text-indigo-300 text-xs">Employee Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-indigo-300 hover:text-white p-1"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {allItems.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-700 text-white'
                        : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-indigo-800">
          <p className="text-indigo-400 text-xs text-center">
            EMS v1.0.0 &copy; {new Date().getFullYear()}
          </p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
