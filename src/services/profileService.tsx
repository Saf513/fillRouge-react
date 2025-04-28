import axiosClient  from '../api/axios';
import { ProfileResponse, UserSettings, NotificationSettings, PaymentMethod } from '../types/profile';

export const profileService = {
  // Récupérer le profil
  getProfile: async (): Promise<ProfileResponse> => {
    try {
      const user_id = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.user?.id;
      const response = await axiosClient.get<ProfileResponse>(`api/profile/${user_id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      throw error;
    }
  },

  // Mettre à jour le profil complet
  updateProfile: async (data: Partial<UserSettings>): Promise<ProfileResponse> => {
    try {
      const formData = new FormData();

      // Ajouter les champs au FormData
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'avatar' && value instanceof File) {
          formData.append('', value);
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as string);
        }
      });

      const response = await axiosClient.put<ProfileResponse>('api/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  },

  // Mettre à jour uniquement les paramètres de notification
  updateNotificationSettings: async (settings: NotificationSettings): Promise<ProfileResponse> => {
    try {
      const response = await axiosClient.patch<ProfileResponse>('api/profile/notifications', {
        notification_settings: settings,
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres de notification:', error);
      throw error;
    }
  },

  // Mettre à jour uniquement les méthodes de paiement
  updatePaymentMethods: async (methods: PaymentMethod[]): Promise<ProfileResponse> => {
    try {
      const response = await axiosClient.patch<ProfileResponse>('api/profile/payment-methods', {
        payment_methods: methods,
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des méthodes de paiement:', error);
      throw error;
    }
  },
}; 
