
import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';

interface RatingModalProps {
  onClose: () => void;
  onSubmit: (rating: number) => void;
  title?: string;
  subtitle?: string;
}

export const RatingModal: React.FC<RatingModalProps> = ({ onClose, onSubmit, title = "Noter", subtitle }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [rating, setRating] = useState(7.5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSubmit(rating);
        handleClose();
      }, 1500);
    }, 800);
  };

  const getRatingColor = (r: number) => {
    if (r >= 9) return 'text-[#00b894]'; // Green
    if (r >= 7) return 'text-[#10B981]'; // Teal
    if (r >= 5) return 'text-[#FDCB6E]'; // Yellow
    return 'text-[#e17055]'; // Red
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center isolate px-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      ></div>

      {/* Modal Content */}
      <div 
        className={`relative w-full max-w-sm bg-[#1C1F26] rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 border border-white/10 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
      >
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in duration-300">
             <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)] mb-4">
                <Icon name="check" className="text-4xl text-white font-bold" />
             </div>
             <h3 className="text-xl font-bold text-white mb-1">Vote enregistré !</h3>
             <p className="text-gray-400 text-sm">Merci pour votre participation.</p>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-white leading-none mb-1">{title}</h3>
                {subtitle && <p className="text-xs text-gray-400 font-medium">{subtitle}</p>}
              </div>
              <button onClick={handleClose} className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
                <Icon name="close" className="text-xl" />
              </button>
            </div>

            {/* Rating Display */}
            <div className="flex flex-col items-center justify-center mb-8">
              <div className={`text-6xl font-black ${getRatingColor(rating)} tabular-nums tracking-tighter drop-shadow-lg transition-colors duration-300`}>
                {rating.toFixed(1)}
              </div>
              <div className="flex gap-1 mt-2">
                {[...Array(10)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 w-4 rounded-full transition-colors duration-200 ${i < Math.floor(rating) ? 'bg-white' : 'bg-white/10'}`}
                  ></div>
                ))}
              </div>
            </div>

            {/* Slider */}
            <div className="mb-8 relative px-2">
              <input 
                type="range" 
                min="1" 
                max="10" 
                step="0.1" 
                value={rating} 
                onChange={(e) => setRating(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <div className="flex justify-between mt-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                <span>Mauvais</span>
                <span>Moyen</span>
                <span>Excellent</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button 
                onClick={handleClose}
                className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-transparent text-white border border-white/10 hover:bg-white/5 transition-all"
              >
                Annuler
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-white text-black hover:bg-gray-200 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin"></div>
                    Envoi...
                  </>
                ) : (
                  'Confirmer'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
