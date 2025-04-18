// hooks/useStudentDashboardData.js
import { useEffect, useState } from 'react';
import axiosClient  from '../api/axios';
import { AxiosError } from 'axios';
import { useAuth } from './useAuth';

interface ErrorResponse {
  message: string;
}

// Définir l'interface pour les données du tableau de bord
interface DashboardData {
  courses: Array<{
    id: number;
    title: string;
    instructor: string;
    progress: number;
    image: string;
    lastViewed: string;
    rating: number;
    reviews: number;
    totalLessons: number;
    completedLessons: number;
    category: string;
    level: string;
    description: string;
    bookmarked: boolean;
    isArchived: boolean;
    estimatedTimeLeft: string;
    lastSection: string;
    lastLesson: string;
  }>;
  certificates: Array<{
    id: number;
    title: string;
    issuer: string;
    date: string;
    image: string;
    course: string;
    skills: string[];
  }>;
  notifications: Array<{
    id: number;
    title: string;
    course: string;
    time: string;
    icon: string;
    read: boolean;
  }>;
  userProfile: {
    name: string;
    email: string;
    avatar: string;
  };
}

export default function useStudentDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Début de la requête API...");
        const token = "6|hRhV49YbcWYyFsPM4C4S7eI9pdiVgiTA2j8nE3p318ea7a26"
        console.log("Token utilisé:", token ? "Token présent" : "Token absent");
        

        // Utiliser l'URL relative pour bénéficier du proxy Vite
        const response = await axiosClient.get('/api/dashboard-student', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log("Réponse API reçue:", response);
        console.log("Structure complète de la réponse:", JSON.stringify(response.data, null, 2));
        
        // Vérifier si la structure de la réponse est correcte
        if (response.data && response.data.data) {
          console.log("Données du tableau de bord:", response.data.data);
          console.log("Cours:", response.data.data.courses);
          console.log("Certificats:", response.data.data.certificates);
          console.log("Profil:", response.data.data.profile);
          
          // Vérifier si les tableaux sont vides
          if (response.data.data.courses && response.data.data.courses.length === 0) {
            console.log("Aucun cours trouvé dans la réponse");
          }
          
          if (response.data.data.certificates && response.data.data.certificates.length === 0) {
            console.log("Aucun certificat trouvé dans la réponse");
          }
          
          setData(response.data.data);
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
