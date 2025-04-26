import { useState, useEffect } from "react";
import UserProfile from "../components/shared/user-profile";
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
} from "lucide-react";
import TeacherProfile from "./teacher/profile/teacherProfile";
import TeacherSettings from "./teacher/settings/teacherSettings";
import CourseCreationForm from "../components/forms/createCourse";
import { DashboardCourse, Profile } from "@/types/dashboard";
import { useProfile } from "@/hooks/useProfile";
import useTeacherDashboardData, {
  DashboardData,
} from "@/hooks/useDashboardTeacher";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "../hooks/useAuth";
import { data, useNavigate } from "react-router-dom";
export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNewCourseModal, setShowNewCourseModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const { data: dashboardData, loading: apiLoading, error: apiError } =
    useTeacherDashboardData();

  const [courses, setCourses] = useState<DashboardCourse[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { logout } = useAuth();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("auth-storage") || "{}").state
    ?.user;

  useEffect(() => {
    if (dashboardData?.courses) {
      setCourses(dashboardData.courses);
    }
  }, [dashboardData]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        if (dashboardData) {
          setCourses(dashboardData.courses || []);
          setProfile(dashboardData.profile || null);
          setStats(dashboardData.stats || {});
          setStudents(dashboardData.students || []);
          setRecentActivities(dashboardData.recent_activities || []);
          setLoading(false);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [dashboardData]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    // Close other menus when mobile menu is opened
    if (!showMobileMenu) {
      setShowNotifications(false);
      setShowProfileMenu(false);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showNotifications) {
      setShowProfileMenu(false);
      setShowMobileMenu(false);
    }
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    if (showProfileMenu) {
      setShowNotifications(false);
      setShowMobileMenu(false);
    }
  };

  const handleCourseClick = (index: number) => {
    setSelectedCourse(selectedCourse === index ? null : index);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (windowWidth < 1024) {
      setShowMobileMenu(false);
    }
  };

  if (loading || apiLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#ff9500]"></div>
          <p className="mt-4 text-[#4c4c4d]">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error || apiError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mb-4 rounded-full bg-red-100 p-3 inline-block">
            <X className="h-6 w-6 text-red-500" />
          </div>
          <h2 className="mb-2 text-lg font-semibold">Erreur de chargement</h2>
          <p className="text-[#4c4c4d]">{error || apiError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 rounded-md bg-[#ff9500] px-4 py-2 text-white"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f7f7f8] font-sans text-[#262626]">
      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        } ${
          showMobileMenu
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        } shadow-md`}
      >
        <div className="flex h-16 items-center justify-between border-b border-[#f1f1f3] px-4">
          <div className="flex items-center">
            <div 
              className="flex h-10 w-10 items-center justify-center rounded-md bg-[#ff9500] cursor-pointer"
              onClick={() => navigate('/')}
            >
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            {sidebarOpen && (
              <span className="ml-3 text-lg font-bold">EduTeach</span>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="rounded-md p-1 text-[#4c4c4d] hover:bg-[#f1f1f3] hidden lg:block"
          >
            <ChevronRight
              className={`h-5 w-5 transition-transform duration-300 ${
                sidebarOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <button
            onClick={toggleMobileMenu}
            className="rounded-md p-1 text-[#4c4c4d] hover:bg-[#f1f1f3] lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => handleTabChange("dashboard")}
                className={`flex w-full items-center rounded-md px-3 py-2 ${
                  activeTab === "dashboard"
                    ? "bg-[#fff4e5] text-[#ff9500]"
                    : "text-[#4c4c4d] hover:bg-[#f1f1f3]"
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
                  activeTab === "courses"
                    ? "bg-[#fff4e5] text-[#ff9500]"
                    : "text-[#4c4c4d] hover:bg-[#f1f1f3]"
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
                  activeTab === "students"
                    ? "bg-[#fff4e5] text-[#ff9500]"
                    : "text-[#4c4c4d] hover:bg-[#f1f1f3]"
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
                  activeTab === "messages"
                    ? "bg-[#fff4e5] text-[#ff9500]"
                    : "text-[#4c4c4d] hover:bg-[#f1f1f3]"
                }`}
              >
                <MessageSquare className="h-5 w-5" />
                {sidebarOpen && <span className="ml-3">Notifications</span>}
              </button>
            </li>
           
           
            <li>
              <button
                onClick={() => handleTabChange("earnings")}
                className={`flex w-full items-center rounded-md px-3 py-2 ${
                  activeTab === "earnings"
                    ? "bg-[#fff4e5] text-[#ff9500]"
                    : "text-[#4c4c4d] hover:bg-[#f1f1f3]"
                }`}
              >
                <DollarSign className="h-5 w-5" />
                {sidebarOpen && <span className="ml-3">Earnings</span>}
              </button>
            </li>
            <li>
                <button
                  onClick={() => handleTabChange("profile")}
                  className={`flex w-full items-center rounded-md px-3 py-2 ${
                    activeTab === "profile"
                      ? "bg-[#fff4e5] text-[#ff9500]"
                      : "text-[#4c4c4d] hover:bg-[#f1f1f3]"
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
                    activeTab === "settings"
                      ? "bg-[#fff4e5] text-[#ff9500]"
                      : "text-[#4c4c4d] hover:bg-[#f1f1f3]"
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  {sidebarOpen && <span className="ml-3">Settings</span>}
                </button>
              </li>
            
          </ul>

         
        </nav>

        <div className="border-t border-[#f1f1f3] p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center rounded-md px-3 py-2 text-[#4c4c4d] hover:bg-[#f1f1f3]"
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="ml-3">Se déconnecter</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-20">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#f1f1f3] bg-white px-4 md:px-6">
          <div className="flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="rounded-md p-2 text-[#4c4c4d] hover:bg-[#f1f1f3] lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              onClick={toggleSidebar}
              className="ml-2 rounded-md p-2 text-[#4c4c4d] hover:bg-[#f1f1f3] hidden lg:block"
            >
              <Grid className="h-5 w-5" />
            </button>
            <div className="ml-4 lg:hidden">
              <h1 className="text-lg font-bold">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
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
                    <button className="text-xs text-[#ff9500]">
                      Mark all as read
                    </button>
                  </div>
                  <div className="space-y-6">
                    {recentActivities.length > 0 ? (
                      recentActivities.map((activity, index) => (
                        <div key={activity.id || index} className="flex gap-4">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-[#fff4e5]">
                            {activity.type === 'enrollment' && <User className="h-full w-full p-2 text-[#ff9500]" />}
                            {activity.type === 'question' && <MessageSquare className="h-full w-full p-2 text-[#ff9500]" />}
                            {activity.type === 'review' && <Star className="h-full w-full p-2 text-[#ff9500]" />}
                          </div>
                          <div>
                            <p className="font-medium">
                              {activity.type === 'enrollment' && 'Nouvel étudiant inscrit'}
                              {activity.type === 'question' && 'Nouvelle question posée'}
                              {activity.type === 'review' && 'Nouvel avis'}
                            </p>
                            <p className="text-sm text-[#4c4c4d]">{activity.content}</p>
                            <p className="mt-1 text-xs text-[#4c4c4d]">
                              {new Date(activity.created_at).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-[#4c4c4d]">Aucune activité récente</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={toggleProfileMenu}
                className="flex items-center rounded-full text-[#4c4c4d] hover:bg-[#f1f1f3]"
              >
                <img
                  src="/placeholder.svg?height=40&width=40"
                  alt="Profile"
                  className="h-10 w-10 rounded-full"
                />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-md border border-[#f1f1f3] bg-white p-2 shadow-lg">
                  <div className="mb-2 border-b border-[#f1f1f3] pb-2">
                    <div className="px-3 py-2 text-sm font-medium"></div>
                    <div className="px-3 py-1 text-xs text-[#4c4c4d]">
                      user.email
                    </div>
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
                        <img
                          src="/logout-icon.svg"
                          alt="Logout"
                          className="mr-2 h-4 w-4"
                        />
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
                  <h1 className="text-2xl font-bold md:text-3xl">
                    Bienvenue, {user.first_name} {user.last_name}
                  </h1>
                  <p className="text-[#4c4c4d]">
                    Here's what's happening with your courses today.
                  </p>
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
                    <h3 className="text-sm font-medium text-[#4c4c4d]">
                      Total Étudiants
                    </h3>
                    <div className="rounded-full bg-[#fff4e5] p-2">
                      <Users className="h-5 w-5 text-[#ff9500]" />
                    </div>
                  </div>
                  <p className="mt-4 text-3xl font-bold">{stats?.total_students || 0}</p>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                    <span className="font-medium text-green-500">+{stats?.student_growth || 0}%</span>
                    <span className="ml-1 text-[#4c4c4d]">depuis le mois dernier</span>
                  </div>
                </div>

                <div className="rounded-lg border border-[#f1f1f3] bg-white p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-[#4c4c4d]">
                      Inscriptions aux cours
                    </h3>
                    <div className="rounded-full bg-[#fff4e5] p-2">
                      <BookOpen className="h-5 w-5 text-[#ff9500]" />
                    </div>
                  </div>
                  <p className="mt-4 text-3xl font-bold">{stats?.total_enrollments || 0}</p>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                    <span className="font-medium text-green-500">+{stats?.enrollment_growth || 0}%</span>
                    <span className="ml-1 text-[#4c4c4d]">depuis le mois dernier</span>
                  </div>
                </div>

                <div className="rounded-lg border border-[#f1f1f3] bg-white p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-[#4c4c4d]">
                      Revenus
                    </h3>
                    <div className="rounded-full bg-[#fff4e5] p-2">
                      <DollarSign className="h-5 w-5 text-[#ff9500]" />
                    </div>
                  </div>
                  <p className="mt-4 text-3xl font-bold">${stats?.total_revenue || 0}</p>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                    <span className="font-medium text-green-500">+{stats?.revenue_growth || 0}%</span>
                    <span className="ml-1 text-[#4c4c4d]">depuis le mois dernier</span>
                  </div>
                </div>

                <div className="rounded-lg border border-[#f1f1f3] bg-white p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-[#4c4c4d]">
                      Total Cours
                    </h3>
                    <div className="rounded-full bg-[#fff4e5] p-2">
                      <FileText className="h-5 w-5 text-[#ff9500]" />
                    </div>
                  </div>
                  <p className="mt-4 text-3xl font-bold">{stats?.total_courses || 0}</p>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-[#4c4c4d]">Cours actifs</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity & Performance */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Activity */}
                <div className="rounded-lg border border-[#f1f1f3] bg-white p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-bold">Activités Récentes</h2>
                    <button className="text-sm text-[#ff9500]">Voir tout</button>
                  </div>
                  <div className="space-y-6">
                    {recentActivities.length > 0 ? (
                      recentActivities.map((activity, index) => (
                        <div key={activity.id || index} className="flex gap-4">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-[#fff4e5]">
                            {activity.type === 'enrollment' && <User className="h-full w-full p-2 text-[#ff9500]" />}
                            {activity.type === 'question' && <MessageSquare className="h-full w-full p-2 text-[#ff9500]" />}
                            {activity.type === 'review' && <Star className="h-full w-full p-2 text-[#ff9500]" />}
                          </div>
                          <div>
                            <p className="font-medium">
                              {activity.type === 'enrollment' && 'Nouvel étudiant inscrit'}
                              {activity.type === 'question' && 'Nouvelle question posée'}
                              {activity.type === 'review' && 'Nouvel avis'}
                            </p>
                            <p className="text-sm text-[#4c4c4d]">{activity.content}</p>
                            <p className="mt-1 text-xs text-[#4c4c4d]">
                              {new Date(activity.created_at).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-[#4c4c4d]">Aucune activité récente</p>
                    )}
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
                        Course performance chart showing enrollments,
                        completions, and revenue over time
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Popular Courses */}
              <div className="rounded-lg border border-[#f1f1f3] bg-white p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-bold">Popular Courses</h2>
                  <button className="text-sm text-[#ff9500]">
                    View All Courses
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] border-collapse">
                    <thead>
                      <tr className="border-b border-[#f1f1f3]">
                        <th className="py-3 text-left text-sm font-medium text-[#4c4c4d]">
                          Course
                        </th>
                        <th className="py-3 text-left text-sm font-medium text-[#4c4c4d]">
                          Students
                        </th>
                        <th className="py-3 text-left text-sm font-medium text-[#4c4c4d]">
                          Rating
                        </th>
                        <th className="py-3 text-left text-sm font-medium text-[#4c4c4d]">
                          Revenue
                        </th>
                        <th className="py-3 text-left text-sm font-medium text-[#4c4c4d]">
                          Status
                        </th>
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
                              <p className="font-medium">
                                UI/UX Design Fundamentals
                              </p>
                              <p className="text-xs text-[#4c4c4d]">
                                6 weeks • Intermediate
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <p className="font-medium">458</p>
                          <p className="text-xs text-[#4c4c4d]">
                            +28 this week
                          </p>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center">
                            <Star className="mr-1 h-4 w-4 fill-[#ff9500] text-[#ff9500]" />
                            <span className="font-medium">4.9</span>
                            <span className="ml-1 text-xs text-[#4c4c4d]">
                              (128)
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <p className="font-medium">$8,245</p>
                          <p className="text-xs text-green-500">
                            +12.5% from last month
                          </p>
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
                              <p className="text-xs text-[#4c4c4d]">
                                8 weeks • Advanced
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <p className="font-medium">372</p>
                          <p className="text-xs text-[#4c4c4d]">
                            +15 this week
                          </p>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center">
                            <Star className="mr-1 h-4 w-4 fill-[#ff9500] text-[#ff9500]" />
                            <span className="font-medium">4.8</span>
                            <span className="ml-1 text-xs text-[#4c4c4d]">
                              (95)
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <p className="font-medium">$6,820</p>
                          <p className="text-xs text-green-500">
                            +8.3% from last month
                          </p>
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
                              <p className="font-medium">
                                Web Design Fundamentals
                              </p>
                              <p className="text-xs text-[#4c4c4d]">
                                4 weeks • Beginner
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <p className="font-medium">512</p>
                          <p className="text-xs text-[#4c4c4d]">
                            +32 this week
                          </p>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center">
                            <Star className="mr-1 h-4 w-4 fill-[#ff9500] text-[#ff9500]" />
                            <span className="font-medium">4.7</span>
                            <span className="ml-1 text-xs text-[#4c4c4d]">
                              (143)
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <p className="font-medium">$9,120</p>
                          <p className="text-xs text-green-500">
                            +15.2% from last month
                          </p>
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
                  <p className="text-[#4c4c4d]">
                    Manage and monitor all your courses
                  </p>
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
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="overflow-hidden rounded-lg border border-[#f1f1f3] bg-white transition-shadow hover:shadow-md"
                  >
                    <div className="relative h-40 bg-[#f7f7f8]">
                      <img
                        src={course.image_url || "/placeholder.svg?height=160&width=320"}
                        alt={course.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 p-4">
                        <span className="rounded-md bg-green-500 px-2 py-1 text-xs font-medium text-white">
                          {course.status || "Published"}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="mb-1 text-lg font-bold">{course.title}</h3>
                      <div className="mb-3 flex items-center text-sm text-[#4c4c4d]">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>
                          {course.duration || "N/A"} • {course.level || "N/A"}
                        </span>
                      </div>
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <Users className="mr-1 h-4 w-4 text-[#4c4c4d]" />
                          <span className="text-sm text-[#4c4c4d]">
                            {course.total_students || 0} étudiants
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Star className="mr-1 h-4 w-4 fill-[#ff9500] text-[#ff9500]" />
                          <span className="text-sm font-medium">{course.rating || 0}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <button className="rounded-md border border-[#f1f1f3] bg-white px-3 py-1.5 text-sm font-medium text-[#4c4c4d] hover:bg-[#f1f1f3]">
                          Voir Cours
                        </button>
                        <button className="rounded-md border border-[#f1f1f3] bg-white px-3 py-1.5 text-sm font-medium text-[#4c4c4d] hover:bg-[#f1f1f3]">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && profile && (
            <UserProfile 
              userRole="teacher" 
              userData={{
                name: dashboardData?.teacher?.name || "",
                email: dashboardData?.teacher?.email || "",
                avatar: profile.avatar_url || "/placeholder.svg?height=100&width=100",
                bio: profile.bio || "",
                job_title: profile.job_title || "",
                website: profile.website || "",
                social_links: profile.social_links || {}
              }}
              backLink="/teacher/dashboard"
              backLabel="Retour au tableau de bord"
              onSave={(data) => console.log("Saving profile data:", data)}
            />
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && <TeacherSettings />}

          {/* Other tabs would go here */}
          {activeTab !== "dashboard" &&
            activeTab !== "courses" &&
            activeTab !== "profile" &&
            activeTab !== "settings" && (
              <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-[#f1f1f3] bg-white p-6">
                <div className="rounded-full bg-[#fff4e5] p-3">
                  <LayoutDashboard className="h-6 w-6 text-[#ff9500]" />
                </div>
                <h3 className="mt-4 text-lg font-medium">Coming Soon</h3>
                <p className="mt-2 text-center text-sm text-[#4c4c4d]">
                  The {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                  section is under development and will be available soon.
                </p>
              </div>
            )}
        </main>
      </div>

      {/* New Course Modal */}
      {showNewCourseModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg my-8 relative">
            <button
              onClick={() => setShowNewCourseModal(false)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
            <CourseCreationForm />
          </div>
        </div>
      )}
    </div>
  );
}
