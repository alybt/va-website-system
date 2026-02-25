import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import api from '../api/axios';

const FavoriteButton = ({ scriptId, userId, initialIsFavorited }) => {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [loading, setLoading] = useState(false);

  const toggleFavorite = async () => {
    if (!userId) return alert("Please login to favorite scripts!");
    
    setLoading(true);
    try {
      const response = await api.post('/favorites/toggle', {
        user_id: userId,
        script_id: scriptId
      });

      if (response.data.status === 'added') {
        setIsFavorited(true);
      } else {
        setIsFavorited(false);
      }
    } catch (err) {
      console.error("Error toggling favorite", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={toggleFavorite}
      disabled={loading}
      className="focus:outline-none transition-transform active:scale-125"
      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart 
        size={24} 
        fill={isFavorited ? "#ef4444" : "none"} 
        stroke={isFavorited ? "#ef4444" : "currentColor"}
        className={`transition-colors duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}
      />
    </button>
  );
};

export default FavoriteButton;