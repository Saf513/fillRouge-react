import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useCourses } from '@/hooks/useCourses'
import { useWishlistStore } from '@/hooks/useWishlistStore'
import { Course } from '@/types/course'
import {
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  ShoppingCart,
  Heart,
} from "lucide-react"
import  {Button} from "@/components/ui/button"

export default function CourseDetails() {
  const { id } = useParams()
  const { courses, loading } = useCourses()
  const { 
    wishlistedCourses, 
    toggleWishlist: toggleWishlistStore,
    fetchWishlistedCourses
  } = useWishlistStore()
  const [course, setCourse] = useState<Course | null>(null)

  // Check if course is in wishlist
  const isInWishlist = id ? wishlistedCourses.includes(id) : false

  // Function to toggle wishlist status
  const toggleWishlist = () => {
    if (id) {
      toggleWishlistStore(id)
    }
  }

  // Fetch wishlist courses when component mounts
  useEffect(() => {
    fetchWishlistedCourses()
  }, [fetchWishlistedCourses])

  useEffect(() => {
    if (courses && id) {

      const foundCourse = courses.find(c => String(c.id) === id)

      if (foundCourse) {
        setCourse(foundCourse)
      }
    }
  }, [courses, id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-96 bg-gray-200 rounded mb-8"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cours non trouvé</h1>
          <p className="text-gray-600">Le cours que vous recherchez n'existe pas ou a été supprimé.</p>
        </div>
      </div>
    )
  }
console.log("course:" , course)
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="text-gray-600 mb-6">{course.description}</p>

          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-500 mr-2" />
              <span>{course.duration} heures</span>
            </div>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-500 mr-2" />
              <span>{course.total_students?.toLocaleString() || 0} étudiants</span>
            </div>
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-gray-500 mr-2" />
              <span>{course.level}</span>
            </div>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 mr-2" />
              <span>{course.rating} ({course.total_reviews?.toLocaleString() || 0} avis)</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">Par {course.instructor?.firstName} {course.instructor?.lastName}</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Ce que vous apprendrez</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.tags?.map((tag, index) => (
                <li key={index} className="flex items-center">
                  <Play className="h-4 w-4 text-green-500 mr-2" />
                  <span>{tag.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <img 
              src={course.image_url || "/placeholder.svg"} 
              alt={course.title} 
              className="w-full h-48 object-cover rounded-lg mb-4"
            />

            <div className="mb-4">
              {course.discount ? (
                <div className="flex items-center">
                  <span className="text-2xl font-bold">${course.price - course.discount}</span>
                  <span className="text-gray-500 line-through ml-2">${course.price}</span>
                </div>
              ) : (
                <span className="text-2xl font-bold">${course.price}</span>
              )}
            </div>

            <div className="flex gap-2 mb-4">
              <Button className="flex-1 bg-[#a435f0] text-white py-3 rounded-lg font-medium hover:bg-[#8710d8] transition-colors" onClick={() => window.location.href = '/checkout'}>
                <ShoppingCart className="h-5 w-5 inline-block mr-2" />
                Ajouter au panier
              </Button>

              <Button 
                className={`px-3 py-3 rounded-lg font-medium transition-colors ${
                  isInWishlist 
                    ? "bg-red-100 text-red-500 hover:bg-red-200" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`} 
                onClick={toggleWishlist}
              >
                <Heart className={`h-5 w-5 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            </div>

            <div className="text-sm text-gray-600">
              <p>Garantie de remboursement de 30 jours</p>
              <p>Accès à vie</p>
              <p>Accès sur mobile et TV</p>
              <p>Certificat de complétion</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
