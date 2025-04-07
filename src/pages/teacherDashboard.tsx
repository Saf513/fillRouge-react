"use client"

import { useState, useEffect } from "react"
import {
  BarChart3,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  DollarSign,
  FileText,
  Grid,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  MoreVertical,
  PenTool,
  Plus,
  Search,
  Settings,
  Star,
  TrendingUp,
  Upload,
  User,
  Users,
  X,
  Bell,
  Code,
  Layout,
} from "lucide-react"
import TeacherProfile from "./teacher/profile/teacherProfile"
import TeacherSettings from "./teacher/settings/teacherSettings"

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNewCourseModal, setShowNewCourseModal] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0)

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
    if (showNotifications) {
      setShowProfileMenu(false)
      setShowMobileMenu(false)
    }
  }

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu)
    if (showProfileMenu) {
      setShowNotifications(false)
      setShowMobileMenu(false)
    }
  }

  const handleCourseClick = (index: number) => {
    setSelectedCourse(selectedCourse === index ? null : index)
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (windowWidth < 1024) {
      setShowMobileMenu(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f7f7f8] font-sans text-[#262626]">
      {/* Mobile Menu Overlay */}
      {showMobileMenu && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={toggleMobileMenu}></div>}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        } ${showMobileMenu ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} shadow-md`}
      >
        <div className="flex h-16 items-center justify-between border-b border-[#f1f1f3] px-4">
          <div className="flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#ff9500]">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            {sidebarOpen && <span className="ml-3 text-lg font-bold">EduTeach</span>}
          </div>
          <button onClick={toggleSidebar} className="rounded-md p-1 text-[#4c4c4d] hover:bg-[#f1f1f3] hidden lg:block">
            <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${sidebarOpen ? "rotate-180" : ""}`} />
          </button>
          <button onClick={toggleMobileMenu} className="rounded-md p-1 text-[#4c4c4d] hover:bg-[#f1f1f3] lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => handleTabChange("dashboard")}
                className={`flex w-full items-center rounded-md px-3 py-2 ${
                  activeTab === "dashboard" ? "bg-[#fff4e5] text-[#ff9500]" : "text-[#4c4c4d] hover:bg-[#f1f1f3]"
                }`}
              >
                <LayoutDashboard className="h-5 w-5" />
                {sidebarOpen && <span className="ml-3">Dashboard</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabChange("courses")}
                className={`flex w-full items-center rounded-md px-3 py-2 ${
                  activeTab === "courses" ? "bg-[#fff4e5] text-[#ff9500]" : "text-[#4c4c4d] hover:bg-[#f1f1f3]"
                }`}
              >
                <BookOpen className="h-5 w-5" />
                {sidebarOpen && <span className="ml-3">My Courses</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabChange("students")}
                className={`flex w-full items-center rounded-md px-3 py-2 ${
                  activeTab === "students" ? "bg-[#fff4e5] text-[#ff9500]" : "text-[#4c4c4d] hover:bg-[#f1f1f3]"
                }`}
              >
                <Users className="h-5 w-5" />
                {sidebarOpen && <span className="ml-3">Students</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabChange("messages")}
                className={`flex w-full items-center rounded-md px-3 py-2 ${
                  activeTab === "messages" ? "bg-[#fff4e5] text-[#ff9500]" : "text-[#4c4c4d] hover:bg-[#f1f1f3]"
                }`}
              >
                <MessageSquare className="h-5 w-5" />
                {sidebarOpen && <span className="ml-3">Messages</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabChange("analytics")}
                className={`flex w-full items-center rounded-md px-3 py-2 ${
                  activeTab === "analytics" ? "bg-[#fff4e5] text-[#ff9500]" : "text-[#4c4c4d] hover:bg-[#f1f1f3]"
                }`}
              >
                <BarChart3 className="h-5 w-5" />
                {sidebarOpen && <span className="ml-3">Analytics</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabChange("schedule")}
                className={`flex w-full items-center rounded-md px-3 py-2 ${
                  activeTab === "schedule" ? "bg-[#fff4e5] text-[#ff9500]" : "text-[#4c4c4d] hover:bg-[#f1f1f3]"
                }`}
              >
                <Calendar className="h-5 w-5" />
                {sidebarOpen && <span className="ml-3">Schedule</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabChange("earnings")}
                className={`flex w-full items-center rounded-md px-3 py-2 ${
                  activeTab === "earnings" ? "bg-[#fff4e5] text-[#ff9500]" : "text-[#4c4c4d] hover:bg-[#f1f1f3]"
                }`}
              >
                <DollarSign className="h-5 w-5" />
                {sidebarOpen && <span className="ml-3">Earnings</span>}
              </button>
            </li>
          </ul>

          <div className="mt-6 border-t border-[#f1f1f3] pt-6">
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => handleTabChange("profile")}
                  className={`flex w-full items-center rounded-md px-3 py-2 ${
                    activeTab === "profile" ? "bg-[#fff4e5] text-[#ff9500]" : "text-[#4c4c4d] hover:bg-[#f1f1f3]"
                  }`}
                >
                  <User className="h-5 w-5" />
                  {sidebarOpen && <span className="ml-3">Profile</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange("settings")}
                  className={`flex w-full items-center rounded-md px-3 py-2 ${
                    activeTab === "settings" ? "bg-[#fff4e5] text-[#ff9500]" : "text-[#4c4c4d] hover:bg-[#f1f1f3]"
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  {sidebarOpen && <span className="ml-3">Settings</span>}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleTabChange("help")}
                  className={`flex w-full items-center rounded-md px-3 py-2 ${
                    activeTab === "help" ? "bg-[#fff4e5] text-[#ff9500]" : "text-[#4c4c4d] hover:bg-[#f1f1f3]"
                  }`}
                >
                  <HelpCircle className="h-5 w-5" />
                  {sidebarOpen && <span className="ml-3">Help Center</span>}
                </button>
              </li>
            </ul>
          </div>
        </nav>

        <div className="border-t border-[#f1f1f3] p-4">
          <button className="flex w-full items-center rounded-md px-3 py-2 text-[#4c4c4d] hover:bg-[#f1f1f3]">
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="ml-3">Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-20">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#f1f1f3] bg-white px-4 md:px-6">
          <div className="flex items-center">
            <button onClick={toggleMobileMenu} className="rounded-md p-2 text-[#4c4c4d] hover:bg-[#f1f1f3] lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <button
              onClick={toggleSidebar}
              className="ml-2 rounded-md p-2 text-[#4c4c4d] hover:bg-[#f1f1f3] hidden lg:block"
            >
              <Grid className="h-5 w-5" />
            </button>
            <div className="ml-4 lg:hidden">
              <h1 className="text-lg font-bold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
            </div>
          </div>

          <div className="relative flex items-center gap-2 sm:gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4c4c4d]" />
              <input
                type="text"
                placeholder="Search..."
                className="h-10 w-40 rounded-md border border-[#f1f1f3] bg-[#f7f7f8] pl-10 pr-4 text-sm focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500] lg:w-60"
              />
            </div>

            <button
              onClick={() => setShowNewCourseModal(true)}
              className="hidden items-center rounded-md bg-[#ff9500] px-4 py-2 text-sm font-medium text-white hover:bg-[#ff9500]/90 sm:flex"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Course
            </button>

            <button
              onClick={() => setShowNewCourseModal(true)}
              className="flex items-center rounded-full bg-[#ff9500] p-2 text-white hover:bg-[#ff9500]/90 sm:hidden"
            >
              <Plus className="h-5 w-5" />
            </button>

            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="relative rounded-full p-2 text-[#4c4c4d] hover:bg-[#f1f1f3]"
              >
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#ff9500]"></span>
                <Bell className="h-5 w-5" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-md border border-[#f1f1f3] bg-white p-4 shadow-lg">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-medium">Notifications</h3>
                    <button className="text-xs text-[#ff9500]">Mark all as read</button>
                  </div>
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    <div className="flex gap-3">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-[#fff4e5]">
                        <User className="h-full w-full p-2 text-[#ff9500]" />
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Sarah Johnson</span> asked a question in{" "}
                          <span className="font-medium">UI/UX Design Fundamentals</span>
                        </p>
                        <p className="text-xs text-[#4c4c4d]">10 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-[#fff4e5]">
                        <Star className="h-full w-full p-2 text-[#ff9500]" />
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Michael Brown</span> left a 5-star review on{" "}
                          <span className="font-medium">Advanced JavaScript</span>
                        </p>
                        <p className="text-xs text-[#4c4c4d]">1 hour ago</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-[#fff4e5]">
                        <Users className="h-full w-full p-2 text-[#ff9500]" />
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">5 new students</span> enrolled in{" "}
                          <span className="font-medium">Web Design Fundamentals</span>
                        </p>
                        <p className="text-xs text-[#4c4c4d]">3 hours ago</p>
                      </div>
                    </div>
                  </div>
                  <button className="mt-4 w-full rounded-md border border-[#f1f1f3] py-2 text-center text-sm text-[#4c4c4d] hover:bg-[#f1f1f3]">
                    View All Notifications
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={toggleProfileMenu}
                className="flex items-center rounded-full text-[#4c4c4d] hover:bg-[#f1f1f3]"
              >
                <img src="/placeholder.svg?height=40&width=40" alt="Profile" className="h-10 w-10 rounded-full" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-md border border-[#f1f1f3] bg-white p-2 shadow-lg">
                  <div className="mb-2 border-b border-[#f1f1f3] pb-2">
                    <div className="px-3 py-2 text-sm font-medium">John Smith</div>
                    <div className="px-3 py-1 text-xs text-[#4c4c4d]">john.smith@example.com</div>
                  </div>
                  <ul>
                    <li>
                      <button
                        onClick={() => handleTabChange("profile")}
                        className="flex w-full items-center rounded-md px-3 py-2 text-sm text-[#4c4c4d] hover:bg-[#f1f1f3]"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleTabChange("settings")}
                        className="flex w-full items-center rounded-md px-3 py-2 text-sm text-[#4c4c4d] hover:bg-[#f1f1f3]"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </button>
                    </li>
                    <li className="mt-2 border-t border-[#f1f1f3] pt-2">
                      <button className="flex w-full items-center rounded-md px-3 py-2 text-sm text-[#4c4c4d] hover:bg-[#f1f1f3]">
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
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="flex flex-col justify-between md:flex-row md:items-center">
                <div>
                  <h1 className="text-2xl font-bold md:text-3xl">Welcome back, John!</h1>
                  <p className="text-[#4c4c4d]">Here's what's happening with your courses today.</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 md:mt-0">
                  <button className="rounded-md border border-[#f1f1f3] bg-white px-4 py-2 text-sm font-medium hover:bg-[#f1f1f3]">
                    Last 7 days
                  </button>
                  <button className="rounded-md border border-[#f1f1f3] bg-white px-4 py-2 text-sm font-medium hover:bg-[#f1f1f3]">
                    Last 30 days
                  </button>
                  <button className="rounded-md border border-[#f1f1f3] bg-white px-4 py-2 text-sm font-medium hover:bg-[#f1f1f3]">
                    All time
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border border-[#f1f1f3] bg-white p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-[#4c4c4d]">Total Students</h3>
                    <div className="rounded-full bg-[#fff4e5] p-2">
                      <Users className="h-5 w-5 text-[#ff9500]" />
                    </div>
                  </div>
                  <p className="mt-4 text-3xl font-bold">1,245</p>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                    <span className="font-medium text-green-500">+12.5%</span>
                    <span className="ml-1 text-[#4c4c4d]">from last month</span>
                  </div>
                </div>

                <div className="rounded-lg border border-[#f1f1f3] bg-white p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-[#4c4c4d]">Course Enrollments</h3>
                    <div className="rounded-full bg-[#fff4e5] p-2">
                      <BookOpen className="h-5 w-5 text-[#ff9500]" />
                    </div>
                  </div>
                  <p className="mt-4 text-3xl font-bold">3,872</p>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                    <span className="font-medium text-green-500">+8.2%</span>
                    <span className="ml-1 text-[#4c4c4d]">from last month</span>
                  </div>
                </div>

                <div className="rounded-lg border border-[#f1f1f3] bg-white p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-[#4c4c4d]">Total Revenue</h3>
                    <div className="rounded-full bg-[#fff4e5] p-2">
                      <DollarSign className="h-5 w-5 text-[#ff9500]" />
                    </div>
                  </div>
                  <p className="mt-4 text-3xl font-bold">$24,568</p>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                    <span className="font-medium text-green-500">+18.3%</span>
                    <span className="ml-1 text-[#4c4c4d]">from last month</span>
                  </div>
                </div>

                <div className="rounded-lg border border-[#f1f1f3] bg-white p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-[#4c4c4d]">Course Rating</h3>
                    <div className="rounded-full bg-[#fff4e5] p-2">
                      <Star className="h-5 w-5 text-[#ff9500]" />
                    </div>
                  </div>
                  <p className="mt-4 text-3xl font-bold">4.8</p>
                  <div className="mt-2 flex items-center text-sm">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= 4 ? "fill-[#ff9500] text-[#ff9500]" : "text-[#f1f1f3]"}`}
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-[#4c4c4d]">from 256 reviews</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity & Performance */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Activity */}
                <div className="rounded-lg border border-[#f1f1f3] bg-white p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-bold">Recent Activity</h2>
                    <button className="text-sm text-[#ff9500]">View All</button>
                  </div>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-[#fff4e5]">
                        <User className="h-full w-full p-2 text-[#ff9500]" />
                      </div>
                      <div>
                        <p className="font-medium">New student enrolled</p>
                        <p className="text-sm text-[#4c4c4d]">Emily Johnson enrolled in "UI/UX Design Fundamentals"</p>
                        <p className="mt-1 text-xs text-[#4c4c4d]">10 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-[#fff4e5]">
                        <MessageSquare className="h-full w-full p-2 text-[#ff9500]" />
                      </div>
                      <div>
                        <p className="font-medium">New question asked</p>
                        <p className="text-sm text-[#4c4c4d]">
                          Michael Brown asked a question in "Advanced JavaScript"
                        </p>
                        <p className="mt-1 text-xs text-[#4c4c4d]">1 hour ago</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-[#fff4e5]">
                        <Star className="h-full w-full p-2 text-[#ff9500]" />
                      </div>
                      <div>
                        <p className="font-medium">New course review</p>
                        <p className="text-sm text-[#4c4c4d]">
                          Sarah Thompson left a 5-star review on "Web Design Fundamentals"
                        </p>
                        <p className="mt-1 text-xs text-[#4c4c4d]">3 hours ago</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-[#fff4e5]">
                        <FileText className="h-full w-full p-2 text-[#ff9500]" />
                      </div>
                      <div>
                        <p className="font-medium">Assignment submitted</p>
                        <p className="text-sm text-[#4c4c4d]">
                          David Wilson submitted an assignment in "Front-End Web Development"
                        </p>
                        <p className="mt-1 text-xs text-[#4c4c4d]">5 hours ago</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Chart */}
                <div className="rounded-lg border border-[#f1f1f3] bg-white p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-bold">Course Performance</h2>
                    <select className="rounded-md border border-[#f1f1f3] bg-white px-3 py-2 text-sm">
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                      <option>Last 3 months</option>
                      <option>Last year</option>
                    </select>
                  </div>
                  <div className="h-64">
                    {/* Chart would go here - using a placeholder */}
                    <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed border-[#f1f1f3] bg-[#f7f7f8] p-6">
                      <BarChart3 className="mb-2 h-10 w-10 text-[#4c4c4d]" />
                      <p className="text-center text-sm text-[#4c4c4d]">
                        Course performance chart showing enrollments, completions, and revenue over time
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Popular Courses */}
              <div className="rounded-lg border border-[#f1f1f3] bg-white p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-bold">Popular Courses</h2>
                  <button className="text-sm text-[#ff9500]">View All Courses</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] border-collapse">
                    <thead>
                      <tr className="border-b border-[#f1f1f3]">
                        <th className="py-3 text-left text-sm font-medium text-[#4c4c4d]">Course</th>
                        <th className="py-3 text-left text-sm font-medium text-[#4c4c4d]">Students</th>
                        <th className="py-3 text-left text-sm font-medium text-[#4c4c4d]">Rating</th>
                        <th className="py-3 text-left text-sm font-medium text-[#4c4c4d]">Revenue</th>
                        <th className="py-3 text-left text-sm font-medium text-[#4c4c4d]">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-[#f1f1f3]">
                        <td className="py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded bg-[#fff4e5]">
                              <PenTool className="h-full w-full p-2 text-[#ff9500]" />
                            </div>
                            <div className="ml-3">
                              <p className="font-medium">UI/UX Design Fundamentals</p>
                              <p className="text-xs text-[#4c4c4d]">6 weeks • Intermediate</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <p className="font-medium">458</p>
                          <p className="text-xs text-[#4c4c4d]">+28 this week</p>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center">
                            <Star className="mr-1 h-4 w-4 fill-[#ff9500] text-[#ff9500]" />
                            <span className="font-medium">4.9</span>
                            <span className="ml-1 text-xs text-[#4c4c4d]">(128)</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <p className="font-medium">$8,245</p>
                          <p className="text-xs text-green-500">+12.5% from last month</p>
                        </td>
                        <td className="py-4">
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600">
                            Active
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b border-[#f1f1f3]">
                        <td className="py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded bg-[#fff4e5]">
                              <Code className="h-full w-full p-2 text-[#ff9500]" />
                            </div>
                            <div className="ml-3">
                              <p className="font-medium">Advanced JavaScript</p>
                              <p className="text-xs text-[#4c4c4d]">8 weeks • Advanced</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <p className="font-medium">372</p>
                          <p className="text-xs text-[#4c4c4d]">+15 this week</p>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center">
                            <Star className="mr-1 h-4 w-4 fill-[#ff9500] text-[#ff9500]" />
                            <span className="font-medium">4.8</span>
                            <span className="ml-1 text-xs text-[#4c4c4d]">(95)</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <p className="font-medium">$6,820</p>
                          <p className="text-xs text-green-500">+8.3% from last month</p>
                        </td>
                        <td className="py-4">
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600">
                            Active
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b border-[#f1f1f3]">
                        <td className="py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded bg-[#fff4e5]">
                              <Layout className="h-full w-full p-2 text-[#ff9500]" />
                            </div>
                            <div className="ml-3">
                              <p className="font-medium">Web Design Fundamentals</p>
                              <p className="text-xs text-[#4c4c4d]">4 weeks • Beginner</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <p className="font-medium">512</p>
                          <p className="text-xs text-[#4c4c4d]">+32 this week</p>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center">
                            <Star className="mr-1 h-4 w-4 fill-[#ff9500] text-[#ff9500]" />
                            <span className="font-medium">4.7</span>
                            <span className="ml-1 text-xs text-[#4c4c4d]">(143)</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <p className="font-medium">$9,120</p>
                          <p className="text-xs text-green-500">+15.2% from last month</p>
                        </td>
                        <td className="py-4">
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600">
                            Active
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* My Courses Tab */}
          {activeTab === "courses" && (
            <div className="space-y-6">
              <div className="flex flex-col justify-between md:flex-row md:items-center">
                <div>
                  <h1 className="text-2xl font-bold md:text-3xl">My Courses</h1>
                  <p className="text-[#4c4c4d]">Manage and monitor all your courses</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 md:mt-0">
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4c4c4d]" />
                    <input
                      type="text"
                      placeholder="Search courses..."
                      className="h-10 w-full rounded-md border border-[#f1f1f3] bg-white pl-10 pr-4 text-sm focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500] sm:w-60"
                    />
                  </div>
                  <button
                    onClick={() => setShowNewCourseModal(true)}
                    className="flex w-full items-center justify-center rounded-md bg-[#ff9500] px-4 py-2 text-sm font-medium text-white hover:bg-[#ff9500]/90 sm:w-auto"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    New Course
                  </button>
                </div>
              </div>

              {/* Course Filters */}
              <div className="flex flex-wrap gap-2">
                <button className="rounded-md bg-[#fff4e5] px-4 py-2 text-sm font-medium text-[#ff9500]">
                  All Courses (12)
                </button>
                <button className="rounded-md bg-white px-4 py-2 text-sm font-medium text-[#4c4c4d] hover:bg-[#f1f1f3]">
                  Published (8)
                </button>
                <button className="rounded-md bg-white px-4 py-2 text-sm font-medium text-[#4c4c4d] hover:bg-[#f1f1f3]">
                  Draft (3)
                </button>
                <button className="rounded-md bg-white px-4 py-2 text-sm font-medium text-[#4c4c4d] hover:bg-[#f1f1f3]">
                  Archived (1)
                </button>
              </div>

              {/* Course List */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Course Card 1 */}
                <div className="overflow-hidden rounded-lg border border-[#f1f1f3] bg-white">
                  <div className="relative h-40 bg-[#f7f7f8]">
                    <img
                      src="/placeholder.svg?height=160&width=320"
                      alt="UI/UX Design Fundamentals"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 p-4">
                      <span className="rounded-md bg-green-500 px-2 py-1 text-xs font-medium text-white">
                        Published
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="mb-1 text-lg font-bold">UI/UX Design Fundamentals</h3>
                    <div className="mb-3 flex items-center text-sm text-[#4c4c4d]">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>6 weeks • Intermediate</span>
                    </div>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4 text-[#4c4c4d]" />
                        <span className="text-sm text-[#4c4c4d]">458 students</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4 fill-[#ff9500] text-[#ff9500]" />
                        <span className="text-sm font-medium">4.9</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <button className="rounded-md border border-[#f1f1f3] bg-white px-3 py-1.5 text-sm font-medium text-[#4c4c4d] hover:bg-[#f1f1f3]">
                        View Course
                      </button>
                      <button className="rounded-md border border-[#f1f1f3] bg-white px-3 py-1.5 text-sm font-medium text-[#4c4c4d] hover:bg-[#f1f1f3]">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Course Card 2 */}
                <div className="overflow-hidden rounded-lg border border-[#f1f1f3] bg-white">
                  <div className="relative h-40 bg-[#f7f7f8]">
                    <img
                      src="/placeholder.svg?height=160&width=320"
                      alt="Advanced JavaScript"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 p-4">
                      <span className="rounded-md bg-green-500 px-2 py-1 text-xs font-medium text-white">
                        Published
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="mb-1 text-lg font-bold">Advanced JavaScript</h3>
                    <div className="mb-3 flex items-center text-sm text-[#4c4c4d]">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>8 weeks • Advanced</span>
                    </div>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4 text-[#4c4c4d]" />
                        <span className="text-sm text-[#4c4c4d]">372 students</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4 fill-[#ff9500] text-[#ff9500]" />
                        <span className="text-sm font-medium">4.8</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <button className="rounded-md border border-[#f1f1f3] bg-white px-3 py-1.5 text-sm font-medium text-[#4c4c4d] hover:bg-[#f1f1f3]">
                        View Course
                      </button>
                      <button className="rounded-md border border-[#f1f1f3] bg-white px-3 py-1.5 text-sm font-medium text-[#4c4c4d] hover:bg-[#f1f1f3]">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Course Card 3 */}
                <div className="overflow-hidden rounded-lg border border-[#f1f1f3] bg-white">
                  <div className="relative h-40 bg-[#f7f7f8]">
                    <img
                      src="/placeholder.svg?height=160&width=320"
                      alt="Web Design Fundamentals"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 p-4">
                      <span className="rounded-md bg-green-500 px-2 py-1 text-xs font-medium text-white">
                        Published
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="mb-1 text-lg font-bold">Web Design Fundamentals</h3>
                    <div className="mb-3 flex items-center text-sm text-[#4c4c4d]">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>4 weeks • Beginner</span>
                    </div>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4 text-[#4c4c4d]" />
                        <span className="text-sm text-[#4c4c4d]">512 students</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4 fill-[#ff9500] text-[#ff9500]" />
                        <span className="text-sm font-medium">4.7</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <button className="rounded-md border border-[#f1f1f3] bg-white px-3 py-1.5 text-sm font-medium text-[#4c4c4d] hover:bg-[#f1f1f3]">
                        View Course
                      </button>
                      <button className="rounded-md border border-[#f1f1f3] bg-white px-3 py-1.5 text-sm font-medium text-[#4c4c4d] hover:bg-[#f1f1f3]">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Course Card 4 - Draft */}
                <div className="overflow-hidden rounded-lg border border-[#f1f1f3] bg-white">
                  <div className="relative h-40 bg-[#f7f7f8]">
                    <img
                      src="/placeholder.svg?height=160&width=320"
                      alt="Mobile App Development"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 p-4">
                      <span className="rounded-md bg-yellow-500 px-2 py-1 text-xs font-medium text-white">Draft</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="mb-1 text-lg font-bold">Mobile App Development</h3>
                    <div className="mb-3 flex items-center text-sm text-[#4c4c4d]">
                      <Clock className="mr-1 h-4 w-4" />
                      <span>10 weeks • Intermediate</span>
                    </div>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4 text-[#4c4c4d]" />
                        <span className="text-sm text-[#4c4c4d]">Not published</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-[#4c4c4d]">60% complete</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <button className="rounded-md border border-[#f1f1f3] bg-white px-3 py-1.5 text-sm font-medium text-[#4c4c4d] hover:bg-[#f1f1f3]">
                        Edit Course
                      </button>
                      <button className="rounded-md border border-[#f1f1f3] bg-white px-3 py-1.5 text-sm font-medium text-[#4c4c4d] hover:bg-[#f1f1f3]">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && <TeacherProfile />}

          {/* Settings Tab */}
          {activeTab === "settings" && <TeacherSettings />}

          {/* Other tabs would go here */}
          {activeTab !== "dashboard" && activeTab !== "courses" && activeTab !== "profile" && activeTab !== "settings" && (
            <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-[#f1f1f3] bg-white p-6">
              <div className="rounded-full bg-[#fff4e5] p-3">
                <LayoutDashboard className="h-6 w-6 text-[#ff9500]" />
              </div>
              <h3 className="mt-4 text-lg font-medium">Coming Soon</h3>
              <p className="mt-2 text-center text-sm text-[#4c4c4d]">
                The {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} section is under development and will be
                available soon.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* New Course Modal */}
      {showNewCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Create New Course</h2>
              <button
                onClick={() => setShowNewCourseModal(false)}
                className="rounded-full p-1 text-[#4c4c4d] hover:bg-[#f1f1f3]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="course-title" className="mb-1 block text-sm font-medium">
                  Course Title
                </label>
                <input
                  id="course-title"
                  type="text"
                  placeholder="Enter course title"
                  className="w-full rounded-md border border-[#f1f1f3] bg-white px-3 py-2 text-sm focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500]"
                />
              </div>
              <div>
                <label htmlFor="course-category" className="mb-1 block text-sm font-medium">
                  Category
                </label>
                <select
                  id="course-category"
                  className="w-full rounded-md border border-[#f1f1f3] bg-white px-3 py-2 text-sm focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500]"
                >
                  <option>Web Development</option>
                  <option>UI/UX Design</option>
                  <option>Mobile Development</option>
                  <option>Data Science</option>
                  <option>Programming</option>
                </select>
              </div>
              <div>
                <label htmlFor="course-level" className="mb-1 block text-sm font-medium">
                  Level
                </label>
                <select
                  id="course-level"
                  className="w-full rounded-md border border-[#f1f1f3] bg-white px-3 py-2 text-sm focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500]"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              <div>
                <label htmlFor="course-description" className="mb-1 block text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="course-description"
                  rows={3}
                  placeholder="Enter course description"
                  className="w-full rounded-md border border-[#f1f1f3] bg-white px-3 py-2 text-sm focus:border-[#ff9500] focus:outline-none focus:ring-1 focus:ring-[#ff9500]"
                ></textarea>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Course Thumbnail</label>
                <div className="flex items-center justify-center rounded-md border border-dashed border-[#f1f1f3] bg-[#f7f7f8] p-4">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-[#4c4c4d]" />
                    <p className="mt-2 text-sm text-[#4c4c4d]">
                      Drag and drop an image or <span className="text-[#ff9500]">browse files</span>
                    </p>
                    <p className="text-xs text-[#4c4c4d]">Recommended: 1280x720px, Max 5MB</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowNewCourseModal(false)}
                className="rounded-md border border-[#f1f1f3] bg-white px-4 py-2 text-sm font-medium text-[#4c4c4d] hover:bg-[#f1f1f3]"
              >
                Cancel
              </button>
              <button className="rounded-md bg-[#ff9500] px-4 py-2 text-sm font-medium text-white hover:bg-[#ff9500]/90">
                Create Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}