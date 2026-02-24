import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';
import { MOCK_TEAMMATES } from './PublishPage';

// --- MOCK DATA ---
const SEARCH_DATA = [
    // Players (using MOCK_TEAMMATES + extras)
    ...MOCK_TEAMMATES.map(t => ({
        id: t.id,
        name: t.name,
        image: t.avatar,
        type: 'player' as const,
        subtitle: `${t.role} • ${Math.random() > 0.5 ? 'FC Laval' : 'Sans club'}`,
        verified: Math.random() > 0.6
    })),
    { id: 'p_new1', name: 'Lamine Yamal', image: 'https://i.pravatar.cc/150?u=lamine', type: 'player' as const, subtitle: 'Ailier • FC Barcelona', verified: true },
    { id: 'p_new2', name: 'Zinedine Zidane', image: 'https://i.pravatar.cc/150?u=zizou', type: 'player' as const, subtitle: 'Coach • Libre', verified: true },
    
    // Clubs
    { id: 'c1', name: 'Paris Saint-Germain', image: 'https://upload.wikimedia.org/wikipedia/fr/thumb/8/86/Paris_Saint-Germain_Logo.svg/1024px-Paris_Saint-Germain_Logo.svg.png', type: 'club' as const, subtitle: 'Ligue 1 • France', verified: true },
    { id: 'c2', name: 'Real Madrid', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png', type: 'club' as const, subtitle: 'La Liga • Espagne', verified: true },
    { id: 'c3', name: 'FC Laval', image: 'https://fclaval.qc.ca/wp-content/uploads/2022/09/Logo-FC-Laval-300x300.png', type: 'club' as const, subtitle: 'PLSQ • Canada', verified: false },
    { id: 'c4', name: 'CS Longueuil', image: '', type: 'club' as const, subtitle: 'L1QC • Canada', verified: false },
    { id: 'c5', name: 'Manchester City', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/1200px-Manchester_City_FC_badge.svg.png', type: 'club' as const, subtitle: 'Premier League • UK', verified: true },
    { id: 'c6', name: 'Arsenal FC', image: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/1200px-Arsenal_FC.svg.png', type: 'club' as const, subtitle: 'Premier League • UK', verified: true },
    { id: 'c8', name: 'CF Montréal', image: 'https://upload.wikimedia.org/wikipedia/fr/thumb/3/3e/CF_Montr%C3%A9al_logo_2023.svg/1200px-CF_Montr%C3%A9al_logo_2023.svg.png', type: 'club' as const, subtitle: 'MLS • Canada', verified: true },
];

// Define type for Recent Search Item
interface RecentSearchItem {
    id: string;
    text: string;
    type: 'text' | 'club' | 'player';
    image?: string;
}

const INITIAL_RECENT_SEARCHES: RecentSearchItem[] = [
    { id: 'r1', text: 'Kylian Mbappé', type: 'text' },
    { id: 'r2', text: 'FC Laval', type: 'club', image: 'https://fclaval.qc.ca/wp-content/uploads/2022/09/Logo-FC-Laval-300x300.png' },
    { id: 'r3', text: 'U19 National', type: 'text' }
];

interface SearchPageProps {
    onBack: () => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onBack }) => {
    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'top' | 'players' | 'clubs'>('top');
    const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>(INITIAL_RECENT_SEARCHES);
    const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-focus on mount with a slight delay for animation smoothness
    useEffect(() => {
        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    const handleRemoveRecent = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setRecentSearches(prev => prev.filter(item => item.id !== id));
    };

    const handleClearAllRecents = () => {
        setRecentSearches([]);
    };

    const handleResultClick = (item: typeof SEARCH_DATA[0]) => {
        setRecentSearches(prev => {
            // Remove if already exists to bump to top
            const filtered = prev.filter(r => r.id !== item.id);
            const newItem: RecentSearchItem = {
                id: item.id,
                text: item.name,
                type: item.type,
                image: item.image
            };
            return [newItem, ...filtered].slice(0, 10);
        });
        // Reset query to simulate navigation/selection
        setQuery('');
    };

    const toggleFollow = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setFollowedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && query.trim()) {
            setRecentSearches(prev => {
                const text = query.trim();
                // Deduplicate by text
                const filtered = prev.filter(r => r.text.toLowerCase() !== text.toLowerCase());
                const newItem: RecentSearchItem = {
                    id: `text-${Date.now()}`,
                    text: text,
                    type: 'text'
                };
                return [newItem, ...filtered].slice(0, 10);
            });
            setQuery('');
            inputRef.current?.blur();
        }
    };

    const filteredResults = SEARCH_DATA.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase())
    );

    const getDisplayResults = () => {
        if (activeTab === 'players') return filteredResults.filter(i => i.type === 'player');
        if (activeTab === 'clubs') return filteredResults.filter(i => i.type === 'club');
        return filteredResults;
    };

    const results = getDisplayResults();

    return (
        <div className="absolute inset-0 z-30 bg-[#0F1115] text-white flex flex-col font-sans w-full h-full overflow-hidden animate-in slide-in-from-right duration-300">
            {/* Header Area */}
            <div className="flex items-center gap-3 p-4 pt-10 pb-2 bg-[#0F1115]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shrink-0">
                <div className="flex-1 w-full bg-[#1e232e] rounded-xl h-11 flex items-center pl-3 pr-2 transition-all focus-within:ring-1 focus-within:ring-blue-500/50">
                    <Icon name="search" className="text-gray-500 text-lg mr-2" />
                    <input 
                        ref={inputRef}
                        type="search" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleSearchSubmit}
                        placeholder="Rechercher..."
                        className="flex-1 bg-transparent border-none text-white text-[15px] placeholder-gray-500 focus:ring-0 p-0 focus:outline-none appearance-none"
                    />
                    {query && (
                        <button 
                            onClick={() => {
                                setQuery('');
                                inputRef.current?.focus();
                            }}
                            className="p-1 text-gray-500 hover:text-white mr-1"
                        >
                            <Icon name="close" className="text-sm" />
                        </button>
                    )}
                </div>
                <button 
                    onClick={onBack}
                    className="text-[15px] font-semibold text-white px-2 py-2 active:opacity-70 transition-opacity"
                >
                    Annuler
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar">
                {!query ? (
                    // Default View: Recent Searches
                    <div className="px-4 py-4">
                        <div className="flex justify-between items-center mb-4 px-1">
                            <h3 className="text-[15px] font-bold text-white">Récents</h3>
                            {recentSearches.length > 0 && (
                                <button 
                                    onClick={handleClearAllRecents}
                                    className="text-[13px] text-blue-500 font-semibold active:opacity-50 px-2 py-1"
                                >
                                    Effacer
                                </button>
                            )}
                        </div>
                        
                        <div className="flex flex-col">
                            {recentSearches.map(recent => (
                                <div 
                                    key={recent.id} 
                                    className="flex items-center justify-between py-3.5 px-2 -mx-2 active:bg-white/10 rounded-xl transition-colors cursor-pointer group"
                                    onClick={() => setQuery(recent.text)}
                                >
                                    <div className="flex items-center gap-4">
                                        {(recent.type === 'club' || recent.type === 'player') && recent.image ? (
                                            <img src={recent.image} alt={recent.text} className="w-12 h-12 rounded-full object-cover border border-white/10 bg-[#1C1C1E]" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-[#1C1C1E] flex items-center justify-center border border-white/5">
                                                <Icon name="history" className="text-gray-400 text-2xl" />
                                            </div>
                                        )}
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[15px] font-semibold text-gray-200">{recent.text}</span>
                                            {recent.type === 'club' && <span className="text-[13px] text-gray-500">Club</span>}
                                            {recent.type === 'player' && <span className="text-[13px] text-gray-500">Joueur</span>}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={(e) => handleRemoveRecent(e, recent.id)}
                                        className="text-gray-500 p-2 opacity-50 hover:opacity-100 active:scale-95 transition-transform"
                                    >
                                        <Icon name="close" className="text-lg" />
                                    </button>
                                </div>
                            ))}
                            {recentSearches.length === 0 && (
                                <div className="py-10 text-center text-gray-500 text-sm italic">
                                    Aucune recherche récente.
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Filters / Tabs - Sticky */}
                        <div className="sticky top-0 z-40 bg-[#0F1115]/95 backdrop-blur-sm border-b border-white/10 flex items-center px-2 shadow-lg">
                            <TabButton label="Top" isActive={activeTab === 'top'} onClick={() => setActiveTab('top')} />
                            <TabButton label="Joueurs" isActive={activeTab === 'players'} onClick={() => setActiveTab('players')} />
                            <TabButton label="Clubs" isActive={activeTab === 'clubs'} onClick={() => setActiveTab('clubs')} />
                        </div>

                        {/* Results List */}
                        <div className="p-2 pb-24 space-y-1">
                            {results.length > 0 ? (
                                results.map(item => {
                                    const isFollowed = followedIds.has(item.id);
                                    return (
                                        <div 
                                            key={item.id} 
                                            onClick={() => handleResultClick(item)}
                                            className="flex items-center justify-between p-3 active:bg-[#1C1C1E] rounded-2xl transition-colors cursor-pointer touch-manipulation"
                                        >
                                            <div className="flex items-center gap-3.5 flex-1 min-w-0">
                                                <div className="relative shrink-0">
                                                    <img 
                                                        src={item.image || `https://ui-avatars.com/api/?name=${item.name}&background=random`} 
                                                        alt={item.name}
                                                        className="w-[52px] h-[52px] rounded-full object-cover border border-white/10 bg-[#151518]"
                                                    />
                                                    {item.type === 'club' && (
                                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center border border-white/20">
                                                            <Icon name="shield" className="text-[10px] text-white" filled />
                                                        </div>
                                                    )}
                                                    {item.verified && (
                                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center border border-black">
                                                            <Icon name="verified" className="text-[16px] text-blue-500" filled />
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="flex flex-col min-w-0 pr-2">
                                                    <span className="text-[15px] font-bold text-white truncate leading-tight mb-0.5">
                                                        {item.name}
                                                    </span>
                                                    <span className="text-[13px] text-gray-400 font-medium truncate leading-tight">
                                                        {item.subtitle}
                                                    </span>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={(e) => toggleFollow(e, item.id)}
                                                className={`h-8 px-4 text-[13px] font-bold rounded-full active:scale-95 transition-all shadow-sm shrink-0 border ${
                                                    isFollowed 
                                                    ? 'bg-[#1C1C1E] text-white border-white/10' 
                                                    : 'bg-white text-black border-transparent'
                                                }`}
                                            >
                                                {isFollowed ? 'Suivi' : 'Suivre'}
                                            </button>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-20 flex flex-col items-center justify-center text-center px-8">
                                    <div className="w-20 h-20 rounded-full bg-[#1C1C1E] flex items-center justify-center mb-4">
                                        <Icon name="search_off" className="text-3xl text-gray-600" />
                                    </div>
                                    <h3 className="text-white font-bold text-base mb-1">Aucun résultat</h3>
                                    <p className="text-gray-500 text-sm">
                                        Nous n'avons trouvé aucun joueur ou club correspondant à "{query}".
                                    </p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// --- Subcomponents ---

const TabButton = ({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) => (
    <button 
        onClick={onClick}
        className={`flex-1 py-3.5 relative text-[14px] font-bold transition-colors ${
            isActive ? 'text-white' : 'text-gray-500'
        }`}
    >
        {label}
        {isActive && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-t-full shadow-[0_-2px_8px_rgba(255,255,255,0.5)]"></div>
        )}
    </button>
);