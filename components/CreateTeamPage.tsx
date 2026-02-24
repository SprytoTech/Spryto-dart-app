
import React, { useState, useMemo, useEffect } from 'react';
import { Icon } from './Icon';
import { LocationModal } from './LocationModal';
import { LeagueSelectorModal } from './LeagueSelectorModal';

interface CreateTeamPageProps {
    onBack: () => void;
    onShowSavedTeams?: () => void;
    // Update signatures to pass back filter data AND optional ID
    onSave?: (team: any[], leagueLabel: string, weekLabel: string, leagueIds: string[], location: string, id?: string) => void;
    onSubmit?: (team: any[], leagueLabel: string, weekLabel: string, leagueIds: string[], location: string, id?: string) => void;
    initialTeam?: (any | null)[];
    // New props for pre-filling filters
    initialLeagueIds?: string[];
    initialLocation?: string;
    initialId?: string; // ID of the team being edited
}

// 3-4-3 Formation Coordinates (Aligned with previous pages)
const FORMATION_COORDS = [
    { top: '85%', left: '50%', role: 'G' },   // 0: GK
    { top: '70%', left: '20%', role: 'DC' },  // 1: CB
    { top: '70%', left: '50%', role: 'DC' },  // 2: CB
    { top: '70%', left: '80%', role: 'DC' },  // 3: CB
    { top: '50%', left: '15%', role: 'MG' },  // 4: LM
    { top: '50%', left: '38%', role: 'MC' },  // 5: CM
    { top: '50%', left: '62%', role: 'MC' },  // 6: CM
    { top: '50%', left: '85%', role: 'MD' },  // 7: RM
    { top: '28%', left: '20%', role: 'AG' },  // 8: LW
    { top: '15%', left: '50%', role: 'BU' },  // 9: ST
    { top: '28%', left: '80%', role: 'AD' },  // 10: RW
];

// Mock Data for Player Search with Club Logos
const MOCK_PLAYERS_POOL = [
    { id: 'p1', name: 'Lamine Yamal', team: 'FC Barcelona', clubLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/100px-FC_Barcelona_%28crest%29.svg.png', position: 'AD', avatar: 'https://i.pravatar.cc/150?u=yamal', rating: 9.2 },
    { id: 'p2', name: 'Warren Zaïre-Emery', team: 'PSG', clubLogo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/8/86/Paris_Saint-Germain_Logo.svg/100px-Paris_Saint-Germain_Logo.svg.png', position: 'MC', avatar: 'https://i.pravatar.cc/150?u=wze', rating: 8.9 },
    { id: 'p3', name: 'William Saliba', team: 'Arsenal', clubLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/100px-Arsenal_FC.svg.png', position: 'DC', avatar: 'https://i.pravatar.cc/150?u=saliba', rating: 8.8 },
    { id: 'p4', name: 'Mike Maignan', team: 'AC Milan', clubLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Logo_of_AC_Milan.svg/100px-Logo_of_AC_Milan.svg.png', position: 'G', avatar: 'https://i.pravatar.cc/150?u=maignan', rating: 8.7 },
    { id: 'p5', name: 'Kylian Mbappé', team: 'Real Madrid', clubLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/100px-Real_Madrid_CF.svg.png', position: 'BU', avatar: 'https://i.pravatar.cc/150?u=mbappe', rating: 9.1 },
    { id: 'p6', name: 'Rodri', team: 'Man City', clubLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/100px-Manchester_City_FC_badge.svg.png', position: 'MC', avatar: 'https://i.pravatar.cc/150?u=rodri', rating: 9.3 },
    { id: 'p7', name: 'Achraf Hakimi', team: 'PSG', clubLogo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/8/86/Paris_Saint-Germain_Logo.svg/100px-Paris_Saint-Germain_Logo.svg.png', position: 'MD', avatar: 'https://i.pravatar.cc/150?u=hakimi', rating: 8.6 },
    { id: 'p8', name: 'Theo Hernandez', team: 'AC Milan', clubLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Logo_of_AC_Milan.svg/100px-Logo_of_AC_Milan.svg.png', position: 'MG', avatar: 'https://i.pravatar.cc/150?u=theo', rating: 8.5 },
    { id: 'p9', name: 'Vinicius Jr', team: 'Real Madrid', clubLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/100px-Real_Madrid_CF.svg.png', position: 'AG', avatar: 'https://i.pravatar.cc/150?u=vini', rating: 9.0 },
    { id: 'p10', name: 'Virgil Van Dijk', team: 'Liverpool', clubLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/100px-Liverpool_FC.svg.png', position: 'DC', avatar: 'https://i.pravatar.cc/150?u=vvd', rating: 8.7 },
    { id: 'p11', name: 'Ruben Dias', team: 'Man City', clubLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/100px-Manchester_City_FC_badge.svg.png', position: 'DC', avatar: 'https://i.pravatar.cc/150?u=dias', rating: 8.6 },
    // Add some randoms
    ...Array.from({ length: 40 }).map((_, i) => ({
        id: `mock-${i}`,
        name: `Joueur Talentueux ${i+1}`,
        team: i % 3 === 0 ? 'FC Laval' : (i % 3 === 1 ? 'CS Longueuil' : 'CS MRO'),
        clubLogo: `https://ui-avatars.com/api/?name=${(i % 3 === 0 ? 'FC Laval' : (i % 3 === 1 ? 'CS Longueuil' : 'CS MRO')).replace(' ', '+')}&background=${i % 3 === 0 ? '7B1FA2' : (i % 3 === 1 ? '1E88E5' : 'FDB813')}&color=fff&size=64`,
        position: ['G', 'DC', 'DC', 'MD', 'MG', 'MC', 'MC', 'AD', 'AG', 'BU'][i % 10], // Ensure all roles are covered
        avatar: `https://i.pravatar.cc/150?u=player${i}`,
        rating: (Math.random() * 2 + 7).toFixed(1)
    }))
];

// Persistence Keys
const TEAM_STORAGE_KEY = 'spryto_draft_team';
const LEAGUE_STORAGE_KEY = 'spryto_draft_leagues';
const LOC_STORAGE_KEY = 'spryto_draft_location';

export const CreateTeamPage: React.FC<CreateTeamPageProps> = ({ 
    onBack, 
    onShowSavedTeams, 
    onSave, 
    onSubmit, 
    initialTeam,
    initialLeagueIds,
    initialLocation,
    initialId
}) => {
    // State initialization with Lazy Loading from localStorage or Props
    const [team, setTeam] = useState<(typeof MOCK_PLAYERS_POOL[0] | null)[]>(() => {
        if (initialTeam) return initialTeam;
        try {
            const saved = localStorage.getItem(TEAM_STORAGE_KEY);
            return saved ? JSON.parse(saved) : Array(11).fill(null);
        } catch (e) {
            return Array(11).fill(null);
        }
    });
    
    // UI State
    const [activeSlot, setActiveSlot] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    const [location, setLocation] = useState(() => {
        if (initialLocation) return initialLocation;
        try {
            const saved = localStorage.getItem(LOC_STORAGE_KEY);
            return saved ? JSON.parse(saved) : 'Montréal, QC';
        } catch (e) {
            return 'Montréal, QC';
        }
    });

    const [selectedLeagues, setSelectedLeagues] = useState<string[]>(() => {
        if (initialLeagueIds) return initialLeagueIds;
        try {
            const saved = localStorage.getItem(LEAGUE_STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });
    
    // Modals
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [showLeagueSelector, setShowLeagueSelector] = useState(false);
    
    // Confirmation for Reset
    const [pendingUpdate, setPendingUpdate] = useState<{ type: 'league' | 'location', value: any } | null>(null);

    // Validation Toast State
    const [showValidationToast, setShowValidationToast] = useState(false);
    const [showSaveToast, setShowSaveToast] = useState(false);

    // Submission State
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    // --- PERSISTENCE EFFECTS ---
    useEffect(() => {
        localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(team));
    }, [team]);

    useEffect(() => {
        localStorage.setItem(LOC_STORAGE_KEY, JSON.stringify(location));
    }, [location]);

    useEffect(() => {
        localStorage.setItem(LEAGUE_STORAGE_KEY, JSON.stringify(selectedLeagues));
    }, [selectedLeagues]);


    const handleSlotClick = (index: number) => {
        // Validation: Check if a league is selected
        if (selectedLeagues.length === 0) {
            setShowValidationToast(true);
            // Hide toast automatically after 3 seconds if not interacted with
            setTimeout(() => setShowValidationToast(false), 3000);
            return;
        }

        setActiveSlot(index);
        setSearchQuery('');
        setShowSearchModal(true);
    };

    const handleSelectPlayer = (player: typeof MOCK_PLAYERS_POOL[0]) => {
        if (activeSlot !== null) {
            setTeam(prev => {
                const newTeam = [...prev];
                newTeam[activeSlot] = player;
                return newTeam;
            });
            setShowSearchModal(false);
            setActiveSlot(null);
        }
    };

    const handleRemovePlayer = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        setTeam(prev => {
            const newTeam = [...prev];
            newTeam[index] = null;
            return newTeam;
        });
    };

    const handleConfirmReset = () => {
        if (!pendingUpdate) return;

        if (pendingUpdate.type === 'league') {
            setSelectedLeagues(pendingUpdate.value);
        } else if (pendingUpdate.type === 'location') {
            setLocation(pendingUpdate.value);
        }
        
        // Reset Team
        setTeam(Array(11).fill(null));
        setPendingUpdate(null);
    };

    const handleLeagueApply = (ids: string[]) => {
        const isDifferent = JSON.stringify(ids.sort()) !== JSON.stringify(selectedLeagues.sort());
        const hasPlayers = team.some(p => p !== null);

        if (isDifferent) {
            if (hasPlayers) {
                // Ask for confirmation if team is not empty
                setPendingUpdate({ type: 'league', value: ids });
            } else {
                // Just apply if team is empty
                setSelectedLeagues(ids);
            }
        }
    };

    const handleLocationApply = (loc: string) => {
        const isDifferent = loc !== location;
        const hasPlayers = team.some(p => p !== null);

        if (isDifferent) {
            if (hasPlayers) {
                // Ask for confirmation
                setPendingUpdate({ type: 'location', value: loc });
            } else {
                setLocation(loc);
            }
        }
    };

    const filteredSearchPlayers = useMemo(() => {
        let results = MOCK_PLAYERS_POOL;

        // 1. Filter by Position (Strict)
        if (activeSlot !== null) {
            const requiredRole = FORMATION_COORDS[activeSlot].role;
            results = results.filter(p => p.position === requiredRole);
        }

        // 2. Filter by Search Query
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            results = results.filter(p => 
                p.name.toLowerCase().includes(q) ||
                p.team.toLowerCase().includes(q)
            );
        }
        
        return results;
    }, [searchQuery, activeSlot]);

    const filledCount = team.filter(Boolean).length;
    const progress = (filledCount / 11) * 100;

    // Helper to display friendly name for selected leagues (reused logic)
    const getLeagueDisplay = () => {
        if (selectedLeagues.length === 0) return 'Ligue';
        if (selectedLeagues.length > 1) return `${selectedLeagues.length} Ligues`;
        
        const id = selectedLeagues[0];
        const parts = id.split('_');
        let leagueName = '';
        let age = '';
        let gender = '';

        // Gender detection (usually last part for SQ IDs)
        const lastPart = parts[parts.length - 1];
        if (lastPart === 'm') gender = '(M)';
        else if (lastPart === 'f') gender = '(F)';

        // Age detection
        const agePart = parts.find(p => p.toLowerCase().startsWith('u') && !isNaN(parseInt(p.substring(1))));
        if (agePart) age = agePart.toUpperCase();

        // League Name mapping
        if (id === 'pl') leagueName = 'Premier League';
        else if (id === 'laliga') leagueName = 'La Liga';
        else if (id === 'bundesliga') leagueName = 'Bundesliga';
        else if (id === 'ligue1') leagueName = 'Ligue 1';
        else if (id === 'seriea') leagueName = 'Serie A';
        else if (id === 'mls') leagueName = 'MLS';
        else if (parts.includes('l1qc')) leagueName = 'L1QC';
        else if (parts.includes('l2qc')) leagueName = 'L2QC';
        else if (parts.includes('l3qc')) leagueName = 'L3QC';
        else if (parts.includes('espoirs')) leagueName = 'Espoirs';
        else if (parts.includes('ldp')) leagueName = 'LDP';
        else if (parts.includes('plsjq')) leagueName = 'PLSJQ';
        else if (parts.includes('rseq')) leagueName = 'RSEQ';
        else if (parts.includes('qsl')) leagueName = 'QSL';
        else if (parts.includes('lasm')) leagueName = 'LASM';
        else if (parts.includes('rsa')) leagueName = 'RSA';
        else if (parts.includes('qcsl')) leagueName = 'QCSL';
        else if (id.includes('soccer_quebec')) leagueName = 'Soccer Québec';
        else {
             // Fallback: capitalized ID if not matched (e.g. 'Ligue')
             leagueName = id.charAt(0).toUpperCase() + id.slice(1);
             // Basic cleanup if it looks like an ID
             if (leagueName.includes('_')) leagueName = 'Ligue';
        }

        return `${leagueName} ${age} ${gender}`.replace(/\s+/g, ' ').trim();
    };

    const handleSaveDraft = () => {
        if (onSave) {
            onSave(team, getLeagueDisplay(), "Semaine 24", selectedLeagues, location, initialId);
            setShowSaveToast(true);
            setTimeout(() => setShowSaveToast(false), 2000);
        }
    };

    const handleSubmit = () => {
        setSubmissionStatus('loading');

        // Simulate API Processing Time
        setTimeout(() => {
            setSubmissionStatus('success');

            // Wait for Success Animation to play before navigating
            setTimeout(() => {
                // Clear storage on successful submission
                localStorage.removeItem(TEAM_STORAGE_KEY);
                localStorage.removeItem(LEAGUE_STORAGE_KEY);
                localStorage.removeItem(LOC_STORAGE_KEY);

                if (onSubmit) {
                    onSubmit(team, getLeagueDisplay(), "Semaine 24", selectedLeagues, location, initialId);
                } else {
                    onBack();
                }
                // No need to reset submissionStatus as we navigate away/unmount
            }, 1500); 
        }, 2000);
    };

    return (
        <div className="absolute inset-0 z-[60] bg-[#001025] text-white font-sans flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
            
            {/* Header & Filters Section (Shrink to fit) */}
            <div className="shrink-0 z-20 bg-[#001025]">
                {/* Header */}
                <div className="flex items-center justify-between px-4 pt-12 pb-2">
                    <button 
                        onClick={onBack}
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 text-white hover:bg-white/20 transition-colors"
                    >
                        <Icon name="close" className="text-xl" />
                    </button>
                    <div className="flex flex-col items-center drop-shadow-md">
                        <h1 className="text-lg font-black uppercase tracking-tight">Crée ton équipe</h1>
                        <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Semaine 24</span>
                    </div>
                    {/* View Saved Teams Button */}
                    <button 
                        onClick={onShowSavedTeams}
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 text-white hover:bg-white/20 transition-colors active:scale-95"
                    >
                        <Icon name="history" className="text-xl" />
                    </button>
                </div>

                {/* Filters */}
                <div className="px-4 pb-3 flex justify-center gap-3">
                     <button 
                          onClick={() => setShowLocationModal(true)}
                          className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0F1115] rounded-full border border-white/10 text-xs font-bold text-gray-200 active:scale-95 transition-transform shadow-sm"
                      >
                          <Icon name="location_on" className="text-xs text-blue-400" filled />
                          <span className="truncate max-w-[100px]">{location.split(',')[0]}</span>
                      </button>

                      <button 
                          onClick={() => setShowLeagueSelector(true)}
                          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-xs font-bold active:scale-95 transition-transform shadow-sm ${
                              selectedLeagues.length > 0 
                              ? 'bg-white text-black border-white' 
                              : 'bg-[#0F1115] text-gray-200 border-white/10'
                          } ${showValidationToast && selectedLeagues.length === 0 ? 'animate-[pulse_0.5s_ease-in-out_infinite] ring-2 ring-red-500 border-red-500 text-white' : ''}`}
                      >
                          <span>{getLeagueDisplay()}</span>
                          <Icon name="expand_more" className="text-xs" />
                      </button>
                </div>
            </div>

            {/* PITCH AREA - Flexible Height (Fills available space) */}
            <div className="flex-1 relative w-full bg-[#002855] border-y border-white/10 shadow-2xl overflow-hidden z-10">
                {/* Field Markings */}
                <div className="absolute top-4 bottom-4 left-4 right-4 border-2 border-white/20 rounded-lg"></div>
                <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-white/20 -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-40 h-20 border-b-2 border-x-2 border-white/20 rounded-b-lg"></div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 h-20 border-t-2 border-x-2 border-white/20 rounded-t-lg"></div>

                {/* Slots */}
                {FORMATION_COORDS.map((pos, index) => {
                    const player = team[index];
                    return (
                        <div 
                            key={index}
                            className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 transition-all active:scale-90"
                            style={{ top: pos.top, left: pos.left }}
                            onClick={() => handleSlotClick(index)}
                        >
                            {player ? (
                                // FILLED SLOT
                                <>
                                    <div className="relative w-12 h-12 rounded-full border-2 border-[#10B981] bg-black shadow-lg z-10">
                                        <img src={player.avatar} alt={player.name} className="w-full h-full object-cover rounded-full" />
                                        <button 
                                            onClick={(e) => handleRemovePlayer(e, index)}
                                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border border-black"
                                        >
                                            <Icon name="close" className="text-[10px] text-white font-bold" />
                                        </button>
                                        
                                        {/* CHANGED: Replaced rating (green) with club logo (white bg) */}
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border-2 border-black overflow-hidden p-0.5 shadow-sm">
                                            <img src={player.clubLogo} alt={player.team} className="w-full h-full object-contain" />
                                        </div>
                                    </div>
                                    <div className="mt-1 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-[9px] font-bold text-white truncate max-w-[80px] border border-white/10">
                                        {player.name.split(' ').pop()}
                                    </div>
                                </>
                            ) : (
                                // EMPTY SLOT
                                <>
                                    <div className="w-10 h-10 rounded-full border-2 border-dashed border-white/30 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer group">
                                        <Icon name="add" className="text-white/50 group-hover:text-white transition-colors" />
                                    </div>
                                    <span className="mt-1 text-[9px] font-bold text-white/40 uppercase">{pos.role}</span>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Bottom Action Bar - Compacted */}
            <div className="shrink-0 bg-[#0F1115] border-t border-white/10 z-30 flex flex-col justify-center px-5 py-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Progression</span>
                    <span className="text-xs font-bold text-white">{filledCount} / 11</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full mb-4 overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-green-400 transition-all duration-300 ease-out" 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={handleSaveDraft}
                        className="flex-1 py-3.5 rounded-xl font-bold text-sm bg-[#1C1F26] text-white border border-white/10 hover:bg-white/5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                        <Icon name="save" className="text-lg" />
                        Sauvegarder
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={filledCount < 11}
                        className={`flex-[2] py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-lg active:scale-[0.98] ${
                            filledCount === 11 
                            ? 'bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                            : 'bg-[#1C1F26] text-gray-500 cursor-not-allowed border border-white/5'
                        }`}
                    >
                        Valider
                    </button>
                </div>
            </div>

            {/* FULL SCREEN SUBMISSION OVERLAY */}
            {submissionStatus !== 'idle' && (
                <div className="absolute inset-0 z-[200] bg-[#001025] flex flex-col items-center justify-center animate-in fade-in duration-300">
                    {submissionStatus === 'loading' && (
                        <>
                            <div className="relative mb-6">
                                <div className="w-16 h-16 border-4 border-white/10 rounded-full"></div>
                                <div className="absolute inset-0 w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Icon name="sports_soccer" className="text-xl text-blue-500 animate-pulse" />
                                </div>
                            </div>
                            <h2 className="text-xl font-black text-white uppercase tracking-wide mb-1 animate-pulse">Validation</h2>
                            <p className="text-gray-400 text-xs font-medium">Création de votre carte d'équipe...</p>
                        </>
                    )}
                    
                    {submissionStatus === 'success' && (
                        <div className="flex flex-col items-center animate-in zoom-in duration-500">
                            <div className="relative mb-6">
                                <div className="w-20 h-20 bg-[#10B981] rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.5)] z-10 relative">
                                    <Icon name="check" className="text-4xl text-white font-bold" />
                                </div>
                                <div className="absolute inset-0 bg-[#10B981] rounded-full animate-ping opacity-20"></div>
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Équipe Validée !</h2>
                            <p className="text-gray-400 text-sm font-medium">Prête à être partagée</p>
                        </div>
                    )}
                </div>
            )}

            {/* VALIDATION WARNING TOAST */}
            {showValidationToast && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[150] w-64 bg-[#1C1F26]/95 backdrop-blur-md p-5 rounded-2xl border border-red-500/30 shadow-[0_0_40px_rgba(239,68,68,0.2)] flex flex-col items-center text-center animate-in zoom-in fade-in duration-200">
                    <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-3 border border-red-500/20">
                        <Icon name="priority_high" className="text-2xl text-red-500" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">Filtres requis</h3>
                    <p className="text-xs text-gray-400 leading-relaxed mb-4">
                        Veuillez sélectionner une ligue et une localisation avant de choisir vos joueurs.
                    </p>
                    <button 
                        onClick={() => {
                            setShowValidationToast(false);
                            setShowLeagueSelector(true);
                        }}
                        className="bg-white text-black text-xs font-bold px-6 py-2.5 rounded-full hover:bg-gray-200 transition-colors shadow-lg active:scale-95"
                    >
                        Choisir une ligue
                    </button>
                </div>
            )}

            {/* RESET CONFIRMATION MODAL */}
            {pendingUpdate && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center isolate px-6">
                    <div 
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setPendingUpdate(null)}
                    ></div>
                    <div className="relative w-full max-w-sm bg-[#1C1F26] rounded-2xl p-6 border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
                                <Icon name="warning" className="text-2xl text-red-500" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">
                                Changer de {pendingUpdate.type === 'league' ? 'ligue' : 'localisation'} ?
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed mb-6">
                                Cette action réinitialisera votre équipe actuelle. Tous les joueurs sélectionnés seront retirés.
                            </p>
                            <div className="flex gap-3 w-full">
                                <button 
                                    onClick={() => setPendingUpdate(null)}
                                    className="flex-1 py-3 bg-transparent border border-white/10 text-white font-bold rounded-xl active:scale-95 transition-transform hover:bg-white/5"
                                >
                                    Annuler
                                </button>
                                <button 
                                    onClick={handleConfirmReset}
                                    className="flex-1 py-3 bg-white text-black font-bold rounded-xl active:scale-95 transition-transform hover:bg-gray-200"
                                >
                                    Continuer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SAVE SUCCESS TOAST */}
            {showSaveToast && (
                <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-[150] bg-[#1C1F26] border border-white/10 rounded-full px-5 py-3 shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Icon name="check" className="text-black text-xs font-bold" />
                    </div>
                    <span className="text-sm font-bold text-white">Brouillon sauvegardé</span>
                </div>
            )}

            {/* Player Search Overlay */}
            {showSearchModal && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center isolate animate-in fade-in duration-200">
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowSearchModal(false)}
                    ></div>
                    <div className="relative w-full h-[85vh] bg-[#151518] rounded-t-[24px] overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300">
                        {/* Handle */}
                        <div className="flex justify-center pt-3 pb-2" onClick={() => setShowSearchModal(false)}>
                            <div className="w-10 h-1 bg-white/20 rounded-full"></div>
                        </div>

                        {/* Search Header */}
                        <div className="px-5 pb-4 border-b border-white/5">
                            <h3 className="text-lg font-bold text-white text-center mb-4">
                                Sélectionner un {FORMATION_COORDS[activeSlot!].role}
                            </h3>
                            <div className="relative">
                                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input 
                                    type="text" 
                                    placeholder="Rechercher un joueur..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-[#1C1F26] text-white pl-10 pr-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:border-white/30 text-sm"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto px-2">
                            {filteredSearchPlayers.length > 0 ? (
                                filteredSearchPlayers.map((player) => (
                                    <div 
                                        key={player.id} 
                                        onClick={() => handleSelectPlayer(player)}
                                        className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img src={player.avatar} alt={player.name} className="w-10 h-10 rounded-full object-cover bg-gray-800" />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white">{player.name}</span>
                                                <span className="text-xs text-gray-400">{player.position} • {player.team}</span>
                                            </div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-gray-500 group-hover:text-white group-hover:bg-blue-500 group-hover:border-transparent transition-all">
                                            <Icon name="add" className="text-lg" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                                    <Icon name="person_off" className="text-3xl mb-2 opacity-50" />
                                    <p className="text-sm">Aucun joueur trouvé pour ce poste.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showLocationModal && (
                <LocationModal 
                    currentLocation={location}
                    onClose={() => setShowLocationModal(false)}
                    onSelect={handleLocationApply}
                />
            )}

            {showLeagueSelector && (
                <LeagueSelectorModal 
                    initialSelection={selectedLeagues}
                    onClose={() => setShowLeagueSelector(false)}
                    onApply={handleLeagueApply}
                    currentLocation={location}
                />
            )}
        </div>
    );
};
