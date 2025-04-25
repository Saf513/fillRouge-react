import UserProfile from "../../../components/shared/user-profile"
import { useProfile } from "../../../hooks/useProfile"
import { useEffect, useState } from "react"

export default function TeacherProfile() {
  const { profile, loading, error, fetchProfile, updateProfile } = useProfile()
  const [teacherData, setTeacherData] = useState(null)
 const user = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.user;
  useEffect(() => {
    // Fetch profile data when component mounts
    fetchProfile()
  }, [])

  useEffect(() => {
    // Update teacherData when profile data is loaded
    if (profile) {
      setTeacherData({
        id: profile.id,
        name: user.firstName,
        email: user.email,
        avatar: profile.settings?.avatar || "/placeholder.svg?height=200&width=200",
        phone: profile.settings?.phone || "",
        location: profile.settings?.location || "",
        website: profile.settings?.website || "",
        bio: profile.settings?.bio || "",
        joinDate: profile.user.created_at ? new Date(profile.user.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' }) : "",
        title: profile.settings?.title || "Enseignant",
        skills: profile.settings?.skills || [],
        certificates: profile.settings?.certificates || [],
        courses: profile.settings?.courses || [],
        experience: profile.settings?.experience || [],
        education: profile.settings?.education || [],
        socialLinks: profile.settings?.social_links || [],
        stats: profile.settings?.stats || {
          coursesCreated: {
            value: 0,
            label: "Cours créés",
            icon: "BookOpen",
          },
          studentsTaught: {
            value: "0",
            label: "Étudiants enseignés",
            icon: "Users",
          },
          averageRating: {
            value: "0",
            label: "Note moyenne",
            icon: "Star",
          },
        },
      })
    }
  }, [profile])

  const handleSave = async (data) => {
    try {
      await updateProfile(data)
      console.log("Profil mis à jour avec succès")
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error)
    }
  }

  if (loading) {
    return <div>Chargement du profil...</div>
  }

  if (error) {
    return <div>Erreur: {error}</div>
  }

  if (!teacherData) {
    return <div>Aucune donnée de profil disponible</div>
  }

  return (
    <UserProfile
      userRole="teacher"
      userData={teacherData}
      backLink="/teacher/dashboard"
      backLabel="Retour au tableau de bord"
      onSave={handleSave}
    />
  )
}
