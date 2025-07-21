import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  icon = "FileText", 
  title = "No items found", 
  description = "Get started by adding your first item.", 
  actionLabel = "Add Item", 
  onAction,
  className = "" 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}
    >
      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-primary/60" />
      </div>
      
      <h3 className="font-display font-bold text-xl text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md">
        {description}
      </p>
      
      {onAction && (
        <Button onClick={onAction} className="flex items-center gap-2">
          <ApperIcon name="Plus" className="w-4 h-4" />
          {actionLabel}
        </Button>
      )}
      
      <div className="mt-8 flex items-center gap-6 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <ApperIcon name="Lightbulb" className="w-4 h-4" />
          <span>Pro tip: Use quick add for faster entry</span>
        </div>
      </div>
    </motion.div>
  )
}

export default Empty