
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Post, Opportunity } from '../types';
import { Icon } from './Icon';
import { posts } from '../data'; // Import posts for "Related" section
import { PostCard } from './PostCard'; // Import PostCard
import { TaggedUsersModal } from './TaggedUsersModal';
import { ShareModal } from './ShareModal';
import { CommentsModal } from './CommentsModal';
import { PostOptionsModal } from './PostOptionsModal';

interface HighlightDetailsPageProps {
  post: Post;
  onBack: () => void;
  currentUser: any;
  onPostClick: (post: Post) => void;
}

const getYoutubeId = (url: string | undefined) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const getGoogleDriveId = (url: string | undefined) => {
  if (!url) return null;
  const regExp = /\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

export const HighlightDetailsPage: React.FC<HighlightDetailsPageProps> = ({ post, onBack, currentUser, onPostClick }) => {
  // Initialize state based on the CURRENT post prop
  const [isSubscribed, setIsSubscribed] = useState(post.isFollowed || false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.ratingCount);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  
  // Infinite Scroll State
  const [upNextPosts, setUpNextPosts] = useState<Post[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // State for controls visibility
  const [showControls, setShowControls] = useState(false);

  // Modals
  const [showTaggedModal, setShowTaggedModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false); 
  
  // Logic for Not Interested / Undo
  const [lastHiddenPost, setLastHiddenPost] = useState<Post | null>(null);
  const undoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const observerRef = useRef<HTMLDivElement>(null); // For infinite scroll

  // CRITICAL: Reset local state when the `post` prop changes (e.g. auto-advance to next video)
  useEffect(() => {
      setIsSubscribed(post.isFollowed || false);
      setIsLiked(false); 
      setLikeCount(post.ratingCount);
      setIsSaved(false);
      setShowControls(false); 
      setIsDescriptionExpanded(false);
      setShowOptionsModal(false);
      
      // Reset Infinite Scroll List
      // Initial load: Filter out current, take others
      setUpNextPosts(posts.filter(p => p.id !== post.id));
      setIsLoadingMore(false);

      // We do NOT reset lastHiddenPost here, because we want the toast to persist across the transition
  }, [post.id]);

  // Infinite Scroll Logic
  const loadMoreHighlights = useCallback(() => {
      if (isLoadingMore) return;
      setIsLoadingMore(true);

      // Simulate network delay
      setTimeout(() => {
          const newBatch: Post[] = [];
          // Generate 3 random posts from existing data to simulate infinite feed
          for (let i = 0; i < 3; i++) {
              const randomPost = posts[Math.floor(Math.random() * posts.length)];
              // Create a unique ID to avoid key collisions
              newBatch.push({
                  ...randomPost,
                  id: `infinite-${post.id}-${Date.now()}-${i}`
              });
          }
          
          setUpNextPosts(prev => [...prev, ...newBatch]);
          setIsLoadingMore(false);
      }, 1000);
  }, [isLoadingMore, post.id]);

  // Observer for scrolling
  useEffect(() => {
      const observer = new IntersectionObserver(
          (entries) => {
              if (entries[0].isIntersecting) {
                  loadMoreHighlights();
              }
          },
          { threshold: 0.1, rootMargin: '200px' }
      );

      const target = observerRef.current;
      if (target) observer.observe(target);

      return () => {
          if (target) observer.unobserve(target);
      };
  }, [loadMoreHighlights, upNextPosts]); // Re-attach when list changes

  const taggedUsers = post.taggedUsers || [];
  const displayTagged = taggedUsers.slice(0, 3);

  const handleLike = () => {
    if (isLiked) {
        setLikeCount(prev => prev - 1);
    } else {
        setLikeCount(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  // Handle "Not Interested" Action
  const handleNotInterested = () => {
      // 1. Store the current post to allow Undo
      setLastHiddenPost(post);

      // 2. Find index of current post to determine the next one
      const currentIndex = posts.findIndex(p => p.id === post.id);
      
      // 3. Determine next post (Loop back to start if at end, or pick from related)
      // Using global posts array to maintain feed order
      const nextIndex = (currentIndex + 1) % posts.length;
      const nextPost = posts[nextIndex];

      // 4. Navigate to next post immediately
      onPostClick(nextPost);

      // 5. Set timer to clear the undo capability after 5 seconds
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
      undoTimeoutRef.current = setTimeout(() => {
          setLastHiddenPost(null);
      }, 5000);
  };

  // Handle "Undo" Action
  const handleUndoMask = () => {
      if (lastHiddenPost) {
          // Restore the previous video
          onPostClick(lastHiddenPost);
          // Clear the backup
          setLastHiddenPost(null);
          if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
      }
  };

  const youtubeId = getYoutubeId(post.video);
  const googleDriveId = getGoogleDriveId(post.video);

  const handleDownload = () => {
      const link = document.createElement('a');
      link.href = post.video || '';
      link.download = `spryto_highlight_${post.id}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  return (
    <div className="absolute inset-0 z-[60] bg-[#0F1115] text-white flex flex-col font-sans animate-in slide-in-from-right duration-300 overflow-hidden w-full h-full">
      
      {/* Sticky Video Player Area */}
      <div 
        className="w-full aspect-video bg-black sticky top-0 z-[70] shadow-2xl group/video relative cursor-pointer"
        onClick={() => setShowControls(!showControls)}
      >
         {/* Back Button (Top Left) */}
         <div className="absolute top-4 left-4 z-20">
            <button 
                onClick={(e) => { e.stopPropagation(); onBack(); }} 
                className="w-8 h-8 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 active:scale-90 transition-transform"
            >
                <Icon name="keyboard_arrow_down" className="text-2xl" />
            </button>
         </div>

         {/* Options Button (Top Right) */}
         <div className={`absolute top-4 right-4 z-20 transition-opacity duration-200 ${showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <button 
                onClick={(e) => { e.stopPropagation(); setShowOptionsModal(true); }} 
                className="w-8 h-8 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 active:scale-90 transition-transform"
            >
                <Icon name="more_horiz" className="text-2xl" />
            </button>
         </div>
         
         {youtubeId ? (
            <iframe 
                className="w-full h-full object-cover" 
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&controls=1&playsinline=1&rel=0`} 
                title="YouTube player" 
                frameBorder="0" 
                allow="autoplay; encrypted-media; fullscreen"
            ></iframe>
         ) : googleDriveId ? (
            <iframe 
                className="w-full h-full object-cover" 
                src={`https://drive.google.com/file/d/${googleDriveId}/preview`} 
                title="Drive player" 
                frameBorder="0" 
                allow="autoplay; encrypted-media; fullscreen"
            ></iframe>
         ) : post.video ? (
            <video 
                ref={videoRef}
                src={post.video} 
                className="w-full h-full object-contain" 
                controls 
                autoPlay 
                playsInline
            />
         ) : (
             <img src={post.image} className="w-full h-full object-contain" alt="" />
         )}
      </div>

      {/* Content Scroll Area */}
      <div className="flex-1 overflow-y-auto bg-[#0F1115]">
        <div className="p-4 pb-0">
            
            {/* Description */}
            <div className="mb-4" onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}>
                <p className={`text-sm font-medium leading-relaxed text-gray-100 mb-1 ${isDescriptionExpanded ? '' : 'line-clamp-2'}`}>
                    {post.content} {post.hashtags.map(tag => <span key={tag} className="text-blue-400 ml-1">{tag}</span>)}
                </p>
                <p className="text-[10px] text-gray-500 font-medium">{post.timestamp}</p>
            </div>

            {/* Channel / User Row */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <img src={post.user.avatar} alt={post.user.name} className="w-9 h-9 rounded-full object-cover border border-white/10" />
                    <div className="flex flex-col">
                        <span className="text-[15px] font-bold text-white leading-none mb-0.5">{post.user.name}</span>
                        <span className="text-[10px] text-gray-500 font-medium mt-0.5">
                            {post.stats.position} <span className="text-gray-600 mx-0.5">-</span> {post.user.team || 'No Club'}
                        </span>
                    </div>
                </div>
                <button 
                    onClick={() => setIsSubscribed(!isSubscribed)}
                    className={`text-[10px] font-bold px-6 py-1 rounded-full transition-all duration-200 active:scale-95 ${isSubscribed ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-white text-black'}`}
                >
                    {isSubscribed ? 'Suivi' : 'Suivre'}
                </button>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex items-center gap-4">
                    {/* Rate Button */}
                    <button 
                        onClick={handleLike}
                        className={`flex items-center gap-2 px-4 h-9 rounded-full border transition-all active:scale-95 shrink-0 ${isLiked ? 'bg-white text-black border-white' : 'bg-[#272727] text-white border border-white/5 hover:bg-white/5'}`}
                    >
                        <Icon name="sports_soccer" className="text-[18px]" filled={isLiked} />
                        <span className="text-[13px] font-bold">{likeCount}</span>
                    </button>

                    {/* Comment Button */}
                    <button 
                        className="text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors active:scale-95" 
                        onClick={() => setShowCommentsModal(true)}
                    >
                        <Icon name="chat_bubble_outline" className="text-[26px]" />
                        <span className="text-xs font-bold text-gray-300">{post.commentCount}</span>
                    </button>

                    {/* Tagged Users */}
                    {taggedUsers.length > 0 && (
                        <div className="flex -space-x-3 items-center pl-1" onClick={() => setShowTaggedModal(true)}>
                            {displayTagged.map(u => (
                                <img key={u.id} src={u.avatar} className="w-7 h-7 rounded-full border-2 border-[#0F1115] object-cover" alt={u.name} />
                            ))}
                            <div className="w-7 h-7 rounded-full border-2 border-[#0F1115] bg-gray-700 flex items-center justify-center">
                                <Icon name="person" className="text-[12px] text-white" filled />
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Icons */}
                <div className="flex items-center gap-5">
                    <button 
                        onClick={() => setShowShareModal(true)}
                        className="text-gray-400 hover:text-white transition-colors active:scale-90"
                    >
                        <Icon name="send" className="text-[22px] -rotate-45" />
                    </button>
                    <button onClick={handleDownload} className="text-gray-400 hover:text-white transition-colors active:scale-90">
                        <Icon name="download" className="text-[22px]" />
                    </button>
                    <button onClick={() => setIsSaved(!isSaved)} className={`transition-colors active:scale-90 ${isSaved ? 'text-white' : 'text-gray-400 hover:text-white'}`}>
                        <Icon name={isSaved ? "bookmark" : "bookmark_border"} className="text-[22px]" filled={isSaved} />
                    </button>
                </div>
            </div>

            {/* Stats Box */}
            <div className="mb-6 px-1">
                <div className="bg-[#1C1F26] border border-white/5 rounded-xl p-2 flex items-center justify-between shadow-sm">
                    <div className="flex flex-col items-center flex-1 gap-0.5 border-r border-white/5">
                        <span className="text-[9px] font-bold uppercase text-gray-400 opacity-80 flex items-center gap-1">
                            <Icon name="radar" className="text-[11px]" filled />Poste
                        </span>
                        <span className="font-bold text-sm text-white font-display">{post.stats.position}</span>
                    </div>
                    <div className="flex flex-col items-center flex-1 gap-0.5 border-r border-white/5">
                        <span className="text-[9px] font-bold uppercase text-gray-400 opacity-80 flex items-center gap-1">
                            <Icon name="workspace_premium" className="text-[11px]" filled />Rank
                        </span>
                        <span className="font-bold text-sm text-white font-display">{post.stats.category}</span>
                    </div>
                    <div className="flex flex-col items-center flex-1 gap-0.5">
                        <span className="text-[9px] font-bold uppercase text-gray-400 opacity-80 flex items-center gap-1">
                            <Icon name="cake" className="text-[11px]" filled />Age
                        </span>
                        <span className="font-bold text-sm text-white font-display">{post.stats.age}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Separator */}
        <div className="h-1 bg-[#1C1F26] w-full mb-6"></div>

        {/* Up Next / Related Videos - Infinite Scroll */}
        <div className="pb-20">
            {/* Label for section */}
            <div className="px-4 mb-2">
                <h3 className="text-[15px] font-bold text-white">À suivre</h3>
            </div>

            {upNextPosts.map(related => (
                <PostCard 
                    key={related.id} 
                    post={related} 
                    onClick={onPostClick}
                />
            ))}

            {/* Infinite Scroll Loader */}
            <div ref={observerRef} className="h-20 w-full flex items-center justify-center py-4">
                {isLoadingMore && (
                    <div className="flex gap-2 items-center">
                        <div className="w-2 h-2 bg-neon-pink rounded-full animate-[bounce_1s_infinite_0ms]"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-[bounce_1s_infinite_200ms]"></div>
                        <div className="w-2 h-2 bg-neon-violet rounded-full animate-[bounce_1s_infinite_400ms]"></div>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Undo Toast Notification - Appears when a post is hidden */}
      {lastHiddenPost && (
        <div className="fixed bottom-10 left-0 right-0 z-[100] px-4 pointer-events-none flex justify-center animate-in slide-in-from-bottom-4 duration-300">
          <div className="pointer-events-auto bg-[#1C1C1E] border border-white/10 rounded-[20px] p-4 flex items-center justify-between shadow-2xl w-full max-w-[380px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                <Icon name="visibility_off" className="text-gray-300 text-xl" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-white font-bold text-sm leading-tight">Publication masquée</span>
                <span className="text-gray-400 text-[11px] leading-tight mt-0.5 line-clamp-2">
                  Nous vous suggérerons moins de publications comme celle-ci.
                </span>
              </div>
            </div>
            <button 
              onClick={handleUndoMask}
              className="text-white font-bold text-sm px-3 py-2 hover:bg-white/5 rounded-xl transition-colors shrink-0 ml-2"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {showTaggedModal && <TaggedUsersModal users={taggedUsers} onClose={() => setShowTaggedModal(false)} />}
      {showShareModal && <ShareModal post={post} onClose={() => setShowShareModal(false)} />}
      {showCommentsModal && <CommentsModal post={post} onClose={() => setShowCommentsModal(false)} />}
      
      {showOptionsModal && (
        <PostOptionsModal 
          post={post} 
          onClose={() => setShowOptionsModal(false)} 
          isSaved={isSaved}
          isFollowing={isSubscribed}
          isCompact={true} 
          onSave={() => setIsSaved(!isSaved)}
          onUnfollow={() => setIsSubscribed(!isSubscribed)}
          onShare={() => {
              setShowOptionsModal(false);
              setTimeout(() => setShowShareModal(true), 300);
          }}
          onNotInterested={handleNotInterested}
        />
      )}
    </div>
  );
};
