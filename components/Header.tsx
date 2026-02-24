
import React from 'react';
import { Icon } from './Icon';

interface HeaderProps {
  isVisible: boolean;
  onPublishClick?: () => void;
  onSearchClick?: () => void;
  onMapClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isVisible, onPublishClick, onSearchClick, onMapClick }) => {
  return (
    <header 
      className={`absolute top-0 left-0 right-0 z-50 bg-[#0F1115]/80 backdrop-blur-xl px-5 py-4 flex justify-between items-center border-b border-glass-border transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="flex items-center gap-1">
        <button 
          onClick={onPublishClick}
          className="p-2 rounded-full hover:bg-white/10 transition text-white/80 active:scale-90"
        >
          <Icon name="add_circle" className="text-2xl font-light" />
        </button>
        <button 
          onClick={onMapClick}
          className="p-2 rounded-full hover:bg-white/10 transition text-white/80 active:scale-90"
        >
          <Icon name="map" className="text-2xl font-light" />
        </button>
      </div>

      <h1 className="text-2xl font-black tracking-tighter italic bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 absolute left-1/2 -translate-x-1/2 pointer-events-none">
        SPRYTO
      </h1>

      <div className="flex items-center gap-4">
        <button 
          onClick={onSearchClick}
          className="p-2 rounded-full hover:bg-white/10 transition text-white/80 active:scale-90"
        >
          <Icon name="search" className="text-2xl font-light" />
        </button>
        <button className="p-2 rounded-full hover:bg-white/10 transition relative text-white/80">
          <Icon name="notifications" className="text-2xl font-light" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-neon-pink rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
        </button>
      </div>
    </header>
  );
};
