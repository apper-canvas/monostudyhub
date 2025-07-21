import React from "react"
import { cn } from "@/utils/cn"

const Card = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("bg-white rounded-xl shadow-md border border-gray-100", className)}
      {...props}
    />
  )
})

Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("p-6 pb-4", className)}
      {...props}
    />
  )
})

CardHeader.displayName = "CardHeader"

const CardContent = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("p-6 pt-0", className)}
      {...props}
    />
  )
})

CardContent.displayName = "CardContent"

export { Card, CardHeader, CardContent }