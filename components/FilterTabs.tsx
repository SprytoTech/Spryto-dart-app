
import React from 'react';
import { Icon } from './Icon';

interface FilterTabsProps {
  isHeaderVisible: boolean;
  activeFilter: 'for-you' | 'elite' | 'friends' | 'men' | 'woman';
  onFilterChange: (filter: 'for-you' | 'elite' | 'friends' | 'men' | 'woman') => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ isHeaderVisible, activeFilter, onFilterChange }) => {
  const getButtonStyle = (filter: string) => {
    if (activeFilter === filter) {
      return "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.2)]";
    }
    return "glass-card text-gray-300 font-semibold hover:bg-white/10 border border-white/5";
  };

  return (
    <div 
      className={`flex items-center justify-between px-5 py-2 mb-4 sticky z-40 bg-[#0F1115]/80 backdrop-blur-xl transition-[top] duration-300 ease-in-out ${
        isHeaderVisible ? 'top-[72px]' : 'top-0'
      }`}
    >
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pr-5">
        <button 
          onClick={() => onFilterChange('for-you')}
          className={`text-xs px-5 py-2 rounded-full transition-all duration-300 whitespace-nowrap ${getButtonStyle('for-you')}`}
        >
          For you
        </button>
        <button 
          onClick={() => onFilterChange('elite')}
          className={`text-xs px-5 py-2 rounded-full transition-all duration-300 whitespace-nowrap ${getButtonStyle('elite')}`}
        >
          Élite Plays
        </button>
        <button 
          onClick={() => onFilterChange('friends')}
          className={`text-xs px-5 py-2 rounded-full transition-all duration-300 whitespace-nowrap ${getButtonStyle('friends')}`}
        >
          Friends
        </button>
        <button 
          onClick={() => onFilterChange('men')}
          className={`text-xs px-5 py-2 rounded-full transition-all duration-300 whitespace-nowrap ${getButtonStyle('men')}`}
        >
          Men
        </button>
        <button 
          onClick={() => onFilterChange('woman')}
          className={`text-xs px-5 py-2 rounded-full transition-all duration-300 whitespace-nowrap ${getButtonStyle('woman')}`}
        >
          Woman
        </button>
      </div>
      <div className="pl-2 bg-transparent">
        <button className="text-gray-400 hover:text-white transition">
            <Icon name="tune" />
        </button>
      </div>
    </div>
  );
};