
import React, { useState, useMemo } from 'react';
import { Icon } from './Icon';
import { LocationModal } from './LocationModal';
import { LeagueSelectorModal } from './LeagueSelectorModal';

// Reusing the chart component
const BigChart = ({ data }: { data: number[] }) => {
    const max = 100;
    const min = 0;
    const width = 300;
    const height = 100;
    
    if (data.length < 2) return null;

    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((val - min) / (max - min)) * height;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="w-full h-24 relative mt-4">
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={`M0,${height} ${points} ${width},${height}`} fill="url(#chartGradient)" />
                <polyline points={points} fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                {data.map((val, i) => {
                    const x = (i / (data.length - 1)) * width;
                    const y = height - ((val - min) / (max - min)) * height;
                    return (
                        <circle key={i} cx={x} cy={y} r="4" fill="#1C1F26" stroke="#10B981" strokeWidth="2" />
                    );
                })}
            </svg>
        </div>
    );
};

// Map Leagues to Locations for Mock Data
const LEAGUE_LOCATIONS: Record<string, string[]> = {
    "Premier League": ["London, UK", "Manchester, UK", "Liverpool, UK"],
    "La Liga": ["Madrid, Spain", "Barcelona, Spain"],
    "Ligue 1": ["Paris, France", "Lyon, France", "Marseille, France"],
    "Bundesliga": ["Munich, Germany", "Berlin, Germany"],
    "Serie A": ["Milan, Italy", "Rome, Italy"],
    "L1QC": ["Montréal, QC", "Laval, QC", "Longueuil, QC", "Québec, QC"],
    "MLS": ["Montréal, QC", "Toronto, ON", "New York, USA", "Los Angeles, USA"],
    "Brasileirão": ["Rio de Janeiro", "São Paulo"],
    "Eredivisie": ["Amsterdam"],
    "Liga Portugal": ["Lisbon", "Porto"],
    "LDP": ["Montréal, QC", "Laval, QC", "Brossard, QC", "Terrebonne, QC"],
    "PLSJQ": ["Québec, QC", "Sherbrooke, QC", "Gatineau, QC", "Lévis, QC"]
};

// Generate Mock Players (50 per league)
const GENERATE_PLAYERS = () => {
    const baseNames = [
        "Lamine Yamal", "Warren Zaïre-Emery", "Endrick Felipe", "Kobbie Mainoo", "Ismaël Koné", "Jonathan David", "Guillaume Restes", 
        "Leny Yoro", "Bradley Barcola", "Arda Güler", "Alejandro Garnacho", "Rico Lewis", "Evan Ferguson", "Mathys Tel", 
        "Vitor Roque", "Savio", "Jorrel Hato", "Arthur Vermeeren", "Pau Cubarsí", "Claudio Echeverri",
        "Estevao Willian", "Franco Mastantuono", "Kendry Páez", "Lucas Beraldo", "Gabriel Moscardo",
        "Desire Doué", "Eliesse Ben Seghir", "George Ilenikhena", "Guilherme", "Luis Guilherme",
        "Lorran", "Archie Gray", "Lewis Miley", "Ethan Nwaneri", "Francesco Camarda",
        "Luka Vuskovic", "Assan Ouedraogo", "Simone Pafundi", "Kenan Yildiz", "Can Uzun",
        "Semih Kılıçsoy", "Roony Bardghji", "Antonio Nusa", "Oscar Gloukh", "Bilal El Khannouss",
        "El Chadaille Bitshiabu", "Saël Kumbedi", "Christian Mawissa", "Jeanuël Belocian", "Ayyoub Bouaddi"
    ];

    const positions = ["BU", "AG", "AD", "MOC", "MC", "MDC", "DG", "DD", "DC", "G"];
    // Added LDP and PLSJQ to generation list
    const leagues = ["Premier League", "La Liga", "Ligue 1", "Bundesliga", "Serie A", "L1QC", "MLS", "Brasileirão", "Eredivisie", "Liga Portugal", "LDP", "PLSJQ"];
    
    let allPlayers: any[] = [];
    let globalIdCounter = 0;

    // Generate 50 players for EACH league
    leagues.forEach((league) => {
        const leagueLocations = LEAGUE_LOCATIONS[league] || ["Montréal, QC"];
        
        for (let i = 0; i < 50; i++) {
            const nameBase = baseNames[i % baseNames.length];
            const fullName = i >= baseNames.length ? `${nameBase} ${i}` : nameBase;
            
            const rating = (Math.random() * (9.5 - 7.0) + 7.0).toFixed(1);
            const growth = (Math.random() * 2.5).toFixed(1);
            const location = leagueLocations[i % leagueLocations.length];
            const position = positions[i % positions.length];
            
            // Age generation: weighted to produce some U15-U17 for testing LDP/PLSJQ
            // For LDP/PLSJQ, we favor younger ages
            let age;
            if (league === 'LDP' || league === 'PLSJQ') {
                age = Math.floor(Math.random() * (19 - 14) + 14).toString(); // 14-18
            } else {
                age = Math.floor(Math.random() * (23 - 16) + 16).toString(); // 16-22
            }

            allPlayers.push({
                id: `p-${globalIdCounter++}`,
                name: fullName.split(' ').pop() || fullName,
                fullName: fullName,
                position: position,
                age: age,
                height: `1.${Math.floor(Math.random() * (95 - 70) + 70)}m`,
                weight: `${Math.floor(Math.random() * (85 - 60) + 60)}kg`,
                team: `Club ${String.fromCharCode(65 + (i % 26))}${i}`,
                league: league,
                location: location,
                gender: '(M)', // Default for now
                avatar: `https://i.pravatar.cc/150?u=${fullName.replace(' ', '')}${league}${i}`,
                rating: rating,
                growth: growth,
                chartData: Array.from({length: 7}, () => Math.floor(Math.random() * 60 + 30)).sort((a, b) => a - b),
            });
        }
    });
    
    return allPlayers;
};

const ALL_PLAYERS = GENERATE_PLAYERS();
const POSITIONS = ["Tout", "G", "DC", "DD", "DG", "MDC", "MC", "MOC", "AD", "AG", "BU"];

interface TrendingPlayersListPageProps {
    onBack: () => void;
}

export const TrendingPlayersListPage: React.FC<TrendingPlayersListPageProps> = ({ onBack }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [location, setLocation] = useState('Montréal, QC'); 
    const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
    const [selectedPosition, setSelectedPosition] = useState('Tout');
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [showLeagueSelector, setShowLeagueSelector] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);

    const filteredPlayers = useMemo(() => {
        const filtered = ALL_PLAYERS.filter(p => {
            // 1. Filter by Search (Name or Team)
            const matchesSearch = p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  p.team.toLowerCase().includes(searchQuery.toLowerCase());
            
            // 2. Filter by League (Advanced matching)
            let matchesLeague = true;
            if (selectedLeagues.length > 0) {
                matchesLeague = selectedLeagues.some(id => {
                    const idLower = id.toLowerCase();
                    
                    // Simple League Checks
                    if (id === 'pl' && p.league === 'Premier League') return true;
                    if (id === 'laliga' && p.league === 'La Liga') return true;
                    if (id === 'ligue1' && p.league === 'Ligue 1') return true;
                    if (id === 'bundesliga' && p.league === 'Bundesliga') return true;
                    if (id === 'seriea' && p.league === 'Serie A') return true;
                    if (id === 'mls' && p.league === 'MLS') return true;

                    // Complex ID Parsing (e.g., sq_prov_ldp_U17_m)
                    if (idLower.startsWith('sq_')) {
                        let leagueMatch = false;
                        if (idLower.includes('l1qc') && p.league === 'L1QC') leagueMatch = true;
                        else if (idLower.includes('ldp') && p.league === 'LDP') leagueMatch = true;
                        else if (idLower.includes('plsjq') && p.league === 'PLSJQ') leagueMatch = true;
                        
                        if (!leagueMatch) return false;

                        // Check Age Category (e.g. U17)
                        // Regex looks for _u followed by digits surrounded by underscores or end of string
                        const ageMatch = idLower.match(/_u(\d+)(_|$)/); 
                        if (ageMatch) {
                            const targetAge = parseInt(ageMatch[1]);
                            // Strict age match for "Category" view
                            if (parseInt(p.age) !== targetAge) return false;
                        }

                        // Check Gender (last character usually)
                        const genderChar = idLower.split('_').pop();
                        if (genderChar === 'm' && p.gender !== '(M)') return false;
                        if (genderChar === 'f' && p.gender !== '(F)') return false;

                        return true;
                    }
                    
                    return false;
                });
            }

            // 3. Filter by Position
            const matchesPosition = selectedPosition === 'Tout' || p.position === selectedPosition;

            // 4. Filter by Location
            // Logic: If location is set, check if player location contains the city name
            let matchesLocation = true;
            if (location && location !== 'Position Actuelle') { 
                const cityTarget = location.split(',')[0].trim().toLowerCase(); 
                const playerCity = p.location.split(',')[0].trim().toLowerCase();
                matchesLocation = playerCity === cityTarget;
            }

            return matchesSearch && matchesLeague && matchesPosition && matchesLocation;
        });

        // SORTING: Sort by Growth Descending so the rank number means something
        return filtered.sort((a, b) => parseFloat(b.growth) - parseFloat(a.growth));

    }, [searchQuery, selectedLeagues, selectedPosition, location]);

    const handlePlayerClick = (player: any) => {
        setSelectedPlayer(player);
        setIsFollowing(false);
    };

    const handleLeagueApply = (ids: string[]) => {
        setSelectedLeagues(ids);
    };

    // Helper to display friendly name for selected leagues
    const getLeagueDisplay = () => {
        if (selectedLeagues.length === 0) return 'Ligue';
        if (selectedLeagues.length > 1) return `${selectedLeagues.length} Ligues`;
        
        const id = selectedLeagues[0];
        if (id.includes('ldp')) return id.match(/_u(\d+)/i) ? `LDP U${id.match(/_u(\d+)/i)![1]}` : 'LDP';
        if (id.includes('plsjq')) return id.match(/_u(\d+)/i) ? `PLSJQ U${id.match(/_u(\d+)/i)![1]}` : 'PLSJQ';
        if (id.includes('l1qc')) return 'L1QC';
        if (id === 'pl') return 'Premier League';
        return '1 Ligue';
    };

    return (
        <div className="absolute inset-0 z-[60] bg-[#0F1115] text-white font-sans flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 pt-12 pb-4 bg-[#0F1115]/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-20">
                <button 
                    onClick={onBack}
                    className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors active:scale-95"
                >
                    <Icon name="arrow_back" className="text-xl" />
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-bold tracking-tight text-white leading-none">Joueurs à surveiller</h1>
                    <span className="text-xs text-gray-400 font-medium">{filteredPlayers.length} Talents</span>
                </div>
                <button 
                    onClick={() => setShowInfoModal(true)}
                    className="w-10 h-10 -mr-2 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors active:scale-95"
                >
                    <Icon name="info" className="text-xl" />
                </button>
            </div>

            {/* Location & Filter Bar */}
            <div className="px-4 py-2 flex items-center justify-between mt-2">
                 <button 
                      onClick={() => setShowLocationModal(true)}
                      className="flex items-center gap-1 text-blue-500 hover:text-blue-400 transition-colors group active:scale-95"
                  >
                      <Icon name="location_on" className="text-sm" filled />
                      <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{location}</span>
                      <Icon name="expand_more" className="text-gray-500 text-sm group-hover:text-blue-400 transition-colors" />
                  </button>

                  <button 
                      onClick={() => setShowLeagueSelector(true)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors active:scale-95 ${
                          selectedLeagues.length > 0 
                          ? 'bg-white text-black border-white' 
                          : 'bg-[#1C1F26] text-white border-white/10 hover:bg-white/5'
                      }`}
                  >
                      <span className="text-[11px] font-bold">
                          {getLeagueDisplay()}
                      </span>
                      <Icon name="filter_list" className={`${selectedLeagues.length > 0 ? 'text-black' : 'text-gray-400'} text-sm`} />
                  </button>
            </div>

            {/* Search */}
            <div className="px-4 py-3">
                <div className="w-full bg-[#1C1F26] rounded-xl h-11 flex items-center pl-3 pr-2 border border-white/10 focus-within:border-white/30 transition-colors">
                    <Icon name="search" className="text-gray-500 text-lg mr-2" />
                    <input 
                        type="text" 
                        placeholder="Rechercher un joueur..." 
                        className="flex-1 bg-transparent border-none text-white text-[14px] placeholder-gray-500 focus:ring-0 p-0"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Position Filters */}
            <div className="flex gap-2 overflow-x-auto px-4 pb-4 hide-scrollbar">
                {POSITIONS.map((pos) => (
                    <button
                        key={pos}
                        onClick={() => setSelectedPosition(pos)}
                        className={`px-4 py-1.5 rounded-full text-[13px] font-bold border transition-all whitespace-nowrap active:scale-95 ${
                            selectedPosition === pos
                            ? 'bg-white text-black border-white shadow-lg'
                            : 'bg-[#1C1F26] text-gray-400 border-white/10 hover:bg-white/5'
                        }`}
                    >
                        {pos}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-4 pb-12 space-y-2">
                {filteredPlayers.length > 0 ? (
                    filteredPlayers.map((player, index) => (
                        <div 
                            key={player.id}
                            onClick={() => handlePlayerClick(player)}
                            className="flex items-center justify-between p-3 bg-[#1C1F26] rounded-2xl active:scale-[0.99] transition-transform cursor-pointer border border-white/5"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-6 h-6 text-gray-500 font-bold text-xs font-mono">
                                    {index + 1}
                                </div>
                                <div className="relative">
                                    <img 
                                        src={player.avatar} 
                                        alt={player.fullName} 
                                        className="w-12 h-12 rounded-xl object-cover bg-gray-700" 
                                    />
                                    <div className="absolute -bottom-1 -right-1 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded border border-white/10">
                                        {player.position}
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="text-[15px] font-bold text-white leading-tight">{player.fullName}</h4>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                                        <span className="max-w-[100px] truncate font-medium text-gray-300">{player.team}</span>
                                        <span className="w-0.5 h-0.5 bg-gray-500 rounded-full"></span>
                                        <span className="text-gray-500">
                                            {player.league}
                                            {(['LDP', 'PLSJQ'].includes(player.league)) ? ` U${player.age}` : ''}
                                            {' '}{player.gender}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#10B981]/10 flex items-center justify-center border border-[#10B981]/20">
                                    <span className="text-[#10B981] font-black text-xs">{player.rating}</span>
                                </div>
                                <Icon name="chevron_right" className="text-gray-600" />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-[#1e232e] rounded-full flex items-center justify-center mb-4 border border-white/5">
                            <Icon name="filter_list_off" className="text-2xl text-gray-600" />
                        </div>
                        <p className="text-gray-400 font-bold text-sm mb-1">Aucun joueur trouvé</p>
                        <p className="text-gray-500 text-xs px-10 leading-relaxed">
                            Essayez de modifier la localisation ({location}), la ligue ou le poste.
                        </p>
                        <button 
                            onClick={() => { setLocation(''); setSelectedLeagues([]); setSelectedPosition('Tout'); setSearchQuery(''); }}
                            className="mt-6 px-6 py-2 bg-white text-black font-bold text-xs rounded-full"
                        >
                            Tout effacer
                        </button>
                    </div>
                )}
            </div>

            {/* Selected Player Detail Modal - Reused Design */}
            {selectedPlayer && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center isolate px-4">
                    <div 
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setSelectedPlayer(null)}
                    ></div>
                    
                    <div className="relative w-full max-w-[320px] bg-[#0F1115] rounded-[24px] overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-200">
                        {/* Header Background */}
                        <div className="h-24 bg-gradient-to-b from-[#1C1F26] to-[#0F1115] relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                                <button 
                                onClick={() => setSelectedPlayer(null)}
                                className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                                >
                                <Icon name="close" className="text-xl" />
                                </button>
                        </div>

                        <div className="px-5 pb-6 relative -mt-12 text-center">
                            {/* Avatar */}
                            <div className="relative inline-block mb-3">
                                <div className="w-24 h-24 rounded-full border-4 border-[#0F1115] overflow-hidden bg-[#2C2C2E] shadow-xl relative z-10">
                                    <img src={selectedPlayer.avatar} alt={selectedPlayer.fullName} className="w-full h-full object-cover" />
                                </div>
                                {/* Rating Badge */}
                                <div className="absolute bottom-1 right-1 z-20 w-7 h-7 bg-[#10B981] rounded-full flex items-center justify-center border-4 border-[#0F1115] text-[#0F1115] font-black text-[10px] shadow-md">
                                    {selectedPlayer.rating}
                                </div>
                            </div>

                            {/* Name & Subtitle */}
                            <h2 className="text-lg font-black text-white leading-tight mb-1">{selectedPlayer.fullName}</h2>
                            <p className="text-xs text-gray-400 font-medium mb-5">
                                {selectedPlayer.team} • {selectedPlayer.league} <span className="text-gray-500">{selectedPlayer.gender}</span>
                            </p>

                            {/* Actions Buttons */}
                            <div className="mb-6 flex justify-center gap-3 px-6">
                                <button 
                                    onClick={() => setIsFollowing(!isFollowing)}
                                    className={`flex-1 py-2.5 rounded-full font-bold text-xs transition-all active:scale-[0.98] shadow-lg ${
                                        isFollowing 
                                        ? 'bg-[#1C1F26] text-white border border-white/10 hover:bg-[#252830]' 
                                        : 'bg-white text-black hover:bg-gray-200'
                                    }`}
                                >
                                    {isFollowing ? 'Suivi' : 'Suivre'}
                                </button>
                                <button 
                                    className="flex-1 py-2.5 rounded-full font-bold text-xs transition-all active:scale-[0.98] shadow-lg bg-[#1C1F26] text-white border border-white/20 hover:bg-[#252830]"
                                >
                                    Voir
                                </button>
                            </div>

                            {/* Stats Grid - Minimalist */}
                            <div className="grid grid-cols-4 gap-1 mb-5 p-1 bg-[#151517] rounded-xl border border-white/5">
                                <div className="flex flex-col items-center py-2 border-r border-white/5">
                                    <span className="text-[9px] font-bold text-gray-500 uppercase">Age</span>
                                    <span className="text-xs font-bold text-white">{selectedPlayer.age}</span>
                                </div>
                                <div className="flex flex-col items-center py-2 border-r border-white/5">
                                    <span className="text-[9px] font-bold text-gray-500 uppercase">Taille</span>
                                    <span className="text-xs font-bold text-white">{selectedPlayer.height}</span>
                                </div>
                                <div className="flex flex-col items-center py-2 border-r border-white/5">
                                    <span className="text-[9px] font-bold text-gray-500 uppercase">Poids</span>
                                    <span className="text-xs font-bold text-white">{selectedPlayer.weight}</span>
                                </div>
                                <div className="flex flex-col items-center py-2">
                                    <span className="text-[9px] font-bold text-gray-500 uppercase">Poste</span>
                                    <span className="text-xs font-bold text-white">{selectedPlayer.position}</span>
                                </div>
                            </div>

                            {/* Chart Section */}
                            <div className="bg-[#151517] rounded-xl p-4 border border-white/5">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Progression (Saison)</h4>
                                    <div className="flex items-center gap-1 text-[#10B981] text-[10px] font-bold bg-[#10B981]/10 px-1.5 py-0.5 rounded">
                                        <Icon name="trending_up" className="text-xs" />
                                        <span>+{selectedPlayer.growth}</span>
                                    </div>
                                </div>
                                <BigChart data={selectedPlayer.chartData} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Info Modal */}
            {showInfoModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center isolate px-6">
                    <div 
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setShowInfoModal(false)}
                    ></div>
                    <div className="relative w-full max-w-sm bg-[#1C1F26] rounded-2xl p-6 border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4 text-blue-400 border border-blue-500/20">
                                <Icon name="trending_up" className="text-2xl" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Joueurs à surveiller</h3>
                            <p className="text-sm text-gray-400 leading-relaxed mb-6">
                                Cette page met en avant les joueurs qui ont enregistré la plus forte courbe de progression récemment.
                            </p>
                            <button 
                                onClick={() => setShowInfoModal(false)}
                                className="w-full py-3 bg-white text-black font-bold rounded-xl active:scale-95 transition-transform hover:bg-gray-200"
                            >
                                Compris
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showLocationModal && (
                <LocationModal 
                    currentLocation={location}
                    onClose={() => setShowLocationModal(false)}
                    onSelect={(loc) => setLocation(loc)}
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
