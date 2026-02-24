import React, { useEffect, useState } from 'react';
import { User } from '../types';

interface TaggedUsersModalProps {
  users: User[];
  onClose: () => void;
}

export const TaggedUsersModal: React.FC<TaggedUsersModalProps> = ({ users, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

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
        style={{ maxHeight: '80vh' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-4" onClick={handleClose}>
          <div className="w-10 h-1 bg-white/20 rounded-full"></div>
        </div>
        
        {/* Header */}
        <div className="px-6 pb-4 border-b border-white/5">
            <h3 className="text-lg font-bold text-white text-center">Joueurs identifiés</h3>
        </div>

        {/* Users List */}
        <div className="overflow-y-auto max-h-[60vh] p-4 pb-8">
            {users.map(user => (
                <div key={user.id} className="flex items-center justify-between py-3 px-2 active:bg-white/5 rounded-xl transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                        <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="w-12 h-12 rounded-full object-cover border border-white/10" 
                        />
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-white">{user.name}</span>
                            <span className="text-xs text-gray-400">{user.team || 'Football Player'}</span>
                        </div>
                    </div>
                    <button className="px-5 py-1.5 bg-secondary/10 hover:bg-secondary/20 text-secondary text-xs font-bold rounded-lg transition-colors border border-secondary/20">
                        Voir profil
                    </button>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};