import { useState, useEffect } from 'react';
import  axiosClient  from '../api/axios';
import { AxiosError } from 'axios';
import { Lesson , Course , Section , Instructor, } from '@/types/course';

interface ErrorResponse {
    message: string;
}

// interface Lesson {
//     id: string;
//     title: string;
//     duration: number; // en minutes
//     is_completed: boolean;
//     order: number;
// }

// interface Section {
//     id: string;
//     title: string;
//     order: number;
//     descreption : string;
//     lessons: Lesson[];
// }

// interface Instructor {
//     id: string;
//     first_name: string;
//     last_name: string;
//     email: string;
//     avatar_url?: string;
//     bio?: string;
// }

// interface Course {
//     id: string;
//     title: string;
//     subtitle: string;
//     description: string;
//     slug: string;
//     instructor: Instructor;
//     level: string;
//     language: string;
//     image_url: string;
//     video_url: string;
//     price: number;
//     discount: number;
//     requirements: string[];
//     what_you_will_learn: string[];
//     target_audience: string[];
//     average_rating: number;
//     has_certificate: boolean;
//     sections: Section[];
//     total_lessons: number;
//     completed_lessons: number;
//     progress: number;
//     last_viewed?: string;
//     bookmarked: boolean;
//     bestseller?: boolean;
//     new?: boolean;
//     reviewCount?: number;
//     duration?: string;
//     studentsCount?: number;
// }

// interface CourseResponse {
//     current_page: number;
//     data: Course[];
//     first_page_url: string;
//     from: number;
//     last_page: number;
//     last_page_url: string;
//     links: Array<{
//         url: string | null;
//         label: string;
//         active: boolean;
//     }>;
//     next_page_url: string | null;
//     path: string;
//     per_page: number;
//     prev_page_url: string | null;
//     to: number;
//     total: number;
// }

const useCourses = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(12);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log("Début de la récupération des cours...");
                
                const response = await axiosClient.get('http://localhost:8000/api/courses', {
                    params: {
                        page: currentPage,
                        per_page: perPage,
                    },
                });
                
                console.log("Réponse brute de l'API:", JSON.stringify(response, null, 2));
                console.log("Données de la réponse:", JSON.stringify(response.data, null, 2));
                console.log("Type de la réponse:", typeof response.data);
                console.log("Propriétés de la réponse:", Object.keys(response.data));

                if (response.data && response.data.courses) {
                    console.log("Structure avec 'courses':", JSON.stringify(response.data.courses, null, 2));
                    const { data, current_page, total, per_page } = response.data.courses;
                    console.log("Données des cours extraites:", data);
                    setCourses(data);
                    setTotal(total);
                    setCurrentPage(current_page);
                    setPerPage(per_page);
                } else if (response.data && response.data.data) {
                    console.log("Structure avec 'data':", JSON.stringify(response.data.data, null, 2));
                    const { data, current_page, total, per_page } = response.data;
                    console.log("Données des cours extraites:", data);
                    setCourses(data);
                    setTotal(total);
                    setCurrentPage(current_page);
                    setPerPage(per_page);
                } else {
                    console.error("Format de réponse invalide:", JSON.stringify(response.data, null, 2));
                    setError("Format de réponse invalide");
                }
            } catch (err) {
                console.error("Erreur lors de la récupération des cours:", err);
                const error = err as AxiosError<ErrorResponse>;
                setError(error.response?.data?.message || 'Une erreur est survenue');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [currentPage, perPage]);

    return {
        courses,
        total,
        currentPage,
        perPage,
        loading,
        error,
        selectedCourse,
        setCurrentPage,
        setPerPage,
        setSelectedCourse,
    };
};

export default useCourses;