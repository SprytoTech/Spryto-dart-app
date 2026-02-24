
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { SuggestedPlay, Post } from '../types';
import { Icon } from './Icon';
import { CommentsModal } from './CommentsModal';
import { ShareModal } from './ShareModal';
import { PostOptionsModal } from './PostOptionsModal';

interface ShortsFeedPageProps {
  initialPlayId: string;
  plays: SuggestedPlay[];
  onBack: () => void;
  onPublish: () => void;
}

export const ShortsFeedPage: React.FC<ShortsFeedPageProps> = ({ initialPlayId, plays, onBack, onPublish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Gesture state
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const dragStartTime = useRef(0);

  // Layout Constants
  const INITIAL_VIDEO_HEIGHT_PCT = 40; 
  const DISMISS_THRESHOLD = 200; 

  // Synchronisation de l'index initial
  useEffect(() => {
    const index = plays.findIndex(p => p.id === initialPlayId);
    if (index !== -1) {
      setCurrentIndex(index);
      setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.scrollTo({ top: index * window.innerHeight, behavior: 'auto' });
          }
      }, 0);
    }
  }, [initialPlayId, plays]);

  const handleScroll = () => {
    if (containerRef.current) {
      const index = Math.round(containerRef.current.scrollTop / window.innerHeight);
      if (index !== currentIndex) {
        setCurrentIndex(index);
      }
    }
  };

  // --- Gesture Logic ---
  const handleTouchStart = (e: React.TouchEvent) => {
      dragStartY.current = e.touches[0].clientY;
      dragStartTime.current = Date.now();
      setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
      if (!isDragging) return;
      const currentY = e.touches[0].clientY;
      const delta = currentY - dragStartY.current;
      if (delta > 0) {
          setDragY(delta);
      }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
      if (!isDragging) return;
      setIsDragging(false);
      const duration = Date.now() - dragStartTime.current;
      const delta = e.changedTouches[0].clientY - dragStartY.current;
      const velocity = delta / duration;
      if (delta > DISMISS_THRESHOLD || (velocity > 0.6 && delta > 50)) {
          setShowComments(false);
          setTimeout(() => setDragY(0), 400);
      } else {
          setDragY(0);
      }
  };

  const progress = useMemo(() => {
      return Math.min(1, dragY / (window.innerHeight * 0.5));
  }, [dragY]);

  const currentPlay = plays[currentIndex];

  const mockPostForModal: Post = currentPlay ? {
      id: currentPlay.id,
      user: currentPlay.user,
      content: currentPlay.title,
      timestamp: 'À l\'instant',
      image: currentPlay.image,
      video: currentPlay.video,
      hashtags: ['#shorts', '#football'],
      stats: { position: '', category: '', age: '' },
      reactionCount: 0,
      ratingCount: 0,
      commentCount: 0,
      recentReactions: [],
      isFollowed: false
  } : {} as Post;

  const [miniPlayerPlaying, setMiniPlayerPlaying] = useState(true);
  const miniVideoRef = useRef<HTMLVideoElement>(null);

  const toggleMiniPlay = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (miniVideoRef.current) {
          if (miniPlayerPlaying) miniVideoRef.current.pause();
          else miniVideoRef.current.play();
          setMiniPlayerPlaying(!miniPlayerPlaying);
      }
  };

  // HEADER SPLIT VIEW: Description complète affichée ici
  const descriptionNode = currentPlay ? (
      <div className="pb-4 border-b border-white/5 mb-2 mt-2 px-1">
          <div className="flex items-start gap-3">
              <div className="shrink-0">
                  <img 
                      src={currentPlay.user.avatar} 
                      alt={currentPlay.user.name} 
                      className="w-10 h-10 rounded-full object-cover border border-white/10"
                  />
              </div>
              <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-white">{currentPlay.user.name}</span>
                      <button className="bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-full">Suivre</button>
                  </div>
                  {/* Pas de line-clamp ici pour montrer la description complète */}
                  <p className="text-sm text-gray-200 leading-snug font-normal whitespace-pre-wrap">
                      {currentPlay.title} <span className="text-blue-400">#football #skills #highlights #talent #soccer #training</span>
                  </p>
                  <p className="text-[11px] text-gray-500 mt-2 font-medium">5 janvier • {currentPlay.stats?.position || 'Joueur'}</p>
              </div>
          </div>
      </div>
  ) : null;

  return (
    <div className="absolute inset-0 z-[60] bg-black text-white font-sans h-full w-full overflow-hidden">
      
      {/* SPLIT VIEW OVERLAY */}
      {showComments && currentPlay && (
        <div 
            className="absolute inset-0 z-[70] flex flex-col bg-black overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div 
                className="absolute inset-0 bg-black -z-10"
                style={{ 
                    opacity: Math.max(0, 1 - progress),
                    transition: isDragging ? 'none' : 'opacity 0.4s' 
                }}
            ></div>
            
            <div 
                className="relative w-full flex items-center justify-center shrink-0 overflow-hidden bg-black" 
                style={{ 
                    height: `${INITIAL_VIDEO_HEIGHT_PCT + (progress * (100 - INITIAL_VIDEO_HEIGHT_PCT))}%`,
                    transition: isDragging ? 'none' : 'height 0.4s cubic-bezier(0.19, 1, 0.22, 1)'
                }}
                onClick={toggleMiniPlay}
            >
                <div 
                    className="relative z-10 overflow-hidden transition-all shadow-2xl border border-white/10 bg-black"
                    style={{ 
                        height: progress > 0.8 ? '100%' : '90%', 
                        width: progress > 0.8 ? '100%' : 'auto',
                        aspectRatio: progress > 0.8 ? 'unset' : '9/16',
                        borderRadius: progress > 0.8 ? '0px' : '24px',
                        transform: `scale(${0.95 + (progress * 0.05)})`,
                        transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)'
                    }}
                >
                    {currentPlay.video ? (
                        <video 
                            ref={miniVideoRef}
                            src={currentPlay.video} 
                            className="w-full h-full object-cover"
                            autoPlay
                            loop
                            playsInline
                        />
                    ) : (
                        <img 
                            src={currentPlay.image} 
                            className="w-full h-full object-cover"
                            alt={currentPlay.title}
                        />
                    )}
                    
                    {!miniPlayerPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                            <Icon name="play_arrow" className="text-white text-4xl opacity-80" filled />
                        </div>
                    )}

                    <div 
                        className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"
                        style={{ opacity: 1 - progress }}
                    ></div>
                </div>
                
                <button 
                    onClick={(e) => { e.stopPropagation(); setShowComments(false); }}
                    className="absolute top-6 left-6 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 z-20 active:scale-90 transition-all"
                    style={{ 
                        opacity: Math.max(0, 1 - (progress * 4)),
                        transform: `translateY(${-progress * 20}px)`
                    }}
                >
                    <Icon name="keyboard_arrow_down" className="text-2xl" />
                </button>
            </div>

            <div 
                className="flex-1 relative bg-[#151518] rounded-t-[24px] z-20 -mt-4 shadow-[0_-20px_60px_rgba(0,0,0,0.7)] overflow-hidden"
                style={{ 
                    opacity: 1 - (progress * 0.5),
                    transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)'
                }}
            >
                <div className="w-full flex justify-center py-4 shrink-0 cursor-grab active:cursor-grabbing">
                    <div className="w-12 h-1 bg-white/10 rounded-full"></div>
                </div>

                <CommentsModal 
                    post={mockPostForModal} 
                    onClose={() => setShowComments(false)} 
                    variant="embedded"
                    headerContent={descriptionNode}
                />
            </div>
        </div>
      )}

      {/* Main Content Area */}
      {!showComments && (
        <div className="absolute top-0 left-0 right-0 z-30 pt-12 pb-4 flex justify-center items-center gap-6 text-[15px] font-bold text-shadow-sm pointer-events-none animate-in fade-in duration-500">
            <button onClick={onBack} className="absolute left-4 top-12 pointer-events-auto active:opacity-70 hover:scale-110 transition-transform">
                <Icon name="arrow_back_ios" className="text-2xl drop-shadow-md" />
            </button>
            
            <button className="text-white/60 hover:text-white pointer-events-auto transition-colors drop-shadow-md">Suivis</button>
            <div className="relative">
                <button className="text-white font-bold pointer-events-auto drop-shadow-md">Pour toi</button>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
            </div>

            <button onClick={onPublish} className="absolute right-4 top-12 pointer-events-auto active:opacity-70 hover:scale-110 transition-transform">
                <Icon name="camera_alt" className="text-2xl drop-shadow-md" />
            </button>
        </div>
      )}

      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar"
      >
        {plays.map((play, index) => (
          <ShortVideoItem 
            key={play.id} 
            play={play} 
            isActive={index === currentIndex && !showComments}
            onComment={() => setShowComments(true)}
            onDescriptionClick={() => setShowComments(true)}
            onShare={() => setShowShare(true)}
            onOptions={() => setShowOptions(true)}
          />
        ))}
      </div>

      {!showComments && (
        <div className="absolute bottom-0 left-0 right-0 z-40 bg-[#0F1115] border-t border-white/10 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2.5 px-4 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom duration-500">
            <div className="flex items-center justify-between">
                <div className="flex flex-col items-center flex-1 border-r border-white/5 gap-0.5">
                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Icon name="radar" className="text-[10px]" filled /> Poste
                    </span>
                    <span className="text-sm font-bold text-white font-display">{currentPlay?.stats?.position || currentPlay?.role || '-'}</span>
                </div>
                <div className="flex flex-col items-center flex-1 border-r border-white/5 gap-0.5">
                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Icon name="workspace_premium" className="text-[10px]" filled /> Rank
                    </span>
                    <span className="text-sm font-bold text-white font-display">{currentPlay?.stats?.category || 'N/A'}</span>
                </div>
                <div className="flex flex-col items-center flex-1 gap-0.5">
                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Icon name="cake" className="text-[10px]" filled /> Age
                    </span>
                    <span className="text-sm font-bold text-white font-display">{currentPlay?.stats?.age || '-'}</span>
                </div>
            </div>
        </div>
      )}

      {showShare && (
          <ShareModal post={mockPostForModal} onClose={() => setShowShare(false)} />
      )}

      {showOptions && (
        <PostOptionsModal 
          post={mockPostForModal} 
          onClose={() => setShowOptions(false)} 
          isSaved={false} // Placeholder, ideally synced with item
          isFollowing={false} // Placeholder
          isCompact={true}
          onShare={() => {
              setShowOptions(false);
              setTimeout(() => setShowShare(true), 300);
          }}
        />
      )}
    </div>
  );
};

interface ShortVideoItemProps {
    play: SuggestedPlay;
    isActive: boolean;
    onComment: () => void;
    onDescriptionClick: () => void;
    onShare: () => void;
    onOptions: () => void;
}

const ShortVideoItem: React.FC<ShortVideoItemProps> = ({ play, isActive, onComment, onDescriptionClick, onShare, onOptions }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isFollowed, setIsFollowed] = useState(false);

    useEffect(() => {
        if (isActive) {
            // Only try to play if there is a video source
            if (play.video) {
                videoRef.current?.play().catch(() => {});
                setIsPlaying(true);
            }
        } else {
            if (play.video && videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }
            setIsPlaying(false);
        }
    }, [isActive, play.video]);

    const togglePlay = () => {
        if (videoRef.current && play.video) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    return (
        <div className="h-full w-full relative snap-start bg-[#1C1C1E] overflow-hidden">
            <div onClick={togglePlay} className="absolute inset-0 cursor-pointer">
                {play.video ? (
                    <video 
                        ref={videoRef}
                        src={play.video}
                        poster={play.image}
                        className="h-full w-full object-cover"
                        loop
                        playsInline
                    />
                ) : (
                    <img 
                        src={play.image}
                        className="h-full w-full object-cover"
                        alt={play.title}
                    />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none"></div>
                
                {!isPlaying && play.video && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/10 backdrop-blur-[1px]">
                        <Icon name="play_arrow" className="text-white text-6xl opacity-50" filled />
                    </div>
                )}
            </div>

            <div className="absolute bottom-20 right-2 z-20 flex flex-col items-center gap-4 pb-6 w-12">
                <ActionButton 
                    icon="sports_soccer" 
                    label={isLiked ? "8.2K" : "8.1K"} 
                    filled={isLiked} 
                    color={isLiked ? "text-[#FE2C55]" : "text-white"} 
                    onClick={() => setIsLiked(!isLiked)} 
                />
                <ActionButton icon="chat_bubble" label="243" filled={false} onClick={onComment} />
                <ActionButton icon="bookmark" label={isSaved ? "402" : "401"} filled={isSaved} color={isSaved ? "text-[#F1C40F]" : "text-white"} onClick={() => setIsSaved(!isSaved)} />
                {/* Labels removed for Share and Options */}
                <ActionButton icon="send" filled={false} className="-rotate-45" onClick={onShare} />
                <ActionButton icon="more_horiz" filled={false} onClick={onOptions} />
            </div>

            <div className="absolute bottom-24 left-0 right-16 z-20 px-4 pb-4 flex flex-col items-start text-white pointer-events-none">
                <div className="flex items-start gap-3 mb-3 pointer-events-auto">
                    <div className="w-11 h-11 rounded-full border border-white/20 overflow-hidden shrink-0 bg-black/20 backdrop-blur-sm cursor-pointer shadow-lg">
                        <img src={play.user.avatar} alt={play.user.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col pt-0.5 shadow-black drop-shadow-md">
                        <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-bold text-[15px] text-white leading-none cursor-pointer hover:underline decoration-white/50">{play.user.name}</h3>
                            <Icon name="verified" className="text-blue-400 text-[14px]" filled />
                            <button 
                                onClick={() => setIsFollowed(!isFollowed)}
                                className={`text-[11px] font-semibold border border-white/30 px-2 py-0.5 rounded-full transition-colors ${isFollowed ? 'bg-white/10 text-white/70' : 'bg-transparent text-white hover:bg-white/10'}`}
                            >
                                {isFollowed ? 'Suivi' : 'Suivre'}
                            </button>
                        </div>
                        <span className="text-[12px] font-medium text-gray-200 opacity-90 leading-tight">
                            {play.stats?.position || play.role} • {play.user.team || 'No Team'}
                        </span>
                    </div>
                </div>

                {/* DESCRIPTION ABRÉGÉE ICI (line-clamp-1) */}
                <p 
                    className="text-sm font-medium leading-relaxed text-white/95 pointer-events-auto drop-shadow-md line-clamp-1 active:opacity-70 cursor-pointer"
                    onClick={onDescriptionClick}
                >
                    {play.title} <span className="text-blue-400 font-normal">#football #skills ⚽️🔥</span>
                </p>
            </div>
        </div>
    );
};

const ActionButton = ({ icon, label, filled, color = "text-white", className = "", onClick }: any) => (
    <div className="flex flex-col items-center gap-1 cursor-pointer active:scale-90 transition-transform group p-1" onClick={onClick}>
        <div className={`drop-shadow-md ${className}`}>
            <Icon name={icon} className={`text-[28px] ${color} drop-shadow-lg transition-all duration-200 font-light`} filled={filled} />
        </div>
        {label && <span className="text-xs font-medium drop-shadow-md text-white/95 tracking-tight">{label}</span>}
    </div>
);
