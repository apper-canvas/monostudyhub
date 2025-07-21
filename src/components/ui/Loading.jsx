import { motion } from "framer-motion"
import { Card, CardHeader, CardContent } from "@/components/atoms/Card"

const Loading = ({ type = "cards" }) => {
  const shimmerAnimation = {
    animate: {
      x: ["-100%", "100%"],
    },
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "linear",
    }
  }
  
  const SkeletonCard = () => (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded mb-2 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                {...shimmerAnimation}
              />
            </div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-3 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                {...shimmerAnimation}
              />
            </div>
            <div className="flex gap-4">
              <div className="h-3 bg-gray-200 rounded w-20 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                  {...shimmerAnimation}
                />
              </div>
              <div className="h-3 bg-gray-200 rounded w-16 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                  {...shimmerAnimation}
                />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
              {...shimmerAnimation}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-gray-200 rounded relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                {...shimmerAnimation}
              />
            </div>
            <div className="h-16 bg-gray-200 rounded relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                {...shimmerAnimation}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
  
  const SkeletonList = () => (
    <Card>
      <div className="p-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`flex items-center gap-4 py-4 ${i !== 4 ? "border-b border-gray-200" : ""}`}>
            <div className="w-5 h-5 bg-gray-200 rounded-full relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                {...shimmerAnimation}
              />
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                  {...shimmerAnimation}
                />
              </div>
              <div className="h-3 bg-gray-200 rounded w-1/2 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                  {...shimmerAnimation}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-12 h-6 bg-gray-200 rounded-full relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                  {...shimmerAnimation}
                />
              </div>
              <div className="w-12 h-6 bg-gray-200 rounded-full relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                  {...shimmerAnimation}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
  
  if (type === "list") {
    return <SkeletonList />
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: i * 0.1 }}
        >
          <SkeletonCard />
        </motion.div>
      ))}
    </div>
  )
}

export default Loading