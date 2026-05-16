const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} EMS — Employee Management System. All rights reserved.
        </p>
        <p className="text-xs text-gray-400">v1.0.0</p>
      </div>
    </footer>
  )
}

export default Footer
