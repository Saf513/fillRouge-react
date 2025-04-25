// hooks/useStudentDashboardData.js
import { useEffect, useState } from 'react';
import axiosClient  from '../api/axios';
import { AxiosError } from 'axios';
import { useAuth } from './useAuth';

interface ErrorResponse {
  message: string;
}

// Import des interfaces depuis le fichier types
import { DashboardCourse, Profile } from '@/types/dashboard';

// Définir l'interface pour les données du tableau de bord
export interface DashboardData {
  courses: DashboardCourse[];
  student: Array<{
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    enrollment_date: string;
    progress: number;
  }>;
  profile: Profile | null;
}


export default function useTeacherDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Début de la requête API...");
        const token =JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.token;
        const teacherId= JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.user?.id;


        console.log("Token utilisé:", token ? "Token présent" : "Token absent");


        // Utiliser l'URL relative pour bénéficier du proxy Vite
        const response = await axiosClient.get(`api/dashboard-teacher/${teacherId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log("Réponse API reçue:", response);
        console.log("Structure complète de la réponse:", JSON.stringify(response.data, null, 2));

        // La réponse est directement dans response.data, pas dans response.data.data
        if (response.data) {
          setData({
            courses: response.data.courses || [],
            student: response.data.student || [],
            profile: response.data.profile && response.data.profile.length > 0 ? response.data.profile[0] : null
          });
          setError(null);
        } else {
          console.error("Structure de réponse incorrecte:", response.data);
          setError("Format de réponse API incorrect");
          setData(null);
        }
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        console.error('Erreur détaillée:', {
          message: error.message,
          response: error.response,
          status: error.response?.status,
          data: error.response?.data
        });
        setError(error.response?.data?.message || 'Une erreur est survenue lors de la récupération des données');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log("État actuel:", { data, loading, error });
  return { data, loading, error };
}
