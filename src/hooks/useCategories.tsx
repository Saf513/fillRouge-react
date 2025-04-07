import { useState , useEffect} from 'react' ;
import { axiosClient } from '../api/axios';
import { AxiosError } from 'axios';

interface ErrorResponse {
    message: string;
}

interface Category {
    id: string;
    title: string;
    description: string;
    image_url: string;
    subcategories: Array<{
        id: string;
        title: string;
        description: string;
        image_url: string;
    }>;
}

                                                              
export default function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosClient.get('/api/categories');
        setCategories(response.data.data);
        setLoading(false);
      } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        setError(error.response?.data?.message || 'Une erreur est survenue lors de la récupération des catégories');
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return { categories, loading, error };
}