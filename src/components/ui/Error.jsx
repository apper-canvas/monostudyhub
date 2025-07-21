import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ message = "Something went wrong", onRetry, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}
    >
      <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-600" />
      </div>
      
      <h3 className="font-display font-bold text-lg text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message}. Please try again or contact support if the problem persists.
      </p>
      
      <div className="flex items-center gap-3">
        {onRetry && (
          <Button onClick={onRetry} className="flex items-center gap-2">
            <ApperIcon name="RefreshCw" className="w-4 h-4" />
            Try Again
          </Button>
        )}
        
        <Button variant="ghost" onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      </div>
    </motion.div>
  )
}

export default Error