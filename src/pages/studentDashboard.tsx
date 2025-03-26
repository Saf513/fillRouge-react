"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  Filter,
  Heart,
  HelpCircle,
  LogOut,
  Menu,
  MessageSquare,
  MoreVertical,
  Play,
  Search,
  Settings,
  Star,
  TrendingUp,
  User,
  X,
  Bell,
  CheckCircle,
  Award,
  Bookmark,
  Download,
  ExternalLink,
  Share2,
  DollarSign,
  Lightbulb,
  Layers,
  Smartphone,
  CreditCard,
} from "lucide-react"

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("my-learning")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedView, setSelectedView] = useState("all")
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [showCourseDetails, setShowCourseDetails] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null)
  const [sortOption, setSortOption] = useState("recent")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [progressFilter, setProgressFilter] = useState("all")
  const [showArchived, setShowArchived] = useState(false)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    // Set initial state
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu)
    // Close other menus when mobile menu is opened
    if (!showMobileMenu) {
      setShowNotifications(false)
      setShowProfileMenu(false)
    }
  }

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
    if (!showNotifications) {
      setShowProfileMenu(false)
    }
  }

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu)
    if (!showProfileMenu) {
      setShowNotifications(false)
    }
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (windowWidth < 1024) {
      setShowMobileMenu(false)
    }
  }

  const handleViewChange = (view: string) => {
    setSelectedView(view)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const handleCourseClick = (index: number) => {
    setSelectedCourse(index)
    setShowCourseDetails(true)
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value)
  }

  const handleCategoryFilterChange = (category: string) => {
    setCategoryFilter(category)
  }

  const handleProgressFilterChange = (progress: string) => {
    setProgressFilter(progress)
  }

  const toggleArchivedCourses = () => {
    setShowArchived(!showArchived)
  }

  // Sample student data
  const studentData = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    avatar: "/placeholder.svg?height=200&width=200",
    joinDate: "January 2022",
    lastActive: "Today at 10:30 AM",
  }

  // Sample courses data
  const courses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      instructor: "Dr. Angela Yu",
      progress: 65,
      image: "/placeholder.svg?height=160&width=320",
      lastViewed: "2 hours ago",
      rating: 4.8,
      reviews: 142,
      totalLessons: 226,
      completedLessons: 147,
      category: "Web Development",
      level: "Beginner to Advanced",
      description:
        "Become a full-stack web developer with just one course. HTML, CSS, Javascript, Node, React, MongoDB, and more!",
      bookmarked: true,
      isArchived: false,
      estimatedTimeLeft: "12h 30m",
      lastSection: "Section 8: Advanced CSS",
      lastLesson: "Flexbox Layout",
    },
    {
      id: 2,
      title: "Advanced JavaScript Concepts",
      instructor: "Andrei Neagoie",
      progress: 42,
      image: "/placeholder.svg?height=160&width=320",
      lastViewed: "Yesterday",
      rating: 4.9,
      reviews: 95,
      totalLessons: 184,
      completedLessons: 77,
      category: "Programming",
      level: "Advanced",
      description: "Learn advanced JavaScript concepts including prototype inheritance, closures, currying, and more.",
      bookmarked: false,
      isArchived: false,
      estimatedTimeLeft: "18h 45m",
      lastSection: "Section 5: Closures and Prototypal Inheritance",
      lastLesson: "Understanding the Prototype Chain",
    },
    {
      id: 3,
      title: "The Complete Digital Marketing Course",
      instructor: "Rob Percival, Daragh Walsh",
      progress: 28,
      image: "/placeholder.svg?height=160&width=320",
      lastViewed: "3 days ago",
      rating: 4.7,
      reviews: 118,
      totalLessons: 148,
      completedLessons: 41,
      category: "Marketing",
      level: "Beginner",
      description: "Learn SEO, Google Ads, Facebook Marketing, and more to grow your business or career.",
      bookmarked: true,
      isArchived: false,
      estimatedTimeLeft: "22h 15m",
      lastSection: "Section 4: Search Engine Optimization",
      lastLesson: "Keyword Research Strategies",
    },
    {
      id: 4,
      title: "UI/UX Design Masterclass",
      instructor: "Daniel Walter Scott",
      progress: 85,
      image: "/placeholder.svg?height=160&width=320",
      lastViewed: "1 week ago",
      rating: 4.8,
      reviews: 156,
      totalLessons: 112,
      completedLessons: 95,
      category: "Design",
      level: "Intermediate",
      description: "Learn UI/UX design from the ground up. Figma, user research, wireframing, and more!",
      bookmarked: false,
      isArchived: false,
      estimatedTimeLeft: "4h 20m",
      lastSection: "Section 10: High-Fidelity Prototypes",
      lastLesson: "Creating Interactive Prototypes in Figma",
    },
    {
      id: 5,
      title: "Python for Data Science and Machine Learning",
      instructor: "Jose Portilla",
      progress: 15,
      image: "/placeholder.svg?height=160&width=320",
      lastViewed: "2 weeks ago",
      rating: 4.7,
      reviews: 201,
      totalLessons: 165,
      completedLessons: 25,
      category: "Data Science",
      level: "Intermediate to Advanced",
      description: "Learn how to use NumPy, Pandas, Seaborn, Matplotlib, Scikit-Learn, and more!",
      bookmarked: true,
      isArchived: false,
      estimatedTimeLeft: "28h 10m",
      lastSection: "Section 3: NumPy Arrays",
      lastLesson: "Array Indexing and Selection",
    },
    {
      id: 6,
      title: "iOS 17 & Swift 5: Complete iOS App Development Bootcamp",
      instructor: "Dr. Angela Yu",
      progress: 100,
      image: "/placeholder.svg?height=160&width=320",
      lastViewed: "Completed",
      rating: 4.9,
      reviews: 134,
      totalLessons: 178,
      completedLessons: 178,
      category: "Mobile Development",
      level: "Beginner to Advanced",
      description: "From beginner to iOS developer with just one course! Fully updated for iOS 17 and Swift 5.",
      bookmarked: false,
      isArchived: false,
      completed: true,
      completionDate: "October 15, 2023",
      estimatedTimeLeft: "0h 0m",
      lastSection: "Section 15: Publishing Your App",
      lastLesson: "Submitting to the App Store",
    },
    {
      id: 7,
      title: "The Complete SQL Bootcamp",
      instructor: "Jose Portilla",
      progress: 52,
      image: "/placeholder.svg?height=160&width=320",
      lastViewed: "5 days ago",
      rating: 4.8,
      reviews: 112,
      totalLessons: 85,
      completedLessons: 44,
      category: "Database",
      level: "Beginner to Intermediate",
      description: "Learn SQL for data analysis and database management with PostgreSQL.",
      bookmarked: false,
      isArchived: true,
      estimatedTimeLeft: "8h 15m",
      lastSection: "Section 6: Advanced SQL Commands",
      lastLesson: "Window Functions",
    },
  ]

  // Sample notifications
  const notifications = [
    {
      id: 1,
      title: "New lesson available",
      course: "Complete Web Development Bootcamp",
      time: "10 minutes ago",
      icon: BookOpen,
      read: false,
    },
    {
      id: 2,
      title: "Assignment due soon",
      course: "Advanced JavaScript Concepts",
      time: "1 hour ago",
      icon: FileText,
      read: false,
    },
    {
      id: 3,
      title: "Your certificate is ready",
      course: "iOS 17 & Swift 5: Complete iOS App Development Bootcamp",
      time: "Yesterday",
      icon: Award,
      read: true,
    },
    {
      id: 4,
      title: "Instructor replied to your question",
      course: "UI/UX Design Masterclass",
      time: "2 days ago",
      icon: MessageSquare,
      read: true,
    },
  ]

  // Sample wishlist courses
  const wishlistCourses = [
    {
      id: 101,
      title: "AWS Certified Solutions Architect",
      instructor: "Stephane Maarek",
      image: "/placeholder.svg?height=160&width=320",
      rating: 4.8,
      reviews: 178,
      price: 94.99,
      salePrice: 15.99,
      category: "Cloud Computing",
    },
    {
      id: 102,
      title: "2023 Complete Front-End Web Development Course",
      instructor: "Colt Steele",
      image: "/placeholder.svg?height=160&width=320",
      rating: 4.9,
      reviews: 143,
      price: 89.99,
      salePrice: 12.99,
      category: "Web Development",
    },
    {
      id: 103,
      title: "Character Art School: Complete Character Drawing",
      instructor: "Scott Harris",
      image: "/placeholder.svg?height=160&width=320",
      rating: 4.7,
      reviews: 121,
      price: 69.99,
      salePrice: 14.99,
      category: "Art & Design",
    },
  ]

  // Sample certificates
  const certificates = [
    {
      id: 1,
      title: "iOS 17 & Swift 5 Developer Certification",
      issuer: "Dr. Angela Yu",
      date: "October 15, 2023",
      image: "/placeholder.svg?height=160&width=320",
      course: "iOS 17 & Swift 5: Complete iOS App Development Bootcamp",
      skills: ["Swift", "iOS Development", "UIKit", "SwiftUI", "Core Data"],
    },
  ]

  // Sample categories for filtering
  const categories = [
    { id: "all", name: "All Categories" },
    { id: "web-development", name: "Web Development" },
    { id: "programming", name: "Programming" },
    { id: "marketing", name: "Marketing" },
    { id: "design", name: "Design" },
    { id: "data-science", name: "Data Science" },
    { id: "mobile-development", name: "Mobile Development" },
    { id: "database", name: "Database" },
  ]

  // Filter and sort courses
  const filteredCourses = courses
    .filter((course) => {
      // Filter by search term
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())

      // Filter by view (all, in-progress, completed)
      const matchesView =
        selectedView === "all"
          ? true
          : selectedView === "completed"
            ? course.progress === 100
            : selectedView === "in-progress"
              ? course.progress < 100 && course.progress > 0
              : selectedView === "not-started"
                ? course.progress === 0
                : true

      // Filter by category
      const matchesCategory =
        categoryFilter === "all" ? true : course.category.toLowerCase().replace(/\s+/g, "-") === categoryFilter

      // Filter by progress
      const matchesProgress =
        progressFilter === "all"
          ? true
          : progressFilter === "not-started"
            ? course.progress === 0
            : progressFilter === "in-progress"
              ? course.progress > 0 && course.progress < 100
              : progressFilter === "completed"
                ? course.progress === 100
                : true

      // Filter by archived status
      const matchesArchived = showArchived ? true : !course.isArchived

      return matchesSearch && matchesView && matchesCategory && matchesProgress && matchesArchived
    })
    .sort((a, b) => {
      // Sort by selected option
      if (sortOption === "recent") {
        // Sort by last viewed (most recent first)
        return a.lastViewed === "Completed"
          ? 1
          : b.lastViewed === "Completed"
            ? -1
            : a.lastViewed.localeCompare(b.lastViewed)
      } else if (sortOption === "title-asc") {
        // Sort by title (A-Z)
        return a.title.localeCompare(b.title)
      } else if (sortOption === "title-desc") {
        // Sort by title (Z-A)
        return b.title.localeCompare(a.title)
      } else if (sortOption === "progress-high") {
        // Sort by progress (highest first)
        return b.progress - a.progress
      } else if (sortOption === "progress-low") {
        // Sort by progress (lowest first)
        return a.progress - b.progress
      }
      return 0
    })

  return (
    <div className="flex min-h-screen bg-[#f7f9fa] font-sans text-[#1c1d1f]">
      {/* Mobile Menu Overlay */}
      {showMobileMenu && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={toggleMobileMenu}></div>}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        } ${showMobileMenu ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} shadow-md`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          <div className="flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#a435f0]">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            {sidebarOpen && <span className="ml-3 text-lg font-bold">Udemy</span>}
          </div>
          <button onClick={toggleSidebar} className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hidden lg:block">
            <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${sidebarOpen ? "rotate-180" : ""}`} />
          </button>
          <button onClick={toggleMobileMenu} className="rounded-md p-1 text-gray-500 hover:bg-gray-100 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <h3 className={`mb-2 text-xs font-semibold uppercase text-gray-500 ${!sidebarOpen && "sr-only"}`}>Learn</h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => handleTabChange("my-learning")}
                  className={`flex w-full items-center rounded-md px-3 py-2 ${
                    activeTab === "my-learning" ? "bg-[#f7f9fa] text-[#a435f0]" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <BookOpen className="h-5 w-5" />
                  {sidebarOpen && <span className="ml-3">My Learning</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange("wishlist")}
                  className={`flex w-full items-center rounded-md px-3 py-2 ${
                    activeTab === "wishlist" ? "bg-[#f7f9fa] text-[#a435f0]" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Heart className="h-5 w-5" />
                  {sidebarOpen && <span className="ml-3">Wishlist</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange("archived")}
                  className={`flex w-full items-center rounded-md px-3 py-2 ${
                    activeTab === "archived" ? "bg-[#f7f9fa] text-[#a435f0]" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Bookmark className="h-5 w-5" />
                  {sidebarOpen && <span className="ml-3">Archived</span>}
                </button>
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className={`mb-2 text-xs font-semibold uppercase text-gray-500 ${!sidebarOpen && "sr-only"}`}>
              Manage
            </h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => handleTabChange("certificates")}
                  className={`flex w-full items-center rounded-md px-3 py-2 ${
                    activeTab === "certificates" ? "bg-[#f7f9fa] text-[#a435f0]" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Award className="h-5 w-5" />
                  {sidebarOpen && <span className="ml-3">Certificates</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange("tools")}
                  className={`flex w-full items-center rounded-md px-3 py-2 ${
                    activeTab === "tools" ? "bg-[#f7f9fa] text-[#a435f0]" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  {sidebarOpen && <span className="ml-3">Learning Tools</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange("notifications")}
                  className={`flex w-full items-center rounded-md px-3 py-2 ${
                    activeTab === "notifications" ? "bg-[#f7f9fa] text-[#a435f0]" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Bell className="h-5 w-5" />
                  {sidebarOpen && <span className="ml-3">Notifications</span>}
                </button>
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className={`mb-2 text-xs font-semibold uppercase text-gray-500 ${!sidebarOpen && "sr-only"}`}>
              Account
            </h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => handleTabChange("account")}
                  className={`flex w-full items-center rounded-md px-3 py-2 ${
                    activeTab === "account" ? "bg-[#f7f9fa] text-[#a435f0]" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <User className="h-5 w-5" />
                  {sidebarOpen && <span className="ml-3">Account Settings</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange("payment-methods")}
                  className={`flex w-full items-center rounded-md px-3 py-2 ${
                    activeTab === "payment-methods" ? "bg-[#f7f9fa] text-[#a435f0]" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <CreditCard className="h-5 w-5" />
                  {sidebarOpen && <span className="ml-3">Payment Methods</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange("purchase-history")}
                  className={`flex w-full items-center rounded-md px-3 py-2 ${
                    activeTab === "purchase-history" ? "bg-[#f7f9fa] text-[#a435f0]" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <DollarSign className="h-5 w-5" />
                  {sidebarOpen && <span className="ml-3">Purchase History</span>}
                </button>
              </li>
            </ul>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => handleTabChange("help")}
                  className={`flex w-full items-center rounded-md px-3 py-2 ${
                    activeTab === "help" ? "bg-[#f7f9fa] text-[#a435f0]" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <HelpCircle className="h-5 w-5" />
                  {sidebarOpen && <span className="ml-3">Help Center</span>}
                </button>
              </li>
            </ul>
          </div>

          {sidebarOpen && (
            <div className="mt-6 rounded-lg bg-[#f7f9fa] p-4">
              <h4 className="font-medium text-[#a435f0]">Become an Instructor</h4>
              <p className="mt-1 text-xs text-gray-600">
                Share your knowledge and earn income by creating online courses
              </p>
              <button className="mt-3 w-full rounded-md border border-[#a435f0] bg-white px-3 py-2 text-sm font-medium text-[#a435f0] hover:bg-[#f7f9fa]">
                Start Teaching
              </button>
            </div>
          )}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <button className="flex w-full items-center rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100">
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="ml-3">Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 ${windowWidth >= 1024 ? (sidebarOpen ? "ml-64" : "ml-20") : "ml-0"}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
          <div className="flex items-center">
            <button onClick={toggleMobileMenu} className="rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
            {!sidebarOpen && windowWidth >= 1024 && (
              <button
                onClick={toggleSidebar}
                className="mr-2 rounded-md p-2 text-gray-500 hover:bg-gray-100 hidden lg:block"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            <div className="relative hidden md:block ml-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search for anything"
                value={searchTerm}
                onChange={handleSearch}
                className="h-10 w-64 rounded-md border border-gray-300 bg-[#f7f9fa] pl-10 pr-4 text-sm focus:border-[#a435f0] focus:outline-none focus:ring-1 focus:ring-[#a435f0] lg:w-80"
              />
            </div>
          </div>

          <div className="relative flex items-center gap-2 sm:gap-4">
            <button className="rounded-md border border-gray-300 p-2 text-gray-500 hover:bg-gray-100 md:hidden">
              <Search className="h-5 w-5" />
            </button>

            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                {notifications.some((n) => !n.read) && (
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#a435f0]"></span>
                )}
                <Bell className="h-5 w-5" />
              </button>

              {showNotifications && (
                <div
                  ref={notificationsRef}
                  className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-md border border-gray-200 bg-white p-4 shadow-lg"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-medium">Notifications</h3>
                    <button className="text-xs text-[#a435f0]">Mark all as read</button>
                  </div>
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`flex gap-3 ${notification.read ? "opacity-75" : ""}`}>
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-[#f7f9fa]">
                          <notification.icon className="h-full w-full p-2 text-[#a435f0]" />
                        </div>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">{notification.title}</span> in{" "}
                            <span className="font-medium">{notification.course}</span>
                          </p>
                          <p className="text-xs text-gray-500">{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <div className="ml-auto h-2 w-2 flex-shrink-0 rounded-full bg-[#a435f0]"></div>
                        )}
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 w-full rounded-md border border-gray-200 py-2 text-center text-sm text-gray-700 hover:bg-gray-100">
                    View All Notifications
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={toggleProfileMenu}
                className="flex items-center rounded-full text-gray-700 hover:bg-gray-100"
              >
                <img src={studentData.avatar || "/placeholder.svg"} alt="Profile" className="h-10 w-10 rounded-full" />
              </button>

              {showProfileMenu && (
                <div
                  ref={profileMenuRef}
                  className="absolute right-0 mt-2 w-56 rounded-md border border-gray-200 bg-white p-2 shadow-lg"
                >
                  <div className="mb-2 border-b border-gray-200 pb-2">
                    <div className="px-3 py-2 text-sm font-medium">{studentData.name}</div>
                    <div className="px-3 py-1 text-xs text-gray-500">{studentData.email}</div>
                  </div>
                  <ul>
                    <li>
                      <button
                        onClick={() => handleTabChange("account")}
                        className="flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleTabChange("my-learning")}
                        className="flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        My Learning
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleTabChange("wishlist")}
                        className="flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Heart className="mr-2 h-4 w-4" />
                        Wishlist
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleTabChange("purchase-history")}
                        className="flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <DollarSign className="mr-2 h-4 w-4" />
                        Purchase History
                      </button>
                    </li>
                    <li className="mt-2 border-t border-gray-200 pt-2">
                      <button className="flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 md:p-6">
          {/* My Learning Tab */}
          {activeTab === "my-learning" && (
            <div className="space-y-6">
              <div className="flex flex-col justify-between md:flex-row md:items-center">
                <div>
                  <h1 className="text-2xl font-bold md:text-3xl">My Learning</h1>
                  <p className="text-gray-600">Keep track of your learning progress</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 md:mt-0">
                  <button
                    onClick={() => handleViewChange("all")}
                    className={`rounded-md px-4 py-2 text-sm font-medium ${
                      selectedView === "all"
                        ? "bg-[#a435f0] text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    All courses
                  </button>
                  <button
                    onClick={() => handleViewChange("in-progress")}
                    className={`rounded-md px-4 py-2 text-sm font-medium ${
                      selectedView === "in-progress"
                        ? "bg-[#a435f0] text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    In progress
                  </button>
                  <button
                    onClick={() => handleViewChange("completed")}
                    className={`rounded-md px-4 py-2 text-sm font-medium ${
                      selectedView === "completed"
                        ? "bg-[#a435f0] text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => handleViewChange("not-started")}
                    className={`rounded-md px-4 py-2 text-sm font-medium ${
                      selectedView === "not-started"
                        ? "bg-[#a435f0] text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    Not started
                  </button>
                </div>
              </div>

              {/* Learning Statistics */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-500">Your Progress</h3>
                    <div className="rounded-full bg-[#f7f9fa] p-2">
                      <TrendingUp className="h-5 w-5 text-[#a435f0]" />
                    </div>
                  </div>
                  <p className="mt-4 text-3xl font-bold">62%</p>
                  <div className="mt-2 text-sm text-gray-600">Overall course completion</div>
                  <div className="mt-3 h-2.5 w-full rounded-full bg-gray-100">
                    <div className="h-2.5 w-[62%] rounded-full bg-[#a435f0]"></div>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-500">Active Courses</h3>
                    <div className="rounded-full bg-[#f7f9fa] p-2">
                      <BookOpen className="h-5 w-5 text-[#a435f0]" />
                    </div>
                  </div>
                  <p className="mt-4 text-3xl font-bold">5</p>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                    <span className="font-medium text-green-500">+2</span>
                    <span className="ml-1 text-gray-500">from last month</span>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-500">Hours Spent</h3>
                    <div className="rounded-full bg-[#f7f9fa] p-2">
                      <Clock className="h-5 w-5 text-[#a435f0]" />
                    </div>
                  </div>
                  <p className="mt-4 text-3xl font-bold">42.5</p>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                    <span className="font-medium text-green-500">+8.3</span>
                    <span className="ml-1 text-gray-500">from last week</span>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-500">Certificates Earned</h3>
                    <div className="rounded-full bg-[#f7f9fa] p-2">
                      <Award className="h-5 w-5 text-[#a435f0]" />
                    </div>
                  </div>
                  <p className="mt-4 text-3xl font-bold">1</p>
                  <div
                    className="mt-2 text-sm text-[#a435f0] font-medium cursor-pointer"
                    onClick={() => handleTabChange("certificates")}
                  >
                    View certificate
                  </div>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search your courses..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="h-10 w-full rounded-md border border-gray-300 bg-white pl-10 pr-4 text-sm focus:border-[#a435f0] focus:outline-none focus:ring-1 focus:ring-[#a435f0]"
                  />
                </div>
                <button
                  onClick={toggleFilters}
                  className="flex items-center justify-center rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </button>
                <select
                  className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#a435f0] focus:outline-none focus:ring-1 focus:ring-[#a435f0]"
                  value={sortOption}
                  onChange={handleSortChange}
                >
                  <option value="recent">Sort by: Recently Accessed</option>
                  <option value="title-asc">Sort by: Title A-Z</option>
                  <option value="title-desc">Sort by: Title Z-A</option>
                  <option value="progress-high">Sort by: Progress (High to Low)</option>
                  <option value="progress-low">Sort by: Progress (Low to High)</option>
                </select>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-medium">Filters</h3>
                    <button onClick={toggleFilters} className="text-xs text-[#a435f0]">
                      Clear all
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <div>
                      <h4 className="mb-2 text-sm font-medium">Categories</h4>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <label key={category.id} className="flex items-center">
                            <input
                              type="radio"
                              name="category"
                              checked={categoryFilter === category.id}
                              onChange={() => handleCategoryFilterChange(category.id)}
                              className="h-4 w-4 rounded border-gray-300 text-[#a435f0]"
                            />
                            <span className="ml-2 text-sm">{category.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-medium">Progress</h4>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="progress"
                            checked={progressFilter === "all"}
                            onChange={() => handleProgressFilterChange("all")}
                            className="h-4 w-4 rounded border-gray-300 text-[#a435f0]"
                          />
                          <span className="ml-2 text-sm">All</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="progress"
                            checked={progressFilter === "not-started"}
                            onChange={() => handleProgressFilterChange("not-started")}
                            className="h-4 w-4 rounded border-gray-300 text-[#a435f0]"
                          />
                          <span className="ml-2 text-sm">Not started (0%)</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="progress"
                            checked={progressFilter === "in-progress"}
                            onChange={() => handleProgressFilterChange("in-progress")}
                            className="h-4 w-4 rounded border-gray-300 text-[#a435f0]"
                          />
                          <span className="ml-2 text-sm">In progress (1-99%)</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="progress"
                            checked={progressFilter === "completed"}
                            onChange={() => handleProgressFilterChange("completed")}
                            className="h-4 w-4 rounded border-gray-300 text-[#a435f0]"
                          />
                          <span className="ml-2 text-sm">Completed (100%)</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-medium">Other</h4>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={showArchived}
                            onChange={toggleArchivedCourses}
                            className="h-4 w-4 rounded border-gray-300 text-[#a435f0]"
                          />
                          <span className="ml-2 text-sm">Show archived courses</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={toggleFilters}
                      className="rounded-md bg-[#a435f0] px-4 py-2 text-sm font-medium text-white hover:bg-[#8710d8]"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}

              {/* Course List */}
              <div className="space-y-4">
                {filteredCourses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
                    <BookOpen className="h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium">No courses found</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Try adjusting your search or filter to find what you're looking for.
                    </p>
                  </div>
                ) : (
                  filteredCourses.map((course, index) => (
                    <div
                      key={course.id}
                      className={`overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md ${course.isArchived ? "opacity-75" : ""}`}
                    >
                      <div className="flex flex-col md:flex-row">
                        <div
                          className="relative h-48 w-full cursor-pointer md:h-auto md:w-64 md:flex-shrink-0"
                          onClick={() => handleCourseClick(index)}
                        >
                          <img
                            src={course.image || "/placeholder.svg"}
                            alt={course.title}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-[#a435f0] backdrop-blur-sm transition-all hover:bg-white">
                              <Play className="h-5 w-5" />
                            </button>
                          </div>
                          {course.progress === 100 && (
                            <div className="absolute left-3 top-3 rounded-md bg-green-500 px-2 py-1 text-xs font-medium text-white">
                              Completed
                            </div>
                          )}
                          {course.isArchived && (
                            <div className="absolute left-3 top-3 rounded-md bg-gray-500 px-2 py-1 text-xs font-medium text-white">
                              Archived
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col p-4">
                          <div className="mb-2 flex items-start justify-between">
                            <div>
                              <h3
                                className="text-lg font-bold line-clamp-1 cursor-pointer hover:text-[#a435f0]"
                                onClick={() => handleCourseClick(index)}
                              >
                                {course.title}
                              </h3>
                              <p className="text-sm text-gray-500">{course.instructor}</p>
                            </div>
                            <div className="flex items-center">
                              <button
                                className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // Toggle bookmark logic would go here
                                }}
                              >
                                {course.bookmarked ? (
                                  <Bookmark className="h-5 w-5 fill-[#a435f0] text-[#a435f0]" />
                                ) : (
                                  <Bookmark className="h-5 w-5" />
                                )}
                              </button>
                              <div className="relative ml-1">
                                <button className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100">
                                  <MoreVertical className="h-5 w-5" />
                                </button>
                                {/* Dropdown menu would go here */}
                              </div>
                            </div>
                          </div>

                          <div className="mb-3 mt-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Progress</span>
                              <span className="font-medium">{course.progress}% complete</span>
                            </div>
                            <div className="mt-1 h-2 w-full rounded-full bg-gray-100">
                              <div
                                className={`h-2 rounded-full ${course.progress === 100 ? "bg-green-500" : "bg-[#a435f0]"}`}
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="mt-auto">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="mr-1 h-4 w-4" />
                                <span>{course.estimatedTimeLeft} left</span>
                                <span className="mx-2">•</span>
                                <span>
                                  {course.completedLessons}/{course.totalLessons} lessons
                                </span>
                              </div>
                              <button
                                className={`rounded-md px-4 py-2 text-sm font-medium ${
                                  course.progress === 100
                                    ? "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                                    : "bg-[#a435f0] text-white hover:bg-[#8710d8]"
                                }`}
                                onClick={() => handleCourseClick(index)}
                              >
                                {course.progress === 100 ? "Leave a review" : "Continue learning"}
                              </button>
                            </div>

                            {course.progress > 0 && course.progress < 100 && (
                              <div className="mt-3 text-sm text-gray-500">
                                <p>Last viewed: {course.lastViewed}</p>
                                <p className="mt-1">
                                  <span className="font-medium">{course.lastSection}:</span> {course.lastLesson}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Recommended Courses Section */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-bold">Recommended Based on Your Learning</h2>
                  <button className="text-sm text-[#a435f0]">View All</button>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="relative h-40 bg-gray-100">
                      <img
                        src="/placeholder.svg?height=160&width=320"
                        alt="React Native for Mobile Apps"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <div className="absolute bottom-4 left-4">
                          <span className="rounded-md bg-yellow-500 px-2 py-1 text-xs font-medium text-white">
                            Bestseller
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="rounded-full bg-[#f7f9fa] px-2 py-1 text-xs text-[#a435f0]">
                          Mobile Development
                        </span>
                        <div className="flex items-center">
                          <Star className="mr-1 h-4 w-4 fill-[#eb8a2f] text-[#eb8a2f]" />
                          <span className="text-sm font-medium">4.8</span>
                        </div>
                      </div>
                      <h3 className="mb-2 text-lg font-bold">React Native for Mobile Apps</h3>
                      <p className="mb-4 text-sm text-gray-500">
                        Learn to build native mobile apps for both iOS and Android.
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold">$16.99</span>
                          <span className="ml-2 text-sm line-through text-gray-500">$94.99</span>
                        </div>
                        <button className="rounded-md bg-[#a435f0] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#8710d8]">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Certificates Tab */}
          {activeTab === "certificates" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold md:text-3xl">My Certificates</h1>
                <p className="text-gray-600">View and download your course completion certificates</p>
              </div>

              {/* Certificates */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-lg font-bold">Your Certificates</h2>
                {certificates.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 text-center">
                    <Award className="h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium">No certificates yet</h3>
                    <p className="mt-2 text-sm text-gray-500">Complete a course to earn your first certificate.</p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {certificates.map((certificate) => (
                      <div
                        key={certificate.id}
                        className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
                      >
                        <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                          <img
                            src={certificate.image || "/placeholder.svg"}
                            alt={certificate.title}
                            className="h-40 w-auto object-contain"
                          />
                          <div className="absolute top-3 right-3 flex space-x-2">
                            <button className="rounded-full bg-white/80 p-1.5 text-gray-700 backdrop-blur-sm transition-all hover:bg-white">
                              <Download className="h-4 w-4" />
                            </button>
                            <button className="rounded-full bg-white/80 p-1.5 text-gray-700 backdrop-blur-sm transition-all hover:bg-white">
                              <Share2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-bold mb-1">{certificate.title}</h3>
                          <p className="text-sm text-gray-500 mb-3">
                            Issued by {certificate.issuer} • {certificate.date}
                          </p>
                          <div className="mb-3">
                            <h4 className="text-sm font-medium mb-1">Skills</h4>
                            <div className="flex flex-wrap gap-1">
                              {certificate.skills.map((skill, index) => (
                                <span key={index} className="rounded-full bg-[#f7f9fa] px-2 py-1 text-xs text-gray-700">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <button className="w-full rounded-md border border-[#a435f0] bg-white py-2 text-center text-sm font-medium text-[#a435f0] hover:bg-[#f7f9fa]">
                            View Certificate
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Certificate Benefits */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold">Why Certificates Matter</h2>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="rounded-lg border border-gray-200 bg-[#f7f9fa] p-4">
                    <div className="mb-3 rounded-full bg-[#f7f9fa] p-2 w-fit">
                      <Award className="h-6 w-6 text-[#a435f0]" />
                    </div>
                    <h3 className="text-md font-medium mb-2">Showcase Your Skills</h3>
                    <p className="text-sm text-gray-600">
                      Add certificates to your LinkedIn profile and resume to demonstrate your expertise to potential
                      employers.
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-[#f7f9fa] p-4">
                    <div className="mb-3 rounded-full bg-[#f7f9fa] p-2 w-fit">
                      <TrendingUp className="h-6 w-6 text-[#a435f0]" />
                    </div>
                    <h3 className="text-md font-medium mb-2">Career Advancement</h3>
                    <p className="text-sm text-gray-600">
                      Use your certificates to negotiate promotions or apply for new positions in your field.
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-[#f7f9fa] p-4">
                    <div className="mb-3 rounded-full bg-[#f7f9fa] p-2 w-fit">
                      <Lightbulb className="h-6 w-6 text-[#a435f0]" />
                    </div>
                    <h3 className="text-md font-medium mb-2">Validate Your Knowledge</h3>
                    <p className="text-sm text-gray-600">
                      Prove your understanding of key concepts and demonstrate your commitment to continuous learning.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Course Details Modal */}
          {showCourseDetails && selectedCourse !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
              <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-lg">
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-4">
                  <h2 className="text-xl font-bold">{courses[selectedCourse].title}</h2>
                  <button
                    onClick={() => setShowCourseDetails(false)}
                    className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="mb-6 flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-2/3">
                      <div className="relative h-64 rounded-lg bg-gray-100 overflow-hidden">
                        <img
                          src={courses[selectedCourse].image || "/placeholder.svg"}
                          alt={courses[selectedCourse].title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <button className="flex h-16 w-16 items-center justify-center rounded-full bg-white/80 text-[#a435f0] backdrop-blur-sm transition-all hover:bg-white">
                            <Play className="h-8 w-8" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h3 className="text-lg font-bold mb-2">About this course</h3>
                        <p className="text-gray-600">{courses[selectedCourse].description}</p>

                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div className="flex items-center">
                            <Layers className="h-5 w-5 text-gray-500 mr-2" />
                            <div>
                              <p className="text-sm font-medium">Level</p>
                              <p className="text-sm text-gray-500">{courses[selectedCourse].level}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <BookOpen className="h-5 w-5 text-gray-500 mr-2" />
                            <div>
                              <p className="text-sm font-medium">Lessons</p>
                              <p className="text-sm text-gray-500">{courses[selectedCourse].totalLessons} total</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-1/3">
                      <div className="rounded-lg border border-gray-200 bg-[#f7f9fa] p-4">
                        <h3 className="text-lg font-bold mb-4">Your Progress</h3>
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Completion</span>
                            <span className="font-medium">{courses[selectedCourse].progress}%</span>
                          </div>
                          <div className="mt-1 h-2 w-full rounded-full bg-white">
                            <div
                              className={`h-2 rounded-full ${courses[selectedCourse].progress === 100 ? "bg-green-500" : "bg-[#a435f0]"}`}
                              style={{ width: `${courses[selectedCourse].progress}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-sm">Lessons Completed</span>
                            </div>
                            <span className="text-sm font-medium">
                              {courses[selectedCourse].completedLessons}/{courses[selectedCourse].totalLessons}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-sm">Last Viewed</span>
                            </div>
                            <span className="text-sm">{courses[selectedCourse].lastViewed}</span>
                          </div>
                        </div>

                        <button className="mt-4 w-full rounded-md bg-[#a435f0] py-2.5 text-center text-sm font-medium text-white hover:bg-[#8710d8]">
                          Continue Learning
                        </button>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <button className="flex items-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <Download className="mr-2 h-4 w-4" />
                            Resources
                          </button>
                          <button className="flex items-center rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Q&A
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="mt-6">
                    <h3 className="text-lg font-bold mb-4">Course Content</h3>
                    <div className="space-y-3">
                      <div className="rounded-lg border border-gray-200 overflow-hidden">
                        <div className="flex items-center justify-between bg-[#f7f9fa] px-4 py-3">
                          <div className="flex items-center">
                            <ChevronDown className="h-5 w-5 text-gray-500 mr-2" />
                            <h4 className="font-medium">Section 1: Introduction</h4>
                          </div>
                          <div className="text-sm text-gray-500">3/3 • 15 min</div>
                        </div>
                        <div className="p-4 bg-white">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                                <span className="text-sm">Welcome to the Course</span>
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <Play className="h-3 w-3 mr-1" />
                                <span>5 min</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                                <span className="text-sm">Course Overview</span>
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <Play className="h-3 w-3 mr-1" />
                                <span>7 min</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                                <span className="text-sm">Setting Up Your Environment</span>
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <Play className="h-3 w-3 mr-1" />
                                <span>3 min</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg border border-gray-200 overflow-hidden">
                        <div className="flex items-center justify-between bg-[#f7f9fa] px-4 py-3">
                          <div className="flex items-center">
                            <ChevronRight className="h-5 w-5 text-gray-500 mr-2" />
                            <h4 className="font-medium">Section 2: Core Concepts</h4>
                          </div>
                          <div className="text-sm text-gray-500">12/20 • 2h 30min</div>
                        </div>
                      </div>

                      <div className="rounded-lg border border-gray-200 overflow-hidden">
                        <div className="flex items-center justify-between bg-[#f7f9fa] px-4 py-3">
                          <div className="flex items-center">
                            <ChevronRight className="h-5 w-5 text-gray-500 mr-2" />
                            <h4 className="font-medium">Section 3: Advanced Topics</h4>
                          </div>
                          <div className="text-sm text-gray-500">0/15 • 3h 15min</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Instructor Information */}
                  <div className="mt-6">
                    <h3 className="text-lg font-bold mb-4">Your Instructor</h3>
                    <div className="flex items-start gap-4">
                      <img
                        src="/placeholder.svg?height=80&width=80"
                        alt={courses[selectedCourse].instructor}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-medium">{courses[selectedCourse].instructor}</h4>
                        <p className="text-sm text-gray-500 mt-1">Professional Developer & Instructor</p>
                        <div className="mt-2 flex items-center">
                          <Star className="h-4 w-4 fill-[#eb8a2f] text-[#eb8a2f]" />
                          <span className="ml-1 text-sm">{courses[selectedCourse].rating} Instructor Rating</span>
                          <span className="mx-2 text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{courses[selectedCourse].reviews} Reviews</span>
                          <span className="mx-2 text-gray-500">•</span>
                          <span className="text-sm text-gray-500">50K+ Students</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-200 pt-6">
                    <button className="flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Course Certificate
                    </button>
                    <button className="flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Course
                    </button>
                    <button className="flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Bookmark className="mr-2 h-4 w-4" />
                      {courses[selectedCourse].bookmarked ? "Remove from Saved" : "Save Course"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs would use the tabbed interface pattern */}
          {activeTab !== "my-learning" && activeTab !== "certificates" && (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-6">
              <div className="rounded-full bg-[#f7f9fa] p-3">
                <Lightbulb className="h-6 w-6 text-[#a435f0]" />
              </div>
              <h3 className="mt-4 text-lg font-medium">Coming Soon</h3>
              <p className="mt-2 text-center text-sm text-gray-500">
                The {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} section is under development and will be
                available soon.
              </p>
            </div>
          )}

          {/* Mobile App Promotion */}
          <div className="mt-8 rounded-lg border border-gray-200 bg-[#f7f9fa] p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-[#a435f0]">Learn on the go!</h3>
                <p className="mt-2 text-gray-600">
                  Download our mobile app for iOS and Android to learn anytime, anywhere.
                </p>
                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
                  <button className="flex items-center rounded-md bg-[#1c1d1f] px-4 py-2 text-sm font-medium text-white">
                    <Smartphone className="mr-2 h-4 w-4" />
                    App Store
                  </button>
                  <button className="flex items-center rounded-md bg-[#1c1d1f] px-4 py-2 text-sm font-medium text-white">
                    <Smartphone className="mr-2 h-4 w-4" />
                    Google Play
                  </button>
                </div>
              </div>
              <div className="hidden md:block">
                <img src="/placeholder.svg?height=120&width=200" alt="Mobile App" className="h-30 w-auto" />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white p-4 text-center text-sm text-gray-500">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div>© 2023 Udemy, Inc. All rights reserved.</div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-[#a435f0]">
                Terms
              </a>
              <a href="#" className="hover:text-[#a435f0]">
                Privacy
              </a>
              <a href="#" className="hover:text-[#a435f0]">
                Help
              </a>
              <a href="#" className="hover:text-[#a435f0]">
                Accessibility
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

