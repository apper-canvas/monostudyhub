import React from "react"
import { cn } from "@/utils/cn"

const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn("input-field", className)}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = "Input"

export default Input