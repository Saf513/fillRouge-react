import axiosClient from '@/api/axios';
import { Course, Section, Lesson, Category, Tag } from '@/types/course';
import { Rating } from '@/types/rating';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const courseService = {
  // Course APIs
  async createCourse(courseData: Partial<Course>): Promise<Course> {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosClient.post('api/courses', courseData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du cours:', error);
      throw error;
    }
  },

  async updateCourse(courseId: string, courseData: Partial<Course>): Promise<Course> {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosClient.put(
        `api/courses/${courseId}`, 
        courseData, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json',
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  async deleteCourse(courseId: string): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      await axiosClient.delete(
        `api/courses/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json',
          }
        }
      );
    } catch (error) {
      console.error('Erreur lors de la suppression du cours:', error);
      throw error;
    }
  },

  async getCourseById(courseId: string): Promise<Course> {
    try {
      const response = await axiosClient.get(`/api/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  },

  // Section APIs
  async addSection(courseId: string, sectionData: Partial<Section>): Promise<Section> {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosClient.post(
        `api/courses/${courseId}/sections`, 
        sectionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la section:', error);
      throw error;
    }
  },

  async updateSection(courseId: string, sectionId: string, sectionData: Partial<Section>): Promise<Section> {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosClient.put(
        `api/courses/${courseId}/sections/${sectionId}`, 
        sectionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating section:', error);
      throw error;
    }
  },

  async deleteSection(courseId: string, sectionId: string): Promise<void> {
    try {
      await axiosClient.delete(`${API_URL}/courses/${courseId}/sections/${sectionId}`);
    } catch (error) {
      console.error('Error deleting section:', error);
      throw error;
    }
  },
  async addLesson(courseId: string, sectionId: string, lessonData: Partial<Lesson>, token: string): Promise<Lesson> {
    try {
      const response = await axiosClient.post(
        `api/courses/${courseId}/sections/${sectionId}/lessons`,
        lessonData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la leçon:', error);
      throw error;
    }
  },

  async updateLesson(courseId: string, sectionId: string, lessonId: string, lessonData: Partial<Lesson>): Promise<Lesson> {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosClient.put(
        `api/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`, 
        lessonData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating lesson:', error);
      throw error;
    }
  },

  async deleteLesson(courseId: string, sectionId: string, lessonId: string): Promise<void> {
    try {
      await axiosClient.delete(`${API_URL}/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`);
    } catch (error) {
      console.error('Error deleting lesson:', error);
      throw error;
    }
  },

  // Category APIs
  async getCategories(): Promise<Category[]> {
    try {
      const response = await axiosClient.get(`${API_URL}/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  async addCategory(categoryData: Partial<Category>): Promise<Category> {
    try {
      const response = await axiosClient.post(`${API_URL}/categories`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },

  // Tag APIs
  async getTags(): Promise<Tag[]> {
    try {
      const response = await axiosClient.get(`${API_URL}/tags`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  },

  async addTag(courseId: string, tagName: string): Promise<any> {
    const token = localStorage.getItem('token');

    try {
      // Étape 1 : Créer (ou récupérer) le tag
      const response = await axiosClient.post(
        `${API_URL}/api/courses/${courseId}/tags`,
        { name: tagName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const tagId = response.data.tag.id;

      // Étape 2 : Attacher le tag au cours
      const result = await axiosClient.post(
        `${API_URL}/api/courses/${courseId}/tags/${tagId}`,
        {}, // ← corps vide (sinon Laravel ne comprend pas bien parfois)
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response, result);
      return response.data; // Retourner les données de la réponse

    } catch (error) {
      console.error("Erreur lors de l'ajout du tag:", error);
      throw error;
    }
  },

  async updateCourseTags(courseId: string, tags: string[]): Promise<{ success: boolean }> {
    const token = localStorage.getItem('token');
    
    try {
      const response = await axiosClient.put(
        `${API_URL}/api/courses/${courseId}/tags`,
        { tags }, // Envoyer tous les tags en une fois
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la mise à jour des tags:", error);
      throw error;
    }
  },

  // File upload API
  async uploadAttachment(file: File, lessonId: string): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
        formData.append('type', 'lesson');
      }

      const response = await axiosClient.post(
        `api/lessons/${lessonId}/attachments`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error uploading attachment:', error);
      throw error;
    }
  },

  // Course image upload
  async uploadCourseImage(courseId: string, file: File): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axiosClient.post(
        `${API_URL}/courses/${courseId}/image`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error uploading course image:', error);
      throw error;
    }
  },

  async uploadFile (type: string, file: File) {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        const response = await axiosClient.post(
            'api/upload',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Erreur lors du téléchargement du fichier:', error);
        throw error;
    }
  },

  // Resource APIs
  async addResource(courseId: string, resourceData: {
    title: string;
    type: string;
    file_url: string;
    is_downloadable: boolean;
    lesson_id?: number;
  }): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosClient.post(
        `api/courses/${courseId}/resources`,
        resourceData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding resource:', error);
      throw error;
    }
  },

  async getEnrolledStudents(courseId: string): Promise<any> {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosClient.get(
        `api/courses/${courseId}/enrolled-students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json',
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching enrolled students:', error);
      throw error;
    }
  },

  // Ratings APIs
  async getCourseRatings(courseId: string): Promise<Rating[]> {
    try {
      const response = await axiosClient.get(`${API_URL}/courses/${courseId}/ratings`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des évaluations:', error);
      throw error;
    }
  },

  async submitRating(courseId: string, ratingData: { stars: number; comment: string }): Promise<Rating> {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosClient.post(
        `api/courses/${courseId}/ratings`,
        ratingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la soumission de l\'évaluation:', error);
      throw error;
    }
  },

  async getUserRating(courseId: string): Promise<Rating | null> {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosClient.get(
        `api/courses/${courseId}/user-rating`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json',
          }
        }
      );
      return response.data.rating || null;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'évaluation de l\'utilisateur:', error);
      return null;
    }
  }
};
