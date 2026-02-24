
import React, { useState } from 'react';
import { Icon } from './Icon';
import { BottomNav } from './BottomNav';
import { Opportunity } from '../types';

interface TicketsPageProps {
  onBack: () => void;
  onFindTickets: () => void;
  onViewSaved: () => void;
  onTicketClick?: (ticket: Opportunity) => void;
  tickets?: Opportunity[];
}

export const TicketsPage: React.FC<TicketsPageProps> = ({ onBack, onFindTickets, onViewSaved, onTicketClick, tickets = [] }) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  // Mock Past Tickets
  const pastTickets: Opportunity[] = [
      {
        id: 'past_1',
        type: 'Tryout',
        title: 'Détection Hivernale',
        club: 'CF Montréal',
        clubLogo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/3/3e/CF_Montr%C3%A9al_logo_2023.svg/200px-CF_Montr%C3%A9al_logo_2023.svg.png',
        date: '10 Jan 2024',
        location: 'Stade Saputo, Montréal',
        tags: ['U15', 'Elite'],
        isFeatured: false
      }
  ];

  const renderEmptyState = (type: 'upcoming' | 'past') => (
    <div className="flex flex-col items-center justify-center flex-1 px-8 text-center pt-20 animate-in fade-in zoom-in duration-300">
      {/* Butterfly Net Illustration */}
      <div className="mb-8 relative w-48 h-48 opacity-80">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
             <path d="M156.5 67.5C152 64.5 146.5 63 141 63C135.5 63 130 64.5 125.5 67.5L42 121C38.5 123.5 36.5 127.5 36.5 131.5C36.5 135.5 38.5 139.5 42 142L125.5 195.5C130 198.5 135.5 200 141 200C146.5 200 152 198.5 156.5 195.5L180 180.5C184.5 177.5 187 172.5 187 167.5V95.5C187 90.5 184.5 85.5 180 82.5L156.5 67.5Z" stroke="#4B5563" strokeWidth="2" fill="none"/>
             <ellipse cx="141" cy="131.5" rx="55" ry="35" stroke="#4B5563" strokeWidth="2" fill="#1C1F26" />
             <path d="M42 121L125.5 67.5" stroke="#4B5563" strokeWidth="2"/>
             <line x1="141" y1="96.5" x2="141" y2="166.5" stroke="#4B5563" strokeWidth="1"/>
             <line x1="100" y1="115" x2="182" y2="148" stroke="#4B5563" strokeWidth="1"/>
             <line x1="100" y1="148" x2="182" y2="115" stroke="#4B5563" strokeWidth="1"/>
             {/* Handle */}
             <path d="M36.5 131.5L15 155" stroke="#E67E22" strokeWidth="8" strokeLinecap="round"/>
             {/* Butterfly */}
             <path d="M50 50C40 40 30 60 45 70C35 80 50 90 60 80C70 90 85 80 75 70C90 60 80 40 70 50C65 55 55 55 50 50Z" fill="#F43F5E" opacity="0.8"/>
          </svg>
      </div>

      <h3 className="text-[17px] font-bold text-white mb-6">
        {type === 'upcoming' 
          ? "Votre emploi du temps est assez ouvert" 
          : "Aucun billet passé"}
      </h3>

      {type === 'upcoming' && (
        <>
          <button 
            onClick={onFindTickets}
            className="w-full bg-[#1C1F26] text-white font-bold py-3.5 rounded-xl mb-12 border border-white/10 active:scale-95 transition-transform hover:bg-[#252a33]"
          >
            Faisons des projets
          </button>

          <p className="text-sm text-gray-400 mb-4">Il manque quelque chose ?</p>
          
          <button className="text-sm text-white font-medium underline decoration-gray-500 underline-offset-4 hover:text-gray-200">
            Trouvez vos billets
          </button>
        </>
      )}
    </div>
  );

  const renderTicketCard = (ticket: Opportunity, isPast: boolean = false, index: number = 0) => (
      <div 
        key={ticket.id} 
        onClick={() => onTicketClick && onTicketClick(ticket)}
        className={`bg-white text-black rounded-xl overflow-hidden shadow-lg relative cursor-pointer active:scale-[0.98] transition-transform animate-in slide-in-from-bottom-4 fade-in duration-500 fill-mode-both ${isPast ? 'opacity-70 grayscale-[0.5]' : ''}`}
        style={{ animationDelay: `${index * 100}ms` }}
      >
        {/* Header */}
        <div className="p-3 flex justify-between items-start">
          <div>
            <div className="text-[11px] font-bold uppercase text-gray-500 mb-0.5">{ticket.date}</div>
            <div className="text-[11px] font-medium text-gray-400">{isPast ? 'Terminé' : '1:00pm'}</div>
          </div>
          <div className="flex flex-col items-end">
             <div className="flex items-center gap-1 mb-1">
                <span className="text-[11px] font-bold">1</span>
                <Icon name="qr_code_2" className="text-xl" />
             </div>
          </div>
        </div>

        {/* Event Content */}
        <div className="flex px-3 pb-3 gap-3">
           <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden shrink-0 shadow-inner flex items-center justify-center p-1.5">
              <img 
                src={ticket.clubLogo} 
                alt="Event" 
                className="w-full h-full object-contain"
              />
           </div>
           <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h3 className="font-bold text-[15px] leading-tight mb-0.5 truncate">{ticket.title}</h3>
              <p className="text-[11px] text-gray-500 truncate">{ticket.club} • {ticket.location.split(',')[0]}</p>
           </div>
        </div>

        {/* Decorative Circles for Ticket Effect */}
        <div className="absolute top-[45%] -left-3 w-5 h-5 bg-[#0F1115] rounded-full"></div>
        <div className="absolute top-[45%] -right-3 w-5 h-5 bg-[#0F1115] rounded-full"></div>
        
        {/* Dashed Line */}
        <div className="absolute top-[45%] left-3 right-3 h-[1px] border-t-2 border-dashed border-gray-200 -z-10"></div>
      </div>
  );

  return (
    <div className="absolute inset-0 z-[60] bg-[#0F1115] text-white flex flex-col font-sans animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="px-4 pt-12 pb-2 bg-[#0F1115] flex items-center justify-between">
        <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors active:scale-95"
        >
            <Icon name="arrow_back" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold text-white">Billets</h1>
        <button 
            onClick={onViewSaved}
            className="w-10 h-10 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors active:scale-95"
        >
            <Icon name="bookmark_border" className="text-2xl" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mt-2">
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 pb-3 text-[15px] font-bold relative transition-colors ${activeTab === 'upcoming' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
          À venir
          {activeTab === 'upcoming' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF453A] rounded-t-full mx-10 animate-in fade-in duration-300"></div>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('past')}
          className={`flex-1 pb-3 text-[15px] font-bold relative transition-colors ${activeTab === 'past' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Passé
          {activeTab === 'past' && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF453A] rounded-t-full mx-10 animate-in fade-in duration-300"></div>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-[#0F1115]">
        {activeTab === 'upcoming' ? (
          tickets.length > 0 ? (
            <div className="p-5 space-y-4">
              {tickets.map((t, i) => renderTicketCard(t, false, i))}
              <div className="mt-8 text-center animate-in fade-in duration-500 delay-300 fill-mode-both">
                 <p className="text-sm text-gray-400 mb-4">Il manque quelque chose ?</p>
                 <button 
                    onClick={onFindTickets}
                    className="text-sm text-white font-medium underline decoration-gray-500 underline-offset-4 hover:text-gray-200"
                 >
                    Trouvez vos billets
                 </button>
              </div>
            </div>
          ) : (
            renderEmptyState('upcoming')
          )
        ) : (
          pastTickets.length > 0 ? (
            <div className="p-5 space-y-4">
              {pastTickets.map((t, i) => renderTicketCard(t, true, i))}
            </div>
          ) : (
            renderEmptyState('past')
          )
        )}
      </div>

      <BottomNav 
          activeTab="opportunities"
          onHomeClick={onBack} 
          onOpportunitiesClick={onFindTickets}
      />
    </div>
  );
};
