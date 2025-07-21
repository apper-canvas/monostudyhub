import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { formatDate, getDateLabel, isOverdue, getDaysUntilDue } from "@/utils/dateHelpers"

const AssignmentList = ({ 
  assignments = [], 
  courses = [], 
  onEdit, 
  onDelete, 
  onToggleComplete 
}) => {
  const [sortBy, setSortBy] = useState("dueDate")
  const [sortOrder, setSortOrder] = useState("asc")
  
  const getCourse = (courseId) => courses.find(c => c.Id === courseId)
  
  const sortedAssignments = [...assignments].sort((a, b) => {
    let aValue, bValue
    
    switch (sortBy) {
      case "dueDate":
        aValue = new Date(a.dueDate)
        bValue = new Date(b.dueDate)
        break
      case "course":
        aValue = getCourse(a.courseId)?.name || ""
        bValue = getCourse(b.courseId)?.name || ""
        break
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        aValue = priorityOrder[a.priority]
        bValue = priorityOrder[b.priority]
        break
      case "status":
        aValue = a.status
        bValue = b.status
        break
      default:
        aValue = a.title
        bValue = b.title
    }
    
    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
    return 0
  })
  
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }
  
  const SortButton = ({ field, children }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="text-xs text-gray-600 hover:text-gray-900 p-1"
    >
      <span>{children}</span>
      {sortBy === field && (
        <ApperIcon 
          name={sortOrder === "asc" ? "ChevronUp" : "ChevronDown"} 
          className="w-3 h-3 ml-1" 
        />
      )}
    </Button>
  )
  
  const getStatusVariant = (status) => {
    switch (status) {
      case "completed": return "success"
      case "in-progress": return "warning"
      default: return "default"
    }
  }
  
  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "high": return "high"
      case "medium": return "medium"
      default: return "low"
    }
  }
  
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="grid grid-cols-12 gap-4 items-center text-sm font-medium text-gray-700">
          <div className="col-span-4">
            <SortButton field="title">Assignment</SortButton>
          </div>
          <div className="col-span-2">
            <SortButton field="course">Course</SortButton>
          </div>
          <div className="col-span-2">
            <SortButton field="dueDate">Due Date</SortButton>
          </div>
          <div className="col-span-1">
            <SortButton field="priority">Priority</SortButton>
          </div>
          <div className="col-span-1">
            <SortButton field="status">Status</SortButton>
          </div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
      </div>
      
      {/* Table Body */}
      <div className="divide-y divide-gray-100">
        <AnimatePresence>
          {sortedAssignments.map((assignment) => {
            const course = getCourse(assignment.courseId)
            const overdue = isOverdue(assignment.dueDate) && assignment.status !== "completed"
            const daysUntil = getDaysUntilDue(assignment.dueDate)
            
            return (
              <motion.div
                key={assignment.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className={`px-6 py-4 hover:bg-gray-50 transition-colors duration-200 ${
                  overdue ? "bg-red-50" : ""
                }`}
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Assignment Title */}
                  <div className="col-span-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onToggleComplete(assignment)}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          assignment.status === "completed"
                            ? "bg-green-500 border-green-500"
                            : "border-gray-300 hover:border-green-400"
                        }`}
                      >
                        {assignment.status === "completed" && (
                          <ApperIcon name="Check" className="w-3 h-3 text-white" />
                        )}
                      </button>
                      <div>
                        <h4 className={`font-medium text-gray-900 ${
                          assignment.status === "completed" ? "line-through text-gray-500" : ""
                        }`}>
                          {assignment.title}
                        </h4>
                        {assignment.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {assignment.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Course */}
                  <div className="col-span-2">
                    {course && (
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: course.color }}
                        />
                        <span className="text-sm text-gray-700 font-medium">
                          {course.code}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Due Date */}
                  <div className="col-span-2">
                    <div className="text-sm">
                      <div className={`font-medium ${overdue ? "text-red-600" : "text-gray-900"}`}>
                        {getDateLabel(assignment.dueDate)}
                      </div>
                      <div className="text-gray-500">
                        {formatDate(assignment.dueDate)}
                      </div>
                      {daysUntil >= 0 && daysUntil <= 7 && assignment.status !== "completed" && (
                        <div className={`text-xs ${overdue ? "text-red-600" : "text-orange-600"}`}>
                          {overdue ? "Overdue" : `${daysUntil} days left`}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Priority */}
                  <div className="col-span-1">
                    <Badge variant={getPriorityVariant(assignment.priority)}>
                      {assignment.priority}
                    </Badge>
                  </div>
                  
                  {/* Status */}
                  <div className="col-span-1">
                    <Badge variant={getStatusVariant(assignment.status)}>
                      {assignment.status}
                    </Badge>
                  </div>
                  
                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onEdit(assignment)}
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onDelete(assignment.Id)}
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default AssignmentList