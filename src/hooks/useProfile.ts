import { useState, useEffect } from 'react';
import { profileService } from '../services/profileService';
import { ProfileResponse, UserSettings, NotificationSettings, PaymentMethod } from '../types/profile';

export const useProfile = () => {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger le profil
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile();
      setProfile(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement du profil');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour le profil
  const updateProfile = async (data: Partial<UserSettings>) => {
    try {
      setLoading(true);
      const updatedProfile = await profileService.updateProfile(data);
      setProfile(updatedProfile);
      setError(null);
      return updatedProfile;
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil');
      console.error('Erreur:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour les paramètres de notification
  const updateNotificationSettings = async (settings: NotificationSettings) => {
    try {
      setLoading(true);
      const updatedProfile = await profileService.updateNotificationSettings(settings);
      setProfile(updatedProfile);
      setError(null);
      return updatedProfile;
    } catch (err) {
      setError('Erreur lors de la mise à jour des paramètres de notification');
      console.error('Erreur:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour les méthodes de paiement
  const updatePaymentMethods = async (methods: PaymentMethod[]) => {
    try {
      setLoading(true);
      const updatedProfile = await profileService.updatePaymentMethods(methods);
      setProfile(updatedProfile);
      setError(null);
      return updatedProfile;
    } catch (err) {
      setError('Erreur lors de la mise à jour des méthodes de paiement');
      console.error('Erreur:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Charger le profil au montage du composant
  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updateNotificationSettings,
    updatePaymentMethods,
  };
}; 