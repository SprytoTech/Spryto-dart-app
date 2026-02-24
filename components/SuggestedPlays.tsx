
import React, { useRef, useState } from 'react';
import { SuggestedPlay } from '../types';
import { Icon } from './Icon';

interface SuggestedPlaysProps {
  plays: SuggestedPlay[];
  onPlayClick?: (playId: string) => void;
}

const SuggestedPlayCard: React.FC<{ play: SuggestedPlay; onClick?: () => void }> = ({ play, onClick }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = () => {
    if (videoRef.current && play.video) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div 
      className="relative min-w-[160px] h-[240px] rounded-2xl overflow-hidden snap-start shadow-xl group border border-white/5 cursor-pointer active:scale-95 transition-transform"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {play.video ? (
        <video
          ref={videoRef}
          src={play.video}
          poster={play.image}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          muted
          loop
          playsInline
        />
      ) : (
        <img 
          src={play.image} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          alt={play.title}
        />
      )}
      
      {/* Play Icon Overlay (visible when not playing and has video) */}
      {play.video && (
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
          <div className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
              <Icon name="play_arrow" className="text-white text-xl" filled />
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 pointer-events-none"></div>
      
      <div className="absolute bottom-0 left-0 w-full p-4 pointer-events-none">
        <div className="flex items-center gap-2">
          <img 
            alt={play.user.name} 
            className="w-6 h-6 rounded-full border border-white/50" 
            src={play.user.avatar} 
          />
          <span className="text-gray-300 text-[10px] uppercase font-bold tracking-wider">{play.user.name}</span>
        </div>
      </div>
    </div>
  );
};

export const SuggestedPlays: React.FC<SuggestedPlaysProps> = ({ plays, onPlayClick }) => {
  return (
    <section className="mb-8 pl-5">
      <div className="mb-4 pr-5">
        <h2 className="font-bold text-lg text-white tracking-tight flex items-center gap-2">
          <span className="w-1 h-5 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full"></span>
          Plays suggérés
        </h2>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar snap-x pr-5">
        {plays.map((play) => (
          <SuggestedPlayCard 
            key={play.id} 
            play={play} 
            onClick={() => onPlayClick?.(play.id)} 
          />
        ))}
      </div>
    </section>
  );
};
