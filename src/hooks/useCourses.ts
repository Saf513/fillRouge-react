import { useState, useEffect } from 'react';
import { Course } from '@/types/course';
import axiosClient from '@/api/axios';

interface Category {
  id: number;
  title: string;
  description: string;
  parent_id: number | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

interface Tag {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse {
  current_page: number;
  data: Course[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

interface ApiResponse {
  courses: PaginatedResponse;
  categories: Category[];
  tags: Tag[];
  message: string;
}

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    total: 0
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        console.log('Début de la requête des cours...');
        const response = await axiosClient.get<ApiResponse>('/api/courses');
        console.log('Réponse reçue:', response.data);
        
        if (response.data && response.data.courses && response.data.courses.data) {
          console.log('Données des cours trouvées');
          setCourses(response.data.courses.data);
          setPagination({
            currentPage: response.data.courses.current_page,
            totalPages: response.data.courses.last_page,
            perPage: response.data.courses.per_page,
            total: response.data.courses.total
          });
        } else {
          console.error('Format de réponse inattendu:', response.data);
          setError('Format de données invalide');
          setCourses([]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des cours:', err);
        setError('Erreur lors du chargement des cours');
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  console.log('État final des cours:', { courses, loading, error, pagination });
  return { courses, loading, error, pagination };
}; 