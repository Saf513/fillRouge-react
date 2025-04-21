import { useState, useEffect } from "react"
import { useUsers } from '@/hooks/useUsers'
import { useCourses } from '@/hooks/useCourses'
import { Course } from "@/types/course"
import useCategories from "@/hooks/useCategories"
// import { User } from "@/hooks/useUsers"

import {
  Users,
  BookOpen,
  DollarSign,
  BarChart2,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  Filter,
  Download,
  Trash2,
  Edit,
  Eye,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import axiosClient from "@/api/axios"

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const { courses, loading: coursesLoading, error: coursesError } = useCourses()
  const { users, loading: usersLoading, error: usersError } = useUsers()
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false)

  useEffect(() => {
    if (categoriesError) {
      console.error('Erreur lors du chargement des catégories:', categoriesError)
    }
  }, [categoriesError])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Données simulées pour le dashboard
  const handleSaveLesson = async () => {
    if (!currentSection || !currentLesson) return;

    if (currentLesson.title.trim() === "") {
      toast({
        title: "Erreur",
        description: "Le titre de la leçon est requis",
        variant: "destructive",
      });
      return;
    }

    try {
      setFileUploading(true);

      let contentUrl = currentLesson.content_url;

      // Upload the file if a file is selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("content_type", currentLesson.content_type);

        const response = await axiosClient.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data && response.data.url) {
          contentUrl = response.data.url; // Update content_url with the uploaded file URL
        }
      }

      const lessonData = {
        ...currentLesson,
        duration: currentLesson.duration.toString(),
        content_type: currentLesson.content_type,
        content_url: contentUrl, // Ensure content_url is updated
        section_id: parseInt(currentSection.id),
      };

      console.log("Données de la leçon:", lessonData);

      const isEditing = currentSection.lessons.some(
        (lesson) => lesson.id === currentLesson.id
      );

      let updatedLessons;
      if (isEditing) {
        updatedLessons = currentSection.lessons.map((lesson) =>
          lesson.id === currentLesson.id ? lessonData : lesson
        );
      } else {
        updatedLessons = [...currentSection.lessons, lessonData];
      }

      const updatedSection = {
        ...currentSection,
        lessons: updatedLessons,
      };

      const updatedSections = course.sections?.map((section) =>
        section.id === updatedSection.id ? updatedSection : section
      );

      setCourse({
        ...course,
        sections: updatedSections,
      });

      setShowLessonDialog(false);
      setCurrentLesson(null);
      setCurrentSection(null);
    } catch (error) {
      toast({
        title: "Error creating lesson",
        description: `There was an error creating your lesson. Please try again. ${error}`,
        variant: "destructive",
      });
    } finally {
      setFileUploading(false);
    }
  };const stats = [
    { title: "Utilisateurs Totaux", value: `${users.length}`, change: "+12%", icon: <Users className="h-5 w-5" /> },
    { title: "Cours Actifs", value: `${courses.filter(course => course.status === 'active').length}`, change: "+8%", icon: <BookOpen className="h-5 w-5" /> },
    { title: "Revenus Mensuels", value: `€${courses.reduce((acc, course) => acc + course.price, 0)}`, change: "+15%", icon: <DollarSign className="h-5 w-5" /> },
    { title: "Taux de Complétion", value: `${courses.reduce((acc, course) => acc + (course.status === 'completed' ? 1 : 0), 0) / courses.length * 100}%`, change: "+3%", icon: <BarChart2 className="h-5 w-5" /> },
  ]

  
 
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Actif</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactif</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">En attente</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Complété</Badge>
      case "refunded":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Remboursé</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const handleCourseApproval = (courseId: number, action: "approve" | "reject") => {
    if (!courseId) return;
    console.log(`Course ${courseId} ${action === "approve" ? "approved" : "rejected"}`)
    setIsApprovalDialogOpen(false)
  }

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await axiosClient.delete(`/api/courses/${courseId}`);
      // Rafraîchir la liste des cours
      const response = await axiosClient.get('/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Erreur lors de la suppression du cours:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await axiosClient.delete(`/api/users/${userId}`);
      // Rafraîchir la liste des utilisateurs
      const response = await axiosClient.get('/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    }
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsApprovalDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsApprovalDialogOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`${isSidebarOpen ? "w-64" : "w-20"} bg-white dark:bg-gray-800 shadow-md transition-all duration-300 ease-in-out overflow-hidden`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-primary" />
            {isSidebarOpen && <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">EduAdmin</span>}
          </div>
          <button onClick={toggleSidebar} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
            {isSidebarOpen ? (
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <Menu className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
        </div>
        <nav className="mt-5 px-2">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            className={`w-full justify-start mb-2 ${!isSidebarOpen && "justify-center"}`}
            onClick={() => setActiveTab("overview")}
          >
            <BarChart2 className="h-5 w-5 mr-2" />
            {isSidebarOpen && <span>Vue d'ensemble</span>}
          </Button>
          <Button
            variant={activeTab === "courses" ? "default" : "ghost"}
            className={`w-full justify-start mb-2 ${!isSidebarOpen && "justify-center"}`}
            onClick={() => setActiveTab("courses")}
          >
            <BookOpen className="h-5 w-5 mr-2" />
            {isSidebarOpen && <span>Cours</span>}
          </Button>
          <Button
            variant={activeTab === "users" ? "default" : "ghost"}
            className={`w-full justify-start mb-2 ${!isSidebarOpen && "justify-center"}`}
            onClick={() => setActiveTab("users")}
          >
            <Users className="h-5 w-5 mr-2" />
            {isSidebarOpen && <span>Utilisateurs</span>}
          </Button>
          <Button
            variant={activeTab === "finance" ? "default" : "ghost"}
            className={`w-full justify-start mb-2 ${!isSidebarOpen && "justify-center"}`}
            onClick={() => setActiveTab("finance")}
          >
            <DollarSign className="h-5 w-5 mr-2" />
            {isSidebarOpen && <span>Finances</span>}
          </Button>
          <Button
            variant={activeTab === "reports" ? "default" : "ghost"}
            className={`w-full justify-start mb-2 ${!isSidebarOpen && "justify-center"}`}
            onClick={() => setActiveTab("reports")}
          >
            <BarChart2 className="h-5 w-5 mr-2" />
            {isSidebarOpen && <span>Rapports</span>}
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            className={`w-full justify-start mb-2 ${!isSidebarOpen && "justify-center"}`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="h-5 w-5 mr-2" />
            {isSidebarOpen && <span>Paramètres</span>}
          </Button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                {activeTab === "overview" && "Vue d'ensemble"}
                {activeTab === "courses" && "Gestion des Cours"}
                {activeTab === "users" && "Gestion des Utilisateurs"}
                {activeTab === "finance" && "Finances"}
                {activeTab === "reports" && "Rapports"}
                {activeTab === "settings" && "Paramètres"}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <Button variant="outline" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Admin" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profil</DropdownMenuItem>
                  <DropdownMenuItem>Paramètres</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Déconnexion</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {stat.title}
                      </CardTitle>
                      <div className="p-2 bg-primary/10 rounded-full">{stat.icon}</div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-green-500 mt-1">{stat.change} depuis le mois dernier</p>
                    </CardContent>
                  </Card>
                ))}
              </div>


              {/* Charts and Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Courses */}
                <Card>
                  <CardHeader>
                    <CardTitle>Cours en Attente d'Approbation</CardTitle>
                    <CardDescription>Cours récemment soumis nécessitant une révision</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Titre du Cours</TableHead>
                          <TableHead>Instructeur</TableHead>
                          <TableHead>Soumis le</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                         
                          {courses.filter(course => course.status === 'pending').map((course) => (
                          <TableRow key={course.id}>
                            <TableCell className="font-medium">{course.title}</TableCell>
                              <TableCell>{course.instructor?.firstName} {course.instructor?.lastName}</TableCell>
                              <TableCell>{course.submitted ? new Date(course.submitted).toLocaleDateString() : 'Non spécifié'}</TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" onClick={() => setSelectedCourse(course)}>
                                    Réviser
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Révision du Cours</DialogTitle>
                                    <DialogDescription>
                                      Examinez les détails du cours avant de l'approuver ou de le rejeter.
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedCourse && (
                                    <div className="space-y-4 py-4">
                                      <div className="space-y-2">
                                        <h3 className="font-semibold">{selectedCourse.title}</h3>
                                          <p className="text-sm text-gray-500">Par {selectedCourse.instructor.first_name}</p>
                                          <Badge>{categories.find(category => category.id === selectedCourse.category_id)?.name}</Badge>
                                      </div>
                                      <div className="space-y-2">
                                        <h4 className="text-sm font-medium">Description du cours</h4>
                                        <p className="text-sm">
                                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.
                                          Vivamus hendrerit arcu sed erat molestie vehicula.
                                        </p>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <h4 className="text-sm font-medium">Durée</h4>
                                          <p className="text-sm">8 heures</p>
                                        </div>
                                        <div>
                                          <h4 className="text-sm font-medium">Niveau</h4>
                                          <p className="text-sm">Intermédiaire</p>
                                        </div>
                                        <div>
                                          <h4 className="text-sm font-medium">Prix</h4>
                                          <p className="text-sm">€49.99</p>
                                        </div>
                                        <div>
                                          <h4 className="text-sm font-medium">Langue</h4>
                                          <p className="text-sm">Français</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() => handleCourseApproval(selectedCourse?.id, "reject")}
                                    >
                                      Rejeter
                                    </Button>
                                    <Button onClick={() => handleCourseApproval(selectedCourse?.id, "approve")}>
                                      Approuver
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                        {users.filter(user => new Date(user.created_at) > new Date()).map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-2">
                                  <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                                  <AvatarFallback>{user.lastName.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{user.lastName}</div>
                                  <div className="text-xs text-gray-500">{user.email}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  user.role === "student"
                                    ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                    : user.role === "instructor"
                                      ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                                      : "bg-green-100 text-green-800 hover:bg-green-100"
                                }
                              >
                                {user.role === "student"
                                  ? "Étudiant"
                                  : user.role === "instructor"
                                    ? "Instructeur"
                                    : "Admin"}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(user.joined).toLocaleDateString()}</TableCell>
                            <TableCell>{user.courses}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => setActiveTab("users")}>
                      Gérer les utilisateurs
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle>Transactions Récentes</CardTitle>
                  <CardDescription>Dernières transactions financières sur la plateforme</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Utilisateur</TableHead>
                        <TableHead>Cours</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    {/* <TableBody>
                      {recentTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">{transaction.user}</TableCell>
                          <TableCell>{transaction.course}</TableCell>
                          <TableCell>{transaction.amount}</TableCell>
                          <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                          <TableCell>{renderStatusBadge(transaction.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody> */}
                  </Table>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab("finance")}>
                    Voir toutes les transactions
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === "courses" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Gestion des Cours</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrer
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </div>
              </div>

              {coursesLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : coursesError ? (
                <div className="text-red-500 text-center">{coursesError}</div>
              ) : (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titre du Cours</TableHead>
                        <TableHead>Instructeur</TableHead>
                        <TableHead>Catégorie</TableHead>
                          <TableHead>Date de soumission</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                        {courses.map((course: Course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.title}</TableCell>
                            <TableCell>{course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'Non spécifié'}</TableCell>
                            <TableCell>{categories.find((category) => category.id === course.category_id)?.title || 'Non spécifié'}</TableCell>
                            <TableCell>{course.created_at ? new Date(course.created_at).toLocaleDateString() : 'Non spécifié'}</TableCell>
                          <TableCell>{renderStatusBadge(course.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditCourse(course)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteCourse(course.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Gestion des Utilisateurs</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrer
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </div>
              </div>

              {usersLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : usersError ? (
                <div className="text-red-500 text-center">{usersError}</div>
              ) : (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rôle</TableHead>
                          <TableHead>Date d'inscription</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user: User) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{renderStatusBadge(user.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              )}
            </div>
          )}

          {/* Finance Tab */}
          {activeTab === "finance" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Gestion Financière</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Période
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </div>
              </div>

              {/* Revenue Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">€124,750.50</div>
                    <p className="text-xs text-green-500 mt-1">+15% depuis le mois dernier</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Revenus Mensuels</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">€48,234.20</div>
                    <p className="text-xs text-green-500 mt-1">+8% depuis le mois dernier</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Valeur Moyenne des Commandes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">€54.75</div>
                    <p className="text-xs text-red-500 mt-1">-2% depuis le mois dernier</p>
                  </CardContent>
                </Card>
              </div>

              {/* Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle>Transactions</CardTitle>
                  <CardDescription>Historique complet des transactions sur la plateforme</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                      <Input type="text" placeholder="Rechercher des transactions..." className="w-80" />
                      <Select>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous</SelectItem>
                          <SelectItem value="completed">Complétés</SelectItem>
                          <SelectItem value="pending">En attente</SelectItem>
                          <SelectItem value="refunded">Remboursés</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Période" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes</SelectItem>
                          <SelectItem value="today">Aujourd'hui</SelectItem>
                          <SelectItem value="week">Cette semaine</SelectItem>
                          <SelectItem value="month">Ce mois</SelectItem>
                          <SelectItem value="year">Cette année</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Utilisateur</TableHead>
                        <TableHead>Cours</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Méthode</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        ...recentTransactions,
                        {
                          id: 5,
                          user: "Marie Dubois",
                          course: "Python pour Data Science",
                          amount: "€59.99",
                          date: "2023-11-10",
                          status: "completed",
                        },
                        {
                          id: 6,
                          user: "Thomas Leroy",
                          course: "Design Thinking",
                          amount: "€39.99",
                          date: "2023-11-08",
                          status: "completed",
                        },
                        {
                          id: 7,
                          user: "Sophie Martin",
                          course: "Marketing Digital Avancé",
                          amount: "€89.99",
                          date: "2023-11-05",
                          status: "refunded",
                        },
                        {
                          id: 8,
                          user: "Lucas Bernard",
                          course: "Introduction à l'IA",
                          amount: "€79.99",
                          date: "2023-11-01",
                          status: "completed",
                        },
                      ].map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>#{transaction.id.toString().padStart(6, "0")}</TableCell>
                          <TableCell className="font-medium">{transaction.user}</TableCell>
                          <TableCell>{transaction.course}</TableCell>
                          <TableCell>{transaction.amount}</TableCell>
                          <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                          <TableCell>Carte bancaire</TableCell>
                          <TableCell>{renderStatusBadge(transaction.status)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Précédent
                    </Button>
                    <Button variant="outline" size="sm">
                      1
                    </Button>
                    <Button variant="outline" size="sm">
                      Suivant
                    </Button>
                  </div>
                  <Select defaultValue="10">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Afficher" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 par page</SelectItem>
                      <SelectItem value="20">20 par page</SelectItem>
                      <SelectItem value="50">50 par page</SelectItem>
                    </SelectContent>
                  </Select>
                </CardFooter>
              </Card>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Paramètres du Système</h2>
                <Button>Sauvegarder les modifications</Button>
              </div>

              <Tabs defaultValue="general">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="general">Général</TabsTrigger>
                  <TabsTrigger value="appearance">Apparence</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="security">Sécurité</TabsTrigger>
                  <TabsTrigger value="integrations">Intégrations</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Paramètres Généraux</CardTitle>
                      <CardDescription>
                        Configurez les paramètres généraux de votre plateforme d'apprentissage
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nom de la Plateforme</label>
                        <Input defaultValue="EduLearn" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">URL du Site</label>
                        <Input defaultValue="https://edulearn.example.com" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email de Contact</label>
                        <Input defaultValue="contact@edulearn.example.com" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Devise par Défaut</label>
                        <Select defaultValue="eur">
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une devise" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="eur">Euro (€)</SelectItem>
                            <SelectItem value="usd">Dollar US ($)</SelectItem>
                            <SelectItem value="gbp">Livre Sterling (£)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Langue par Défaut</label>
                        <Select defaultValue="fr">
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une langue" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fr">Français</SelectItem>
                            <SelectItem value="en">Anglais</SelectItem>
                            <SelectItem value="es">Espagnol</SelectItem>
                            <SelectItem value="de">Allemand</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="appearance" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Apparence</CardTitle>
                      <CardDescription>Personnalisez l'apparence de votre plateforme d'apprentissage</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Thème</label>
                        <div className="flex space-x-4">
                          <div className="flex items-center space-x-2">
                            <input type="radio" id="light" name="theme" defaultChecked />
                            <label htmlFor="light">Clair</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="radio" id="dark" name="theme" />
                            <label htmlFor="dark">Sombre</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input type="radio" id="system" name="theme" />
                            <label htmlFor="system">Système</label>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Couleur Principale</label>
                        <div className="flex space-x-4">
                          <div className="w-8 h-8 rounded-full bg-primary cursor-pointer border-2 border-gray-300" />
                          <div className="w-8 h-8 rounded-full bg-blue-500 cursor-pointer" />
                          <div className="w-8 h-8 rounded-full bg-green-500 cursor-pointer" />
                          <div className="w-8 h-8 rounded-full bg-purple-500 cursor-pointer" />
                          <div className="w-8 h-8 rounded-full bg-red-500 cursor-pointer" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Logo</label>
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                            <BookOpen className="h-8 w-8 text-primary" />
                          </div>
                          <Button variant="outline">Changer le logo</Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Favicon</label>
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-primary" />
                          </div>
                          <Button variant="outline">Changer le favicon</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard

