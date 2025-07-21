import { NavLink } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"

const Sidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Courses", href: "/courses", icon: "BookOpen" },
    { name: "Assignments", href: "/assignments", icon: "FileText" },
    { name: "Schedule", href: "/schedule", icon: "Calendar" },
    { name: "Grades", href: "/grades", icon: "TrendingUp" },
  ]

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:block w-64 bg-white border-r border-gray-200 h-screen">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="GraduationCap" className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-display font-bold text-xl gradient-text">
            StudyHub
          </h1>
        </div>
        
        <nav className="space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <ApperIcon
                    name={item.icon}
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"
                    }`}
                  />
                  <span className="font-medium">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )

  // Mobile Sidebar Overlay
  const MobileSidebar = () => (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="lg:hidden fixed top-0 left-0 w-64 h-full bg-white shadow-xl z-50"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="GraduationCap" className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-display font-bold text-xl gradient-text">
                StudyHub
              </h1>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <nav className="space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <ApperIcon
                      name={item.icon}
                      className={`w-5 h-5 transition-colors duration-200 ${
                        isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"
                      }`}
                    />
                    <span className="font-medium">{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </motion.div>
    </>
  )

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  )
}

export default Sidebar