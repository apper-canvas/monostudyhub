import coursesData from "@/services/mockData/courses.json"

let courses = [...coursesData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const courseService = {
  async getAll() {
    await delay(300)
    return [...courses]
  },
  
  async getById(id) {
    await delay(200)
    return courses.find(course => course.Id === parseInt(id))
  },
  
  async create(courseData) {
    await delay(400)
    const maxId = Math.max(...courses.map(c => c.Id), 0)
    const newCourse = {
      Id: maxId + 1,
      ...courseData,
      currentGrade: null,
      gradeCategories: courseData.gradeCategories || [
        { name: "Homework", weight: 20 },
        { name: "Quizzes", weight: 15 },
        { name: "Midterm", weight: 25 },
        { name: "Final", weight: 40 }
      ]
    }
    courses.push(newCourse)
    return newCourse
  },
  
  async update(id, courseData) {
    await delay(300)
    const index = courses.findIndex(course => course.Id === parseInt(id))
    if (index !== -1) {
      courses[index] = { ...courses[index], ...courseData }
      return courses[index]
    }
    throw new Error("Course not found")
  },
  
  async delete(id) {
    await delay(300)
    const index = courses.findIndex(course => course.Id === parseInt(id))
    if (index !== -1) {
      courses.splice(index, 1)
      return true
    }
    throw new Error("Course not found")
  }
}