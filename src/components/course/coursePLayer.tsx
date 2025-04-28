"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import Image from "next/image"
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Play,
  CheckCircle,
  Clock,
  FileText,
  Video,
  Download,
  Award,
  BookOpen,
  Lock,
  CheckSquare,
  MessageSquare,
  Share2,
  Heart,
  Menu,
  X,
  Settings,
  HelpCircle,
  User,
  MoreHorizontal,
  Printer,
  Linkedin,
  File as FileIcon
} from "lucide-react"
import { courseService } from "@/services/courseService"
import { toast } from "@/hooks/use-toast"

// Types
type Lesson = {
  id: string
  title: string
  duration: string
  type: "video" | "article" | "quiz" | "assignment"
  completed: boolean
  locked: boolean
  preview: boolean
  content?: string
  videoUrl?: string
  content_url?: string
  content_type?: string
}

type Section = {
  id: string
  title: string
  lessons: Lesson[]
  expanded?: boolean
}

type Course = {
  id: string
  title: string
  instructor: {
    first_name: string
    last_name: string
  }
  description: string
  progress: number
  totalLessons: number
  completedLessons: number
  sections: Section[]
  image_url: string
}

// Exemple de données de cours - sera remplacé par les données réelles
const defaultCourseState: Course = {
  id: "",
  title: "",
  instructor: {
    first_name: "",
    last_name: ""
  },
  description: "",
  progress: 0,
  totalLessons: 0,
  completedLessons: 0,
  sections: [],
  image_url: "/placeholder.svg?height=600&width=1200"
}

// Ressources téléchargeables
const resources = [
  { name: "Code source du cours", size: "15.4 MB", type: "zip" },
  { name: "Slides de présentation", size: "2.8 MB", type: "pdf" },
  { name: "Cheat sheet HTML/CSS", size: "1.2 MB", type: "pdf" },
  { name: "Exercices pratiques", size: "3.5 MB", type: "zip" },
]

// Notes de cours
const notes = [
  {
    id: "note-1",
    timestamp: "5:30",
    content: "Important: Les balises sémantiques améliorent l'accessibilité et le SEO",
    lessonId: "lesson-2-2",
  },
  {
    id: "note-2",
    timestamp: "12:15",
    content: "Flexbox est préférable pour les mises en page unidimensionnelles, Grid pour les bidimensionnelles",
    lessonId: "lesson-3-3",
  },
]

// Composant principal
const CoursePlayer = () => {
  const { id } = useParams<{ id: string }>()
  const [course, setCourse] = useState<Course>(defaultCourseState)
  const [currentLessonId, setCurrentLessonId] = useState<string>("")
  const [showSidebar, setShowSidebar] = useState(true)
  const [showCertificate, setShowCertificate] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Charger les données du cours
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) return
      
      try {
        setLoading(true)
        const response = await courseService.getCourseById(id)
        console.log("Données du cours:", response)
        
        // Récupérer les données du cours depuis response
        const data = response.data
        console.log(data.sections[0].lessons[0])
        // Transformation des données du cours pour correspondre à notre structure
        const transformedCourse: Course = {
          id: data.id,
          title: data.title || "",
          instructor: {
            first_name: data.instructor?.firstName || "",
            last_name: data.instructor?.lastName || ""
          },
          description: data.description || "",
          progress: data.user_progress ? parseInt(data.user_progress) : 0,
          totalLessons: data.total_lessons || data.sections?.reduce((total, section) => 
            total + (section.lessons?.length || 0), 0) || 0,
          completedLessons: data.completed_lessons || 0,
          sections: data.sections?.map(section => ({
            id: section.id.toString(),
            title: section.title,
            expanded: false,
            lessons: section.lessons?.map(lesson => ({
              id: lesson.id.toString(),
              title: lesson.title || "",
              duration: lesson.duration || "0:00",
              type: (lesson.content_type as "video" | "article" | "quiz" | "assignment") || "video",
              completed: lesson.completed || false,
              locked: lesson.locked || false,
              preview: lesson.preview || false,
              content: lesson.description,
              videoUrl: lesson.content_url,
              content_url: lesson.content_url,
              content_type: lesson.content_type
            })) || []
          })) || [],
          image_url: data.image_url || "/placeholder.svg?height=600&width=1200"
        }

        console.log("Données du cours transformées:", transformedCourse)
        
        setCourse(transformedCourse)
        
        // Définir la première leçon comme leçon actuelle si aucune n'est sélectionnée
        if (transformedCourse.sections.length > 0 && 
            transformedCourse.sections[0].lessons.length > 0 && 
            !currentLessonId) {
          setCurrentLessonId(transformedCourse.sections[0].lessons[0].id)
        }
        
        setError(null)
      } catch (err) {
        console.error("Erreur lors du chargement du cours:", err)
        setError("Impossible de charger le cours. Veuillez réessayer plus tard.")
        toast({
          title: "Erreur",
          description: "Impossible de charger le cours. Veuillez réessayer plus tard.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchCourseData()
  }, [id, currentLessonId])

  // Trouver la leçon et la section actuelles
  const findCurrentLesson = () => {
    let currentSection = null
    let currentLesson = null
    let lessonIndex = -1
    let sectionIndex = -1

    course.sections.forEach((section, secIdx) => {
      const lesson = section.lessons.findIndex((lesson) => lesson.id === currentLessonId)
      if (lesson !== -1) {
        currentSection = section
        currentLesson = section.lessons[lesson]
        lessonIndex = lesson
        sectionIndex = secIdx
      }
    })

    return { currentSection, currentLesson, lessonIndex, sectionIndex }
  }

  const { currentSection, currentLesson, lessonIndex, sectionIndex } = findCurrentLesson()

  // Vérifier si c'est la première ou la dernière leçon
  const isFirstLesson = sectionIndex === 0 && lessonIndex === 0
  const isLastLesson =
    sectionIndex === course.sections.length - 1 && lessonIndex === course.sections[sectionIndex]?.lessons.length - 1

  // Naviguer vers la leçon précédente
  const goToPreviousLesson = () => {
    if (isFirstLesson) return

    if (lessonIndex > 0) {
      // Aller à la leçon précédente dans la même section
      setCurrentLessonId(course.sections[sectionIndex].lessons[lessonIndex - 1].id)
    } else {
      // Aller à la dernière leçon de la section précédente
      const prevSection = course.sections[sectionIndex - 1]
      setCurrentLessonId(prevSection.lessons[prevSection.lessons.length - 1].id)
    }
  }

  // Naviguer vers la leçon suivante
  const goToNextLesson = () => {
    if (isLastLesson) {
      // Si c'est la dernière leçon et que le cours est terminé à plus de 95%, afficher le certificat
      if (course.progress > 95) {
        setShowCertificate(true)
        return
      }
      return
    }

    if (lessonIndex < course.sections[sectionIndex].lessons.length - 1) {
      // Aller à la leçon suivante dans la même section
      const nextLesson = course.sections[sectionIndex].lessons[lessonIndex + 1]
      if (!nextLesson.locked) {
        setCurrentLessonId(nextLesson.id)
      }
    } else {
      // Aller à la première leçon de la section suivante
      const nextSection = course.sections[sectionIndex + 1]
      const nextLesson = nextSection.lessons[0]
      if (!nextLesson.locked) {
        setCurrentLessonId(nextLesson.id)
      }
    }
  }

  // Marquer une leçon comme terminée
  const markLessonAsCompleted = async (lessonId: string) => {
    try {
      // Ici, vous pouvez ajouter l'appel API pour marquer la leçon comme terminée
      // Exemple: await courseService.markLessonAsCompleted(course.id, lessonId);
      
      const updatedSections = course.sections.map((section) => {
        const updatedLessons = section.lessons.map((lesson) => {
          if (lesson.id === lessonId) {
            return { ...lesson, completed: true }
          }
          return lesson
        })
        return { ...section, lessons: updatedLessons }
      })

      // Calculer le nouveau nombre de leçons terminées
      let completedCount = 0
      updatedSections.forEach((section) => {
        section.lessons.forEach((lesson) => {
          if (lesson.completed) completedCount++
        })
      })

      // Mettre à jour le cours avec les nouvelles données
      setCourse({
        ...course,
        sections: updatedSections,
        completedLessons: completedCount,
        progress: Math.round((completedCount / course.totalLessons) * 100),
      })

      // Si le cours est terminé à plus de 95%, afficher le certificat
      if (Math.round((completedCount / course.totalLessons) * 100) > 95) {
        setShowCertificate(true)
      }
      
      toast({
        title: "Leçon terminée",
        description: "Votre progression a été enregistrée avec succès.",
      })
    } catch (error) {
      console.error("Erreur lors du marquage de la leçon comme terminée:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de votre progression.",
        variant: "destructive"
      })
    }
  }

  // Basculer l'expansion d'une section
  const toggleSection = (sectionId: string) => {
    const updatedSections = course.sections.map((section) => {
      if (section.id === sectionId) {
        return { ...section, expanded: !section.expanded }
      }
      return section
    })
    setCourse({ ...course, sections: updatedSections })
  }

  // Vérifier si l'appareil est mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setShowSidebar(false)
      } else {
        setShowSidebar(true)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Rendu des icônes de type de leçon
  const renderLessonTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />
      case "article":
        return <FileText className="h-4 w-4" />
      case "quiz":
        return <CheckSquare className="h-4 w-4" />
      case "assignment":
        return <FileText className="h-4 w-4" />
      default:
        return <Video className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Chargement du cours...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4 rounded-full bg-red-100 p-3 inline-block">
            <X className="h-6 w-6 text-red-500" />
          </div>
          <h2 className="mb-2 text-lg font-semibold">Erreur de chargement</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 rounded-md bg-orange-500 px-4 py-2 text-white"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header du cours */}
      <header className="bg-white border-b border-gray-200 py-3 px-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="mr-4 p-2 rounded-full hover:bg-gray-100 lg:hidden"
            >
              {showSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <h1 className="text-lg font-bold truncate max-w-[200px] sm:max-w-md">{course.title}</h1>
              <div className="flex items-center text-sm text-gray-500">
                <span className="hidden sm:inline">Par {course.instructor.first_name} {course.instructor.last_name}</span>
                <span className="mx-2 hidden sm:inline">•</span>
                <div className="flex items-center">
                  <div className="w-20 h-1.5 bg-gray-200 rounded-full mr-2">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${course.progress}%` }}></div>
                  </div>
                  <span>{course.progress}% terminé</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Heart className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Share2 className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Settings className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100">
              <HelpCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar avec les sections et leçons */}
        {showSidebar && (
          <aside className="w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-64px)] fixed md:relative z-20 md:z-0">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold">Contenu du cours</h2>
                <span className="text-sm text-gray-500">
                  {course.completedLessons}/{course.totalLessons} leçons
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${course.progress}%` }}></div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {course.sections.map((section) => (
                <div key={section.id} className="border-b border-gray-200">
                  <button
                    className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50"
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="flex items-center">
                      {section.expanded ? (
                        <ChevronDown className="h-5 w-5 mr-2 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 mr-2 text-gray-500" />
                      )}
                      <span className="font-medium">{section.title}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {section.lessons.filter((l) => l.completed).length}/{section.lessons.length}
                    </span>
                  </button>

                  {section.expanded && (
                    <div className="pl-4 pr-2 pb-2">
                      {section.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          className={`flex items-center w-full p-3 rounded-md text-left text-sm mb-1 ${
                            currentLessonId === lesson.id ? "bg-orange-50 text-orange-600" : "hover:bg-gray-50"
                          } ${lesson.locked ? "opacity-60" : ""}`}
                          onClick={() => !lesson.locked && setCurrentLessonId(lesson.id)}
                          disabled={lesson.locked}
                        >
                          <div className="flex-shrink-0 mr-3">
                            {lesson.completed ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : lesson.locked ? (
                              <Lock className="h-5 w-5 text-gray-400" />
                            ) : (
                              <div className="flex items-center justify-center h-5 w-5 rounded-full border border-gray-300">
                                {renderLessonTypeIcon(lesson.type)}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 flex flex-col">
                            <span className={`${lesson.completed ? "text-gray-500" : ""}`}>{lesson.title}</span>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{lesson.duration}</span>
                              {lesson.preview && (
                                <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                                  Aperçu
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200">
              <button
                className="flex items-center justify-center w-full py-2 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                onClick={() => setShowCertificate(true)}
                disabled={course.progress < 95}
              >
                <Award className="h-5 w-5 mr-2" />
                {course.progress >= 95 ? "Voir le certificat" : "Terminer le cours pour obtenir le certificat"}
              </button>
            </div>
          </aside>
        )}

        {/* Contenu principal */}
        <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)]">
          {showCertificate ? (
            <div className="p-6 max-w-4xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-8 text-center">
                <div className="mb-6">
                  <Award className="h-16 w-16 text-orange-500 mx-auto" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Certificat d'Achèvement</h2>
                <p className="text-gray-500 mb-6">Ce certificat est décerné à</p>
                <h3 className="text-2xl font-bold mb-6">Jean Dupont</h3>
                <p className="text-lg mb-2">pour avoir complété avec succès le cours</p>
                <h4 className="text-xl font-bold mb-6">{course.title}</h4>
                <p className="text-gray-500 mb-8">Délivré le {new Date().toLocaleDateString()}</p>

                <div className="flex justify-center mb-8">
                  <div className="border-t-2 border-gray-300 w-24"></div>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <div className="text-center">
                    <Image
                      src="/placeholder.svg?height=100&width=200"
                      alt="Signature de l'instructeur"
                      width={150}
                      height={60}
                      className="mx-auto mb-2"
                    />
                    <p className="font-medium">{course.instructor.first_name} {course.instructor.last_name}</p>
                    <p className="text-sm text-gray-500">Instructeur</p>
                  </div>
                  <div className="text-center">
                    <Image
                      src="/placeholder.svg?height=100&width=200"
                      alt="Logo de la plateforme"
                      width={150}
                      height={60}
                      className="mx-auto mb-2"
                    />
                    <p className="font-medium">LearnHub</p>
                    <p className="text-sm text-gray-500">Plateforme d'apprentissage</p>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  <button className="flex items-center py-2 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-600">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger PDF
                  </button>
                  <button className="flex items-center py-2 px-4 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimer
                  </button>
                  <button className="flex items-center py-2 px-4 bg-[#0077B5] text-white rounded-md hover:bg-[#006699]">
                    <Linkedin className="h-4 w-4 mr-2" />
                    Partager sur LinkedIn
                  </button>
                </div>

                <div className="text-sm text-gray-500">
                  ID du certificat: CERT-{course.id}-{Date.now().toString().slice(-8)}
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  className="text-orange-500 hover:text-orange-600 font-medium"
                  onClick={() => setShowCertificate(false)}
                >
                  Retourner au cours
                </button>
              </div>
            </div>
          ) : currentLesson ? (
            <div className="h-full flex flex-col">
              {/* Contenu de la leçon */}
              <div className="flex-1 overflow-y-auto">
                {currentLesson?.type === "video" && (
                  <div className="bg-black aspect-video">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Image
                        src={currentLesson?.content_url || "/placeholder.svg?height=600&width=1200"}
                        alt={currentLesson?.title || "Vidéo du cours"}
                        layout="fill"
                        objectFit="contain"
                      />
                      <button className="absolute inset-0 flex items-center justify-center">
                        <div className="h-16 w-16 rounded-full bg-white/80 flex items-center justify-center">
                          <Play className="h-8 w-8 text-orange-500 ml-1" />
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                <div className="p-6 max-w-4xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">{currentLesson?.title}</h2>
                    <div className="flex items-center">
                      <button
                        className="p-2 rounded-full hover:bg-gray-100 mr-2"
                        onClick={() => setShowNotes(!showNotes)}
                      >
                        <FileText className="h-5 w-5" />
                      </button>
                      <button className="p-2 rounded-full hover:bg-gray-100">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {currentLesson?.type === "article" && (
                    <div className="prose max-w-none">
                      <p>
                        {currentLesson?.content ||
                          "Le contenu de cette leçon n'est pas disponible pour le moment."}
                      </p>
                    </div>
                  )}

                  {currentLesson?.type === "quiz" && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-medium mb-4">Quiz: Vérifiez vos connaissances</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="font-medium mb-2">
                            1. Quelle balise HTML est utilisée pour créer un lien hypertexte?
                          </p>
                          <div className="space-y-2">
                            <label className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                              <input type="radio" name="q1" className="h-4 w-4 text-orange-500" />
                              <span className="ml-2">&lt;link&gt;</span>
                            </label>
                            <label className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                              <input type="radio" name="q1" className="h-4 w-4 text-orange-500" />
                              <span className="ml-2">&lt;a&gt;</span>
                            </label>
                            <label className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                              <input type="radio" name="q1" className="h-4 w-4 text-orange-500" />
                              <span className="ml-2">&lt;href&gt;</span>
                            </label>
                            <label className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer">
                              <input type="radio" name="q1" className="h-4 w-4 text-orange-500" />
                              <span className="ml-2">&lt;url&gt;</span>
                            </label>
                          </div>
                        </div>
                      </div>
                      <button className="mt-6 py-2 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-600">
                        Vérifier les réponses
                      </button>
                    </div>
                  )}

                  {currentLesson?.type === "assignment" && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-medium mb-4">Projet: {currentLesson.title}</h3>
                      <div className="prose max-w-none">
                        <p>{currentLesson.content || "Les instructions pour ce projet ne sont pas disponibles."}</p>
                      </div>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <button className="py-2 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-600">
                          Soumettre le projet
                        </button>
                        <button className="py-2 px-4 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                          Télécharger les ressources
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Notes de cours (conditionnellement affiché) */}
                  {showNotes && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">Mes notes</h3>
                        <button className="text-sm text-orange-500 hover:text-orange-600">Ajouter une note</button>
                      </div>
                      {notes.filter((note) => note.lessonId === currentLessonId).length > 0 ? (
                        <div className="space-y-3">
                          {notes
                            .filter((note) => note.lessonId === currentLessonId)
                            .map((note) => (
                              <div key={note.id} className="flex items-start">
                                <div className="bg-yellow-200 text-yellow-800 px-1.5 py-0.5 rounded text-xs mr-2 mt-1">
                                  {note.timestamp}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm">{note.content}</p>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Aucune note pour cette leçon. Cliquez sur "Ajouter une note" pour commencer.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Ressources téléchargeables */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                    <h3 className="font-medium mb-4">Ressources téléchargeables</h3>
                    <div className="space-y-2">
                      {resources.map((resource, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                        >
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-md bg-gray-100 flex items-center justify-center mr-3">
                              {resource.type === "pdf" ? (
                                <FileText className="h-4 w-4 text-red-500" />
                              ) : resource.type === "zip" ? (
                                <Download className="h-4 w-4 text-blue-500" />
                              ) : (
                                <FileIcon className="h-4 w-4 text-gray-500" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{resource.name}</p>
                              <p className="text-xs text-gray-500">{resource.size}</p>
                            </div>
                          </div>
                          <button className="text-orange-500 hover:text-orange-600">
                            <Download className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Commentaires et questions */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-medium mb-4">Questions et commentaires</h3>
                    <div className="mb-4">
                      <textarea
                        className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        rows={3}
                        placeholder="Posez une question ou laissez un commentaire..."
                      ></textarea>
                      <div className="mt-2 flex justify-end">
                        <button className="py-2 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-600">
                          Publier
                        </button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="h-10 w-10 rounded-full bg-gray-200 mr-3 flex-shrink-0">
                          <User className="h-10 w-10 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <h4 className="font-medium">Sophie Martin</h4>
                            <span className="text-xs text-gray-500 ml-2">il y a 2 jours</span>
                          </div>
                          <p className="text-sm mb-2">
                            Est-ce que quelqu'un peut m'expliquer la différence entre Flexbox et Grid? Dans quels cas
                            utiliser l'un plutôt que l'autre?
                          </p>
                          <div className="flex items-center text-sm">
                            <button className="text-gray-500 hover:text-orange-500 mr-4">
                              <MessageSquare className="h-4 w-4 inline mr-1" /> Répondre
                            </button>
                            <span className="text-gray-500">2 réponses</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Barre de navigation entre leçons */}
              <div className="border-t border-gray-200 bg-white p-4 flex items-center justify-between">
                <button
                  className={`flex items-center py-2 px-4 rounded-md ${
                    isFirstLesson
                      ? "text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 hover:bg-gray-50"
                  }`}
                  onClick={goToPreviousLesson}
                  disabled={isFirstLesson}
                >
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  <span className="hidden sm:inline">Précédent</span>
                </button>

                <div className="flex items-center">
                  {currentLesson && !currentLesson.completed && (
                    <button
                      className="py-2 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-600 mr-2"
                      onClick={() => markLessonAsCompleted(currentLessonId)}
                    >
                      <CheckCircle className="h-5 w-5 sm:mr-2 inline" />
                      <span className="hidden sm:inline">Marquer comme terminé</span>
                    </button>
                  )}
                  <button
                    className={`flex items-center py-2 px-4 rounded-md ${
                      isLastLesson ||
                      (currentLesson?.completed && course.sections[sectionIndex]?.lessons[lessonIndex + 1]?.locked)
                        ? "text-gray-400 cursor-not-allowed"
                        : "bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={goToNextLesson}
                    disabled={
                      isLastLesson ||
                      (currentLesson?.completed && course.sections[sectionIndex]?.lessons[lessonIndex + 1]?.locked)
                    }
                  >
                    <span className="hidden sm:inline">Suivant</span>
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Aucune leçon sélectionnée</h2>
                <p className="text-gray-500">Sélectionnez une leçon dans le menu pour commencer à apprendre</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default CoursePlayer
