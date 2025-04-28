import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import axios from '@/api/axios';
import { RatingFormData } from '@/types/rating';
import { useNavigate } from 'react-router-dom';

interface RatingFormProps {
  courseId: number;
  onRatingAdded: () => void;
}

export function RatingForm({ courseId, onRatingAdded }: RatingFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const navigate = useNavigate();

  // Vérifier si l'utilisateur a déjà donné un avis
  useEffect(() => {
    const checkExistingRating = async () => {
      try {
        const response = await axios.get(`/api/courses/${courseId}/ratings`);
        if (response.data.has_rated) {
          setHasRated(true);
          setError('Vous avez déjà donné un avis pour ce cours');
        }
      } catch (error) {
        console.error('Erreur lors de la vérification des avis:', error);
      }
    };

    checkExistingRating();
  }, [courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (hasRated) {
      setError('Vous avez déjà donné un avis pour ce cours');
      return;
    }
    
    if (rating === 0) {
      setError('Veuillez donner une note');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData: RatingFormData = {
        course_id: courseId,
        stars: rating,
        comment,
      };

      await axios.post(`/api/ratings`, formData);
      
      setRating(0);
      setComment('');
      setError('');
      onRatingAdded();
      // Utiliser navigate au lieu de redirect
      navigate(`/course/${courseId}`);
    } catch (err: any) {
      if (err.response && err.response.status === 409) {
        setError('Vous avez déjà donné un avis pour ce cours');
        setHasRated(true);
      } else {
        setError('Erreur lors de l\'envoi de votre avis');
      }
      console.error('Erreur:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-xl font-semibold mb-4">Donnez votre avis sur ce cours</h3>
      {hasRated ? (
        <div className="text-amber-600 bg-amber-50 p-4 rounded-md mb-4">
          Vous avez déjà donné un avis pour ce cours. Vous ne pouvez donner qu'un seul avis par cours.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="flex items-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="p-1"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= (hoverRating || rating)
                      ? 'fill-[#ff9500] text-[#ff9500]'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Partagez votre expérience avec ce cours..."
            className="w-full p-3 border border-gray-200 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#ff9500]"
            rows={4}
          />
          <button
            type="submit"
            disabled={isSubmitting || hasRated}
            className="bg-[#ff9500] text-white px-6 py-2 rounded-md hover:bg-[#ff9500]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer mon avis'}
          </button>
        </form>
      )}
    </div>
  );
}
