
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';

interface League {
    id: string;
    name: string;
    logo: string;
    gender: 'M' | 'F';
    keywords: string[]; // Mots-clés pour la localisation (Pays, Villes, Régions)
    isGlobal?: boolean; // Pour afficher par défaut si aucune correspondance locale
}

const LEAGUES: League[] = [
    // --- MEN (Global / Major) ---
    { 
        id: 'bundesliga', 
        name: 'Bundesliga', 
        gender: 'M', 
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Bundesliga_logo_%282017%29.svg/1200px-Bundesliga_logo_%282017%29.svg.png',
        keywords: ['Germany', 'Allemagne', 'DE', 'Munich', 'Berlin', 'Dortmund', 'Hamburg'],
        isGlobal: true 
    },
    { 
        id: 'pl', 
        name: 'Premier League', 
        gender: 'M', 
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Premier_League_Logo.svg/1200px-Premier_League_Logo.svg.png',
        keywords: ['UK', 'United Kingdom', 'England', 'Angleterre', 'London', 'Manchester', 'Liverpool', 'GB'],
        isGlobal: true 
    },
    { 
        id: 'laliga', 
        name: 'La Liga', 
        gender: 'M', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/La_Liga_Logo_%282023%29.svg/1200px-La_Liga_Logo_%282023%29.svg.png',
        keywords: ['Spain', 'Espagne', 'ES', 'Madrid', 'Barcelona', 'Valencia', 'Seville'],
        isGlobal: true 
    },
    { 
        id: 'ligue1', 
        name: 'Ligue 1', 
        gender: 'M', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Ligue_1_Uber_Eats_logo.svg/1200px-Ligue_1_Uber_Eats_logo.svg.png',
        keywords: ['France', 'FR', 'Paris', 'Lyon', 'Marseille', 'Lille', 'Monaco', 'Bordeaux'],
        isGlobal: true 
    },
    { 
        id: 'seriea', 
        name: 'Serie A', 
        gender: 'M', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Serie_A_logo_2019.svg/1200px-Serie_A_logo_2019.svg.png',
        keywords: ['Italy', 'Italie', 'IT', 'Rome', 'Milan', 'Turin', 'Naples'],
        isGlobal: true 
    },
    { 
        id: 'mls', 
        name: 'MLS', 
        gender: 'M', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/MLS_crest_logo_RGB_gradient.svg/1200px-MLS_crest_logo_RGB_gradient.svg.png',
        keywords: ['USA', 'United States', 'Etats-Unis', 'Canada', 'CA', 'QC', 'ON', 'BC', 'Montreal', 'Montréal', 'Toronto', 'Vancouver', 'New York', 'Los Angeles', 'Miami', 'Chicago'],
        isGlobal: false
    },

    // --- QUEBEC SPECIFIC (MEN) ---
    { 
        id: 'soccer_quebec_m', 
        name: 'Soccer Québec', 
        gender: 'M', 
        logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/0/03/Soccer_Qu%C3%A9bec_logo.svg/1200px-Soccer_Qu%C3%A9bec_logo.svg.png',
        keywords: ['Canada', 'QC', 'Quebec', 'Québec', 'Montreal', 'Montréal', 'Laval'],
        isGlobal: false
    },
    { 
        id: 'rseq_m', 
        name: 'RSEQ', 
        gender: 'M', 
        logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/3/33/RSEQ_logo.svg/1200px-RSEQ_logo.svg.png',
        keywords: ['Canada', 'QC', 'Quebec', 'Québec', 'School', 'Universitaire', 'Collegial'],
        isGlobal: false
    },
    { 
        id: 'l1qc_m', 
        name: 'L1QC', 
        gender: 'M', 
        logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/5/52/Ligue1_Qu%C3%A9bec_logo.svg/1200px-Ligue1_Qu%C3%A9bec_logo.svg.png',
        keywords: ['Canada', 'QC', 'Quebec', 'Québec', 'Montreal', 'Montréal', 'Laval', 'Longueuil', 'Gatineau'],
        isGlobal: false
    },
    { 
        id: 'qsl_m', 
        name: 'QSL', 
        gender: 'M', 
        logo: 'https://ui-avatars.com/api/?name=QSL&background=000000&color=fff&size=128&font-size=0.4',
        keywords: ['Canada', 'QC', 'Quebec', 'Québec'],
        isGlobal: false
    },
    { 
        id: 'lasm_m', 
        name: 'LASM', 
        gender: 'M', 
        logo: 'https://ui-avatars.com/api/?name=LASM&background=ef4444&color=fff&size=128&font-size=0.4',
        keywords: ['Canada', 'QC', 'Quebec', 'Québec', 'Montreal', 'Montréal'],
        isGlobal: false
    },
    { 
        id: 'rsa_m', 
        name: 'RSA', 
        gender: 'M', 
        logo: 'https://ui-avatars.com/api/?name=RSA&background=2563eb&color=fff&size=128&font-size=0.4',
        keywords: ['Canada', 'QC', 'Quebec', 'Québec', 'Rive-Sud'],
        isGlobal: false
    },
    { 
        id: 'qcsl_m', 
        name: 'QCSL', 
        gender: 'M', 
        logo: 'https://ui-avatars.com/api/?name=QCSL&background=10b981&color=fff&size=128&font-size=0.4',
        keywords: ['Canada', 'QC', 'Quebec', 'Québec'],
        isGlobal: false
    },
    { 
        id: 'bundesliga_2', 
        name: '2. Bundesliga', 
        gender: 'M', 
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9f/2._Bundesliga_logo.svg/1200px-2._Bundesliga_logo.svg.png',
        keywords: ['Germany', 'Allemagne', 'DE'],
        isGlobal: false
    },
    
    // --- WOMEN (Global / Major) ---
    { 
        id: 'd1arkema', 
        name: 'D1 Arkema', 
        gender: 'F', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/D1_Arkema_logo.svg/1200px-D1_Arkema_logo.svg.png',
        keywords: ['France', 'FR', 'Paris', 'Lyon'],
        isGlobal: true
    },
    { 
        id: 'wsl', 
        name: 'WSL', 
        gender: 'F', 
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/93/Barclays_Women%27s_Super_League_logo.svg/1200px-Barclays_Women%27s_Super_League_logo.svg.png',
        keywords: ['UK', 'England', 'London'],
        isGlobal: true
    },
    { 
        id: 'nwsl', 
        name: 'NWSL', 
        gender: 'F', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/NWSL_Logo_2023.svg/1200px-NWSL_Logo_2023.svg.png',
        keywords: ['USA', 'US', 'Canada', 'CA'],
        isGlobal: true
    },
    { 
        id: 'ligaf', 
        name: 'Liga F', 
        gender: 'F', 
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Liga_F_corporate_logo.svg/1200px-Liga_F_corporate_logo.svg.png',
        keywords: ['Spain', 'Espagne', 'ES'],
        isGlobal: true
    },
    { 
        id: 'frauen_bundesliga', 
        name: 'Frauen-Bundesliga', 
        gender: 'F', 
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Bundesliga_logo_%282017%29.svg/1200px-Bundesliga_logo_%282017%29.svg.png',
        keywords: ['Germany', 'Allemagne', 'DE'],
        isGlobal: false
    },
    { 
        id: 'uwcl', 
        name: 'UWCL', 
        gender: 'F', 
        logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/7/73/Ligue_des_champions_f%C3%A9minine_de_l%27UEFA_logo_%282021%29.svg/1200px-Ligue_des_champions_f%C3%A9minine_de_l%27UEFA_logo_%282021%29.svg.png',
        keywords: ['Europe'],
        isGlobal: true
    },

    // --- QUEBEC SPECIFIC (WOMEN) ---
    { 
        id: 'soccer_quebec_f', 
        name: 'Soccer Québec', 
        gender: 'F', 
        logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/0/03/Soccer_Qu%C3%A9bec_logo.svg/1200px-Soccer_Qu%C3%A9bec_logo.svg.png',
        keywords: ['Canada', 'QC', 'Quebec', 'Québec', 'Montreal', 'Montréal', 'Laval'],
        isGlobal: false
    },
    { 
        id: 'rseq_f', 
        name: 'RSEQ', 
        gender: 'F', 
        logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/3/33/RSEQ_logo.svg/1200px-RSEQ_logo.svg.png',
        keywords: ['Canada', 'QC', 'Quebec', 'Québec', 'School', 'Universitaire', 'Collegial'],
        isGlobal: false
    },
    { 
        id: 'l1qc_f', 
        name: 'L1QC', 
        gender: 'F', 
        logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/5/52/Ligue1_Qu%C3%A9bec_logo.svg/1200px-Ligue1_Qu%C3%A9bec_logo.svg.png',
        keywords: ['Canada', 'QC', 'Quebec', 'Québec', 'Montreal', 'Montréal', 'Laval'],
        isGlobal: false
    },
    { 
        id: 'qsl_f', 
        name: 'QSL', 
        gender: 'F', 
        logo: 'https://ui-avatars.com/api/?name=QSL&background=000000&color=fff&size=128&font-size=0.4',
        keywords: ['Canada', 'QC', 'Quebec', 'Québec'],
        isGlobal: false
    },
    { 
        id: 'lasm_f', 
        name: 'LASM', 
        gender: 'F', 
        logo: 'https://ui-avatars.com/api/?name=LASM&background=ef4444&color=fff&size=128&font-size=0.4',
        keywords: ['Canada', 'QC', 'Quebec', 'Québec', 'Montreal', 'Montréal'],
        isGlobal: false
    },
    { 
        id: 'rsa_f', 
        name: 'RSA', 
        gender: 'F', 
        logo: 'https://ui-avatars.com/api/?name=RSA&background=2563eb&color=fff&size=128&font-size=0.4',
        keywords: ['Canada', 'QC', 'Quebec', 'Québec', 'Rive-Sud'],
        isGlobal: false
    },
    { 
        id: 'qcsl_f', 
        name: 'QCSL', 
        gender: 'F', 
        logo: 'https://ui-avatars.com/api/?name=QCSL&background=10b981&color=fff&size=128&font-size=0.4',
        keywords: ['Canada', 'QC', 'Quebec', 'Québec'],
        isGlobal: false
    },
];

const SQ_SUB_LEAGUES = [
    { id: 'provinciales', name: 'Provinciales' },
    { id: 'interregionales', name: 'Interrégionales' },
    { id: 'regionales', name: 'Régionales' }
];

const SQ_PROVINCIAL_LEAGUES = [
    { id: 'l1qc', name: 'Ligue 1 Québec (L1QC)' },
    { id: 'l2qc', name: 'Ligue 2 Québec (L2QC)' },
    { id: 'l3qc', name: 'Ligue 3 Québec (L3QC)' },
    { id: 'espoirs', name: 'Ligue Espoirs' },
    { id: 'ldp', name: 'Ligue de développement provinciale (LDP)' },
    { id: 'plsjq', name: 'Première ligue de soccer juvénile du Québec (PLSJQ)' }
];

const AGE_GROUPS_LDP = ['U14', 'U15', 'U16', 'U17'];
const AGE_GROUPS_PLSJQ = ['U15', 'U16', 'U17'];

interface LeagueSelectorModalProps {
    onClose: () => void;
    onApply: (selectedIds: string[]) => void;
    initialSelection?: string[];
    currentLocation?: string;
}

export const LeagueSelectorModal: React.FC<LeagueSelectorModalProps> = ({ onClose, onApply, initialSelection = [], currentLocation = '' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>(initialSelection);
    const [selectedGender, setSelectedGender] = useState<'M' | 'F'>('M');
    
    // Drag to dismiss state
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const dragStartY = useRef(0);
    
    // 'main' for main list
    // 'soccer_quebec' for level selection (Provincial, Inter, Regional)
    // 'sq_provinciales' for the specific provincial leagues
    // 'sq_provinciales_age' for age selection (LDP, PLSJQ)
    const [currentView, setCurrentView] = useState<'main' | 'soccer_quebec' | 'sq_provinciales' | 'sq_provinciales_age'>('main');
    
    // Store which provincial league was clicked to know which ages to show
    const [activeProvincialLeague, setActiveProvincialLeague] = useState<string | null>(null);

    useEffect(() => {
        setIsVisible(true);
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setDragOffset(0);
        setTimeout(onClose, 300);
    };

    // --- Drag Handlers ---
    const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
        setIsDragging(true);
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        dragStartY.current = clientY;
    };

    const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
        if (!isDragging) return;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const delta = clientY - dragStartY.current;
        
        // Only allow dragging downwards
        if (delta > 0) {
            setDragOffset(delta);
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        // If dragged more than 100px, dismiss
        if (dragOffset > 100) {
            handleClose();
        } else {
            // Snap back
            setDragOffset(0);
        }
    };

    const handleBack = () => {
        if (currentView === 'sq_provinciales_age') {
            setCurrentView('sq_provinciales');
            setActiveProvincialLeague(null);
        } else if (currentView === 'sq_provinciales') {
            setCurrentView('soccer_quebec');
        } else if (currentView === 'soccer_quebec') {
            setCurrentView('main');
        }
    };

    const toggleSelection = (id: string) => {
        // Intercept click on Soccer Québec to show sub-menu
        if (id === 'soccer_quebec_m' || id === 'soccer_quebec_f') {
            setCurrentView('soccer_quebec');
            return;
        }

        // Mode sélection unique : on remplace la sélection par le nouvel ID
        setSelectedIds(prev => 
            prev.includes(id) 
                ? [] 
                : [id]
        );
    };

    const handleSubLevelClick = (subId: string) => {
        if (subId === 'provinciales') {
            setCurrentView('sq_provinciales');
        } else {
            // Mode sélection unique for Inter/Regional
            const fullId = `sq_${subId}_${selectedGender.toLowerCase()}`;
            setSelectedIds(prev => 
                prev.includes(fullId) 
                    ? [] 
                    : [fullId]
            );
        }
    };

    const handleProvincialClick = (provId: string) => {
        // If LDP or PLSJQ, go to Age Selection
        if (provId === 'ldp' || provId === 'plsjq') {
            setActiveProvincialLeague(provId);
            setCurrentView('sq_provinciales_age');
        } else {
            // Direct selection for L1QC, L2QC, L3QC, Espoirs
            const fullId = `sq_prov_${provId}_${selectedGender.toLowerCase()}`;
            setSelectedIds(prev => 
                prev.includes(fullId) 
                    ? [] 
                    : [fullId]
            );
        }
    };

    const toggleAgeSelection = (age: string) => {
        if (!activeProvincialLeague) return;
        
        const fullId = `sq_prov_${activeProvincialLeague}_${age}_${selectedGender.toLowerCase()}`;
        setSelectedIds(prev => 
            prev.includes(fullId) 
                ? [] 
                : [fullId]
        );
    };

    const handleClear = () => {
        setSelectedIds([]);
    };

    const handleApply = () => {
        onApply(selectedIds);
        handleClose();
    };

    // Filter Logic based on Location + Gender + Search
    const getFilteredLeagues = () => {
        // 1. Filter by Gender
        let list = LEAGUES.filter(l => l.gender === selectedGender);

        // 2. If Search Query exists, prioritize name matching (Global Search)
        if (searchQuery.trim()) {
            return list.filter(league => 
                league.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // 3. If no search, Filter/Sort by Location
        if (currentLocation) {
            const lowerLoc = currentLocation.toLowerCase();
            const isQuebec = lowerLoc.includes('qc') || lowerLoc.includes('quebec') || lowerLoc.includes('québec') || lowerLoc.includes('montreal') || lowerLoc.includes('montréal') || lowerLoc.includes('laval');

            if (isQuebec) {
                // Strict filtering for Quebec as requested
                const quebecLeagues = ['Soccer Québec', 'RSEQ', 'QSL', 'LASM', 'RSA', 'QCSL'];
                return list.filter(l => quebecLeagues.includes(l.name));
            }

            // Normal location logic for other places
            const locParts = lowerLoc.split(/[,\s]+/).filter(Boolean); 
            
            const localLeagues = list.filter(league => {
                return league.keywords.some(keyword => 
                    locParts.some(part => keyword.toLowerCase() === part) ||
                    locParts.some(part => part.includes(keyword.toLowerCase()))
                );
            });

            if (localLeagues.length > 0) {
                const globalLeagues = list.filter(l => l.isGlobal && !localLeagues.find(loc => loc.id === l.id));
                return [...localLeagues, ...globalLeagues]; 
            }
        }

        // Default: Show Global/Major leagues
        return list.filter(l => l.isGlobal);
    };

    const filteredLeagues = getFilteredLeagues();

    const getHeaderTitle = () => {
        if (currentView === 'sq_provinciales_age') {
            if (activeProvincialLeague === 'ldp') return 'LDP - Catégorie';
            if (activeProvincialLeague === 'plsjq') return 'PLSJQ - Catégorie';
            return 'Catégorie';
        }
        if (currentView === 'sq_provinciales') return 'Ligues Provinciales';
        if (currentView === 'soccer_quebec') return 'Soccer Québec';
        return 'Sélectionner une ligue';
    };

    const getAgeGroups = () => {
        if (activeProvincialLeague === 'ldp') return AGE_GROUPS_LDP;
        if (activeProvincialLeague === 'plsjq') return AGE_GROUPS_PLSJQ;
        return [];
    };

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-end justify-center isolate"
            onMouseMove={isDragging ? handleTouchMove : undefined}
            onMouseUp={isDragging ? handleTouchEnd : undefined}
            onMouseLeave={isDragging ? handleTouchEnd : undefined}
        >
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
                style={{ opacity: isDragging ? Math.max(0, 1 - (dragOffset / 400)) : (isVisible ? 1 : 0) }}
            ></div>

            {/* Modal Content */}
            <div 
                className={`relative w-full max-w-md bg-[#151518] rounded-t-[20px] shadow-2xl flex flex-col h-[85vh] border-t border-white/10`}
                style={{ 
                    transform: isDragging || dragOffset > 0 ? `translateY(${dragOffset}px)` : (isVisible ? 'translateY(0)' : 'translateY(100%)'),
                    transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)' 
                }}
            >
                {/* Handle - Draggable Area */}
                <div 
                    className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing touch-none" 
                    onClick={handleClose}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleTouchStart}
                >
                    <div className="w-10 h-1 bg-white/20 rounded-full"></div>
                </div>

                {/* Header */}
                <div className="px-5 pb-2">
                    <div className="relative flex items-center justify-center mb-4">
                        {currentView !== 'main' && (
                            <button 
                                onClick={handleBack}
                                className="absolute left-0 p-1 -ml-2 text-gray-400 hover:text-white"
                            >
                                <Icon name="arrow_back" className="text-xl" />
                            </button>
                        )}
                        <h2 className="text-lg font-bold text-white text-center">
                            {getHeaderTitle()}
                        </h2>
                    </div>
                    
                    {/* Location Badge (Visual Feedback) - Only show in Main View */}
                    {currentView === 'main' && currentLocation && !searchQuery && (
                        <div className="flex justify-center mb-4">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                                <Icon name="location_on" className="text-xs text-blue-400" filled />
                                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wide">
                                    {currentLocation}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Gender Toggle - Only show in Main View */}
                    {currentView === 'main' && (
                        <div className="flex p-1 bg-[#1C1F26] rounded-xl mb-4 border border-white/10">
                            <button
                                onClick={() => setSelectedGender('M')}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                                    selectedGender === 'M' 
                                    ? 'bg-[#2C2C2E] text-white shadow-md' 
                                    : 'text-gray-500 hover:text-gray-300'
                                }`}
                            >
                                Hommes
                            </button>
                            <button
                                onClick={() => setSelectedGender('F')}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                                    selectedGender === 'F' 
                                    ? 'bg-[#2C2C2E] text-white shadow-md' 
                                    : 'text-gray-500 hover:text-gray-300'
                                }`}
                            >
                                Femmes
                            </button>
                        </div>
                    )}

                    {/* Search Bar - Only show in Main View */}
                    {currentView === 'main' && (
                        <div className="relative mb-2">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <Icon name="search" className="text-xl" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="Rechercher une autre ligue"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#242426] text-white text-[15px] placeholder-gray-500 py-3 pl-10 pr-4 rounded-xl border border-white/5 focus:outline-none focus:border-white/20 transition-colors"
                                autoFocus
                            />
                        </div>
                    )}
                </div>

                {/* List Content */}
                <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-2">
                    {currentView === 'main' && (
                        // MAIN LIST VIEW
                        filteredLeagues.length > 0 ? (
                            filteredLeagues.map(league => {
                                const isSelected = selectedIds.includes(league.id);
                                const isFolder = league.id === 'soccer_quebec_m' || league.id === 'soccer_quebec_f';
                                
                                return (
                                    <div 
                                        key={league.id}
                                        onClick={() => toggleSelection(league.id)}
                                        className={`flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer ${
                                            isSelected 
                                            ? 'bg-white/10 border-white/20' 
                                            : 'bg-transparent border-white/5 hover:bg-white/5'
                                        }`}
                                    >
                                        <div className="w-8 h-8 bg-white rounded-md p-1 flex items-center justify-center shrink-0 overflow-hidden">
                                            <img src={league.logo} alt={league.name} className="w-full h-full object-contain" />
                                        </div>
                                        <span className={`text-[15px] font-bold flex-1 ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                                            {league.name}
                                        </span>
                                        {isFolder ? (
                                            <div className="w-6 h-6 flex items-center justify-center shrink-0">
                                                <Icon name="chevron_right" className="text-gray-500 text-xl" />
                                            </div>
                                        ) : (
                                            isSelected && (
                                                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shrink-0">
                                                    <Icon name="check" className="text-black text-sm font-bold" />
                                                </div>
                                            )
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-10 text-gray-500 text-sm">
                                Aucune ligue trouvée pour cette sélection.
                            </div>
                        )
                    )}

                    {currentView === 'soccer_quebec' && (
                        // SOCCER QUEBEC SUB-MENU (Level Selection)
                        <div className="space-y-2 animate-in slide-in-from-right duration-300">
                            {SQ_SUB_LEAGUES.map(subItem => {
                                const isFolder = subItem.id === 'provinciales';
                                const fullId = `sq_${subItem.id}_${selectedGender.toLowerCase()}`;
                                const isSelected = !isFolder && selectedIds.includes(fullId);
                                
                                return (
                                    <div 
                                        key={subItem.id}
                                        onClick={() => handleSubLevelClick(subItem.id)}
                                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                                            isSelected 
                                            ? 'bg-white/10 border-white/20' 
                                            : 'bg-transparent border-white/5 hover:bg-white/5'
                                        }`}
                                    >
                                        <span className={`text-[15px] font-bold flex-1 ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                                            {subItem.name}
                                        </span>
                                        {isFolder ? (
                                            <div className="w-6 h-6 flex items-center justify-center shrink-0">
                                                <Icon name="chevron_right" className="text-gray-500 text-xl" />
                                            </div>
                                        ) : (
                                            isSelected && (
                                                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shrink-0">
                                                    <Icon name="check" className="text-black text-sm font-bold" />
                                                </div>
                                            )
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {currentView === 'sq_provinciales' && (
                        // PROVINCIAL LEAGUES SUB-MENU
                        <div className="space-y-2 animate-in slide-in-from-right duration-300">
                            {SQ_PROVINCIAL_LEAGUES.map(provItem => {
                                const fullId = `sq_prov_${provItem.id}_${selectedGender.toLowerCase()}`;
                                const isSelected = selectedIds.includes(fullId);
                                const isFolder = provItem.id === 'ldp' || provItem.id === 'plsjq';
                                
                                return (
                                    <div 
                                        key={provItem.id}
                                        onClick={() => handleProvincialClick(provItem.id)}
                                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                                            isSelected 
                                            ? 'bg-white/10 border-white/20' 
                                            : 'bg-transparent border-white/5 hover:bg-white/5'
                                        }`}
                                    >
                                        <span className={`text-[15px] font-bold flex-1 ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                                            {provItem.name}
                                        </span>
                                        {isFolder ? (
                                            <div className="w-6 h-6 flex items-center justify-center shrink-0">
                                                <Icon name="chevron_right" className="text-gray-500 text-xl" />
                                            </div>
                                        ) : (
                                            isSelected && (
                                                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shrink-0">
                                                    <Icon name="check" className="text-black text-sm font-bold" />
                                                </div>
                                            )
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {currentView === 'sq_provinciales_age' && (
                        // PROVINCIAL LEAGUES AGE SUB-MENU (LDP/PLSJQ)
                        <div className="space-y-2 animate-in slide-in-from-right duration-300">
                            {getAgeGroups().map(age => {
                                const fullId = `sq_prov_${activeProvincialLeague}_${age}_${selectedGender.toLowerCase()}`;
                                const isSelected = selectedIds.includes(fullId);
                                
                                return (
                                    <div 
                                        key={age}
                                        onClick={() => toggleAgeSelection(age)}
                                        className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                                            isSelected 
                                            ? 'bg-white/10 border-white/20' 
                                            : 'bg-transparent border-white/5 hover:bg-white/5'
                                        }`}
                                    >
                                        <span className={`text-[15px] font-bold flex-1 ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                                            {age}
                                        </span>
                                        {isSelected && (
                                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shrink-0">
                                                <Icon name="check" className="text-black text-sm font-bold" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="p-5 border-t border-white/10 bg-[#151518] pb-[max(2rem,env(safe-area-inset-bottom))]">
                    <div className="flex gap-3">
                        <button 
                            onClick={handleClear}
                            className="flex-1 bg-[#2C2C2E] text-white font-bold py-2.5 rounded-full hover:bg-[#3A3A3C] transition-colors active:scale-95 text-[13px]"
                        >
                            Tout effacer
                        </button>
                        <button 
                            onClick={handleApply}
                            className="flex-1 bg-white text-black font-bold py-2.5 rounded-full hover:bg-gray-200 transition-colors active:scale-95 text-[13px]"
                        >
                            Afficher les résultats
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
