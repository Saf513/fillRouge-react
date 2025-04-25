import axiosClient from '@/api/axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const cartService = {
  // Récupérer le contenu du panier
  async getCart() {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosClient.get(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du panier:', error);
      throw error;
    }
  },

  // Ajouter un cours au panier
  async addToCart(courseId: number | string) {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosClient.post(`${API_URL}/cart/add`, { course_id: courseId }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      throw error;
    }
  },

  // Supprimer un cours du panier
  async removeFromCart(courseId: number | string) {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosClient.delete(`${API_URL}/cart/remove/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression du panier:', error);
      throw error;
    }
  },

  // Vider tout le panier
  async clearCart() {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosClient.delete(`${API_URL}/cart/clear`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du vidage du panier:', error);
      throw error;
    }
  }
};