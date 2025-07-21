import { Card, CardHeader, CardContent } from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import { formatTime, getWeekDays } from "@/utils/dateHelpers"

const WeeklySchedule = ({ classes = [], courses = [] }) => {
  const weekDays = getWeekDays()
  const timeSlots = Array.from({ length: 14 }, (_, i) => 7 + i) // 7 AM to 8 PM
  
  const getCourse = (courseId) => courses.find(c => c.Id === courseId)
  
  const getClassForTimeSlot = (dayOfWeek, hour) => {
    return classes.find(cls => {
      const startHour = parseInt(cls.startTime.split(":")[0])
      const endHour = parseInt(cls.endTime.split(":")[0])
      return cls.dayOfWeek === dayOfWeek && hour >= startHour && hour < endHour
    })
  }
  
  const getClassDuration = (cls) => {
    const startHour = parseInt(cls.startTime.split(":")[0])
    const endHour = parseInt(cls.endTime.split(":")[0])
    return endHour - startHour
  }
  
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-gray-900">
            Weekly Schedule
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ApperIcon name="Calendar" className="w-4 h-4" />
            <span>Current Week</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header Row - Days */}
            <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
              <div className="p-4 text-sm font-medium text-gray-600">
                Time
              </div>
              {weekDays.map((day) => (
                <div 
                  key={day.date}
                  className={`p-4 text-center border-l border-gray-200 ${
                    day.isToday ? "bg-primary/5" : ""
                  }`}
                >
                  <div className={`text-sm font-medium ${
                    day.isToday ? "text-primary" : "text-gray-900"
                  }`}>
                    {day.label}
                  </div>
                  <div className={`text-lg font-bold ${
                    day.isToday ? "text-primary" : "text-gray-700"
                  }`}>
                    {day.dayNumber}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Time Slots */}
            <div className="divide-y divide-gray-100">
              {timeSlots.map((hour) => (
                <div key={hour} className="grid grid-cols-8 min-h-[80px]">
                  {/* Time Column */}
                  <div className="p-4 text-sm text-gray-600 bg-gray-50 border-r border-gray-200">
                    <div className="font-medium">
                      {hour === 12 ? "12:00 PM" : 
                       hour > 12 ? `${hour - 12}:00 PM` : 
                       `${hour}:00 AM`}
                    </div>
                  </div>
                  
                  {/* Day Columns */}
                  {weekDays.map((day, dayIndex) => {
                    const cls = getClassForTimeSlot(dayIndex, hour)
                    const course = cls ? getCourse(cls.courseId) : null
                    const isClassStart = cls && parseInt(cls.startTime.split(":")[0]) === hour
                    
                    return (
                      <div 
                        key={day.date}
                        className={`border-l border-gray-200 p-2 ${
                          day.isToday ? "bg-primary/2" : ""
                        }`}
                      >
                        {cls && isClassStart && (
                          <div 
                            className="h-full rounded-lg p-3 text-white shadow-sm relative overflow-hidden"
                            style={{ 
                              backgroundColor: course?.color || "#6B7280",
                              minHeight: `${getClassDuration(cls) * 64}px`
                            }}
                          >
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-20">
                              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                            </div>
                            
                            <div className="relative z-10">
                              <h4 className="font-semibold text-sm leading-tight mb-1">
                                {course?.name}
                              </h4>
                              <p className="text-xs opacity-90 mb-1">
                                {course?.code}
                              </p>
                              <div className="text-xs opacity-75 space-y-1">
                                <div className="flex items-center gap-1">
                                  <ApperIcon name="Clock" className="w-3 h-3" />
                                  <span>
                                    {formatTime(cls.startTime)} - {formatTime(cls.endTime)}
                                  </span>
                                </div>
                                {cls.location && (
                                  <div className="flex items-center gap-1">
                                    <ApperIcon name="MapPin" className="w-3 h-3" />
                                    <span>{cls.location}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default WeeklySchedule