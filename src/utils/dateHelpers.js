import { format, isToday, isTomorrow, isThisWeek, isPast, addDays } from "date-fns"

export const formatDate = (date, formatStr = "MMM dd") => {
  return format(new Date(date), formatStr)
}

export const formatTime = (time) => {
  return format(new Date(`2000-01-01T${time}`), "h:mm a")
}

export const getDateLabel = (date) => {
  const dateObj = new Date(date)
  
  if (isToday(dateObj)) return "Today"
  if (isTomorrow(dateObj)) return "Tomorrow"
  if (isThisWeek(dateObj)) return format(dateObj, "EEEE")
  return format(dateObj, "MMM dd")
}

export const isOverdue = (dueDate) => {
  return isPast(new Date(dueDate)) && !isToday(new Date(dueDate))
}

export const getDaysUntilDue = (dueDate) => {
  const today = new Date()
  const due = new Date(dueDate)
  const diffTime = due - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export const getWeekDays = () => {
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay())
  
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfWeek, i)
    return {
      date: format(date, "yyyy-MM-dd"),
      label: format(date, "EEE"),
      fullLabel: format(date, "EEEE"),
      dayNumber: format(date, "d"),
      isToday: isToday(date)
    }
  })
}