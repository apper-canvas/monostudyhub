import { useState } from "react"
import Button from "@/components/atoms/Button"

const COURSE_COLORS = [
  "#EF4444", "#F97316", "#F59E0B", "#EAB308",
  "#84CC16", "#22C55E", "#10B981", "#14B8A6",
  "#06B6D4", "#0EA5E9", "#3B82F6", "#6366F1",
  "#8B5CF6", "#A855F7", "#C026D3", "#EC4899"
]

const CourseColorPicker = ({ selectedColor, onColorChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-start gap-3"
      >
        <div 
          className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
          style={{ backgroundColor: selectedColor }}
        />
        Course Color
      </Button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-3 bg-white rounded-lg shadow-lg border z-10">
          <div className="grid grid-cols-8 gap-2">
            {COURSE_COLORS.map((color) => (
              <button
                key={color}
                className={`w-6 h-6 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                  selectedColor === color 
                    ? "border-gray-400 shadow-md" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => {
                  onColorChange(color)
                  setIsOpen(false)
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseColorPicker