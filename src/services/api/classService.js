import classesData from "@/services/mockData/classes.json"

let classes = [...classesData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const classService = {
  async getAll() {
    await delay(300)
    return [...classes]
  },
  
  async getById(id) {
    await delay(200)
    return classes.find(cls => cls.Id === parseInt(id))
  },
  
  async getByCourse(courseId) {
    await delay(200)
    return classes.filter(cls => cls.courseId === parseInt(courseId))
  },
  
  async create(classData) {
    await delay(400)
    const maxId = Math.max(...classes.map(c => c.Id), 0)
    const newClass = {
      Id: maxId + 1,
      ...classData,
      courseId: parseInt(classData.courseId)
    }
    classes.push(newClass)
    return newClass
  },
  
  async update(id, classData) {
    await delay(300)
    const index = classes.findIndex(cls => cls.Id === parseInt(id))
    if (index !== -1) {
      classes[index] = { 
        ...classes[index], 
        ...classData,
        courseId: classData.courseId ? parseInt(classData.courseId) : classes[index].courseId
      }
      return classes[index]
    }
    throw new Error("Class not found")
  },
  
  async delete(id) {
    await delay(300)
    const index = classes.findIndex(cls => cls.Id === parseInt(id))
    if (index !== -1) {
      classes.splice(index, 1)
      return true
    }
    throw new Error("Class not found")
  }
}