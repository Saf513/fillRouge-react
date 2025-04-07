import UserProfile from "../../../components/shared/user-profile"

export default function TeacherProfile() {
  // Sample teacher data
  const teacherData = {
    id: 1,
    name: "Dr. Angela Yu",
    email: "angela.yu@example.com",
    avatar: "/placeholder.svg?height=200&width=200",
    phone: "+1 (555) 987-6543",
    location: "London, UK",
    website: "https://angelayu.com",
    bio: "I'm a professional developer and instructor with over 15 years of experience in web development. I've taught over 500,000 students worldwide and created multiple best-selling courses on Udemy.",
    joinDate: "January 2018",
    title: "Senior Developer & Instructor",
    skills: [
      { name: "Python", level: 95 },
      { name: "Web Development", level: 90 },
      { name: "iOS Development", level: 85 },
      { name: "Data Science", level: 80 },
    ],
    certificates: [
      {
        id: 1,
        title: "Python Professional Certification",
        issuer: "Python Institute",
        date: "March 15, 2023",
        url: "#",
      },
      {
        id: 2,
        title: "iOS Development Mastery",
        issuer: "Apple Developer Academy",
        date: "January 10, 2023",
        url: "#",
      },
    ],
    courses: [
      {
        id: 1,
        title: "Complete Web Development Bootcamp",
        instructor: "Dr. Angela Yu",
        progress: 100,
        image: "/placeholder.svg?height=160&width=320",
        category: "Web Development",
        rating: 4.8,
        reviews: 142,
      },
      {
        id: 2,
        title: "iOS 17 & Swift 5: Complete iOS App Development Bootcamp",
        instructor: "Dr. Angela Yu",
        progress: 100,
        image: "/placeholder.svg?height=160&width=320",
        category: "Mobile Development",
        rating: 4.9,
        reviews: 95,
      },
      {
        id: 3,
        title: "Python for Data Science and Machine Learning",
        instructor: "Dr. Angela Yu",
        progress: 100,
        image: "/placeholder.svg?height=160&width=320",
        category: "Data Science",
        rating: 4.8,
        reviews: 156,
      },
    ],
    experience: [
      {
        id: 1,
        title: "Senior Developer",
        company: "Tech Solutions Inc.",
        location: "London, UK",
        startDate: "2015",
        endDate: "Present",
        description: "Leading development teams and creating innovative solutions",
        current: true,
      },
    ],
    education: [
      {
        id: 1,
        degree: "Ph.D. in Computer Science",
        institution: "University of London",
        location: "London, UK",
        startDate: "2010",
        endDate: "2015",
        description: "Research focus on machine learning and artificial intelligence",
        current: false,
      },
    ],
    socialLinks: [
      { platform: "LinkedIn", url: "https://linkedin.com/in/angelayu", icon: "Linkedin" },
      { platform: "Twitter", url: "https://twitter.com/angelayu", icon: "Twitter" },
      { platform: "YouTube", url: "https://youtube.com/angelayu", icon: "Youtube" },
    ],
    stats: {
      coursesCreated: {
        value: 12,
        label: "Courses Created",
        icon: "BookOpen",
      },
      studentsTaught: {
        value: "500K+",
        label: "Students Taught",
        icon: "Users",
      },
      averageRating: {
        value: "4.8",
        label: "Average Rating",
        icon: "Star",
      },
    },
  }

  return (
    <UserProfile
      userRole="teacher"
      userData={teacherData}
      backLink="/teacher/dashboard"
      backLabel="Retour au tableau de bord"
      onSave={(data) => console.log("Saving profile data:", data)}
    />
  )
} 