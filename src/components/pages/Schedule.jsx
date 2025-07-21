import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import WeeklySchedule from "@/components/organisms/WeeklySchedule"
import ApperIcon from "@/components/ApperIcon"
import { courseService } from "@/services/api/courseService"
import { classService } from "@/services/api/classService"
import { formatTime } from "@/utils/dateHelpers"
import { toast } from "react-toastify"

const Schedule = () => {
  const [classes, setClasses] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingClass, setEditingClass] = useState(null)
  const [formData, setFormData] = useState({
    courseId: "",
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    location: "",
    type: "Lecture"
  })
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [classesData, coursesData] = await Promise.all([
        classService.getAll(),
        courseService.getAll()
      ])
      
      setClasses(classesData)
      setCourses(coursesData)
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
      const classData = {
        ...formData,
        courseId: parseInt(formData.courseId),
        dayOfWeek: parseInt(formData.dayOfWeek)
      }
      
      if (editingClass) {
        await classService.update(editingClass.Id, classData)
        toast.success("Class schedule updated successfully!")
      } else {
        await classService.create(classData)
        toast.success("Class schedule created successfully!")
      }
      
      await loadData()
      resetForm()
    } catch (err) {
      toast.error(`Failed to ${editingClass ? "update" : "create"} class schedule`)
    }
  }
  
  const handleEdit = (cls) => {
    setEditingClass(cls)
    setFormData({
      courseId: cls.courseId.toString(),
      dayOfWeek: cls.dayOfWeek.toString(),
      startTime: cls.startTime,
      endTime: cls.endTime,
      location: cls.location,
      type: cls.type
    })
    setShowAddForm(true)
  }
  
  const handleDelete = async (classId) => {
    if (!confirm("Are you sure you want to delete this class schedule?")) {
      return
    }
    
    try {
      await classService.delete(classId)
      toast.success("Class schedule deleted successfully!")
      await loadData()
    } catch (err) {
      toast.error("Failed to delete class schedule")
    }
  }
  
  const resetForm = () => {
    setFormData({
      courseId: "",
      dayOfWeek: "",
      startTime: "",
      endTime: "",
      location: "",
      type: "Lecture"
    })
    setEditingClass(null)
    setShowAddForm(false)
  }
  
  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }
  
  const courseOptions = courses.map(course => ({
    value: course.Id.toString(),
    label: `${course.code} - ${course.name}`
  }))
  
  const dayOptions = [
    { value: "0", label: "Sunday" },
    { value: "1", label: "Monday" },
    { value: "2", label: "Tuesday" },
    { value: "3", label: "Wednesday" },
    { value: "4", label: "Thursday" },
    { value: "5", label: "Friday" },
    { value: "6", label: "Saturday" }
  ]
  
  const typeOptions = [
    { value: "Lecture", label: "Lecture" },
    { value: "Lab", label: "Lab" },
    { value: "Seminar", label: "Seminar" },
    { value: "Recitation", label: "Recitation" },
    { value: "Tutorial", label: "Tutorial" }
  ]
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-gray-900 mb-2">
            Class Schedule
          </h1>
          <p className="text-gray-600">
            Manage your weekly class schedule and never miss a session.
          </p>
        </div>
        
        <Button onClick={() => setShowAddForm(true)}>
          <ApperIcon name="Plus" className="w-4 h-4" />
          Add Class
        </Button>
      </div>
      
      {/* Add/Edit Class Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-xl text-gray-900">
              {editingClass ? "Edit Class Schedule" : "Add New Class"}
            </h2>
            <Button variant="ghost" onClick={resetForm}>
              <ApperIcon name="X" className="w-5 h-5" />
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              label="Day of Week"
              type="select"
              value={formData.dayOfWeek}
              onChange={handleChange("dayOfWeek")}
              options={dayOptions}
              placeholder="Select day"
              required
            />
            
            <FormField
              label="Class Type"
              type="select"
              value={formData.type}
              onChange={handleChange("type")}
              options={typeOptions}
            />
            
            <FormField
              label="Start Time"
              type="time"
              value={formData.startTime}
              onChange={handleChange("startTime")}
              required
            />
            
            <FormField
              label="End Time"
              type="time"
              value={formData.endTime}
              onChange={handleChange("endTime")}
              required
            />
            
            <FormField
              label="Location"
              value={formData.location}
              onChange={handleChange("location")}
              placeholder="e.g., Engineering Building 201"
              required
            />
            
            <div className="md:col-span-2 lg:col-span-3 flex items-center gap-3 pt-4">
              <Button type="submit">
                <ApperIcon name={editingClass ? "Save" : "Plus"} className="w-4 h-4" />
                {editingClass ? "Update Class" : "Add Class"}
              </Button>
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      )}
      
      {/* Schedule View */}
      {classes.length === 0 ? (
        <Empty
          icon="Calendar"
          title="No classes scheduled"
          description="Add your class schedules to see your weekly timetable."
          actionLabel="Add Class"
          onAction={() => setShowAddForm(true)}
        />
      ) : (
        <WeeklySchedule classes={classes} courses={courses} />
      )}
      
      {/* Class List for Mobile */}
      {classes.length > 0 && (
        <div className="lg:hidden">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="font-display font-bold text-lg text-gray-900">
                All Classes
              </h3>
            </div>
            
            <div className="divide-y divide-gray-100">
              {classes.map((cls) => {
                const course = courses.find(c => c.Id === cls.courseId)
                const dayName = dayOptions.find(d => d.value === cls.dayOfWeek.toString())?.label
                
                return (
                  <div key={cls.Id} className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {course && (
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: course.color }}
                            />
                          )}
                          <span className="font-medium text-gray-900">
                            {course?.code} - {course?.name}
                          </span>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <ApperIcon name="Calendar" className="w-4 h-4" />
                              <span>{dayName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ApperIcon name="Clock" className="w-4 h-4" />
                              <span>{formatTime(cls.startTime)} - {formatTime(cls.endTime)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <ApperIcon name="MapPin" className="w-4 h-4" />
                              <span>{cls.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ApperIcon name="BookOpen" className="w-4 h-4" />
                              <span>{cls.type}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(cls)}>
                          <ApperIcon name="Edit" className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(cls.Id)}>
                          <ApperIcon name="Trash2" className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Schedule