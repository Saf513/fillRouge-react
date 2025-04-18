import { useState, useEffect } from 'react'
import axios from '@/api/axios'

interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  role: string
  created_at: string
  courses_count: number
  status: string
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users')
        setUsers(response.data)
        setLoading(false)
      } catch (err) {
        setError('Erreur lors du chargement des utilisateurs')
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])
console.log("les utilisateures : " ,{ users, loading, error })
  return { users, loading, error }
} 