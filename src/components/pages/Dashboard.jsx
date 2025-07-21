import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardContent } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ApperIcon from "@/components/ApperIcon"
import QuickAddModal from "@/components/organisms/QuickAddModal"
import { courseService } from "@/services/api/courseService"
import { assignmentService } from "@/services/api/assignmentService"
import { classService } from "@/services/api/classService"
import { formatDate, getDateLabel, isOverdue, getDaysUntilDue } from "@/utils/dateHelpers"
import { calculateGPA, getLetterGrade, getGradeColor } from "@/utils/gradeHelpers"
import { toast } from "react-toastify"

const Dashboard = () => {
  const [courses, setCourses] = useState([])
  const [assignments, setAssignments] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [coursesData, assignmentsData, classesData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll(),
        classService.getAll()
      ])
      
      setCourses(coursesData)
      setAssignments(assignmentsData)
      setClasses(classesData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
  const handleQuickAdd = async (formData) => {
    try {
      await assignmentService.create(formData)
      await loadData()
      setQuickAddOpen(false)
      toast.success("Assignment added successfully!")
    } catch (err) {
      toast.error("Failed to add assignment")
    }
  }
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />
  
  // Calculate statistics
  const currentGPA = calculateGPA(courses)
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0)
  const upcomingAssignments = assignments
    .filter(a => a.status !== "completed" && getDaysUntilDue(a.dueDate) >= 0 && getDaysUntilDue(a.dueDate) <= 7)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
  const overdueAssignments = assignments.filter(a => isOverdue(a.dueDate) && a.status !== "completed")
  
  // Get today's classes
  const today = new Date().getDay()
  const todaysClasses = classes
    .filter(cls => cls.dayOfWeek === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your studies today.
          </p>
        </div>
        
        <Button onClick={() => setQuickAddOpen(true)}>
          <ApperIcon name="Plus" className="w-4 h-4" />
          Quick Add
        </Button>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current GPA</p>
                  <p className={`text-2xl font-bold ${getGradeColor(currentGPA * 25)}`}>
                    {currentGPA.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {totalCredits} total credits
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
                  <ApperIcon name="TrendingUp" className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                  <p className="text-xs text-gray-500">
                    Fall 2024 semester
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-full flex items-center justify-center">
                  <ApperIcon name="BookOpen" className="w-6 h-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Due This Week</p>
                  <p className="text-2xl font-bold text-gray-900">{upcomingAssignments.length}</p>
                  {overdueAssignments.length > 0 && (
                    <p className="text-xs text-red-600">
                      {overdueAssignments.length} overdue
                    </p>
                  )}
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-accent/10 to-warning/10 rounded-full flex items-center justify-center">
                  <ApperIcon name="Clock" className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Classes Today</p>
                  <p className="text-2xl font-bold text-gray-900">{todaysClasses.length}</p>
                  <p className="text-xs text-gray-500">
                    {new Date().toLocaleDateString("en-US", { weekday: "long" })}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-success/10 to-info/10 rounded-full flex items-center justify-center">
                  <ApperIcon name="Calendar" className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-lg text-gray-900">
                  Today's Schedule
                </h2>
                <ApperIcon name="Calendar" className="w-5 h-5 text-gray-500" />
              </div>
            </CardHeader>
            <CardContent>
              {todaysClasses.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="Coffee" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No classes today!</p>
                  <p className="text-sm text-gray-400">Time to catch up on assignments</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todaysClasses.map((cls) => {
                    const course = courses.find(c => c.Id === cls.courseId)
                    return (
                      <div key={cls.Id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div 
                          className="w-1 h-12 rounded-full"
                          style={{ backgroundColor: course?.color || "#6B7280" }}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{course?.code}</h4>
                          <p className="text-sm text-gray-600">{course?.name}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            <span>{cls.startTime} - {cls.endTime}</span>
                            <span>{cls.location}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Upcoming Assignments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-lg text-gray-900">
                  Upcoming Assignments
                </h2>
                <Badge variant="default">
                  {upcomingAssignments.length} due soon
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {upcomingAssignments.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="CheckCircle" className="w-12 h-12 text-green-300 mx-auto mb-3" />
                  <p className="text-gray-500">All caught up!</p>
                  <p className="text-sm text-gray-400">No assignments due this week</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingAssignments.slice(0, 5).map((assignment) => {
                    const course = courses.find(c => c.Id === assignment.courseId)
                    const overdue = isOverdue(assignment.dueDate)
                    const daysUntil = getDaysUntilDue(assignment.dueDate)
                    
                    return (
                      <div 
                        key={assignment.Id} 
                        className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                          overdue ? "bg-red-50 border-red-200" : "bg-white border-gray-200"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {course && (
                                <div 
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: course.color }}
                                />
                              )}
                              <span className="text-sm font-medium text-gray-600">
                                {course?.code}
                              </span>
                            </div>
                            <h4 className={`font-medium mb-1 ${
                              overdue ? "text-red-700" : "text-gray-900"
                            }`}>
                              {assignment.title}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className={overdue ? "text-red-600" : ""}>
                                {getDateLabel(assignment.dueDate)} • {formatDate(assignment.dueDate)}
                              </span>
                              {daysUntil >= 0 && (
                                <Badge variant={
                                  overdue ? "error" : 
                                  daysUntil <= 1 ? "warning" : 
                                  "default"
                                }>
                                  {overdue ? "Overdue" : `${daysUntil} days left`}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <Badge variant={assignment.priority === "high" ? "high" : 
                                        assignment.priority === "medium" ? "medium" : "low"}>
                            {assignment.priority}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                  
                  {upcomingAssignments.length > 5 && (
                    <div className="text-center pt-4">
                      <Button variant="ghost" size="sm">
                        View all assignments
                        <ApperIcon name="ArrowRight" className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Course Performance Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-gray-900">
                Course Performance
              </h2>
              <Button variant="ghost" size="sm">
                View Details
                <ApperIcon name="ExternalLink" className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {courses.map((course) => {
                const courseAssignments = assignments.filter(a => a.courseId === course.Id)
                const completedCount = courseAssignments.filter(a => a.status === "completed").length
                const totalCount = courseAssignments.length
                const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0
                
                return (
                  <div key={course.Id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: course.color }}
                      />
                      <h4 className="font-medium text-gray-900 text-sm">
                        {course.code}
                      </h4>
                    </div>
                    
                    {course.currentGrade !== null ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Grade</span>
                          <span className={`font-bold text-sm ${getGradeColor(course.currentGrade)}`}>
                            {course.currentGrade.toFixed(1)}%
                          </span>
                        </div>
                        <Badge variant="default" className="text-xs">
                          {getLetterGrade(course.currentGrade)}
                        </Badge>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Progress</span>
                          <span className="font-bold text-sm text-gray-900">
                            {Math.round(completionRate)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="h-1.5 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${completionRate}%`,
                              backgroundColor: course.color
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <QuickAddModal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        onSubmit={handleQuickAdd}
        courses={courses}
      />
    </div>
  )
}

export default Dashboard