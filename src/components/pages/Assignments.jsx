import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import FilterTabs from "@/components/molecules/FilterTabs"
import SearchBar from "@/components/molecules/SearchBar"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import AssignmentList from "@/components/organisms/AssignmentList"
import ApperIcon from "@/components/ApperIcon"
import { courseService } from "@/services/api/courseService"
import { assignmentService } from "@/services/api/assignmentService"
import { toast } from "react-toastify"

const Assignments = () => {
  const [assignments, setAssignments] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseId: "",
    dueDate: "",
    priority: "medium",
    category: "Homework"
  })
  
  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentService.getAll(),
        courseService.getAll()
      ])
      
      setAssignments(assignmentsData)
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
      if (editingAssignment) {
        await assignmentService.update(editingAssignment.Id, formData)
        toast.success("Assignment updated successfully!")
      } else {
        await assignmentService.create(formData)
        toast.success("Assignment created successfully!")
      }
      
      await loadData()
      resetForm()
    } catch (err) {
      toast.error(`Failed to ${editingAssignment ? "update" : "create"} assignment`)
    }
  }
  
  const handleEdit = (assignment) => {
    setEditingAssignment(assignment)
    setFormData({
      title: assignment.title,
      description: assignment.description || "",
      courseId: assignment.courseId.toString(),
      dueDate: assignment.dueDate,
      priority: assignment.priority,
      category: assignment.category || "Homework"
    })
    setShowAddForm(true)
  }
  
  const handleDelete = async (assignmentId) => {
    if (!confirm("Are you sure you want to delete this assignment?")) {
      return
    }
    
    try {
      await assignmentService.delete(assignmentId)
      toast.success("Assignment deleted successfully!")
      await loadData()
    } catch (err) {
      toast.error("Failed to delete assignment")
    }
  }
  
  const handleToggleComplete = async (assignment) => {
    try {
      const newStatus = assignment.status === "completed" ? "pending" : "completed"
      await assignmentService.update(assignment.Id, { status: newStatus })
      await loadData()
      toast.success(`Assignment marked as ${newStatus}!`)
    } catch (err) {
      toast.error("Failed to update assignment status")
    }
  }
  
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      courseId: "",
      dueDate: "",
      priority: "medium",
      category: "Homework"
    })
    setEditingAssignment(null)
    setShowAddForm(false)
  }
  
  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }
  
  // Filter assignments
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = activeFilter === "all" || assignment.status === activeFilter
    
    return matchesSearch && matchesFilter
  })
  
  // Get filter tabs with counts
  const filterTabs = [
    { value: "all", label: "All", count: assignments.length },
    { value: "pending", label: "Pending", count: assignments.filter(a => a.status === "pending").length },
    { value: "in-progress", label: "In Progress", count: assignments.filter(a => a.status === "in-progress").length },
    { value: "completed", label: "Completed", count: assignments.filter(a => a.status === "completed").length }
  ]
  
  const courseOptions = courses.map(course => ({
    value: course.Id.toString(),
    label: `${course.code} - ${course.name}`
  }))
  
  const priorityOptions = [
    { value: "low", label: "Low Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "high", label: "High Priority" }
  ]
  
  const categoryOptions = [
    { value: "Homework", label: "Homework" },
    { value: "Quizzes", label: "Quizzes" },
    { value: "Midterm", label: "Midterm" },
    { value: "Final", label: "Final" },
    { value: "Project", label: "Project" },
    { value: "Lab", label: "Lab" }
  ]
  
  if (loading) return <Loading type="list" />
  if (error) return <Error message={error} onRetry={loadData} />
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-gray-900 mb-2">
            Assignments
          </h1>
          <p className="text-gray-600">
            Track and manage all your course assignments and deadlines.
          </p>
        </div>
        
        <Button onClick={() => setShowAddForm(true)}>
          <ApperIcon name="Plus" className="w-4 h-4" />
          Add Assignment
        </Button>
      </div>
      
      {/* Add/Edit Assignment Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-xl text-gray-900">
              {editingAssignment ? "Edit Assignment" : "Add New Assignment"}
            </h2>
            <Button variant="ghost" onClick={resetForm}>
              <ApperIcon name="X" className="w-5 h-5" />
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Assignment Title"
              value={formData.title}
              onChange={handleChange("title")}
              placeholder="e.g., Binary Tree Implementation"
              required
              className="md:col-span-2"
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
              label="Category"
              type="select"
              value={formData.category}
              onChange={handleChange("category")}
              options={categoryOptions}
            />
            
            <FormField
              label="Description"
              type="textarea"
              value={formData.description}
              onChange={handleChange("description")}
              placeholder="Assignment description (optional)..."
              className="md:col-span-2"
            />
            
            <div className="md:col-span-2 flex items-center gap-3 pt-4">
              <Button type="submit">
                <ApperIcon name={editingAssignment ? "Save" : "Plus"} className="w-4 h-4" />
                {editingAssignment ? "Update Assignment" : "Add Assignment"}
              </Button>
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      )}
      
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search assignments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <FilterTabs
          tabs={filterTabs}
          activeTab={activeFilter}
          onTabChange={setActiveFilter}
          className="w-full sm:w-auto"
        />
      </div>
      
      {/* Assignment List */}
      {filteredAssignments.length === 0 ? (
        <Empty
          icon="FileText"
          title={searchQuery || activeFilter !== "all" ? "No matching assignments" : "No assignments yet"}
          description={
            searchQuery || activeFilter !== "all" 
              ? "Try adjusting your search or filter criteria."
              : "Add your first assignment to start tracking your academic work."
          }
          actionLabel="Add Assignment"
          onAction={() => setShowAddForm(true)}
        />
      ) : (
        <AssignmentList
          assignments={filteredAssignments}
          courses={courses}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleComplete={handleToggleComplete}
        />
      )}
    </div>
  )
}

export default Assignments