
import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';

interface CheckInModalProps {
  venueName: string;
  onClose: () => void;
  onConfirm: (date: string, time: string) => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({ venueName, onClose, onConfirm }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [dateType, setDateType] = useState<'today' | 'tomorrow' | 'other'>('today');
  const [selectedTime, setSelectedTime] = useState('18:00');
  const [customDate, setCustomDate] = useState('');

  useEffect(() => {
    setIsVisible(true);
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    return () => {
        document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleConfirm = () => {
    let dateStr = 'Aujourd\'hui';
    if (dateType === 'tomorrow') dateStr = 'Demain';
    if (dateType === 'other') dateStr = customDate || 'Date spécifique';
    
    onConfirm(dateStr, selectedTime);
    handleClose();
  };

  // Generate time slots every 30 mins from 6am to 11pm
  const timeSlots = [];
  for (let i = 6; i <= 23; i++) {
      timeSlots.push(`${i}:00`);
      if (i < 23) timeSlots.push(`${i}:30`);
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center isolate">
        <div 
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            onClick={handleClose}
        ></div>
        
        <div className={`relative w-full max-w-md bg-[#1C1F26] rounded-t-[32px] overflow-hidden shadow-2xl transition-transform duration-300 ease-out border-t border-white/10 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="flex justify-center pt-3 pb-2" onClick={handleClose}>
                <div className="w-10 h-1 bg-white/20 rounded-full"></div>
            </div>

            <div className="px-6 pb-8 pt-2">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 border border-green-500/30 shrink-0">
                        <Icon name="check_circle" className="text-2xl" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Check-in</h2>
                        <p className="text-xs text-gray-400 font-medium truncate max-w-[250px]">{venueName}</p>
                    </div>
                </div>

                {/* Date Selection */}
                <div className="mb-6">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Date</label>
                    <div className="flex bg-[#151518] p-1 rounded-xl border border-white/5">
                        <button 
                            onClick={() => setDateType('today')}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${dateType === 'today' ? 'bg-[#2C2C2E] text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Aujourd'hui
                        </button>
                        <button 
                            onClick={() => setDateType('tomorrow')}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${dateType === 'tomorrow' ? 'bg-[#2C2C2E] text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Demain
                        </button>
                        <button 
                            onClick={() => setDateType('other')}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${dateType === 'other' ? 'bg-[#2C2C2E] text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Autre
                        </button>
                    </div>
                    
                    {dateType === 'other' && (
                        <div className="mt-3 animate-in slide-in-from-top-2 fade-in">
                            <input 
                                type="date" 
                                value={customDate}
                                onChange={(e) => setCustomDate(e.target.value)}
                                className="w-full bg-[#151518] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 text-sm font-medium placeholder-gray-500"
                            />
                        </div>
                    )}
                </div>

                {/* Time Selection */}
                <div className="mb-8">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Heure d'arrivée</label>
                    <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 -mx-6 px-6">
                        {timeSlots.map(time => (
                            <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`flex-shrink-0 px-5 py-2.5 rounded-xl border font-bold text-sm transition-all ${
                                    selectedTime === time 
                                    ? 'bg-green-500 text-black border-green-500 shadow-lg scale-105' 
                                    : 'bg-[#151518] text-gray-400 border-white/5 hover:border-white/20 hover:text-white'
                                }`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={handleConfirm}
                    className="w-full bg-white text-black font-bold py-4 rounded-xl active:scale-[0.98] transition-transform shadow-xl flex items-center justify-center gap-2 hover:bg-gray-200"
                >
                    <Icon name="check" className="text-lg" />
                    Confirmer ma présence
                </button>
            </div>
        </div>
    </div>
  );
};
