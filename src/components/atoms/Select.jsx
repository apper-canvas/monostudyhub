import React from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"

const Select = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        className={cn("input-field appearance-none pr-10", className)}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      <ApperIcon 
        name="ChevronDown" 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
      />
    </div>
  )
})

Select.displayName = "Select"

export default Select