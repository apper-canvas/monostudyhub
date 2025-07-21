import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import CourseColorPicker from "@/components/molecules/CourseColorPicker"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import CourseCard from "@/components/organisms/CourseCard"
import ApperIcon from "@/components/ApperIcon"
import { courseService } from "@/services/api/courseService"
import { assignmentService } from "@/services/api/assignmentService"
import { toast } from "react-toastify"

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    instructor: "",
    credits: "",
    color: "#4F46E5",
    semester: "Fall 2024"
  })
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [coursesData, assignmentsData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll()
      ])
      
      setCourses(coursesData)
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
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const courseData = {
        ...formData,
        credits: parseInt(formData.credits)
      }
      
      if (editingCourse) {
        await courseService.update(editingCourse.Id, courseData)
        toast.success("Course updated successfully!")
      } else {
        await courseService.create(courseData)
        toast.success("Course created successfully!")
      }
      
      await loadData()
      resetForm()
    } catch (err) {
      toast.error(`Failed to ${editingCourse ? "update" : "create"} course`)
    }
  }
  
  const handleEdit = (course) => {
    setEditingCourse(course)
    setFormData({
      name: course.name,
      code: course.code,
      instructor: course.instructor,
      credits: course.credits.toString(),
      color: course.color,
      semester: course.semester
    })
    setShowAddForm(true)
  }
  
  const handleDelete = async (courseId) => {
    if (!confirm("Are you sure you want to delete this course? This will also remove all associated assignments.")) {
      return
    }
    
    try {
      await courseService.delete(courseId)
      toast.success("Course deleted successfully!")
      await loadData()
    } catch (err) {
      toast.error("Failed to delete course")
    }
  }
  
  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      instructor: "",
      credits: "",
      color: "#4F46E5",
      semester: "Fall 2024"
    })
    setEditingCourse(null)
    setShowAddForm(false)
  }
  
  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-gray-900 mb-2">
            My Courses
          </h1>
          <p className="text-gray-600">
            Manage your course schedule and track your academic progress.
          </p>
        </div>
        
        <Button onClick={() => setShowAddForm(true)}>
          <ApperIcon name="Plus" className="w-4 h-4" />
          Add Course
        </Button>
      </div>
      
      {/* Add/Edit Course Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-xl text-gray-900">
              {editingCourse ? "Edit Course" : "Add New Course"}
            </h2>
            <Button variant="ghost" onClick={resetForm}>
              <ApperIcon name="X" className="w-5 h-5" />
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Course Name"
              value={formData.name}
              onChange={handleChange("name")}
              placeholder="e.g., Data Structures and Algorithms"
              required
            />
            
            <FormField
              label="Course Code"
              value={formData.code}
              onChange={handleChange("code")}
              placeholder="e.g., CS 201"
              required
            />
            
            <FormField
              label="Instructor"
              value={formData.instructor}
              onChange={handleChange("instructor")}
              placeholder="e.g., Dr. Sarah Johnson"
              required
            />
            
            <FormField
              label="Credits"
              type="number"
              value={formData.credits}
              onChange={handleChange("credits")}
              placeholder="e.g., 3"
              required
              min="1"
              max="6"
            />
            
            <FormField
              label="Semester"
              type="select"
              value={formData.semester}
              onChange={handleChange("semester")}
              options={[
                { value: "Fall 2024", label: "Fall 2024" },
                { value: "Spring 2025", label: "Spring 2025" },
                { value: "Summer 2025", label: "Summer 2025" }
              ]}
              required
            />
            
            <CourseColorPicker
              selectedColor={formData.color}
              onColorChange={(color) => setFormData(prev => ({ ...prev, color }))}
              className="md:col-span-1"
/>
            
            <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 w-full">
              <Button 
                type="submit" 
                className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 px-6 py-3"
              >
                <ApperIcon name={editingCourse ? "Save" : "Plus"} className="w-4 h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">
                  {editingCourse ? "Update Course" : "Add Course"}
                </span>
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                onClick={resetForm}
                className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 px-6 py-3"
              >
                <span className="whitespace-nowrap">Cancel</span>
              </Button>
            </div>
          </form>
        </motion.div>
      )}
      
      {/* Course Grid */}
      {courses.length === 0 ? (
        <Empty
          icon="BookOpen"
          title="No courses yet"
          description="Add your first course to start organizing your academic schedule."
          actionLabel="Add Course"
          onAction={() => setShowAddForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.Id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
            >
              <CourseCard
                course={course}
                assignments={assignments}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Courses