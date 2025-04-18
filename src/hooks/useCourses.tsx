// import { useState, useEffect } from 'react';
// import axiosClient from '../api/axios';
// import { AxiosError } from 'axios';
// import { Course } from '@/types/course';

// interface ErrorResponse {
//   message: string;
// }

// const useCourses = () => {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         const response = await axiosClient.get('/api/courses');
//         console.log('Réponse API:', response.data);

//         if (response.data && Array.isArray(response.data)) {
//           setCourses(response.data);
//         } else if (response.data && response.data.data) {
//           setCourses(response.data.data);
//         } else {
//           console.error('Format de réponse invalide:', response.data);
//           setError("Format de réponse invalide");
//         }
//       } catch (err) {
//         console.error('Erreur lors de la récupération des cours:', err);
//         const error = err as AxiosError<ErrorResponse>;
//         setError(error.response?.data?.message || 'Une erreur est survenue');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, []);

//   return { courses, loading, error };
// };

// export default useCourses;