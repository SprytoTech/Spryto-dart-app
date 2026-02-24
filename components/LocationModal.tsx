import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';

interface LocationModalProps {
  onClose: () => void;
  onSelect: (location: string) => void;
  currentLocation: string;
}

const DEFAULT_RECENTS = ['Toronto, ON', 'Trois-Rivières, QC', 'Shawinigan, QC', 'Québec, QC', 'Montréal, QC'];
const STORAGE_KEY = 'spryto_recent_locations';

const MOCK_CITIES = [
  "Montréal, QC", "Québec, QC", "Laval, QC", "Gatineau, QC", "Longueuil, QC", "Sherbrooke, QC", "Lévis, QC", "Saguenay, QC", "Trois-Rivières, QC", "Terrebonne, QC",
  "Toronto, ON", "Ottawa, ON", "Mississauga, ON", "Brampton, ON", "Hamilton, ON", "London, ON", "Markham, ON", "Vaughan, ON",
  "Vancouver, BC", "Surrey, BC", "Burnaby, BC", "Richmond, BC",
  "Calgary, AB", "Edmonton, AB",
  "Winnipeg, MB",
  "Halifax, NS",
  "Paris, France", "Lyon, France", "Marseille, France", "Bordeaux, France", "Lille, France", "Toulouse, France", "Nice, France",
  "London, UK", "Manchester, UK", "Liverpool, UK", "Birmingham, UK",
  "New York, USA", "Los Angeles, USA", "Chicago, USA", "Miami, USA", "San Francisco, USA", "Boston, USA", "Houston, USA",
  "Barcelona, Spain", "Madrid, Spain", "Valencia, Spain",
  "Rome, Italy", "Milan, Italy", "Naples, Italy",
  "Berlin, Germany", "Munich, Germany", "Hamburg, Germany",
  "Casablanca, Maroc", "Rabat, Maroc", "Marrakech, Maroc",
  "Dakar, Sénégal", "Abidjan, Côte d'Ivoire"
];

const NEIGHBORHOODS: Record<string, string[]> = {
  "Montréal": ["Plateau-Mont-Royal", "Ville-Marie", "Rosemont", "Côte-des-Neiges", "Hochelaga", "Verdun", "Outremont", "Villeray", "Ahuntsic"],
  "Québec": ["Sainte-Foy", "Beauport", "Charlesbourg", "Limoilou", "La Haute-Saint-Charles", "Vieux-Québec", "Sillery"],
  "Laval": ["Chomedey", "Sainte-Dorothée", "Fabreville", "Vimont", "Pont-Viau", "Laval-des-Rapides"],
  "Toronto": ["Old Toronto", "North York", "Scarborough", "Etobicoke", "York", "Downtown", "The Annex", "Liberty Village"],
  "Ottawa": ["ByWard Market", "The Glebe", "Kanata", "Orléans", "Barrhaven", "Westboro"],
  "Vancouver": ["Kitsilano", "West End", "Gastown", "Yaletown", "Mount Pleasant", "Grandview-Woodland"],
  "Paris": ["Le Marais", "Montmartre", "Saint-Germain-des-Prés", "Quartier Latin", "Belleville", "Champs-Élysées", "Bastille"],
  "Lyon": ["Vieux Lyon", "Croix-Rousse", "Part-Dieu", "Confluence", "Fourvière"],
  "London": ["Soho", "Camden", "Shoreditch", "Chelsea", "Notting Hill", "Greenwich", "Westminster"],
  "New York": ["Manhattan", "Brooklyn", "Queens", "Bronx", "Staten Island", "Harlem", "SoHo", "Tribeca"],
  "Los Angeles": ["Hollywood", "Santa Monica", "Venice", "Downtown LA", "Beverly Hills", "Silver Lake"],
  // Default suggestions if city not matched specifically
  "default": ["Centre-ville", "Quartier Nord", "Quartier Sud", "Zone Industrielle", "Vieux Quartier"]
};

export const LocationModal: React.FC<LocationModalProps> = ({ onClose, onSelect, currentLocation }) => {
    const [query, setQuery] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [recents, setRecents] = useState<string[]>([]);
    const [filteredCities, setFilteredCities] = useState<string[]>([]);
    const [isLocating, setIsLocating] = useState(false);
    
    // Distance Logic
    const [distance, setDistance] = useState(0);
    const [baseLocation, setBaseLocation] = useState('');

    useEffect(() => {
        setIsVisible(true);
        // Lock body scroll to prevent background scrolling
        document.body.style.overflow = 'hidden';

        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setRecents(JSON.parse(stored));
            } catch (e) {
                setRecents(DEFAULT_RECENTS);
            }
        } else {
            setRecents(DEFAULT_RECENTS);
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    useEffect(() => {
        // Parse current location string for distance: "City (+ 20 km)"
        const match = currentLocation.match(/^(.*?)(?: \(\+ (\d+) km\))?$/);
        if (match) {
            setBaseLocation(match[1]);
            setDistance(match[2] ? parseInt(match[2]) : 0);
        } else {
            setBaseLocation(currentLocation);
            setDistance(0);
        }
    }, [currentLocation]);

    useEffect(() => {
        if (query.trim()) {
            const lowerQuery = query.toLowerCase();
            const matches = MOCK_CITIES.filter(city => 
                city.toLowerCase().includes(lowerQuery)
            ).slice(0, 10);
            setFilteredCities(matches);
        } else {
            setFilteredCities([]);
        }
    }, [query]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const addToRecents = (location: string) => {
        const updated = [location, ...recents.filter(r => r.toLowerCase() !== location.toLowerCase())];
        const trimmed = updated.slice(0, 5);
        setRecents(trimmed);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    };

    const removeFromRecents = (e: React.MouseEvent, location: string) => {
        e.stopPropagation();
        const updated = recents.filter(r => r !== location);
        setRecents(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    // Helper to select a city while preserving current distance preference
    const selectCity = (city: string) => {
        addToRecents(city);
        // Construct new location string
        const newLoc = distance > 0 ? `${city} (+ ${distance} km)` : city;
        onSelect(newLoc);
        handleClose();
    };

    const handleDistanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDist = parseInt(e.target.value);
        setDistance(newDist);
        // Live update
        const newLoc = newDist > 0 ? `${baseLocation} (+ ${newDist} km)` : baseLocation;
        onSelect(newLoc);
    };

    const handleGeolocation = () => {
        if ("geolocation" in navigator) {
            setIsLocating(true);
            navigator.geolocation.getCurrentPosition(async (position) => {
                setTimeout(() => {
                    const loc = "Position Actuelle";
                    // Reset or Preserve distance? Let's preserve for consistency
                    const newLoc = distance > 0 ? `${loc} (+ ${distance} km)` : loc;
                    onSelect(newLoc); 
                    setIsLocating(false);
                    handleClose();
                }, 1000);
            }, (error) => {
                console.error("Error getting location", error);
                setIsLocating(false);
                alert("Impossible de détecter la localisation. Vérifiez vos permissions.");
            });
        } else {
            alert("La géolocalisation n'est pas supportée par ce navigateur.");
        }
    };

    const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && query.trim()) {
            selectCity(query.trim());
        }
    };

    const getSuggestions = () => {
        if (!baseLocation || baseLocation === "Position Actuelle") return [];
        
        const normalized = baseLocation.toLowerCase();
        const cityKey = Object.keys(NEIGHBORHOODS).find(key => 
            key !== 'default' && normalized.includes(key.toLowerCase())
        );
        
        return cityKey ? NEIGHBORHOODS[cityKey] : NEIGHBORHOODS['default'];
    };

    const suggestions = getSuggestions().slice(0, 4);
    const isSharingLocation = baseLocation === "Position Actuelle";

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center isolate">
            <div 
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            ></div>
            <div 
                className={`relative w-full max-w-md bg-[#0F1115] shadow-2xl transition-transform duration-300 ease-out h-full overflow-y-auto overscroll-contain ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-12 pb-2 bg-[#0F1115]">
                    <h2 className="text-[22px] font-bold text-white tracking-tight">Location</h2>
                    <button onClick={handleClose} className="p-2 -mr-2 text-white hover:text-gray-300 transition-colors active:scale-90">
                        <Icon name="close" className="text-[24px]" />
                    </button>
                </div>

                {/* Input */}
                <div className="px-6 mb-4">
                    <div className="w-full bg-[#1e232e] rounded-xl h-11 flex items-center pl-3 pr-2 transition-all focus-within:ring-1 focus-within:ring-blue-500/50">
                        <Icon name="search" className="text-gray-500 text-lg mr-2" />
                        <input 
                            type="text" 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleSearchSubmit}
                            placeholder="Recherchez une ville..." 
                            className="flex-1 bg-transparent border-none text-white text-[15px] placeholder-gray-500 focus:ring-0 p-0 focus:outline-none"
                            autoFocus
                        />
                        {query && (
                            <button onClick={() => setQuery('')} className="p-1 text-gray-500 hover:text-white mr-1">
                                <Icon name="close" className="text-sm" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Current Selection & Distance - Minimal Design */}
                <div className="px-6 mb-6">
                    <div className="flex items-center justify-between mb-3 px-1">
                        <div className="flex items-center gap-2">
                            <Icon name="location_on" className="text-white text-[18px]" filled />
                            <span className="text-[15px] font-bold text-white">{baseLocation}</span>
                        </div>
                        <span className="text-[12px] font-medium text-blue-400">
                             {distance === 0 ? 'Exact' : `+ ${distance} km`}
                        </span>
                    </div>

                    {/* Elegant Slider */}
                    <div className="relative w-full h-6 flex items-center mb-3 group">
                        {/* Track Background */}
                        <div className="absolute left-0 right-0 h-[2px] bg-white/10 rounded-full overflow-hidden">
                             {/* Active Track */}
                             <div 
                                className="h-full bg-blue-500" 
                                style={{ width: `${(distance / 100) * 100}%` }}
                             ></div>
                        </div>
                        
                        {/* Custom Thumb */}
                         <div 
                            className="absolute h-3 w-3 bg-white rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none transition-transform group-active:scale-125 border border-blue-500"
                            style={{ left: `${(distance / 100) * 100}%`, transform: 'translateX(-50%)' }}
                        ></div>

                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            step="5"
                            value={distance} 
                            onChange={handleDistanceChange}
                            className="w-full h-6 opacity-0 cursor-pointer z-10"
                        />
                    </div>

                    {!isSharingLocation && (
                        <button 
                            onClick={handleGeolocation}
                            disabled={isLocating}
                            className="w-full py-2.5 rounded-lg border border-white/10 hover:bg-white/5 flex items-center justify-center gap-2 active:scale-[0.98] transition-all group disabled:opacity-50"
                        >
                            {isLocating ? (
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <Icon name="my_location" className="text-white text-[14px]" />
                            )}
                            <span className="text-white font-medium text-[12px]">
                                {isLocating ? "Localisation..." : "Partager ma position actuelle"}
                            </span>
                        </button>
                    )}
                </div>

                {/* Lists */}
                <div className="px-6 pb-8">
                    {query.trim() ? (
                        /* Search Results View */
                        <div className="mb-6">
                            <h3 className="text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wider px-1">Résultats</h3>
                            <div className="space-y-0.5">
                                {filteredCities.map((city) => (
                                     <div 
                                        key={city}
                                        className="flex items-center gap-3 py-3 hover:bg-white/5 -mx-2 px-2 rounded-lg cursor-pointer group transition-colors"
                                        onClick={() => selectCity(city)}
                                     >
                                        <div className="w-8 h-8 rounded-full bg-[#2C2C2E] flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                                            <Icon name="location_on" className="text-[18px]" />
                                        </div>
                                        <span className="text-[14px] font-medium text-gray-200 group-hover:text-white">{city}</span>
                                     </div>
                                ))}
                                {filteredCities.length === 0 && (
                                     <p className="text-gray-500 text-sm py-4 text-center">Aucune ville trouvée.</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Default View */
                        <>
                            {/* Recent */}
                            <div className="mb-6">
                                <h3 className="text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wider px-1">Récent</h3>
                                <div className="space-y-0.5">
                                    {recents.map((loc) => (
                                        <div 
                                            key={loc} 
                                            className="flex items-center justify-between py-2.5 hover:bg-white/5 -mx-2 px-2 rounded-lg cursor-pointer group transition-colors"
                                            onClick={() => selectCity(loc)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-7 h-7 rounded-full bg-transparent flex items-center justify-center text-white/90 group-hover:text-white transition-colors">
                                                    <Icon name="history" className="text-[20px]" />
                                                </div>
                                                <span className="text-[13px] font-medium text-gray-200 group-hover:text-white">{loc}</span>
                                            </div>
                                            <button 
                                                onClick={(e) => removeFromRecents(e, loc)}
                                                className="text-gray-500 hover:text-white p-2 transition-colors"
                                            >
                                                <Icon name="cancel" className="text-[18px]" filled />
                                            </button>
                                        </div>
                                    ))}
                                    {recents.length === 0 && (
                                        <p className="text-gray-500 text-xs italic py-2">Aucune recherche récente.</p>
                                    )}
                                </div>
                            </div>

                             {/* Suggested Neighborhoods based on location */}
                            {suggestions.length > 0 && (
                                <div>
                                    <h3 className="text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wider px-1">
                                        Quartiers suggérés {baseLocation !== "Position Actuelle" ? `à ${baseLocation.split(',')[0]}` : ''}
                                    </h3>
                                    <div className="space-y-0.5">
                                        {suggestions.map((loc) => (
                                            <div 
                                                key={loc} 
                                                className="flex items-center gap-4 py-2.5 hover:bg-white/5 -mx-2 px-2 rounded-lg cursor-pointer group transition-colors"
                                                onClick={() => selectCity(loc)}
                                            >
                                                 <span className="text-[13px] font-medium text-gray-300 group-hover:text-white pl-1">{loc}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};