import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardContent } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import FormField from "@/components/molecules/FormField"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { courseService } from "@/services/api/courseService"
import { assignmentService } from "@/services/api/assignmentService"
import { calculateGPA, getLetterGrade, getGradeColor, calculateCourseGrade } from "@/utils/gradeHelpers"
import { toast } from "react-toastify"

const Grades = () => {
  const [courses, setCourses] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showGradeForm, setShowGradeForm] = useState(false)
  const [gradeFormData, setGradeFormData] = useState({
    assignmentId: "",
    grade: ""
  })
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [coursesData, assignmentsData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll()
      ])
      
      // Update course grades based on assignments
      const updatedCourses = coursesData.map(course => {
        const courseAssignments = assignmentsData.filter(a => a.courseId === course.Id)
        const calculatedGrade = calculateCourseGrade(courseAssignments, course.gradeCategories)
        return { ...course, currentGrade: calculatedGrade }
      })
      
      setCourses(updatedCourses)
      setAssignments(assignmentsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadData()
  }, [])
  
  const handleAddGrade = async (e) => {
    e.preventDefault()
    
    try {
      await assignmentService.update(parseInt(gradeFormData.assignmentId), {
        grade: parseFloat(gradeFormData.grade)
      })
      
      await loadData()
      setShowGradeForm(false)
      setGradeFormData({ assignmentId: "", grade: "" })
      toast.success("Grade added successfully!")
    } catch (err) {
      toast.error("Failed to add grade")
    }
  }
  
  const currentGPA = calculateGPA(courses)
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0)
  const completedCourses = courses.filter(course => course.currentGrade !== null)
  
  // Get ungraded assignments for the form
  const ungradedAssignments = assignments
    .filter(a => a.grade === null && a.status === "completed")
    .map(a => {
      const course = courses.find(c => c.Id === a.courseId)
      return {
        value: a.Id.toString(),
        label: `${course?.code} - ${a.title}`
      }
    })
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-gray-900 mb-2">
            Grades & Performance
          </h1>
          <p className="text-gray-600">
            Track your academic performance and calculate your GPA.
          </p>
        </div>
        
        <Button 
          onClick={() => setShowGradeForm(true)}
          disabled={ungradedAssignments.length === 0}
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          Add Grade
        </Button>
      </div>
      
      {/* Add Grade Form */}
      {showGradeForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-xl text-gray-900">
              Add Grade
            </h2>
            <Button variant="ghost" onClick={() => setShowGradeForm(false)}>
              <ApperIcon name="X" className="w-5 h-5" />
            </Button>
          </div>
          
          <form onSubmit={handleAddGrade} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Assignment"
              type="select"
              value={gradeFormData.assignmentId}
              onChange={(e) => setGradeFormData(prev => ({ ...prev, assignmentId: e.target.value }))}
              options={ungradedAssignments}
              placeholder="Select completed assignment"
              required
            />
            
            <FormField
              label="Grade (%)"
              type="number"
              value={gradeFormData.grade}
              onChange={(e) => setGradeFormData(prev => ({ ...prev, grade: e.target.value }))}
              placeholder="e.g., 95"
              min="0"
              max="100"
              step="0.1"
              required
            />
            
            <div className="md:col-span-2 flex items-center gap-3 pt-4">
              <Button type="submit">
                <ApperIcon name="Save" className="w-4 h-4" />
                Add Grade
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowGradeForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      )}
      
      {/* GPA Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <div className={`text-4xl font-bold ${getGradeColor(currentGPA * 25)} mb-2`}>
                  {currentGPA.toFixed(2)}
                </div>
                <p className="text-sm text-gray-600">Current GPA</p>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-20 h-20 relative">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-primary"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${(currentGPA / 4) * 100}, 100`}
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs text-gray-600">
                      {Math.round((currentGPA / 4) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {totalCredits}
                </div>
                <p className="text-sm text-gray-600">Total Credits</p>
              </div>
              <div className="text-xs text-gray-500">
                Fall 2024 Semester
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {completedCourses.length}/{courses.length}
                </div>
                <p className="text-sm text-gray-600">Courses Graded</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${courses.length > 0 ? (completedCourses.length / courses.length) * 100 : 0}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Course Grades */}
      {courses.length === 0 ? (
        <Empty
          icon="TrendingUp"
          title="No courses found"
          description="Add some courses to start tracking your grades."
          actionLabel="Go to Courses"
          onAction={() => window.location.href = "/courses"}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {courses.map((course, index) => {
            const courseAssignments = assignments.filter(a => a.courseId === course.Id)
            const gradedAssignments = courseAssignments.filter(a => a.grade !== null)
            const avgGrade = gradedAssignments.length > 0 
              ? gradedAssignments.reduce((sum, a) => sum + a.grade, 0) / gradedAssignments.length 
              : null
            
            return (
              <motion.div
                key={course.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="card-hover cursor-pointer" onClick={() => setSelectedCourse(selectedCourse?.Id === course.Id ? null : course)}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div 
                            className="w-1 h-12 rounded-full"
                            style={{ backgroundColor: course.color }}
                          />
                          <div>
                            <h3 className="font-display font-bold text-lg text-gray-900">
                              {course.code}
                            </h3>
                            <p className="text-sm text-gray-600">{course.name}</p>
                          </div>
                        </div>
                      </div>
                      
                      {course.currentGrade !== null ? (
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getGradeColor(course.currentGrade)}`}>
                            {course.currentGrade.toFixed(1)}%
                          </div>
                          <Badge variant="default" className="text-xs">
                            {getLetterGrade(course.currentGrade)}
                          </Badge>
                        </div>
                      ) : (
                        <div className="text-right">
                          <div className="text-xl font-medium text-gray-400">
                            No Grade
                          </div>
                          <Badge variant="default" className="text-xs">
                            Pending
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Credits:</span>
                        <span className="font-medium">{course.credits}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Assignments Graded:</span>
                        <span className="font-medium">{gradedAssignments.length}/{courseAssignments.length}</span>
                      </div>
                      
                      {avgGrade !== null && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Average Score:</span>
                          <span className={`font-medium ${getGradeColor(avgGrade)}`}>
                            {avgGrade.toFixed(1)}%
                          </span>
                        </div>
                      )}
                      
                      <div className="pt-2">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span>
                          <span>{courseAssignments.length > 0 ? Math.round((gradedAssignments.length / courseAssignments.length) * 100) : 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="h-1.5 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${courseAssignments.length > 0 ? (gradedAssignments.length / courseAssignments.length) * 100 : 0}%`,
                              backgroundColor: course.color
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Expanded View */}
                    {selectedCourse?.Id === course.Id && gradedAssignments.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-200"
                      >
                        <h4 className="font-medium text-gray-900 mb-3">Recent Grades</h4>
                        <div className="space-y-2">
                          {gradedAssignments.slice(-5).map((assignment) => (
                            <div key={assignment.Id} className="flex items-center justify-between text-sm">
                              <span className="text-gray-700 truncate flex-1">
                                {assignment.title}
                              </span>
                              <div className="flex items-center gap-2 ml-4">
                                <Badge variant={assignment.grade >= 90 ? "success" : assignment.grade >= 80 ? "primary" : assignment.grade >= 70 ? "warning" : "error"}>
                                  {assignment.grade}%
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Grades