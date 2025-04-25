import UserProfile from "../../../components/shared/user-profile"
import { useProfile } from "../../../hooks/useProfile"
import { useEffect, useState } from "react"

export default function StudentProfile({ dashboardDataProfile }) {
  const { profile, loading, error, fetchProfile, updateProfile } = useProfile()
  const [studentData, setStudentData] = useState(null)
  const user = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.user;

  useEffect(() => {
    // Fetch profile data when component mounts
    fetchProfile()
  }, [])

  useEffect(() => {
    // Update studentData when profile data is loaded
    if (profile) {
      setStudentData({
        id: profile.id,
        name: user.firstName,
        email: user.email,
        avatar: profile.settings?.avatar || "/placeholder.svg?height=200&width=200",
        phone: profile.settings?.phone || "",
        location: profile.settings?.location || "",
        website: profile.settings?.website || "",
        bio: profile.settings?.bio || "",
        joinDate: profile.user?.created_at ? new Date(profile.user.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' }) : "",
        title: profile.settings?.title || "Étudiant",
        skills: profile.settings?.skills || [],
        certificates: profile.settings?.certificates || [],
        courses: profile.settings?.courses || [],
        experience: profile.settings?.experience || [],
        education: profile.settings?.education || [],
        socialLinks: profile.settings?.social_links || [],
        stats: profile.settings?.stats || {
          coursesEnrolled: {
            value: 0,
            label: "Cours inscrits",
            icon: "BookOpen",
          },
          certificatesEarned: {
            value: "0",
            label: "Certificats obtenus",
            icon: "Award",
          },
          averageProgress: {
            value: "0%",
            label: "Progression moyenne",
            icon: "TrendingUp",
          },
        },
      })
    } else if (dashboardDataProfile) {
      // Use dashboard data as fallback
      setStudentData(dashboardDataProfile)
    }
  }, [profile, dashboardDataProfile])

  const handleSave = async (data) => {
    try {
      await updateProfile(data)
      console.log("Profil mis à jour avec succès")
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error)
    }
  }

  if (loading && !studentData) {
    return <div>Chargement du profil...</div>
  }

  if (error && !studentData) {
    return <div>Erreur: {error}</div>
  }

  if (!studentData) {
    return <div>Aucune donnée de profil disponible</div>
  }

  return (
    <UserProfile
      userRole="student"
      userData={studentData}
      backLink="/student/dashboard"
      backLabel="Retour au tableau de bord"
      onSave={handleSave}
    />
  )
} 
