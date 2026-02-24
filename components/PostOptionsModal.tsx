
import React, { useEffect, useState, useRef } from 'react';
import { Icon } from './Icon';
import { Post } from '../types';

interface PostOptionsModalProps {
  post: Post;
  onClose: () => void;
  isSaved: boolean;
  isFollowing: boolean;
  isCompact?: boolean; // New prop for smaller popup
  onSave?: () => void;
  onShare?: () => void;
  onNotInterested?: () => void;
  onUnfollow?: () => void;
  onReport?: () => void;
}

type ModalView = 'main' | 'not-interested' | 'keywords';

export const PostOptionsModal: React.FC<PostOptionsModalProps> = ({ 
  post, 
  onClose,
  isSaved,
  isFollowing,
  isCompact = false,
  onSave,
  onShare,
  onNotInterested,
  onUnfollow,
  onReport
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [view, setView] = useState<ModalView>('main');
  const [keywords, setKeywords] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsVisible(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    if (view === 'keywords' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [view]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleAction = (action: (() => void) | undefined) => {
    if (action) action();
    handleClose();
  };

  const switchToNotInterested = () => {
    setView('not-interested');
  };

  const switchToKeywords = () => {
    setView('keywords');
  };

  const undoNotInterested = () => {
    setView('main');
  };

  // Conditional styles based on isCompact
  const containerClasses = isCompact 
    ? "fixed inset-0 z-[100] flex items-center justify-center isolate p-4"
    : "fixed inset-0 z-[100] flex items-end justify-center isolate";

  const modalClasses = isCompact
    ? `relative w-full max-w-[280px] bg-[#1C1C1E] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ease-out flex flex-col border border-white/10 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`
    : `relative w-full max-w-md bg-[#151518] rounded-t-[20px] overflow-hidden shadow-2xl transition-all duration-300 ease-out flex flex-col border-t border-white/10 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`;

  // For compact mode, items might be smaller
  const itemPadding = isCompact ? "px-4 py-3" : "px-6 py-3.5";
  const iconSize = isCompact ? "text-[20px]" : "text-[22px]";
  const textSize = isCompact ? "text-[14px]" : "text-[15px]";

  return (
    <div className={containerClasses}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      ></div>

      {/* Modal Content */}
      <div className={modalClasses}>
        
        {/* Handle bar - Only for non-compact mode */}
        {!isCompact && (
            <div className="flex justify-center py-2.5 cursor-pointer" onClick={handleClose}>
              <div className="w-9 h-1 bg-white/15 rounded-full"></div>
            </div>
        )}

        <div className={`relative overflow-hidden ${isCompact ? 'min-h-[100px]' : 'min-h-[320px]'}`}>
          {/* Main Options View */}
          <div className={`transition-all duration-300 ${view === 'main' ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none absolute inset-0'}`}>
            <div className={`flex flex-col ${!isCompact ? 'mt-1 pb-6' : 'py-1'}`}>
              <button 
                onClick={() => handleAction(onSave)}
                className={`w-full flex items-center gap-3.5 ${itemPadding} hover:bg-white/5 active:bg-white/10 transition-colors group`}
              >
                <Icon 
                  name={isSaved ? "bookmark_remove" : "bookmark"} 
                  className={`${iconSize} group-active:scale-90 transition-transform ${isSaved ? 'text-red-400' : 'text-gray-400'}`} 
                  filled={isSaved}
                />
                <span className={`${textSize} font-semibold text-white/90`}>
                  {isSaved ? 'Retirer' : 'Enregistrer'}
                </span>
              </button>

              <button 
                onClick={() => handleAction(onShare)}
                className={`w-full flex items-center gap-3.5 ${itemPadding} hover:bg-white/5 active:bg-white/10 transition-colors group`}
              >
                <Icon name="ios_share" className={`text-gray-400 ${iconSize} group-active:scale-90 transition-transform`} />
                <span className={`${textSize} font-semibold text-white/90`}>Partager via</span>
              </button>

              <button 
                onClick={switchToNotInterested}
                className={`w-full flex items-center gap-3.5 ${itemPadding} hover:bg-white/5 active:bg-white/10 transition-colors group`}
              >
                <Icon name="visibility_off" className={`text-gray-400 ${iconSize} group-active:scale-90 transition-transform`} />
                <span className={`${textSize} font-semibold text-white/90`}>Pas intéressé(e)</span>
              </button>

              <button 
                onClick={() => handleAction(onUnfollow)}
                className={`w-full flex items-center justify-between ${itemPadding} hover:bg-white/5 active:bg-white/10 transition-colors group`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon 
                    name={isFollowing ? "cancel" : "person_add"} 
                    className={`text-gray-400 ${iconSize} group-active:scale-90 transition-transform`} 
                  />
                  <span className={`${textSize} font-semibold text-white/90`}>
                    {isFollowing ? 'Ne plus suivre' : 'Suivre'}
                  </span>
                </div>
                {!isCompact && <Icon name="chevron_right" className="text-gray-600 text-[18px]" />}
              </button>

              <button 
                onClick={() => handleAction(onReport)}
                className={`w-full flex items-center gap-3.5 ${itemPadding} hover:bg-white/5 active:bg-white/10 transition-colors group`}
              >
                <Icon name="flag" className={`text-gray-400 ${iconSize} group-active:scale-90 transition-transform`} />
                <span className={`${textSize} font-semibold text-white/90`}>Signaler le post</span>
              </button>
            </div>
          </div>

          {/* Not Interested / Post Hidden View */}
          <div className={`transition-all duration-300 ${isCompact ? 'p-4' : 'px-6 pb-10'} ${view === 'not-interested' ? 'translate-x-0 opacity-100' : (view === 'keywords' ? '-translate-x-full opacity-0 pointer-events-none absolute inset-0' : 'translate-x-full opacity-0 pointer-events-none absolute inset-0')}`}>
            <div className="flex items-center justify-between mt-1 mb-2">
              <h3 className={`${isCompact ? 'text-sm' : 'text-[16px]'} font-bold text-white`}>Publication masquée</h3>
              <button 
                onClick={undoNotInterested}
                className={`${isCompact ? 'text-sm' : 'text-[16px]'} font-bold text-blue-400 hover:text-blue-300 transition-colors`}
              >
                Annuler
              </button>
            </div>
            
            <p className={`text-[13px] text-gray-400 leading-tight ${isCompact ? 'mb-4' : 'mb-6'}`}>
              Nous vous suggérerons moins de publications comme celle-ci.
            </p>

            <div className={`bg-[#1C1C1E] rounded-2xl overflow-hidden ${!isCompact ? 'border border-white/5' : ''}`}>
                {/* Secondary Option 1: Masks Automatically */}
                <button 
                  onClick={() => handleAction(onNotInterested)}
                  className={`w-full flex items-center gap-4 px-4 hover:bg-white/5 active:bg-white/10 transition-colors border-b border-white/5 text-left group ${isCompact ? 'py-3' : 'py-4'}`}
                >
                  <Icon name="cancel" className={`text-gray-300 ${iconSize} group-active:scale-90 transition-transform`} />
                  <span className={`text-[13px] font-medium text-white/90 leading-snug flex-1`}>
                    Ne pas suggérer de publications de {post.user.name}
                  </span>
                </button>

                {/* Secondary Option 2: Opens Keywords View */}
                <button 
                  onClick={switchToKeywords}
                  className={`w-full flex items-center gap-4 px-4 hover:bg-white/5 active:bg-white/10 transition-colors border-b border-white/5 text-left group ${isCompact ? 'py-3' : 'py-4'}`}
                >
                  <Icon name="text_fields" className={`text-gray-300 ${iconSize} group-active:scale-90 transition-transform`} />
                  <span className={`text-[13px] font-medium text-white/90 leading-snug flex-1`}>
                    Ne pas suggérer de publications contenant certains mots
                  </span>
                </button>

                {/* Secondary Option 3: Masks Automatically */}
                <button 
                  onClick={() => handleAction(onNotInterested)}
                  className={`w-full flex items-center gap-4 px-4 hover:bg-white/5 active:bg-white/10 transition-colors border-b border-white/5 text-left group ${isCompact ? 'py-3' : 'py-4'}`}
                >
                  <Icon name="sentiment_dissatisfied" className={`text-gray-300 ${iconSize} group-active:scale-90 transition-transform`} />
                  <span className={`text-[13px] font-medium text-white/90 leading-snug flex-1`}>
                    Cette publication me met mal à l'aise
                  </span>
                </button>

                {/* Secondary Option 4: Masks Automatically */}
                <button 
                  onClick={() => handleAction(onNotInterested)}
                  className={`w-full flex items-center gap-4 px-4 hover:bg-white/5 active:bg-white/10 transition-colors text-left group ${isCompact ? 'py-3' : 'py-4'}`}
                >
                  <Icon name="help_outline" className={`text-gray-300 ${iconSize} group-active:scale-90 transition-transform`} />
                  <span className={`text-[13px] font-medium text-white/90 leading-snug flex-1`}>
                    C’est autre chose
                  </span>
                </button>
            </div>
          </div>

          {/* Keywords View */}
          <div className={`transition-all duration-300 ${isCompact ? 'p-4' : 'px-6 pb-12'} ${view === 'keywords' ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none absolute inset-0'}`}>
            {isCompact && (
                <button onClick={switchToNotInterested} className="mb-2 text-gray-400 hover:text-white">
                    <Icon name="arrow_back" />
                </button>
            )}
            <h3 className={`${isCompact ? 'text-[16px]' : 'text-[18px]'} font-bold text-white text-center mt-2 mb-4 leading-tight`}>
                Ajoutez des mots, des expressions ou des emojis
            </h3>
            
            <p className="text-[13px] text-gray-400 text-center leading-snug mb-8">
              Nous ne suggérerons pas de publications qui ont des hashtags ou des légendes avec ces éléments.
            </p>

            <div className="relative mb-8">
                <input 
                    ref={inputRef}
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="Ajoutez plusieurs éléments..."
                    className="w-full bg-transparent border-none text-[15px] text-white placeholder-gray-500 focus:ring-0 px-0 caret-blue-500"
                />
                <div className="h-[1px] w-full bg-white/10 absolute bottom-0"></div>
            </div>

            <button 
                onClick={() => handleAction(onNotInterested)}
                className="w-full bg-[#1A42D8] text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] hover:bg-blue-600 shadow-lg"
            >
                Terminé
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
