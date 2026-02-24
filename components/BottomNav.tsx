
import React from 'react';
import { Icon } from './Icon';

interface BottomNavProps {
  onHomeClick?: () => void;
  onOpportunitiesClick?: () => void;
  onTrendingClick?: () => void;
  activeTab?: 'home' | 'opportunities' | 'trending';
}

export const BottomNav: React.FC<BottomNavProps> = ({ onHomeClick, onOpportunitiesClick, onTrendingClick, activeTab }) => {
  return (
    <div className="fixed bottom-5 left-0 right-0 z-50 flex items-center justify-center gap-3 px-4 pointer-events-none max-w-md mx-auto">
      {/* 1. Home Button (Left Floating) - Triggers Scroll Top */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          onHomeClick?.();
        }}
        className={`pointer-events-auto w-12 h-12 shrink-0 rounded-full glass-card bg-[#0F1115]/90 backdrop-blur-xl flex items-center justify-center transition-all shadow-lg active:scale-95 border border-white/10 group relative ${activeTab === 'home' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
      >
        <Icon name="home" className="text-[22px] group-hover:scale-110 transition-transform" filled={activeTab === 'home'} />
        {activeTab === 'home' && <span className="absolute top-3 right-3 w-2 h-2 bg-neon-pink rounded-full border border-[#0F1115]"></span>}
      </button>

      {/* Center Navigation Pill (Icons 2, 3, 4, 5) */}
      <nav className="pointer-events-auto h-16 glass-card bg-[#0F1115]/90 backdrop-blur-xl rounded-[32px] flex items-center justify-center gap-4 px-5 shadow-neon-active/10 border border-white/10">
        
        {/* 2. Trending / Rankings (Soccer Player) */}
        <button 
          onClick={onTrendingClick}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-all group active:scale-90 ${activeTab === 'trending' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          <Icon name="sports_soccer" className="text-[24px] group-hover:scale-110 transition-transform" filled={activeTab === 'trending'} />
        </button>
        
        {/* 3. Ticket (Opportunities) */}
        <button 
          onClick={onOpportunitiesClick}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-all group active:scale-90 ${activeTab === 'opportunities' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          <Icon name="local_activity" className="text-[22px] group-hover:scale-110 transition-transform" filled={activeTab === 'opportunities'} />
        </button>

        {/* 4. Chat */}
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all group active:scale-90">
          <Icon name="chat_bubble_outline" className="text-[22px] group-hover:scale-110 transition-transform" />
        </button>

        {/* 5. Profile */}
        <button className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all group active:scale-90">
          <Icon name="person" className="text-[24px] group-hover:scale-110 transition-transform" />
        </button>
      </nav>

      {/* 6. Stadium (Right Floating) */}
      <button className="pointer-events-auto w-12 h-12 shrink-0 rounded-full glass-card bg-[#0F1115]/90 backdrop-blur-xl flex items-center justify-center text-gray-400 hover:text-white transition-all shadow-lg active:scale-95 border border-white/10 group">
        <Icon name="stadium" className="text-[22px] group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
};
