import React, { useState } from 'react';
import { TrendingPlayer } from '../types';
import { Icon } from './Icon';

interface TrendingPlayersProps {
  players: TrendingPlayer[];
}

export const TrendingPlayers: React.FC<TrendingPlayersProps> = ({ players }) => {
  // State to track which players are followed (by ID)
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());

  const toggleFollow = (id: string) => {
    const next = new Set(followedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setFollowedIds(next);
  };

  return (
    <section className="mb-8 pl-5">
      <div className="mb-4 pr-5 flex justify-between items-center">
        <h2 className="font-bold text-lg text-white tracking-tight flex items-center gap-2">
          {/* Sober Silver/Slate Gradient Accent */}
          <span className="w-1 h-5 bg-gradient-to-b from-slate-200 to-slate-500 rounded-full"></span>
          Suggested Players
        </h2>
        <button className="text-gray-500 hover:text-white transition-colors">
            <Icon name="arrow_forward" className="text-xl" />
        </button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x pr-5">
        {players.map((player) => {
          const isFollowed = followedIds.has(player.id);
          
          return (
            <div 
              key={player.id} 
              className="min-w-[180px] max-w-[180px] bg-gradient-to-b from-[#1C1F26] to-[#0F1115] rounded-2xl p-5 snap-start shadow-xl relative overflow-hidden group border border-white/5 transition-all hover:border-white/10"
            >
              {/* Subtle light effect at top */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-b from-white/10 to-transparent">
                      <img 
                          alt={player.name} 
                          className="w-full h-full rounded-full object-cover bg-[#151518]" 
                          src={player.image} 
                      />
                  </div>
                  {/* Team Badge - Centered Bottom Pill */}
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-[#1C1F26] text-[9px] font-bold text-gray-300 px-3 py-0.5 rounded-full border border-white/10 shadow-sm whitespace-nowrap max-w-[100px] truncate text-center z-10">
                     {player.team}
                  </div>
                </div>
                
                <h3 className="font-bold text-base text-white leading-tight mb-1.5 truncate w-full">{player.name}</h3>
                
                <div className="flex items-center gap-1.5 mb-5 justify-center w-full px-1">
                  {/* Full Category display (League + Age or Level) - No Box */}
                  <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide truncate max-w-[100px]">
                      {player.category}
                  </span>
                  <span className="text-[9px] text-gray-600">•</span>
                  <span className="text-[11px] font-bold text-gray-200 shrink-0">{player.role}</span>
                </div>

                <button 
                  onClick={() => toggleFollow(player.id)}
                  className={`w-full text-xs font-bold py-2.5 rounded-full transition-all duration-200 shadow-lg active:scale-95 flex items-center justify-center gap-1 ${
                    isFollowed 
                      ? 'bg-white/5 text-white border border-white/20 hover:bg-white/10' 
                      : 'bg-white text-black hover:bg-gray-200 border border-transparent'
                  }`}
                >
                    {isFollowed ? (
                      <>
                        <Icon name="check" className="text-sm font-bold" />
                        <span>Suivi</span>
                      </>
                    ) : (
                      'Suivre'
                    )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};