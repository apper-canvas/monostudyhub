import { useState } from "react"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { format } from "date-fns"

const Header = ({ onMenuClick, title = "" }) => {
  const [currentTime, setCurrentTime] = useState(new Date())
  
  // Update time every minute
  useState(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])
  
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden p-2"
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </Button>
          
          {title && (
            <h1 className="font-display font-bold text-2xl text-gray-900">
              {title}
            </h1>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
            <ApperIcon name="Clock" className="w-4 h-4" />
            <span>{format(currentTime, "MMM dd, yyyy")}</span>
            <span className="text-gray-400">•</span>
            <span>{format(currentTime, "h:mm a")}</span>
          </div>
          
          <Button variant="ghost" size="sm" className="p-2">
            <ApperIcon name="Bell" className="w-5 h-5" />
          </Button>
          
          <Button variant="ghost" size="sm" className="p-2">
            <ApperIcon name="Settings" className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header