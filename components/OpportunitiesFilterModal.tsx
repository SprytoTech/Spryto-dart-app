import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';

interface OpportunitiesFilterModalProps {
  onClose: () => void;
  onApply: (filters: any) => void;
}

const DATE_OPTIONS = [
    { label: "N'importe quelle date", value: 'any' },
    { label: "Aujourd'hui", value: 'today' },
    { label: "Demain", value: 'tomorrow' },
    { label: "Cette semaine", value: 'week' },
    { label: "Ce week-end", value: 'weekend' },
];

const CATEGORIES = [
    { label: "Tryout", value: 'Tryout' },
    { label: "Showcase", value: 'Showcase' },
    { label: "Tournoi", value: 'Tournoi' },
    { label: "Programme", value: 'Programme' },
    { label: "Évènement", value: 'Évènement' },
];

const GENDER_OPTIONS = [
    { label: "Tous", value: 'any' },
    { label: "Homme", value: 'male' },
    { label: "Femme", value: 'female' },
];

const AGE_OPTIONS = ["U13", "U14", "U15", "U16", "U17", "U18", "U19", "U21", "Senior"];

const DAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export const OpportunitiesFilterModal: React.FC<OpportunitiesFilterModalProps> = ({ onClose, onApply }) => {
  // View State
  const [view, setView] = useState<'main' | 'datePicker'>('main');

  useEffect(() => {
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    return () => {
        document.body.style.overflow = 'unset';
    };
  }, []);

  // Filter State
  const [selectedDateOption, setSelectedDateOption] = useState('any');
  const [customRange, setCustomRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState('any');
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  
  // Accordion state
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(true);
  const [isAgeExpanded, setIsAgeExpanded] = useState(false);

  // Calendar State (Temp)
  const [displayDate, setDisplayDate] = useState(new Date());
  const [tempStart, setTempStart] = useState<Date | null>(null);
  const [tempEnd, setTempEnd] = useState<Date | null>(null);

  const toggleCategory = (cat: string) => {
      setSelectedCategories(prev => 
        prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
      );
  };

  const toggleAge = (age: string) => {
      setSelectedAges(prev => 
        prev.includes(age) ? prev.filter(a => a !== age) : [...prev, age]
      );
  };

  const handleApply = () => {
      onApply({
          date: selectedDateOption === 'custom' ? customRange : selectedDateOption,
          categories: selectedCategories,
          gender: selectedGender,
          ages: selectedAges,
          freeOnly: showFreeOnly,
          onlineOnly: showOnlineOnly,
          sortBy
      });
      onClose();
  };

  const handleReset = () => {
      setSelectedDateOption('any');
      setCustomRange({ start: null, end: null });
      setSelectedCategories([]);
      setSelectedGender('any');
      setSelectedAges([]);
      setShowFreeOnly(false);
      setShowOnlineOnly(false);
      setSortBy('relevance');
  };

  // --- Calendar Logic ---
  const handleOpenDatePicker = () => {
      setTempStart(customRange.start);
      setTempEnd(customRange.end);
      setView('datePicker');
  };

  const handleDateClick = (day: number) => {
      const clickedDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
      
      // Reset time to midnight for consistent comparison
      clickedDate.setHours(0, 0, 0, 0);
      
      if (!tempStart || (tempStart && tempEnd)) {
          // Start a new selection
          setTempStart(clickedDate);
          setTempEnd(null);
      } else {
          // Complete the selection
          if (clickedDate.getTime() < tempStart.getTime()) {
              setTempEnd(tempStart);
              setTempStart(clickedDate);
          } else {
              setTempEnd(clickedDate);
          }
      }
  };

  const changeMonth = (delta: number) => {
      const newDate = new Date(displayDate.getFullYear(), displayDate.getMonth() + delta, 1);
      setDisplayDate(newDate);
  };

  const saveDateRange = () => {
      if (tempStart) {
          setCustomRange({ start: tempStart, end: tempEnd || tempStart });
          setSelectedDateOption('custom');
      }
      setView('main');
  };

  const formatDate = (date: Date | null) => {
      if (!date) return '';
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Calendar Helpers
  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  // --- Sub-View: Date Picker ---
  if (view === 'datePicker') {
      const daysInMonth = getDaysInMonth(displayDate);
      const firstDay = getFirstDayOfMonth(displayDate);
      const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
      const blanks = Array.from({ length: firstDay }, (_, i) => i);

      return (
          <div className="fixed inset-0 z-[100] bg-[#0F1115] flex flex-col h-full w-full max-w-md mx-auto animate-in slide-in-from-right duration-300 font-sans">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-white/5 bg-[#0F1115] z-10 shrink-0 pt-[max(2rem,env(safe-area-inset-top))]">
                  <button onClick={() => setView('main')} className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-white/5 transition-colors">
                      <Icon name="arrow_back_ios" className="text-xl text-white pl-2" />
                  </button>
                  <h2 className="text-[17px] font-bold text-white">Choisissez une date</h2>
                  <button onClick={onClose} className="flex items-center justify-center w-10 h-10 -mr-2 rounded-full hover:bg-white/5 transition-colors">
                      <Icon name="close" className="text-2xl text-white" />
                  </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-6 pt-6 pb-6">
                  {/* Inputs - Compact Row Layout */}
                  <div className="flex flex-col mb-4">
                      <div className="flex items-center justify-between py-3 border-b border-white/5">
                          <label className="text-[15px] font-medium text-white">Date de début</label>
                          <div className={`py-1.5 px-3 rounded-lg border flex items-center justify-center transition-colors min-w-[110px] ${tempStart ? 'bg-[#1C1F26] border-white' : 'bg-[#1C1F26] border-white/10'}`}>
                              <span className={`font-bold text-[13px] ${tempStart ? 'text-white' : 'text-gray-500'}`}>
                                  {tempStart ? formatDate(tempStart) : 'Sélectionner'}
                              </span>
                          </div>
                      </div>
                      <div className="flex items-center justify-between py-3">
                          <label className="text-[15px] font-medium text-white">Date de fin</label>
                          <div className={`py-1.5 px-3 rounded-lg border flex items-center justify-center transition-colors min-w-[110px] ${tempEnd ? 'bg-[#1C1F26] border-white' : 'bg-[#1C1F26] border-white/10'}`}>
                              <span className={`font-bold text-[13px] ${tempEnd ? 'text-white' : 'text-gray-500'}`}>
                                  {tempEnd ? formatDate(tempEnd) : 'Sélectionner'}
                              </span>
                          </div>
                      </div>
                  </div>

                  {/* Calendar Container */}
                  <div className="bg-[#1e232e] rounded-2xl p-4 border border-white/5 mx-auto w-full max-w-sm">
                      {/* Month Nav */}
                      <div className="flex items-center justify-between mb-4 px-1">
                          <button onClick={() => changeMonth(-1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
                              <Icon name="chevron_left" className="text-white text-2xl" />
                          </button>
                          <span className="font-bold text-[16px] capitalize text-white">
                              {MONTHS[displayDate.getMonth()]} {displayDate.getFullYear()}
                          </span>
                          <button onClick={() => changeMonth(1)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">
                              <Icon name="chevron_right" className="text-white text-2xl" />
                          </button>
                      </div>

                      {/* Days Header */}
                      <div className="grid grid-cols-7 mb-2 text-center">
                          {DAYS.map(day => (
                              <div key={day} className="text-[12px] font-medium text-gray-500">{day}</div>
                          ))}
                      </div>

                      {/* Days Grid */}
                      <div className="grid grid-cols-7 gap-y-1 gap-x-1">
                          {blanks.map(i => <div key={`blank-${i}`} className="aspect-square"></div>)}
                          {days.map(day => {
                              const date = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
                              date.setHours(0, 0, 0, 0); // Normalize time

                              const isStart = tempStart && date.getTime() === tempStart.getTime();
                              const isEnd = tempEnd && date.getTime() === tempEnd.getTime();
                              const isInRange = tempStart && tempEnd && date > tempStart && date < tempEnd;
                              
                              let buttonClass = "w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-medium transition-all z-10 relative mx-auto";
                              
                              // Background strip for range
                              let rangeBg = "";
                              if (isInRange) {
                                  rangeBg = "absolute inset-y-0 inset-x-0 bg-white/10 rounded-none";
                              } else if (isStart && tempEnd) {
                                  rangeBg = "absolute inset-y-0 right-0 left-1/2 bg-white/10";
                              } else if (isEnd && tempStart) {
                                  rangeBg = "absolute inset-y-0 left-0 right-1/2 bg-white/10";
                              }

                              if (isStart || isEnd) {
                                  buttonClass += " bg-white text-black font-bold";
                              } else {
                                  buttonClass += " text-white hover:bg-white/10";
                              }

                              return (
                                  <div key={day} className="aspect-square relative flex items-center justify-center">
                                      {rangeBg && <div className={rangeBg}></div>}
                                      <button 
                                          onClick={() => handleDateClick(day)}
                                          className={buttonClass}
                                      >
                                          {day}
                                      </button>
                                  </div>
                              );
                          })}
                      </div>
                  </div>
              </div>

              {/* Footer */}
              <div className="shrink-0 px-6 py-6 bg-[#0F1115] border-t border-white/10 flex items-center justify-between z-20 pb-[max(2rem,env(safe-area-inset-bottom))]">
                  <button 
                      onClick={() => { setTempStart(null); setTempEnd(null); }}
                      className="text-sm font-medium text-gray-400 underline decoration-gray-600 underline-offset-4 hover:text-white transition-colors ml-1"
                  >
                      Réinitialiser
                  </button>
                  <button 
                      onClick={saveDateRange}
                      disabled={!tempStart}
                      className="bg-white text-black px-6 py-3 rounded-[30px] font-bold text-[14px] hover:bg-gray-200 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      Enregistrer
                  </button>
              </div>
          </div>
      );
  }

  // --- Main View ---
  return (
    <div className="fixed inset-0 z-[100] bg-[#0F1115] flex flex-col h-full w-full max-w-md mx-auto animate-in slide-in-from-bottom duration-300 font-sans overscroll-contain">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-12 pb-4 border-b border-white/5 bg-[#0F1115] z-10 shrink-0 pt-[max(3rem,env(safe-area-inset-top))]">
            <h2 className="text-xl font-bold text-white">Filtre</h2>
            <button 
                onClick={onClose}
                className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
            >
                <Icon name="close" className="text-2xl" />
            </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
            
            {/* Section: Date */}
            <div className="py-6 border-b border-white/5">
                <h3 className="text-lg font-bold text-white mb-4">Date</h3>
                <div className="flex flex-col gap-4">
                    {DATE_OPTIONS.map((option) => (
                        <label key={option.value} className="flex items-center justify-between cursor-pointer group">
                            <span className="text-[15px] font-medium text-gray-300 group-hover:text-white transition-colors">{option.label}</span>
                            <div className="relative flex items-center">
                                <input 
                                    type="radio" 
                                    name="date_filter"
                                    className="peer sr-only"
                                    checked={selectedDateOption === option.value}
                                    onChange={() => setSelectedDateOption(option.value)}
                                />
                                <div className="w-5 h-5 rounded-full border border-gray-500 peer-checked:border-white peer-checked:border-[6px] transition-all"></div>
                            </div>
                        </label>
                    ))}

                    {/* Custom Date Option */}
                    <button 
                        onClick={handleOpenDatePicker}
                        className="flex items-center justify-between w-full group py-1"
                    >
                        <div className="flex flex-col items-start">
                             <span className={`text-[15px] font-medium transition-colors ${selectedDateOption === 'custom' ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                 Choisissez une date
                             </span>
                             {selectedDateOption === 'custom' && customRange.start && (
                                 <span className="text-xs text-blue-400 font-medium mt-1">
                                     {formatDate(customRange.start)} {customRange.end ? `- ${formatDate(customRange.end)}` : ''}
                                 </span>
                             )}
                        </div>
                        <div className="flex items-center gap-2">
                            {selectedDateOption === 'custom' && (
                                <div className="w-5 h-5 rounded-full border border-white border-[6px] mr-1"></div>
                            )}
                            <Icon name="chevron_right" className="text-gray-500 group-hover:text-white text-xl" />
                        </div>
                    </button>
                </div>
            </div>

            {/* Section: Sexe (Gender) */}
            <div className="py-6 border-b border-white/5">
                <h3 className="text-lg font-bold text-white mb-4">Sexe</h3>
                <div className="flex flex-wrap gap-2.5">
                    {GENDER_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setSelectedGender(option.value)}
                            className={`py-2 px-5 rounded-lg text-[13px] font-bold border transition-all ${
                                selectedGender === option.value 
                                ? 'bg-white text-black border-white shadow-md' 
                                : 'bg-[#1C1F26] text-gray-400 border-white/5 hover:bg-white/5'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Section: Catégorie */}
            <div className="py-6 border-b border-white/5">
                <button 
                    onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
                    className="flex items-center justify-between w-full mb-2"
                >
                    <h3 className="text-lg font-bold text-white">Catégorie</h3>
                    <Icon name={isCategoryExpanded ? "expand_less" : "expand_more"} className="text-2xl text-gray-400" />
                </button>
                
                {isCategoryExpanded && (
                    <div className="flex flex-col gap-4 mt-3 animate-in slide-in-from-top-2">
                        {CATEGORIES.map((cat) => (
                            <label key={cat.value} className="flex items-center justify-between cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <Icon name="chevron_right" className="text-gray-500 text-lg" />
                                    <span className="text-[15px] font-medium text-gray-300 group-hover:text-white transition-colors">{cat.label}</span>
                                </div>
                                <div className="relative flex items-center">
                                    <input 
                                        type="checkbox" 
                                        className="peer sr-only"
                                        checked={selectedCategories.includes(cat.value)}
                                        onChange={() => toggleCategory(cat.value)}
                                    />
                                    <div className="w-5 h-5 rounded border border-gray-500 peer-checked:bg-white peer-checked:border-white flex items-center justify-center transition-colors">
                                        <Icon name="check" className="text-black text-sm opacity-0 peer-checked:opacity-100 font-bold" />
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Section: Âge */}
            <div className="py-6 border-b border-white/5">
                <button 
                    onClick={() => setIsAgeExpanded(!isAgeExpanded)}
                    className="flex items-center justify-between w-full mb-2"
                >
                    <h3 className="text-lg font-bold text-white">Âge</h3>
                    <Icon name={isAgeExpanded ? "expand_less" : "expand_more"} className="text-2xl text-gray-400" />
                </button>
                
                {isAgeExpanded && (
                    <div className="grid grid-cols-3 gap-3 mt-3 animate-in slide-in-from-top-2">
                        {AGE_OPTIONS.map((age) => {
                            const isSelected = selectedAges.includes(age);
                            return (
                                <button
                                    key={age}
                                    onClick={() => toggleAge(age)}
                                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                                        isSelected 
                                        ? 'bg-blue-500 text-white border-blue-500 shadow-md' 
                                        : 'bg-[#1C1F26] text-gray-400 border-white/5 hover:bg-white/5'
                                    }`}
                                >
                                    {age}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Section: Prix du billet */}
            <div className="py-6 border-b border-white/5">
                <h3 className="text-lg font-bold text-white mb-4">Prix du billet</h3>
                <div className="flex items-center justify-between">
                    <span className="text-[15px] text-gray-300">Afficher uniquement les événements gratuits</span>
                    <Switch checked={showFreeOnly} onChange={setShowFreeOnly} />
                </div>
            </div>

            {/* Section: Type d'événement */}
            <div className="py-6 border-b border-white/5">
                <h3 className="text-lg font-bold text-white mb-4">Type d'événement</h3>
                <div className="flex items-center justify-between">
                    <span className="text-[15px] text-gray-300">Afficher les événements en ligne</span>
                    <Switch checked={showOnlineOnly} onChange={setShowOnlineOnly} />
                </div>
            </div>

            {/* Section: Trier par */}
            <div className="py-6">
                <h3 className="text-lg font-bold text-white mb-4">Trier par</h3>
                <div className="flex flex-col gap-4">
                    <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-[15px] font-medium text-gray-300 group-hover:text-white transition-colors">Pertinence</span>
                        <div className="relative flex items-center">
                            <input 
                                type="radio" 
                                name="sort_by"
                                className="peer sr-only"
                                checked={sortBy === 'relevance'}
                                onChange={() => setSortBy('relevance')}
                            />
                            <div className="w-5 h-5 rounded-full border border-gray-500 peer-checked:border-white peer-checked:border-[6px] transition-all"></div>
                        </div>
                    </label>
                    <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-[15px] font-medium text-gray-300 group-hover:text-white transition-colors">Date</span>
                        <div className="relative flex items-center">
                            <input 
                                type="radio" 
                                name="sort_by"
                                className="peer sr-only"
                                checked={sortBy === 'date'}
                                onChange={() => setSortBy('date')}
                            />
                            <div className="w-5 h-5 rounded-full border border-gray-500 peer-checked:border-white peer-checked:border-[6px] transition-all"></div>
                        </div>
                    </label>
                </div>
            </div>
        </div>

        {/* Footer Actions */}
        <div className="shrink-0 p-6 bg-[#0F1115] border-t border-white/10 flex items-center justify-between gap-6 z-20 pb-[max(2rem,env(safe-area-inset-bottom))] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <button 
                onClick={handleReset}
                className="text-[15px] font-semibold text-gray-400 underline decoration-gray-600 underline-offset-4 hover:text-white transition-colors"
            >
                Réinitialiser
            </button>
            <button 
                onClick={handleApply}
                className="bg-white text-black px-8 py-3.5 rounded-full font-bold text-[15px] hover:bg-gray-200 active:scale-95 transition-all shadow-lg"
            >
                Appliquer des filtres
            </button>
        </div>
    </div>
  );
};

// Internal Switch Component
const Switch = ({ checked, onChange }: { checked: boolean, onChange: (val: boolean) => void }) => (
    <button 
        className={`w-12 h-7 rounded-full relative transition-colors duration-200 ease-in-out ${checked ? 'bg-white' : 'bg-gray-700'}`}
        onClick={() => onChange(!checked)}
    >
        <div className={`absolute top-1 left-1 w-5 h-5 bg-black rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`}></div>
    </button>
);