import { useState } from "react"
import { Play, BookOpen, Clock, Star, ChevronRight } from "lucide-react"
import CourseDetails from "./CourseDetails"

interface CourseCardProps {
  course: {
    id: number
    title: string
    instructor: string
    progress: number
    image: string
    lastViewed: string
    rating: number
    reviews: number
    totalLessons: number
    completedLessons: number
    category: string
    level: string
    description: string
    bookmarked: boolean
    isArchived: boolean
    estimatedTimeLeft: string
    lastSection: string
    lastLesson: string
  }
}

export default function CourseCard({ course }: CourseCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <>
      <div
        onClick={() => setShowDetails(true)}
        className="group relative cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
      >
        <div className="relative aspect-video">
          <img
            src={course.image || "/placeholder.svg"}
            alt={course.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/80 text-[#FF9500] backdrop-blur-sm transition-all group-hover:bg-white">
              <Play className="h-8 w-8" />
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="line-clamp-2 text-lg font-bold">{course.title}</h3>
            <button className="ml-2 rounded-full p-1 text-gray-400 hover:bg-gray-100">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <p className="mb-3 text-sm text-gray-600">{course.instructor}</p>

          <div className="mb-3 flex items-center text-sm">
            <div className="flex items-center">
              <Star className="mr-1 h-4 w-4 fill-[#eb8a2f] text-[#eb8a2f]" />
              <span className="font-medium">{course.rating}</span>
              <span className="mx-1 text-gray-500">•</span>
              <span className="text-gray-500">{course.reviews} avis</span>
            </div>
          </div>

          <div className="mb-3">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-gray-500">Progression</span>
              <span className="font-medium">{course.progress}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-100">
              <div
                className={`h-1.5 rounded-full ${course.progress === 100 ? "bg-green-500" : "bg-[#FF9500]"}`}
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <BookOpen className="mr-1 h-4 w-4" />
              <span>{course.completedLessons}/{course.totalLessons} leçons</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              <span>{course.estimatedTimeLeft}</span>
            </div>
          </div>
        </div>
      </div>

      {showDetails && <CourseDetails course={course} onClose={() => setShowDetails(false)} />}
    </>
  )
} 