
import React, { useState } from 'react';
import { Icon } from './Icon';
import { CheckInModal } from './CheckInModal';

interface VenueDetailsPageProps {
  venue: {
    id: number;
    name: string;
    location: string;
    image: string;
    playersPresent: number;
    type: string;
  };
  onBack: () => void;
}

const POPULAR_TIMES = [20, 35, 45, 60, 85, 100, 70, 50, 30, 15]; // Mock data percentages
const HOURS = ['12P', '2P', '4P', '6P', '8P', '10P'];

const TOP_PLAYERS = [
    { name: 'Marcus Cole', role: 'Midfielder', goals: 156, rating: 9.8, avatar: 'https://i.pravatar.cc/150?u=marcus', badge: true },
    { name: 'Sarah Jenks', role: 'Striker', goals: 84, rating: 9.5, avatar: 'https://i.pravatar.cc/150?u=sarah', badge: false },
    { name: 'Davide Rossi', role: 'Defender', goals: 92, rating: 9.2, avatar: 'https://i.pravatar.cc/150?u=davide', badge: false },
];

const TEAMS = [
    { name: 'Blue Thunder', players: '3/5', color: 'bg-blue-900', icon: 'shield' },
    { name: 'Rapid Fire', players: '4/5', color: 'bg-orange-900', icon: 'bolt' },
    { name: 'Iron Defense', players: 'FULL', color: 'bg-red-900', icon: 'lock', isFull: true },
];

const AMENITIES = [
    { icon: 'lightbulb', label: 'Lighting' },
    { icon: 'local_parking', label: 'Parking' },
    { icon: 'wc', label: 'Restrooms' },
    { icon: 'water_drop', label: 'Water' },
];

export const VenueDetailsPage: React.FC<VenueDetailsPageProps> = ({ venue, onBack }) => {
  const [showCheckInModal, setShowCheckInModal] = useState(false);

  return (
    <div className="absolute inset-0 z-[100] bg-[#0F1115] text-white font-sans overflow-hidden animate-in slide-in-from-right duration-300 flex flex-col">
      
      {/* Header Overlay - Fixed on top */}
      <div className="absolute top-0 left-0 right-0 p-4 pt-12 flex justify-between items-start z-20 pointer-events-none">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 pointer-events-auto active:scale-95 transition-transform">
            <Icon name="arrow_back" className="text-xl" />
        </button>
        <div className="flex gap-3 pointer-events-auto">
            <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 active:scale-95">
                <Icon name="favorite_border" className="text-xl" />
            </button>
            <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 active:scale-95">
                <Icon name="share" className="text-xl" />
            </button>
        </div>
      </div>

      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto pb-28 relative">
          
          {/* Hero Image - Inside scroll */}
          <div className="relative h-64 w-full">
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0F1115]"></div>
              <img src={venue.image} alt={venue.name} className="w-full h-full object-cover" />
          </div>

          {/* Content Body */}
          <div className="relative z-10 px-5 -mt-10">
              
              {/* Title Section */}
              <div className="mb-6">
                  <div className="flex gap-3 mb-3">
                      <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
                          Open Now
                      </span>
                      <span className="bg-white/10 text-gray-300 border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                          {venue.playersPresent} Players Live
                      </span>
                  </div>
                  
                  <h1 className="text-3xl font-black text-white leading-tight mb-1">{venue.name}</h1>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Icon name="location_on" className="text-sm" />
                      <span>{venue.location}</span>
                  </div>
              </div>

              {/* Park Level Card */}
              <div className="bg-[#1C1F26] rounded-2xl p-4 border border-white/5 flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#252A33] flex items-center justify-center border border-white/5">
                          <Icon name="signal_cellular_alt" className="text-green-500" />
                      </div>
                      <div>
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">PARK LEVEL</p>
                          <p className="text-sm font-bold text-white">Advanced</p>
                      </div>
                  </div>
                  <Icon name="equalizer" className="text-green-500 text-2xl" />
              </div>

              {/* Feature Pills */}
              <div className="flex gap-3 mb-8 overflow-x-auto hide-scrollbar">
                  <div className="flex items-center gap-2 bg-[#1C1F26] border border-white/5 px-4 py-2 rounded-full whitespace-nowrap">
                      <Icon name="grass" className="text-green-500 text-sm" />
                      <span className="text-xs font-bold">{venue.type}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#1C1F26] border border-white/5 px-4 py-2 rounded-full whitespace-nowrap">
                      <Icon name="wb_sunny" className="text-yellow-500 text-sm" />
                      <span className="text-xs font-bold">Outdoor</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#1C1F26] border border-white/5 px-4 py-2 rounded-full whitespace-nowrap">
                      <Icon name="crop_free" className="text-gray-400 text-sm" />
                      <span className="text-xs font-bold">11 vs 11</span>
                  </div>
              </div>

              {/* Popular Times */}
              <section className="mb-8">
                  <div className="flex justify-between items-baseline mb-6">
                      <h2 className="text-lg font-bold text-white">Popular Times</h2>
                      <span className="text-[10px] text-gray-500">Based on recent activity</span>
                  </div>
                  
                  <div className="h-24 flex items-end justify-between gap-1 mb-2 px-2">
                      {POPULAR_TIMES.map((height, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                              {i === 5 && (
                                  <div className="bg-green-500 text-black text-[9px] font-bold px-1.5 py-0.5 rounded absolute -mt-6">Now</div>
                              )}
                              <div 
                                className={`w-full rounded-t-sm transition-all duration-500 ${i === 5 ? 'bg-green-500' : 'bg-[#2C2C2E] group-hover:bg-[#3A3A3C]'}`} 
                                style={{ height: `${height}%` }}
                              ></div>
                          </div>
                      ))}
                  </div>
                  <div className="flex justify-between px-2 text-[10px] text-gray-500 font-medium font-mono">
                      {HOURS.map(h => <span key={h}>{h}</span>)}
                  </div>
                  <p className="text-center text-xs text-gray-400 mt-4">Usually a little busy at this time.</p>
              </section>

              {/* Top Players */}
              <section className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-bold text-white">Top Players</h2>
                      <button className="text-[10px] font-bold text-green-500 flex items-center gap-1">
                          LEADERBOARD <Icon name="chevron_right" className="text-sm" />
                      </button>
                  </div>
                  <div className="bg-[#1C1F26] border border-white/5 rounded-2xl overflow-hidden">
                      {TOP_PLAYERS.map((player, idx) => (
                          <div key={idx} className="flex items-center p-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                              <div className={`w-6 text-center font-bold text-sm ${idx === 0 ? 'text-yellow-500' : (idx === 1 ? 'text-gray-400' : 'text-orange-700')}`}>
                                  {idx + 1}
                              </div>
                              <img src={player.avatar} className="w-10 h-10 rounded-full bg-gray-800 object-cover mx-3" alt={player.name} />
                              <div className="flex-1">
                                  <div className="flex items-center gap-1">
                                      <span className="text-sm font-bold text-white">{player.name}</span>
                                      {player.badge && <Icon name="verified" className="text-yellow-500 text-[12px]" filled />}
                                  </div>
                                  <span className="text-xs text-gray-400">{player.role} • {player.goals} Goals</span>
                              </div>
                              <div className="text-right">
                                  <div className="text-sm font-bold text-green-400">{player.rating}</div>
                                  <div className="text-[9px] text-gray-500 uppercase">RATING</div>
                              </div>
                          </div>
                      ))}
                  </div>
              </section>

              {/* Field Chat Preview */}
              <section className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                          Field Chat <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      </h2>
                      <div className="flex -space-x-2">
                          {[1,2,3].map(i => (
                              <img key={i} src={`https://i.pravatar.cc/150?u=chat${i}`} className="w-6 h-6 rounded-full border border-[#0F1115]" alt="" />
                          ))}
                          <div className="w-6 h-6 rounded-full bg-[#2C2C2E] border border-[#0F1115] flex items-center justify-center text-[9px] font-bold">+21</div>
                      </div>
                  </div>
                  
                  <div className="bg-[#1C1F26] border border-white/5 rounded-2xl p-4">
                      <div className="flex gap-3">
                          <img src="https://i.pravatar.cc/150?u=marcus" className="w-8 h-8 rounded-full" alt="Marcus" />
                          <div className="flex-1">
                              <div className="flex justify-between items-baseline mb-1">
                                  <span className="text-xs font-bold text-white">Marcus</span>
                                  <span className="text-[10px] text-gray-500">2m ago</span>
                              </div>
                              <p className="text-xs text-gray-300 leading-relaxed">
                                  Anyone bringing an extra ball for the 6pm game? Mine is flat 😅
                              </p>
                          </div>
                      </div>
                      <button className="w-full mt-4 bg-green-500 hover:bg-green-400 text-black font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                          <Icon name="chat" className="text-lg" />
                          Join Conversation
                      </button>
                  </div>
              </section>

              {/* Teams */}
              <section className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-bold text-white">Teams</h2>
                      <button className="px-3 py-1 rounded-full bg-[#1C1F26] border border-white/10 text-[10px] font-bold hover:bg-white/10 transition-colors">
                          + Create
                      </button>
                  </div>
                  <div className="flex flex-col gap-3">
                      {TEAMS.map((team, idx) => (
                          <div key={idx} className="bg-[#1C1F26] border border-white/5 rounded-2xl p-3 flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-xl ${team.color} flex items-center justify-center`}>
                                      <Icon name={team.icon} className="text-white text-lg opacity-80" />
                                  </div>
                                  <div>
                                      <h4 className="text-sm font-bold text-white">{team.name}</h4>
                                      <div className="flex items-center gap-1 mt-0.5">
                                          <div className="flex -space-x-1">
                                              {[1,2,3].map(i => <div key={i} className="w-4 h-4 rounded-full bg-gray-600 border border-[#1C1F26]"></div>)}
                                          </div>
                                          <span className="text-[10px] text-gray-400 ml-1">{team.players} Players</span>
                                      </div>
                                  </div>
                              </div>
                              <button className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${team.isFull ? 'bg-[#2C2C2E] text-gray-500 cursor-not-allowed' : 'bg-green-500 text-black hover:bg-green-400'}`}>
                                  {team.isFull ? 'View' : 'Join'}
                              </button>
                          </div>
                      ))}
                  </div>
              </section>

              {/* Amenities */}
              <section className="mb-8">
                  <h2 className="text-lg font-bold text-white mb-4">Amenities</h2>
                  <div className="grid grid-cols-4 gap-3">
                      {AMENITIES.map((item, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-2">
                              <div className="w-12 h-12 rounded-2xl bg-[#1C1F26] border border-white/5 flex items-center justify-center">
                                  <Icon name={item.icon} className="text-gray-400 text-xl" />
                              </div>
                              <span className="text-[10px] font-medium text-gray-400">{item.label}</span>
                          </div>
                      ))}
                  </div>
              </section>

              {/* Opening Hours & Contact */}
              <section className="space-y-4">
                  <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#1C1F26] flex items-center justify-center border border-white/5 shrink-0">
                          <Icon name="schedule" className="text-white" />
                      </div>
                      <div className="flex-1">
                          <h4 className="text-sm font-bold text-white">Opening Hours</h4>
                          <div className="flex justify-between text-xs text-gray-400 mt-1">
                              <span>Mon - Fri</span>
                              <span>6:00 AM - 10:00 PM</span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-400">
                              <span>Sat - Sun</span>
                              <span>8:00 AM - 11:00 PM</span>
                          </div>
                      </div>
                  </div>

                  <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#1C1F26] flex items-center justify-center border border-white/5 shrink-0">
                          <Icon name="call" className="text-white" />
                      </div>
                      <div className="flex-1">
                          <h4 className="text-sm font-bold text-white">Contact Venue</h4>
                          <p className="text-xs text-gray-400 mt-0.5">For bookings & inquiries</p>
                      </div>
                      <button className="w-8 h-8 rounded-full bg-[#2C2C2E] flex items-center justify-center">
                          <Icon name="chevron_right" className="text-gray-400" />
                      </button>
                  </div>
              </section>
          </div>
      </div>

      {/* Floating Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#0F1115] via-[#0F1115] to-transparent z-30 pb-8">
          <div className="flex gap-4">
              <button 
                onClick={() => setShowCheckInModal(true)}
                className="flex-1 bg-[#2C2C2E] hover:bg-[#3A3A3C] text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all border border-white/10"
              >
                  <Icon name="check_circle" className="text-lg" />
                  Check In
              </button>
              <button className="flex-[2] bg-green-500 hover:bg-green-400 text-black h-12 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-green-500/20">
                  <Icon name="directions" className="text-lg" />
                  Get Directions
              </button>
          </div>
      </div>

      {showCheckInModal && (
          <CheckInModal 
              venueName={venue.name}
              onClose={() => setShowCheckInModal(false)}
              onConfirm={(date, time) => {
                  console.log(`Checked in at ${venue.name} on ${date} at ${time}`);
                  setShowCheckInModal(false);
              }}
          />
      )}

    </div>
  );
};
