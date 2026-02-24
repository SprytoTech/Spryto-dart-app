
import React, { useState, useRef, useEffect } from 'react';
import { Post } from '../types';
import { Icon } from './Icon';
import { ShareModal } from './ShareModal';
import { TaggedUsersModal } from './TaggedUsersModal';
import { CommentsModal } from './CommentsModal';
import { PostOptionsModal } from './PostOptionsModal';

interface PostCardProps {
  post: Post;
  onClick?: (post: Post) => void;
}

const formatCount = (count: number): string => {
  if (count >= 1000) {
    const kCount = (count / 1000).toFixed(1).replace('.', ',');
    return kCount.endsWith(',0') ? `${kCount.split(',')[0]} K` : `${kCount} K`;
  }
  return count.toString();
};

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

export const PostCard: React.FC<PostCardProps> = ({ post, onClick }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showTaggedModal, setShowTaggedModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(post.isFollowed ?? false);
  const [isMasked, setIsMasked] = useState(false);
  const [isFullyRemoved, setIsFullyRemoved] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const youtubeId = getYoutubeId(post.video);
  const googleDriveId = getGoogleDriveId(post.video);

  useEffect(() => {
    if (isMasked) {
      // Start a timer to fully remove the post from the DOM after some time
      // This allows the "Undo" notification to exist.
      timeoutRef.current = setTimeout(() => {
        setIsFullyRemoved(true);
      }, 5000); // 5 seconds to undo
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsFullyRemoved(false);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isMasked]);

  useEffect(() => {
    if (isMasked || isFullyRemoved) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsPlaying(entry.isIntersecting);
        });
      },
      { threshold: 0.65 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [youtubeId, googleDriveId, isMasked, isFullyRemoved]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying && !showShareModal && !showTaggedModal && !showCommentsModal && !showOptionsModal && !isMasked) {
      video.play().catch(() => setIsPlaying(false));
    } else {
      video.pause();
    }
  }, [isPlaying, showShareModal, showTaggedModal, showCommentsModal, showOptionsModal, isMasked]);

  const handleUndoMask = () => {
    setIsMasked(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleMediaClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onClick) {
          onClick(post);
      }
  };

  if (isFullyRemoved) return null;

  const taggedUsers = post.taggedUsers || [];
  const displayTagged = taggedUsers.slice(0, 3);
  const remainingTaggedCount = Math.max(0, taggedUsers.length - 3);
  const isExternalVideo = youtubeId || googleDriveId;
  const hasVideoSource = !!post.video && !isExternalVideo;
  
  // Calculate aspect ratio class
  const getAspectRatioClass = () => {
      if (post.aspectRatio) {
          switch (post.aspectRatio) {
              case '16:9': return 'aspect-video';
              case '9:16': return 'aspect-[9/16]'; // Very tall
              case '1:1': return 'aspect-square';
              case '4:5': return 'aspect-[4/5]';
              case 'free': return 'aspect-[4/5]'; // Default fall back for 'free' in feed
              default: return 'aspect-[4/5]';
          }
      }
      return isExternalVideo ? 'aspect-video' : 'aspect-[4/5]';
  };

  const containerAspectClass = getAspectRatioClass();

  return (
    <>
      {/* The Actual Post - Becomes hidden when masked */}
      <div className={`${isMasked ? 'h-0 overflow-hidden opacity-0 mb-0' : 'opacity-100 mb-8'} transition-all duration-500 ease-in-out`}>
        <article className="mx-2 glass-card rounded-3xl overflow-hidden shadow-glass relative group">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/20 to-transparent">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img alt={post.user.name} className="w-10 h-10 rounded-full object-cover border border-white/10" src={post.user.avatar} />
                {post.user.isOnline && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-charcoal"></div>}
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-sm text-white leading-tight">{post.user.name}</h3>
                <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap mt-0.5">
                  {post.stats.position} <span className="text-gray-600 mx-0.5">-</span> {post.user.team || 'No Club'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
               <button 
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`text-[10px] font-bold px-6 py-1 rounded-full transition-all duration-200 active:scale-95 ${isFollowing ? 'bg-white/5 text-gray-400 border border-white/10' : 'bg-white text-black'}`}
               >
                  {isFollowing ? 'Suivi' : 'Suivre'}
               </button>
               <button className="text-gray-400 hover:text-white transition p-1" onClick={() => setShowOptionsModal(true)}>
                  <Icon name="more_horiz" />
               </button>
            </div>
          </div>

          <div className="px-4 mb-3">
            <p className="text-sm font-medium leading-relaxed text-gray-100 mb-1">
              {post.content} {post.hashtags.map(tag => <span key={tag} className="text-blue-400 ml-1">{tag}</span>)}
            </p>
            <p className="text-[10px] text-gray-500 font-medium">{post.timestamp}</p>
          </div>

          <div 
            ref={containerRef} 
            className={`relative w-full ${containerAspectClass} bg-gray-900 overflow-hidden group/video cursor-pointer`}
            onClick={handleMediaClick}
          >
            {youtubeId ? (
                <div className="w-full h-full relative pointer-events-none">
                    <iframe className="w-full h-full object-cover pointer-events-none" src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${youtubeId}&playsinline=1&rel=0`} title="YouTube player" frameBorder="0" allow="autoplay; encrypted-media"></iframe>
                    <div className="absolute inset-0 z-10 bg-transparent"></div>
                </div>
            ) : googleDriveId ? (
                <div className="w-full h-full relative pointer-events-none">
                    <iframe className="w-full h-full object-cover" src={`https://drive.google.com/file/d/${googleDriveId}/preview`} title="Drive player" frameBorder="0" allow="autoplay; encrypted-media; fullscreen"></iframe>
                    <div className="absolute inset-0 z-10 bg-transparent"></div>
                </div>
            ) : hasVideoSource ? (
                <video ref={videoRef} className="w-full h-full object-cover" src={post.video} poster={post.image} loop playsInline muted={isMuted} onTimeUpdate={() => videoRef.current && setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100)} onWaiting={() => setIsBuffering(true)} onPlaying={() => setIsBuffering(false)} />
            ) : (
                <img src={post.image} className="w-full h-full object-cover" alt="" />
            )}
            
            <div className="absolute top-4 right-4 text-white/30 font-black italic text-xl pointer-events-none tracking-tighter z-20">veo</div>
            <div className="absolute top-4 left-4 z-20"><div className="bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div><span className="text-[10px] font-bold text-white uppercase">{post.user.team || 'LIVE CAM'}</span></div></div>

            {isBuffering && isPlaying && !isExternalVideo && hasVideoSource && <div className="absolute inset-0 flex items-center justify-center z-30"><div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div></div>}
            {!isExternalVideo && hasVideoSource && (
              <button onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} className="absolute bottom-24 right-4 z-20 w-7 h-7 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 text-white opacity-0 group-hover/video:opacity-100 transition-opacity">
                <Icon name={isMuted ? "volume_off" : "volume_up"} className="text-[14px]" />
              </button>
            )}
            
            <div className="absolute bottom-2 left-2 right-2 z-20 pointer-events-none">
               <div className="bg-black/20 backdrop-blur-md border border-white/5 rounded-xl p-1.5 flex items-center justify-between relative overflow-hidden">
                  <div className="flex flex-col items-center flex-1 gap-0 border-r border-white/5">
                      <span className="text-[8px] font-bold uppercase text-gray-300 opacity-80 flex items-center gap-1"><Icon name="radar" className="text-[10px]" filled />Poste</span>
                      <span className="font-bold text-sm text-white font-display">{post.stats.position}</span>
                  </div>
                  <div className="flex flex-col items-center flex-1 gap-0 border-r border-white/5">
                      <span className="text-[8px] font-bold uppercase text-gray-300 opacity-80 flex items-center gap-1"><Icon name="workspace_premium" className="text-[10px]" filled />Rank</span>
                      <span className="font-bold text-sm text-white font-display">{post.stats.category}</span>
                  </div>
                  <div className="flex flex-col items-center flex-1 gap-0">
                      <span className="text-[8px] font-bold uppercase text-gray-300 opacity-80 flex items-center gap-1"><Icon name="cake" className="text-[10px]" filled />Age</span>
                      <span className="font-bold text-sm text-white font-display">{post.stats.age}</span>
                  </div>
                  {!isExternalVideo && hasVideoSource && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5"><div className="h-full bg-white/40" style={{ width: `${progress}%` }} /></div>}
              </div>
            </div>
          </div>

          <div className="px-4 py-4 flex items-center justify-between bg-[#151518]">
            <div className="flex items-center gap-4">
              <button className="bg-white/5 border border-white/10 text-white px-5 py-2 rounded-full flex items-center gap-2 active:scale-95 transition-all">
                <Icon name="sports_soccer" className="text-[18px] text-gray-300" />
                <span className="font-medium text-sm text-gray-200">{formatCount(post.ratingCount)}</span>
              </button>
              <button className="text-gray-400 hover:text-white flex items-center gap-1.5" onClick={() => setShowCommentsModal(true)}>
                <Icon name="chat_bubble_outline" className="text-[26px]" />
                <span className="text-xs font-bold text-gray-300">{formatCount(post.commentCount)}</span>
              </button>
              {taggedUsers.length > 0 && (
                <div className="flex -space-x-3 items-center" onClick={() => setShowTaggedModal(true)}>
                  {displayTagged.map(user => <img key={user.id} alt={user.name} className="w-7 h-7 rounded-full border-2 border-[#151518]" src={user.avatar} />)}
                  {(remainingTaggedCount > 0 || taggedUsers.length > 0) && <div className="w-7 h-7 rounded-full border-2 border-[#151518] bg-gray-700 flex items-center justify-center"><Icon name="person" className="text-[12px] text-white" filled /></div>}
                </div>
              )}
            </div>
            <div className="flex items-center gap-5 text-gray-400">
              <button onClick={() => setShowShareModal(true)}><Icon name="send" className="text-[26px] -rotate-45" /></button>
              <button onClick={() => setIsSaved(!isSaved)} className={isSaved ? 'text-white' : ''}><Icon name="bookmark" className="text-[26px]" filled={isSaved} /></button>
            </div>
          </div>
        </article>
      </div>

      {/* Floating Confirmation Toast - Only visible when masked */}
      {isMasked && (
        <div className="fixed bottom-24 left-0 right-0 z-[100] px-4 pointer-events-none animate-in slide-in-from-bottom-4 duration-300 flex justify-center">
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

      {showShareModal && <ShareModal post={post} onClose={() => setShowShareModal(false)} />}
      {showTaggedModal && <TaggedUsersModal users={taggedUsers} onClose={() => setShowTaggedModal(false)} />}
      {showCommentsModal && <CommentsModal post={post} onClose={() => setShowCommentsModal(false)} />}
      {showOptionsModal && (
        <PostOptionsModal 
          post={post} 
          onClose={() => setShowOptionsModal(false)} 
          isSaved={isSaved}
          isFollowing={isFollowing}
          onSave={() => setIsSaved(!isSaved)}
          onUnfollow={() => setIsFollowing(!isFollowing)}
          onShare={() => setShowShareModal(true)}
          onNotInterested={() => setIsMasked(true)}
        />
      )}
    </>
  );
};
