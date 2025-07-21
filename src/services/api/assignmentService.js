import assignmentsData from "@/services/mockData/assignments.json"

let assignments = [...assignmentsData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const assignmentService = {
  async getAll() {
    await delay(300)
    return [...assignments]
  },
  
  async getById(id) {
    await delay(200)
    return assignments.find(assignment => assignment.Id === parseInt(id))
  },
  
  async getByCourse(courseId) {
    await delay(200)
    return assignments.filter(assignment => assignment.courseId === parseInt(courseId))
  },
  
  async create(assignmentData) {
    await delay(400)
    const maxId = Math.max(...assignments.map(a => a.Id), 0)
    const newAssignment = {
      Id: maxId + 1,
      ...assignmentData,
      courseId: parseInt(assignmentData.courseId),
      status: "pending",
      grade: null,
      category: assignmentData.category || "Homework"
    }
    assignments.push(newAssignment)
    return newAssignment
  },
  
  async update(id, assignmentData) {
    await delay(300)
    const index = assignments.findIndex(assignment => assignment.Id === parseInt(id))
    if (index !== -1) {
      assignments[index] = { 
        ...assignments[index], 
        ...assignmentData,
        courseId: assignmentData.courseId ? parseInt(assignmentData.courseId) : assignments[index].courseId
      }
      return assignments[index]
    }
    throw new Error("Assignment not found")
  },
  
  async delete(id) {
    await delay(300)
    const index = assignments.findIndex(assignment => assignment.Id === parseInt(id))
    if (index !== -1) {
      assignments.splice(index, 1)
      return true
    }
    throw new Error("Assignment not found")
  }
}