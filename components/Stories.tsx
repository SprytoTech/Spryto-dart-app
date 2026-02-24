
import React, { useState } from 'react';
import { Story } from '../types';
import { Icon } from './Icon';

interface StoriesProps {
  stories: Story[];
  onHide?: () => void;
}

export const Stories: React.FC<StoriesProps> = ({ stories, onHide }) => {
  const [showHideModal, setShowHideModal] = useState(false);

  return (
    <div className="pt-4 pb-4 relative">
      {/* Header Section */}
      <div className="flex items-center justify-between px-5 mb-5">
        <h2 className="font-bold text-lg text-white tracking-tight flex items-center gap-3">
          <div className="flex flex-col gap-0.5">
              <span className="w-6 h-1 bg-gradient-to-r from-white to-transparent rounded-full opacity-80"></span>
              <span className="w-3 h-1 bg-gradient-to-r from-gray-400 to-transparent rounded-full opacity-60"></span>
          </div>
          Trending Player
        </h2>
        <button 
          className="text-gray-500 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5"
          onClick={() => setShowHideModal(true)}
        >
          <Icon name="more_horiz" className="text-xl" />
        </button>
      </div>

      {/* Stories List */}
      <div className="flex gap-5 overflow-x-auto px-5 hide-scrollbar snap-x py-2">
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center gap-2.5 min-w-[76px] snap-start cursor-pointer group">
            <div className={`relative w-[76px] h-[76px] rounded-full p-[2px] bg-gradient-to-tr ${story.gradient} ${story.hasUnseen ? 'shadow-[0_0_12px_-2px_rgba(255,255,255,0.25)]' : 'opacity-60'} group-hover:scale-105 transition-transform duration-300 ease-out`}>
              <div className="w-full h-full rounded-full border-[3px] border-[#0F1115] overflow-hidden bg-[#151518]">
                <img 
                  alt={story.user.name} 
                  className={`w-full h-full object-cover transition-all duration-300 ${!story.hasUnseen ? 'grayscale-[50%] opacity-80' : 'group-hover:scale-110'}`} 
                  src={story.user.avatar} 
                />
              </div>
              {/* Flame Badge */}
              <div className="absolute top-0 right-0 translate-x-1.5 -translate-y-1 bg-[#151518] rounded-full p-1 border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.5)] z-10 flex items-center justify-center">
                <Icon name="local_fire_department" className={`text-[14px] ${story.hasUnseen ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'text-gray-600'}`} filled />
              </div>
            </div>
            <span className={`text-[11px] tracking-wide truncate w-full text-center transition-colors ${story.hasUnseen ? 'font-semibold text-white' : 'font-medium text-gray-500'}`}>
              {story.user.name}
            </span>
          </div>
        ))}
      </div>

      {/* Masquer Modal (Bottom Sheet style) */}
      {showHideModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center isolate">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowHideModal(false)}
          ></div>
          <div className="relative w-full max-w-md bg-[#111214] rounded-t-[32px] pt-2 pb-12 px-5 shadow-2xl animate-in slide-in-from-bottom duration-300 border-t border-white/5">
            <div className="flex justify-center mb-6">
              <div className="w-9 h-1 bg-white/10 rounded-full"></div>
            </div>
            
            <button 
              onClick={() => {
                onHide?.();
                setShowHideModal(false);
              }}
              className="w-full bg-[#1C1F26] hover:bg-[#252a33] active:scale-[0.98] text-white flex items-center gap-4 px-6 py-5 rounded-[22px] transition-all border border-white/5 group"
            >
              <Icon name="visibility_off" className="text-white text-2xl group-active:scale-90 transition-transform" />
              <span className="text-[17px] font-medium">Masquer</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
