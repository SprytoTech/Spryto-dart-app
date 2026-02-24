
import React, { useEffect, useState } from 'react';
import { Icon } from './Icon';
import { Post, Opportunity } from '../types';

interface ShareModalProps {
  post?: Post;
  opportunity?: Opportunity;
  team?: { league: string; week: string };
  onClose: () => void;
}

// Dummy data for friends to share with
const friends = [
  { id: 1, name: 'Alex', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
  { id: 2, name: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { id: 3, name: 'Jordan', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026302d' },
  { id: 4, name: 'Mika', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
  { id: 5, name: 'Elise', avatar: 'https://i.pravatar.cc/150?u=a04258a2462d826712d' },
  { id: 6, name: 'Tom', avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d' },
];

export const ShareModal: React.FC<ShareModalProps> = ({ post, opportunity, team, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    setIsVisible(true);
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation
  };

  const toggleFriend = (id: number) => {
    setSelectedFriends(prev => 
      prev.includes(id) 
        ? prev.filter(fid => fid !== id) 
        : [...prev, id]
    );
  };

  const handleSend = () => {
    setIsSent(true);
    // Wait for animation then close
    setTimeout(() => {
      handleClose();
    }, 1500);
  };

  // Filter friends based on search query
  const filteredFriends = friends.filter(friend => 
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center isolate">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      ></div>

      {/* Modal Content */}
      <div 
        className={`relative w-full max-w-md bg-[#151518] rounded-t-[32px] overflow-hidden shadow-2xl transition-transform duration-300 ease-out border-t border-white/10 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {!isSent ? (
          <>
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1" onClick={handleClose}>
              <div className="w-10 h-1 bg-white/20 rounded-full"></div>
            </div>

            {/* Search Bar */}
            <div className="px-5 pt-4 pb-2">
                <div className="bg-[#242529] flex items-center gap-2 px-3 py-2.5 rounded-xl border border-white/5">
                    <Icon name="search" className="text-gray-400 text-xl" />
                    <input 
                        type="text" 
                        placeholder="Rechercher" 
                        className="bg-transparent text-white text-sm placeholder-gray-500 w-full focus:outline-none"
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Icon name="person_add" className="text-gray-400 text-xl" />
                </div>
            </div>

            {/* Friends Grid */}
            <div className="px-5 py-4 grid grid-cols-4 gap-y-4 gap-x-2 border-b border-white/5 pb-6 min-h-[100px]">
                {filteredFriends.length > 0 ? (
                    filteredFriends.map(friend => {
                        const isSelected = selectedFriends.includes(friend.id);
                        return (
                            <div 
                                key={friend.id} 
                                className="flex flex-col items-center gap-1 group cursor-pointer"
                                onClick={() => toggleFriend(friend.id)}
                            >
                                <div className="w-14 h-14 rounded-full relative">
                                    <img 
                                        src={friend.avatar} 
                                        alt={friend.name}
                                        className={`w-full h-full rounded-full object-cover transition-all duration-200 ${isSelected ? 'border-2 border-neon-pink p-[1px]' : 'border border-white/10 group-hover:scale-105'}`} 
                                    />
                                    <div className="absolute bottom-0 right-0 bg-[#151518] rounded-full p-0.5 transition-transform duration-200">
                                        {isSelected ? (
                                            <div className="w-4 h-4 bg-neon-pink rounded-full flex items-center justify-center animate-in zoom-in duration-200">
                                                <Icon name="check" className="text-[10px] text-white font-bold" />
                                            </div>
                                        ) : (
                                            <div className="w-3.5 h-3.5 bg-transparent border-2 border-gray-500 rounded-full"></div>
                                        )}
                                    </div>
                                </div>
                                <span className={`text-[11px] font-medium transition-colors ${isSelected ? 'text-white' : 'text-gray-300'}`}>{friend.name}</span>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-4 flex items-center justify-center text-gray-500 text-xs py-4 italic">
                        Aucun ami trouvé
                    </div>
                )}
            </div>

            {/* Action Area */}
            <div className="min-h-[100px] flex flex-col justify-center">
                {selectedFriends.length > 0 ? (
                    <div className="px-5 py-5 pb-8 animate-in slide-in-from-bottom-4 duration-300">
                        <button 
                            onClick={handleSend}
                            className="w-full bg-neon-pink text-white font-bold py-3.5 rounded-2xl shadow-[0_0_20px_rgba(244,63,94,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-neon-pink/90"
                        >
                            <span className="text-base">Envoyer ({selectedFriends.length})</span>
                            <Icon name="send" className="text-lg -rotate-45 mb-1" />
                        </button>
                    </div>
                ) : (
                    <div className="px-5 py-5 pb-8 flex justify-between gap-2 overflow-x-auto hide-scrollbar animate-in fade-in duration-300">
                        <ActionItem icon="content_copy" label="Copier lien" color="bg-gray-700" />
                        <ActionItem icon="sms" label="SMS" color="bg-green-600" />
                        <ActionItem icon="share" label="Partager..." color="bg-blue-600" />
                        <ActionItem icon="send" label="Messenger" color="bg-gradient-to-r from-blue-500 to-purple-500" />
                        <ActionItem icon="alternate_email" label="Email" color="bg-gray-700" />
                    </div>
                )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 animate-in fade-in duration-300">
             <div className="w-20 h-20 bg-neon-pink/10 rounded-full flex items-center justify-center mb-4 border border-neon-pink/20 shadow-[0_0_30px_rgba(244,63,94,0.2)]">
                  <Icon name="send" className="text-4xl text-neon-pink -rotate-45 ml-1" />
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">Envoyé !</h3>
             <p className="text-gray-400 font-medium">
                Partagé avec <span className="text-white font-bold">{selectedFriends.length}</span> ami{selectedFriends.length > 1 ? 's' : ''}
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

const ActionItem: React.FC<{ icon: string; label: string; color: string }> = ({ icon, label, color }) => (
    <div className="flex flex-col items-center gap-2 min-w-[70px] cursor-pointer group">
        <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border border-white/5`}>
            <Icon name={icon} className="text-white text-xl" />
        </div>
        <span className="text-[10px] text-gray-400 font-medium">{label}</span>
    </div>
);
