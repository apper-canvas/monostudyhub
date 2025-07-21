import { motion } from "framer-motion"
import { Card, CardHeader, CardContent } from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { getLetterGrade, getGradeColor } from "@/utils/gradeHelpers"

const CourseCard = ({ course, assignments = [], onEdit, onDelete }) => {
  const courseAssignments = assignments.filter(a => a.courseId === course.Id)
  const completedCount = courseAssignments.filter(a => a.status === "completed").length
  const upcomingCount = courseAssignments.filter(a => a.status === "pending").length
  
  const completionPercentage = courseAssignments.length > 0 
    ? (completedCount / courseAssignments.length) * 100 
    : 0
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="card-hover relative overflow-hidden group">
        {/* Course Color Strip */}
        <div 
          className="absolute left-0 top-0 w-1 h-full"
          style={{ backgroundColor: course.color }}
        />
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-display font-bold text-lg text-gray-900 mb-1">
                {course.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{course.code}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <ApperIcon name="User" className="w-4 h-4" />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ApperIcon name="Clock" className="w-4 h-4" />
                  <span>{course.credits} credits</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button variant="ghost" size="sm" onClick={() => onEdit(course)}>
                <ApperIcon name="Edit" className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(course.Id)}>
                <ApperIcon name="Trash2" className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {/* Grade Display */}
          {course.currentGrade !== null && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Current Grade</span>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-lg ${getGradeColor(course.currentGrade)}`}>
                    {course.currentGrade.toFixed(1)}%
                  </span>
                  <Badge variant="default" className="text-xs">
                    {getLetterGrade(course.currentGrade)}
                  </Badge>
                </div>
              </div>
              
              {/* Grade Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min(course.currentGrade, 100)}%`,
                    backgroundColor: course.color
                  }}
                />
              </div>
            </div>
          )}
          
          {/* Assignment Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-bold text-lg text-gray-900">{completedCount}</div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-bold text-lg text-gray-900">{upcomingCount}</div>
              <div className="text-xs text-gray-600">Upcoming</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          {courseAssignments.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Progress</span>
                <span className="text-xs text-gray-600">{Math.round(completionPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${completionPercentage}%`,
                    backgroundColor: course.color
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default CourseCard