import UserProfile from "../../../components/shared/user-profile"

export default function StudentProfile() {
  // Sample student data
  const studentData = {
   
  }

  return (
    <UserProfile
      userRole="student"
      userData={studentData}
      backLink="/student/dashboard"
      backLabel="Back to Dashboard"
      onSave={(data) => console.log("Saving profile data:", data)}
    />
  )
} 