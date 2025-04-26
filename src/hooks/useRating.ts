// src/components/course/RatingForm.tsx
import { useState } from 'react';
import { Star } from 'lucide-react';
import axios from 'axios';

interface RatingFormProps {
  courseId: number;
  onRatingAdded: () => void;
}

export function RatingForm({ courseId, onRatingAdded }: RatingFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Veuillez donner une note');
      return;
    }

    try {
      const response = await axios.post('/api/ratings', {
        courseId,
        rating,
        comment,
      });
      
      if (response.status === 201) {
        setRating(0);
        setComment('');
        setError('');
        onRatingAdded(); // Rafraîchir la liste des notes
      }
    } catch (error) {
      setError('Erreur lors de l\'envoi de votre avis');
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold mb-4">Donnez votre avis sur ce cours</h3>
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
          className="bg-[#ff9500] text-white px-6 py-2 rounded-md hover:bg-[#ff9500]/90 transition-colors"
        >
          Envoyer mon avis
        </button>
      </form>
    </div>
  );
}