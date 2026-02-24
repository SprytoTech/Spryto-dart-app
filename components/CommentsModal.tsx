
import React, { useEffect, useState, useRef } from 'react';
import { Post } from '../types';
import { Icon } from './Icon';
import { ShareModal } from './ShareModal';

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
    headline?: string;
    team?: string;
    position?: string;
  };
  text: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
}

interface MentionUser {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    isVerified?: boolean;
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    user: { name: 'princemusombo', avatar: 'https://i.pravatar.cc/150?u=prince', headline: '', position: 'MOC', team: 'FC Lyon' },
    text: 'Bien joué Lenny 👏🏽',
    timestamp: '6 j',
    likes: 12,
    isLiked: false,
    replies: []
  },
  {
    id: 'c2',
    user: { name: 'issam_gaucho', avatar: 'https://i.pravatar.cc/150?u=issam', headline: '', position: 'BU', team: 'Paris FC' },
    text: 'PROGRAMME EN DM @Kevin Duboi',
    timestamp: '1 s',
    likes: 2,
    isLiked: false,
    replies: [
        {
            id: 'c2_r1',
            user: { name: 'Kevin Duboi', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwkQ9fs2m7qgWavEZRcUtFdpDeOG5HugSdI7B8imocyXKEmlsGepg6u3RsOueo_qtpMdL-A3r-Vjy44sb_yg32bt2hrX2twzhcKePgQnij6mcB0sIgyouInveNCPw_iKH4tHvhuIhnwwXa165ZwfLEo-04bp0Z7AtfWraA4HPSXaRf_AfbwP1CLoQd4gtN1o7GLqXSRYtNIHEE5TnUWT2i5vmTdnZm7TEueouf9Iz17LMbRX7-2ngluLnslCwLVZRd-c-Cd3WnayMN', headline: '', position: 'MC', team: 'FC Laval' },
            text: 'Check tes DMs 😉 @issam_gaucho #workhard',
            timestamp: '1 s',
            likes: 2,
            isLiked: true
        }
    ]
  },
  {
    id: 'c3',
    user: { name: 'pierre.lrd', avatar: 'https://i.pravatar.cc/150?u=pierre', headline: '', position: 'DC', team: 'Bordeaux' },
    text: 'Programme en Dm #football',
    timestamp: '6 j',
    likes: 45,
    isLiked: false,
    replies: [
         {
            id: 'c3_r1',
            user: { name: 'Kevin Duboi', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwkQ9fs2m7qgWavEZRcUtFdpDeOG5HugSdI7B8imocyXKEmlsGepg6u3RsOueo_qtpMdL-A3r-Vjy44sb_yg32bt2hrX2twzhcKePgQnij6mcB0sIgyouInveNCPw_iKH4tHvhuIhnwwXa165ZwfLEo-04bp0Z7AtfWraA4HPSXaRf_AfbwP1CLoQd4gtN1o7GLqXSRYtNIHEE5TnUWT2i5vmTdnZm7TEueouf9Iz17LMbRX7-2ngluLnslCwLVZRd-c-Cd3WnayMN', headline: '', position: 'MC', team: 'FC Laval' },
            text: 'C\'est fait !',
            timestamp: '6 j',
            likes: 1,
            isLiked: true
        }
    ]
  },
  {
    id: 'c4',
    user: { name: 'ansu311358', avatar: 'https://i.pravatar.cc/150?u=ansu', headline: '', position: 'AG', team: 'Barça' },
    text: 'Programme en DM',
    timestamp: '5 j',
    likes: 0,
    isLiked: false,
    replies: []
  }
];

const MENTION_SUGGESTIONS: MentionUser[] = [
    { id: 'm1', name: 'Culture Général FOOT', handle: 'adnxsaanz, ash_1224...', avatar: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150&auto=format&fit=crop&q=60' },
    { id: 'm2', name: 'noujoum.invia', handle: 'Vers un avenir brillant', avatar: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=150&auto=format&fit=crop&q=60' },
    { id: 'm3', name: 'cliniquelauture', handle: 'Clinique Lauture | Sports', avatar: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=150&auto=format&fit=crop&q=60', isVerified: true },
    { id: 'm4', name: 'teqball.quebec', handle: 'Teqball Québec', avatar: 'https://images.unsplash.com/photo-1546519638-68e109498ee3?w=150&auto=format&fit=crop&q=60' },
    { id: 'm5', name: '_footbloger', handle: 'Footbloger', avatar: 'https://images.unsplash.com/photo-1434394354979-a235cd3675c7?w=150&auto=format&fit=crop&q=60' },
    { id: 'm6', name: 'tiekscup', handle: 'TieksCup Official', avatar: 'https://images.unsplash.com/photo-1533461502717-83546f485d24?w=150&auto=format&fit=crop&q=60' },
    { id: 'm7', name: 'passion_soccer', handle: 'Boutique Passion Soccer', avatar: 'https://images.unsplash.com/photo-1522778119026-d647f0565c6a?w=150&auto=format&fit=crop&q=60' },
];

const QUICK_REACTIONS = ['❤️', '🙌', '🔥', '👏', '😢', '😍', '😮', '😂'];

interface CommentsModalProps {
  post: Post;
  onClose: () => void;
  variant?: 'modal' | 'embedded';
  headerContent?: React.ReactNode;
}

type FilterType = 'top' | 'newest';

const renderFormattedText = (text: string) => {
  const parts = text.split(/(@[\w\s.-]+|#\w+)/g);
  return parts.map((part, i) => {
    const isMention = part.startsWith('@');
    const isHashtag = part.startsWith('#');
    if (isMention || isHashtag) {
      return (
        <span key={i} className="text-blue-400 font-medium cursor-pointer hover:underline">
          {part}
        </span>
      );
    }
    return part;
  });
};

export const CommentsModal: React.FC<CommentsModalProps> = ({ post, onClose, variant = 'modal', headerContent }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string; name: string; rootId: string } | null>(null);
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());
  const [showShareModal, setShowShareModal] = useState(false);
  
  const [filterType, setFilterType] = useState<FilterType>('top');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');

  const [activeOptionComment, setActiveOptionComment] = useState<Comment | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (variant === 'embedded') {
        setIsVisible(true);
    } else {
        setIsVisible(true);
        document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [variant]);

  const handleClose = () => {
    if (variant === 'embedded') {
        onClose();
    } else {
        setIsVisible(false);
        setTimeout(onClose, 300);
    }
  };

  const toggleThreadExpansion = (commentId: string) => {
    setExpandedThreads(prev => {
        const next = new Set(prev);
        if (next.has(commentId)) next.delete(commentId);
        else next.add(commentId);
        return next;
    });
  };

  const getSortedComments = () => {
      const sorted = [...comments];
      if (filterType === 'top') {
          return sorted.sort((a, b) => b.likes - a.likes);
      } else {
          return sorted.sort((a, b) => {
             const timeA = parseInt(a.id.replace(/\D/g, '')) || 0;
             const timeB = parseInt(b.id.replace(/\D/g, '')) || 0;
             return timeB - timeA; 
          });
      }
  };

  const displayedComments = getSortedComments();

  const handleSend = () => {
    if (!newComment.trim()) return;
    const commentObj: Comment = {
      id: Date.now().toString(),
      user: { name: 'You', avatar: 'https://i.pravatar.cc/150?u=me', headline: '', position: 'MC', team: 'FC Laval' },
      text: newComment,
      timestamp: '1 s',
      likes: 0,
      replies: []
    };
    if (replyingTo) {
        setComments(prev => prev.map(c => {
            if (c.id === replyingTo.rootId) {
                if (!expandedThreads.has(c.id)) toggleThreadExpansion(c.id);
                return { ...c, replies: [...(c.replies || []), commentObj] };
            }
            return c;
        }));
    } else {
        setComments([commentObj, ...comments]);
    }
    setNewComment('');
    setReplyingTo(null);
    setShowMentions(false);
  };

  const handleDelete = (commentId: string, rootId?: string) => {
      if (rootId) {
          setComments(prev => prev.map(c => {
              if (c.id === rootId) {
                  return { ...c, replies: c.replies?.filter(r => r.id !== commentId) };
              }
              return c;
          }));
      } else {
          setComments(prev => prev.filter(c => c.id !== commentId));
      }
      setActiveOptionComment(null);
  };

  const handleReplyClick = (e: React.MouseEvent, comment: Comment, rootId: string) => {
    e.stopPropagation(); // Prevent trigger on parent's long press if any
    setReplyingTo({ id: comment.id, name: comment.user.name, rootId: rootId });
    setNewComment(`@${comment.user.name} `);
    inputRef.current?.focus();
    setShowMentions(false);
  };

  const cancelReply = () => { setReplyingTo(null); setNewComment(''); };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setNewComment(val);
      const lastAtPos = val.lastIndexOf('@');
      if (lastAtPos !== -1) {
          const textAfterAt = val.slice(lastAtPos + 1);
          if (!textAfterAt.includes(' ')) {
              setShowMentions(true);
              setMentionQuery(textAfterAt);
              return;
          }
      }
      setShowMentions(false);
  };

  const handleAtButtonClick = () => {
      setNewComment(prev => prev + '@');
      setShowMentions(true);
      setMentionQuery('');
      inputRef.current?.focus();
  };

  const handleMentionSelect = (user: MentionUser) => {
      const lastAtPos = newComment.lastIndexOf('@');
      if (lastAtPos !== -1) {
          const prefix = newComment.substring(0, lastAtPos);
          setNewComment(`${prefix}@${user.name} `);
      } else {
          setNewComment(`${newComment}@${user.name} `);
      }
      setShowMentions(false);
      inputRef.current?.focus();
  };

  const filteredSuggestions = MENTION_SUGGESTIONS.filter(u => 
      u.name.toLowerCase().includes(mentionQuery.toLowerCase()) || 
      u.handle.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  const toggleLike = (e: React.MouseEvent, commentId: string, rootId?: string) => {
      e.stopPropagation(); // Avoid long press conflict
      const updateLike = (c: Comment) => {
          if (c.id === commentId) {
              return { ...c, likes: c.isLiked ? c.likes - 1 : c.likes + 1, isLiked: !c.isLiked };
          }
          return c;
      };
      if (rootId) {
          setComments(prev => prev.map(c => {
              if (c.id === rootId) return { ...c, replies: c.replies?.map(updateLike) };
              return c;
          }));
      } else {
          setComments(prev => prev.map(updateLike));
      }
  };

  const isPostAuthor = (userName: string) => userName === post.user.name;

  // --- COMPONENT: Individual Comment Item with Robust Long Press ---
  const CommentItem: React.FC<{ comment: Comment, isReply?: boolean, rootId?: string }> = ({ comment, isReply = false, rootId }) => {
      const currentRootId = rootId || comment.id;
      const isAuthor = isPostAuthor(comment.user.name);
      const isMe = comment.user.name === 'You';
      
      const [isPressing, setIsPressing] = useState(false);
      const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

      const startLongPress = (e: React.TouchEvent | React.MouseEvent) => {
        // Prevent trigger if clicking on buttons
        const target = e.target as HTMLElement;
        if (target.closest('button')) return;

        setIsPressing(true);
        longPressTimer.current = setTimeout(() => {
            setActiveOptionComment(comment);
            setIsPressing(false);
        }, 650); // Natural feeling long press delay
      };

      const cancelLongPress = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
        setIsPressing(false);
      };

      return (
        <div 
            className={`flex gap-3 ${isReply ? 'mt-4' : 'mt-6'} w-full relative transition-all duration-200 select-none ${isPressing ? 'scale-[0.98] opacity-70 bg-white/5' : ''} rounded-xl px-1 -mx-1`}
            onTouchStart={startLongPress}
            onTouchEnd={cancelLongPress}
            onTouchMove={cancelLongPress}
            onMouseDown={startLongPress}
            onMouseUp={cancelLongPress}
            onMouseLeave={cancelLongPress}
            onContextMenu={(e) => e.preventDefault()} // Disable native context menu
        >
            <div className="shrink-0">
                <img 
                    src={comment.user.avatar} 
                    alt={comment.user.name} 
                    className={`${isReply ? 'w-8 h-8' : 'w-10 h-10'} rounded-full object-cover border border-white/5`} 
                />
            </div>

            <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-baseline flex-wrap gap-x-2">
                    <span className="text-xs font-semibold text-white truncate">{comment.user.name}</span>
                    {isAuthor && <Icon name="verified" className="text-[10px] text-blue-500" filled />}
                    <span className="text-[10px] text-gray-500 font-normal">{comment.timestamp}</span>
                </div>

                {(comment.user.position || comment.user.team) && (
                    <div className="text-[10px] text-gray-400 font-medium -mt-0.5 mb-0.5">
                        {comment.user.position && <span>{comment.user.position}</span>}
                        {(comment.user.position && comment.user.team) && <span> - </span>}
                        {comment.user.team && <span>{comment.user.team}</span>}
                    </div>
                )}

                <p className="text-sm text-gray-200 leading-snug mt-0.5 whitespace-pre-wrap break-words font-normal">
                    {renderFormattedText(comment.text)}
                </p>

                <div className="flex items-center gap-4 mt-2">
                    <button 
                        onClick={(e) => handleReplyClick(e, comment, currentRootId)}
                        className="text-xs font-semibold text-gray-500 hover:text-gray-300 transition-colors active:scale-90"
                    >
                        Répondre
                    </button>
                    {isMe && (
                         <button 
                            onClick={() => handleDelete(comment.id, isReply ? currentRootId : undefined)}
                            className="text-xs font-semibold text-gray-500 hover:text-red-500 transition-colors"
                        >
                            Supprimer
                        </button>
                    )}
                </div>
            </div>

            <div className="shrink-0 flex flex-col items-center gap-1 pt-1 pl-1">
                 <button 
                    onClick={(e) => toggleLike(e, comment.id, isReply ? currentRootId : undefined)}
                    className="flex flex-col items-center justify-center gap-0.5 group active:scale-125 transition-transform"
                 >
                    <Icon 
                        name="favorite" 
                        className={`text-sm ${comment.isLiked ? 'text-red-500' : 'text-gray-500'}`} 
                        filled={comment.isLiked}
                    />
                    <span className="text-[10px] text-gray-500 font-medium">{comment.likes > 0 ? comment.likes : ''}</span>
                 </button>
            </div>
        </div>
      );
  };

  const isEmbedded = variant === 'embedded';
  const containerClasses = isEmbedded 
    ? "w-full h-full bg-[#151518] flex flex-col"
    : `relative w-full max-w-md bg-[#151518] rounded-t-[20px] overflow-hidden shadow-2xl transition-transform duration-300 ease-out flex flex-col h-[75vh] ${isVisible ? 'translate-y-0' : 'translate-y-full'}`;

  const wrapperClasses = isEmbedded ? "contents" : "fixed inset-0 z-[60] flex items-end justify-center isolate";

  return (
    <div className={wrapperClasses}>
      {!isEmbedded && <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}></div>}

      <div className={containerClasses}>
        <div className={`flex flex-col items-center shrink-0 border-b border-white/5 bg-[#151518] z-20 ${isEmbedded ? 'pt-0 pb-3' : 'pt-2 pb-3'}`}>
          {!isEmbedded && <div className="w-10 h-1 bg-white/20 rounded-full mb-3 cursor-pointer" onClick={handleClose}></div>}
          <div className={`relative w-full flex items-center justify-center px-4 ${isEmbedded ? 'pt-2' : ''}`}>
              <h3 className="text-sm font-bold text-white">Commentaires</h3>
              <div className="absolute right-4 flex items-center gap-3">
                  <div className="relative">
                      <button className={`text-gray-400 hover:text-white transition-colors ${showFilterMenu ? 'text-white' : ''}`} onClick={() => setShowFilterMenu(!showFilterMenu)}><Icon name="tune" className="text-[20px]" /></button>
                      {showFilterMenu && (
                          <>
                              <div className="fixed inset-0 z-40" onClick={() => setShowFilterMenu(false)}></div>
                              <div className="absolute right-0 top-8 z-50 w-48 bg-[#1C1C1E] rounded-xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                  <div className="py-1">
                                      <button onClick={() => { setFilterType('top'); setShowFilterMenu(false); }} className="w-full text-left px-4 py-3 text-sm font-medium text-white hover:bg-white/5 flex items-center justify-between group"><span>Principaux</span>{filterType === 'top' && <Icon name="check" className="text-base text-neon-pink" />}</button>
                                      <button onClick={() => { setFilterType('newest'); setShowFilterMenu(false); }} className="w-full text-left px-4 py-3 text-sm font-medium text-white hover:bg-white/5 flex items-center justify-between group border-t border-white/5"><span>Récents</span>{filterType === 'newest' && <Icon name="check" className="text-base text-neon-pink" />}</button>
                                  </div>
                              </div>
                          </>
                      )}
                  </div>
                  <button className="text-gray-400 hover:text-white transition-colors" onClick={() => setShowShareModal(true)}><Icon name="ios_share" className="text-[20px]" /></button>
              </div>
          </div>
        </div>
        
        <div className="flex-1 relative min-h-0 bg-[#151518]">
            <div className="absolute inset-0 overflow-y-auto px-4 pb-4 scroll-smooth hide-scrollbar">
                {headerContent && <div className="mb-4">{headerContent}</div>}
                {displayedComments.map(comment => {
                    const replies = comment.replies || [];
                    const isExpanded = expandedThreads.has(comment.id);
                    return (
                        <div key={comment.id} className="flex flex-col">
                            <CommentItem comment={comment} />
                            {replies.length > 0 && (
                                <div className="pl-12">
                                    {(isExpanded ? replies : replies.filter(r => isPostAuthor(r.user.name))).map(reply => (
                                        <CommentItem key={reply.id} comment={reply} isReply rootId={comment.id} />
                                    ))}
                                    <div className="flex items-center gap-3 mt-4 group cursor-pointer" onClick={() => toggleThreadExpansion(comment.id)}>
                                        <div className="w-8 h-[1px] bg-gray-600 group-hover:bg-gray-400 transition-colors"></div>
                                        <span className="text-xs font-semibold text-gray-500 group-hover:text-gray-300 transition-colors">
                                            {isExpanded ? 'Masquer les réponses' : `Voir ${replies.length} réponses`}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
                <div className="h-6"></div>
            </div>

            {showMentions && (
                <div className="absolute inset-0 z-40 bg-[#151518] overflow-y-auto animate-in fade-in duration-200">
                    <div className="sticky top-0 bg-[#151518]/95 backdrop-blur z-20 px-4 py-2 border-b border-white/5"><span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Suggestions</span></div>
                    {filteredSuggestions.length > 0 ? filteredSuggestions.map(user => (
                        <div key={user.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors" onClick={() => handleMentionSelect(user)}>
                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-white/5" />
                            <div className="flex flex-col min-w-0"><div className="flex items-center gap-1"><span className="text-sm font-semibold text-white truncate">{user.name}</span>{user.isVerified && <Icon name="verified" className="text-[12px] text-blue-500" filled />}</div><span className="text-xs text-gray-500 truncate">{user.handle}</span></div>
                        </div>
                    )) : <div className="p-8 text-center flex flex-col items-center text-gray-500"><Icon name="person_off" className="text-2xl mb-2 opacity-50" /><span className="text-xs">Aucun utilisateur trouvé</span></div>}
                </div>
            )}
        </div>

        <div className="shrink-0 bg-[#151518] z-30 pb-4 relative shadow-[0_-5px_20px_rgba(0,0,0,0.2)]">
            <div className="flex items-center gap-4 px-4 py-3 overflow-x-auto hide-scrollbar border-t border-white/5">
                {QUICK_REACTIONS.map((emoji, idx) => (<button key={idx} onClick={() => setNewComment(prev => prev + emoji)} className="text-2xl hover:scale-125 active:scale-95 transition-transform">{emoji}</button>))}
            </div>
            {replyingTo && !showMentions && (
                <div className="flex items-center justify-between px-4 py-2 bg-[#1C1F26] border-t border-white/5 text-xs text-gray-400 animate-in slide-in-from-bottom-2">
                    <span>Réponse à <span className="text-white font-semibold">{replyingTo.name}</span></span>
                    <button onClick={cancelReply} className="text-gray-400 hover:text-white p-1"><Icon name="close" className="text-sm" /></button>
                </div>
            )}
            <div className="flex items-end gap-3 px-4 pt-2">
                <img src="https://i.pravatar.cc/150?u=me" alt="Me" className="w-9 h-9 rounded-full object-cover border border-white/10" />
                <div className="flex-1 relative">
                    <div className="bg-[#262626] rounded-[24px] flex items-center px-4 py-2 border border-white/5 focus-within:border-white/20 transition-colors min-h-[44px]">
                        <input ref={inputRef} type="text" value={newComment} onChange={handleInputChange} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder={replyingTo ? "" : "Rejoignez la conversation..."} className="bg-transparent text-white text-sm w-full focus:outline-none placeholder-gray-500 py-1" />
                        {newComment.trim().length > 0 ? (
                            <button onClick={handleSend} className="w-8 h-8 bg-[#3B82F6] rounded-full flex items-center justify-center shrink-0 hover:bg-blue-500 transition-colors ml-2 animate-in zoom-in"><Icon name="arrow_upward" className="text-white text-lg font-bold" /></button>
                        ) : (
                            <button onClick={handleAtButtonClick} className="w-8 h-8 flex items-center justify-center shrink-0 text-gray-400 hover:text-white transition-colors ml-1"><Icon name="alternate_email" className="text-xl" /></button>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {activeOptionComment && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-200" onClick={() => setActiveOptionComment(null)}></div>
              <div className="relative w-full max-w-[260px] z-10 animate-in zoom-in-95 duration-200">
                  <div className="overflow-hidden rounded-2xl bg-[#1C1C1E] border border-white/5 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
                      <div className="p-3 border-b border-white/5 bg-white/[0.03]">
                          <div className="flex items-center gap-3 opacity-80">
                              <img src={activeOptionComment.user.avatar} alt="" className="w-8 h-8 rounded-full border border-white/10 shrink-0" />
                              <div className="flex flex-col min-w-0"><span className="text-xs font-bold text-white/90 truncate">{activeOptionComment.user.name}</span><p className="text-[10px] text-gray-400 truncate max-w-[150px]">{activeOptionComment.text}</p></div>
                          </div>
                      </div>
                      <div className="flex flex-col">
                          {activeOptionComment.user.name !== 'You' ? (
                              <>
                                  <button className="w-full py-3.5 px-4 text-white/90 text-sm font-medium flex justify-between items-center hover:bg-white/5 active:bg-white/10 transition-colors border-b border-white/5 group">Signaler<Icon name="report" className="text-lg text-red-500 group-active:scale-90 transition-transform" /></button>
                                  <button className="w-full py-3.5 px-4 text-white/90 text-sm font-medium flex justify-between items-center hover:bg-white/5 active:bg-white/10 transition-colors group">Bloquer<Icon name="block" className="text-lg text-red-500 group-active:scale-90 transition-transform" /></button>
                              </>
                          ) : (
                               <button onClick={() => handleDelete(activeOptionComment.id)} className="w-full py-3.5 px-4 text-white/90 text-sm font-medium flex justify-between items-center hover:bg-white/5 active:bg-white/10 transition-colors group">Supprimer<Icon name="delete" className="text-lg text-red-500 group-active:scale-90 transition-transform" /></button>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      )}

      {showShareModal && <ShareModal post={post} onClose={() => setShowShareModal(false)} />}
    </div>
  );
};
