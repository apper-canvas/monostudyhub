import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import ApperIcon from "@/components/ApperIcon"

const QuickAddModal = ({ isOpen, onClose, onSubmit, courses = [], type = "assignment" }) => {
  const [formData, setFormData] = useState({
    title: "",
    courseId: "",
    dueDate: "",
    priority: "medium",
    description: ""
  })
  
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      title: "",
      courseId: "",
      dueDate: "",
      priority: "medium",
      description: ""
    })
  }
  
  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }
  
  const courseOptions = courses.map(course => ({
    value: course.Id,
    label: `${course.code} - ${course.name}`
  }))
  
  const priorityOptions = [
    { value: "low", label: "Low Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "high", label: "High Priority" }
  ]
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="font-display font-bold text-xl text-gray-900">
                  Quick Add {type === "assignment" ? "Assignment" : "Task"}
                </h2>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <ApperIcon name="X" className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <FormField
                  label="Title"
                  value={formData.title}
                  onChange={handleChange("title")}
                  placeholder="Assignment title..."
                  required
                />
                
                <FormField
                  label="Course"
                  type="select"
                  value={formData.courseId}
                  onChange={handleChange("courseId")}
                  options={courseOptions}
                  placeholder="Select a course"
                  required
                />
                
                <FormField
                  label="Due Date"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange("dueDate")}
                  required
                />
                
                <FormField
                  label="Priority"
                  type="select"
                  value={formData.priority}
                  onChange={handleChange("priority")}
                  options={priorityOptions}
                />
                
                <FormField
                  label="Description"
                  type="textarea"
                  value={formData.description}
                  onChange={handleChange("description")}
                  placeholder="Optional description..."
                />
                
                {/* Actions */}
                <div className="flex items-center gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    <ApperIcon name="Plus" className="w-4 h-4" />
                    Add {type === "assignment" ? "Assignment" : "Task"}
                  </Button>
                  <Button type="button" variant="secondary" onClick={onClose}>
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default QuickAddModal