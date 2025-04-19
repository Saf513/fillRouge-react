import axiosClient from '@/api/axios';
import { Course, Section, Lesson, Category, Tag } from '@/types/course';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const courseService = {
  // Course APIs
  async createCourse(courseData: Partial<Course>): Promise<Course> {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosClient.post('api/courses' ,courseData, {
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
      const response = await axiosClient.put(`${API_URL}/courses/${courseId}`, courseData);
      return response.data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },
  
  async getCourseById(courseId: string): Promise<Course> {
    try {
      const response = await axiosClient.get(`${API_URL}/courses/${courseId}`);
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
      const response = await axiosClient.put(`${API_URL}/courses/${courseId}/sections/${sectionId}`, sectionData);
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
  
  // Lesson APIs
  async addLesson(courseId: string, sectionId: string, lessonData: Partial<Lesson>): Promise<Lesson> {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosClient.post(
        `api/courses/${courseId}/sections/${sectionId}/lessons`, 
        lessonData,
        {
            withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`
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
      const response = await axiosClient.put(
        `${API_URL}/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`, 
        lessonData
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
  
  async addTag(courseId: string, tagName: string): Promise<Tag> {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosClient.post(
        `${API_URL}/courses/${courseId}/tags`, 
        { name: tagName },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du tag:', error);
      throw error;
    }
  },
  
  // File upload API
  async uploadAttachment(file: File, lessonId: string): Promise<{ url: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axiosClient.post(
        `${API_URL}/lessons/${lessonId}/attachments`, 
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
  }
};
