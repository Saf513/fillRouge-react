import { create } from 'zustand';
import { z } from 'zod';
import axiosClient from '@/api/axios';
import { useAuthStore } from './useAuthStore';

// Définition du schéma de validation pour un cours dans la liste de souhaits
const wishlistItemSchema = z.object({
  courseId: z.string(),
  userId: z.number(),
  addedDate: z.date().default(() => new Date()),
  hasNotifications: z.boolean().default(true),
});

// Type d'un élément de la liste de souhaits
export type WishlistItem = z.infer<typeof wishlistItemSchema>;

// Interface pour le store de la liste de souhaits
interface WishlistState {
  // État
  wishlistedCourses: string[]; // Liste des IDs de cours dans la liste de souhaits
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchWishlistedCourses: () => Promise<void>;
  isWishlisted: (courseId: string) => boolean;
  toggleWishlist: (courseId: string) => Promise<void>;
  removeFromWishlist: (courseId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  toggleNotification: (courseId: string) => Promise<void>;
}

// Création du store Zustand
export const useWishlistStore = create<WishlistState>((set, get) => ({
  // État initial
  wishlistedCourses: [],
  isLoading: false,
  error: null,

  // Actions
  fetchWishlistedCourses: async () => {
    const { user } = useAuthStore.getState();

    // Si l'utilisateur n'est pas connecté, on ne fait rien
    if (!user) {
      set({ wishlistedCourses: [], error: null });
      return;
    }

    try {
      set({ isLoading: true, error: null });

      // Requête API pour récupérer les cours de la liste de souhaits
      const response = await axiosClient.get('/api/wishlist');

      // Extraire les IDs des cours de la réponse
      const wishlistedCourses = response.data.wishlist.map(item => item.course_id.toString());

      set({ 
        wishlistedCourses,
        isLoading: false 
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de la liste de souhaits:', error);
      set({ 
        error: 'Impossible de récupérer votre liste de souhaits. Veuillez réessayer.',
        isLoading: false 
      });
    }
  },

  isWishlisted: (courseId: string) => {
    return get().wishlistedCourses.includes(courseId);
  },

  toggleWishlist: async (courseId: string) => {
    const { user } = useAuthStore.getState();

    // Si l'utilisateur n'est pas connecté, on ne fait rien
    if (!user) {
      set({ error: 'Vous devez être connecté pour gérer votre liste de souhaits.' });
      return;
    }

    try {
      set({ isLoading: true, error: null });

      // Utiliser l'endpoint toggle pour ajouter ou retirer le cours de la liste
      const response = await axiosClient.post('/api/wishlist/toggle', { course_id: courseId });

      // Mettre à jour l'état en fonction de la réponse
      if (response.data.in_wishlist) {
        // Le cours a été ajouté à la liste
        set(state => ({ 
          wishlistedCourses: [...state.wishlistedCourses, courseId],
          isLoading: false 
        }));
      } else {
        // Le cours a été retiré de la liste
        set(state => ({ 
          wishlistedCourses: state.wishlistedCourses.filter(id => id !== courseId),
          isLoading: false 
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la modification de la liste de souhaits:', error);
      set({ 
        error: 'Impossible de modifier votre liste de souhaits. Veuillez réessayer.',
        isLoading: false 
      });
    }
  },

  removeFromWishlist: async (courseId: string) => {
    const { user } = useAuthStore.getState();

    // Si l'utilisateur n'est pas connecté, on ne fait rien
    if (!user) {
      set({ error: 'Vous devez être connecté pour gérer votre liste de souhaits.' });
      return;
    }

    try {
      set({ isLoading: true, error: null });

      // Trouver l'ID de l'élément de la liste de souhaits pour ce cours
      // Note: Dans une implémentation complète, vous stockeriez les IDs des éléments de la liste
      // Pour cet exemple, nous utilisons une requête supplémentaire pour vérifier si le cours est dans la liste
      const checkResponse = await axiosClient.get(`/api/wishlist/check/${courseId}`);

      if (checkResponse.data.in_wishlist) {
        // Supprimer l'élément de la liste de souhaits
        // Note: Dans une implémentation complète, vous auriez l'ID de l'élément de la liste
        // Pour cet exemple, nous utilisons une approche simplifiée
        await axiosClient.post('/api/wishlist/toggle', { course_id: courseId });
      }

      set(state => ({ 
        wishlistedCourses: state.wishlistedCourses.filter(id => id !== courseId),
        isLoading: false 
      }));
    } catch (error) {
      console.error('Erreur lors de la suppression du cours de la liste de souhaits:', error);
      set({ 
        error: 'Impossible de supprimer ce cours de votre liste de souhaits. Veuillez réessayer.',
        isLoading: false 
      });
    }
  },

  clearWishlist: async () => {
    const { user } = useAuthStore.getState();

    // Si l'utilisateur n'est pas connecté, on ne fait rien
    if (!user) {
      set({ error: 'Vous devez être connecté pour gérer votre liste de souhaits.' });
      return;
    }

    try {
      set({ isLoading: true, error: null });

      // Supprimer tous les éléments de la liste de souhaits
      await axiosClient.delete('/api/wishlist');

      set({ 
        wishlistedCourses: [],
        isLoading: false 
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de la liste de souhaits:', error);
      set({ 
        error: 'Impossible de vider votre liste de souhaits. Veuillez réessayer.',
        isLoading: false 
      });
    }
  },

  toggleNotification: async (courseId: string) => {
    const { user } = useAuthStore.getState();

    // Si l'utilisateur n'est pas connecté, on ne fait rien
    if (!user) {
      set({ error: 'Vous devez être connecté pour gérer les notifications.' });
      return;
    }

    try {
      set({ isLoading: true, error: null });

      // Trouver l'ID de l'élément de la liste de souhaits pour ce cours
      // Note: Dans une implémentation complète, vous stockeriez les IDs des éléments de la liste
      // Pour cet exemple, nous utilisons une approche simplifiée

      // Récupérer tous les éléments de la liste de souhaits
      const response = await axiosClient.get('/api/wishlist');

      // Trouver l'élément correspondant au cours
      const wishlistItem = response.data.wishlist.find(item => item.course_id.toString() === courseId);

      if (wishlistItem) {
        // Basculer les notifications pour cet élément
        await axiosClient.patch(`/api/wishlist/${wishlistItem.id}/notifications`);
      }

      set({ isLoading: false });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des notifications:', error);
      set({ 
        error: 'Impossible de mettre à jour les notifications. Veuillez réessayer.',
        isLoading: false 
      });
    }
  },
}));
