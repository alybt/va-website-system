import FavoriteButton from './FavoriteButton'; // The heart component we made
import { Clock, Music, BookOpen } from 'lucide-react';

const ScriptCard = ({ script, userId }) => {
  return (
    <div className="w-80 h-48 bg-white rounded-lg border border-gray-200 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
      
      {/* Top Section: Title and Favorite */}
      <div className="flex justify-between items-start gap-2">
        <h3 className="text-xl font-bold text-gray-800 leading-tight truncate w-full" title={script.title}>
          {script.title}
        </h3>
        <FavoriteButton 
          scriptId={script.script_id} 
          userId={userId} 
          initialIsFavorited={script.is_user_favorite} 
        />
      </div>

      {/* Meta Section: Genre, Runtime, etc. */}
      <div className="text-sm text-gray-500 font-medium flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
        <span className="truncate max-w-[100px]">{script.genre || 'No Genre'}</span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Clock size={14} /> {script.runtime_minutes || 0}m
        </span>
        {script.recommended_music && (
          <>
            <span>•</span>
            <span className="flex items-center gap-1 truncate max-w-[100px]">
              <Music size={14} /> {script.recommended_music}
            </span>
          </>
        )}
      </div>

      {/* Bottom Section: Author Note (Exploration Text) */}
      <div className="mt-3">
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 overflow-hidden">
          {script.author_note || "No author notes provided for this script."}
        </p>
      </div>
      
    </div>
  );
};

export default ScriptCard;