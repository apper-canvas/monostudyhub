export const calculateGPA = (courses) => {
  if (!courses.length) return 0
  
  const validGrades = courses.filter(course => course.currentGrade !== null)
  if (!validGrades.length) return 0
  
  const totalPoints = validGrades.reduce((sum, course) => {
    const gradePoint = getGradePoint(course.currentGrade)
    return sum + (gradePoint * course.credits)
  }, 0)
  
  const totalCredits = validGrades.reduce((sum, course) => sum + course.credits, 0)
  
  return totalCredits > 0 ? (totalPoints / totalCredits) : 0
}

export const getGradePoint = (percentage) => {
  if (percentage >= 97) return 4.0
  if (percentage >= 93) return 3.7
  if (percentage >= 90) return 3.3
  if (percentage >= 87) return 3.0
  if (percentage >= 83) return 2.7
  if (percentage >= 80) return 2.3
  if (percentage >= 77) return 2.0
  if (percentage >= 73) return 1.7
  if (percentage >= 70) return 1.3
  if (percentage >= 67) return 1.0
  if (percentage >= 60) return 0.7
  return 0.0
}

export const getLetterGrade = (percentage) => {
  if (percentage >= 97) return "A+"
  if (percentage >= 93) return "A"
  if (percentage >= 90) return "A-"
  if (percentage >= 87) return "B+"
  if (percentage >= 83) return "B"
  if (percentage >= 80) return "B-"
  if (percentage >= 77) return "C+"
  if (percentage >= 73) return "C"
  if (percentage >= 70) return "C-"
  if (percentage >= 67) return "D+"
  if (percentage >= 60) return "D"
  return "F"
}

export const calculateCourseGrade = (assignments, gradeCategories) => {
  if (!assignments.length || !gradeCategories.length) return null
  
  let totalWeightedScore = 0
  let totalWeight = 0
  
  for (const category of gradeCategories) {
    const categoryAssignments = assignments.filter(a => a.category === category.name && a.grade !== null)
    
    if (categoryAssignments.length > 0) {
      const categoryAverage = categoryAssignments.reduce((sum, a) => sum + a.grade, 0) / categoryAssignments.length
      totalWeightedScore += categoryAverage * (category.weight / 100)
      totalWeight += category.weight / 100
    }
  }
  
  return totalWeight > 0 ? totalWeightedScore / totalWeight : null
}

export const getGradeColor = (percentage) => {
  if (percentage >= 90) return "text-green-600"
  if (percentage >= 80) return "text-blue-600"
  if (percentage >= 70) return "text-yellow-600"
  if (percentage >= 60) return "text-orange-600"
  return "text-red-600"
}