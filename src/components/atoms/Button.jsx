import React from "react"
import { cn } from "@/utils/cn"

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium transition-all duration-200",
    ghost: "hover:bg-gray-100 text-gray-700 font-medium transition-all duration-200",
    danger: "bg-red-500 hover:bg-red-600 text-white font-medium transition-all duration-200"
  }
  
  const sizes = {
    sm: "px-4 py-2 text-sm rounded-md",
    default: "px-6 py-2.5 rounded-lg",
    lg: "px-8 py-3 text-lg rounded-lg"
  }
  
  return (
    <button
      className={cn(variants[variant], sizes[size], "inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed", className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button