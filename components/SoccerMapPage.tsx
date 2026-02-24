
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Icon } from './Icon';
import { BottomNav } from './BottomNav';
import { CheckInModal } from './CheckInModal';

interface SoccerMapPageProps {
  onBack: () => void;
  onOpportunities?: () => void;
  onVenueClick?: (venue: FieldData) => void;
}

interface FieldData {
    id: number;
    name: string;
    location: string;
    query: string;
    type: string;
    distance: string;
    playersPresent: number;
    image: string;
    lat: number;
    lng: number;
}

// Données enrichies avec Coordonnées GPS réelles (Montréal)
const SOCCER_FIELDS: FieldData[] = [
    { 
        id: 1, 
        name: "Parc Jarry", 
        location: "Montréal, QC", 
        query: "Parc Jarry, Montreal", 
        type: "Synthétique",
        distance: "0,8 km",
        playersPresent: 28,
        image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=1000&auto=format&fit=crop",
        lat: 45.5333,
        lng: -73.6231
    },
    { 
        id: 2, 
        name: "Complexe Sportif Claude-Robillard", 
        location: "Montréal, QC", 
        query: "Complexe Sportif Claude-Robillard", 
        type: "Naturel",
        distance: "2,4 km",
        playersPresent: 14,
        image: "https://images.unsplash.com/photo-1575361204480-aadea25d46f7?q=80&w=1000",
        lat: 45.5539, 
        lng: -73.6358
    },
    { 
        id: 3, 
        name: "Stade Saputo", 
        location: "Montréal, QC", 
        query: "Stade Saputo", 
        type: "Pro",
        distance: "5,1 km",
        playersPresent: 0,
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Stade_Saputo_2012.jpg/1200px-Stade_Saputo_2012.jpg",
        lat: 45.5631, 
        lng: -73.5517
    },
    { 
        id: 4, 
        name: "Parc Marquette", 
        location: "Montréal, QC", 
        query: "Parc Marquette, Montreal", 
        type: "Synthétique",
        distance: "3,2 km",
        playersPresent: 42,
        image: "https://images.unsplash.com/photo-1431324155629-1a6de1340178?q=80&w=1000",
        lat: 45.5417, 
        lng: -73.5932
    },
    { 
        id: 5, 
        name: "Parc Maisonneuve", 
        location: "Montréal, QC", 
        query: "Parc Maisonneuve, Montreal", 
        type: "Naturel",
        distance: "4,8 km",
        playersPresent: 8,
        image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=1000",
        lat: 45.5600, 
        lng: -73.5600
    }
];

const FILTERS = ["Distance", "Dénivelé", "Surface", "Type", "Difficulté"];

// Component to handle map center updates
const MapController = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 13, { duration: 1.5 });
    }, [center, map]);
    return null;
};

// Component to handle clicks on the map background to deselect
const MapClickHandler = ({ onMapClick }: { onMapClick: () => void }) => {
    useMapEvents({
        click: () => onMapClick(),
    });
    return null;
};

export const SoccerMapPage: React.FC<SoccerMapPageProps> = ({ onBack, onOpportunities, onVenueClick }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedField, setSelectedField] = useState<FieldData | null>(null);
  const [suggestions, setSuggestions] = useState<FieldData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([45.5333, -73.6231]); // Default to Jarry
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Check In Modal State
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [checkInVenue, setCheckInVenue] = useState<FieldData | null>(null);

  // Helper to create custom HTML markers using Leaflet's DivIcon
  const createCustomIcon = (field: FieldData, isSelected: boolean) => {
      const isHighTraffic = field.playersPresent > 20;
      const isActive = field.playersPresent > 0;
      
      const html = `
        <div class="relative flex flex-col items-center justify-center transform transition-all duration-300 ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}">
            ${isSelected ? `
                <div class="absolute bottom-full mb-2 bg-white text-black px-2 py-1 rounded-md text-[10px] font-bold whitespace-nowrap shadow-lg animate-in fade-in slide-in-from-bottom-2">
                    ${field.name}
                </div>
            ` : ''}
            
            ${isHighTraffic ? '<div class="absolute w-full h-full bg-red-500 rounded-full animate-ping opacity-75"></div>' : ''}
            
            <div class="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 box-border
                ${isSelected 
                    ? 'bg-white border-blue-500 text-blue-500' 
                    : (isActive ? 'bg-[#FF453A] border-white text-white' : 'bg-gray-600 border-white text-white')
                }"
            >
                <span class="material-symbols-outlined text-sm font-variation-settings-fill">sports_soccer</span>
            </div>
            
            <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] -mt-0.5
                ${isSelected 
                    ? 'border-t-blue-500' 
                    : (isActive ? 'border-t-white' : 'border-t-white')
                }"
            ></div>
        </div>
      `;

      return L.divIcon({
          html: html,
          className: 'custom-marker-pin', 
          iconSize: [40, 50],
          iconAnchor: [20, 50], 
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);

      if (value.length > 1) {
          const filtered = SOCCER_FIELDS.filter(field => 
              field.name.toLowerCase().includes(value.toLowerCase()) || 
              field.location.toLowerCase().includes(value.toLowerCase())
          );
          setSuggestions(filtered);
          setShowSuggestions(true);
      } else {
          setSuggestions([]);
          setShowSuggestions(false);
      }
  };

  const handleSuggestionClick = (field: FieldData) => {
      setInputValue(field.name);
      setShowSuggestions(false);
      setSelectedField(field);
      setMapCenter([field.lat, field.lng]); 
  };

  const handleMarkerClick = (field: FieldData) => {
      setSelectedField(field);
      setMapCenter([field.lat, field.lng]); 
  };

  const handleDetailsClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (selectedField && onVenueClick) {
          onVenueClick(selectedField);
      }
  };

  const handleCheckInClick = (e: React.MouseEvent, field: FieldData) => {
      e.stopPropagation();
      setCheckInVenue(field);
      setShowCheckInModal(true);
  };

  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
              setShowSuggestions(false);
          }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="absolute inset-0 z-[100] bg-[#0F1115] text-white font-sans overflow-hidden flex flex-col">
      
      {/* Real Map Layer */}
      <div className="absolute inset-0 z-0 bg-[#1C1C1E]">
        <MapContainer 
            center={mapCenter} 
            zoom={13} 
            style={{ width: '100%', height: '100%', backgroundColor: '#1C1C1E' }}
            zoomControl={false}
            attributionControl={false}
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                maxZoom={20}
            />
            
            <MapController center={mapCenter} />
            <MapClickHandler onMapClick={() => setSelectedField(null)} />

            {SOCCER_FIELDS.map((field) => (
                <Marker 
                    key={field.id}
                    position={[field.lat, field.lng]}
                    icon={createCustomIcon(field, selectedField?.id === field.id)}
                    eventHandlers={{
                        click: () => handleMarkerClick(field)
                    }}
                />
            ))}
        </MapContainer>

        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-none z-[400]"></div>
      </div>

      {/* Top Search & Navigation Area */}
      <div className="absolute top-0 left-0 right-0 z-[500] pt-12 px-4 pb-4" ref={searchContainerRef}>
        <div className="relative mb-3">
            <div className="flex items-center gap-3">
                <button 
                    onClick={onBack}
                    className="w-10 h-10 rounded-full bg-[#1C1C1E]/90 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-lg text-white active:scale-95 transition-transform shrink-0"
                >
                    <Icon name="arrow_back" className="text-xl" />
                </button>
                <div className="flex-1 h-10 bg-[#1C1C1E]/90 backdrop-blur-md rounded-xl flex items-center px-3 border border-white/10 shadow-lg group focus-within:border-orange-500/50 transition-colors relative z-20">
                    <Icon name="search" className="text-gray-400 text-lg mr-2" />
                    <input 
                        type="text" 
                        placeholder="Rechercher un terrain..." 
                        className="bg-transparent border-none text-white text-sm w-full placeholder-gray-500 focus:ring-0 p-0"
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={() => inputValue.length > 1 && setShowSuggestions(true)}
                    />
                    {inputValue && (
                        <button onClick={() => { setInputValue(''); setShowSuggestions(false); }} className="text-gray-500 hover:text-white">
                            <Icon name="close" className="text-sm" />
                        </button>
                    )}
                </div>
                <button className="h-10 px-3 rounded-xl bg-[#1C1C1E]/90 backdrop-blur-md flex items-center gap-2 border border-white/10 shadow-lg active:scale-95 transition-transform shrink-0">
                    <Icon name="bookmark" className="text-white text-lg" />
                    <span className="text-xs font-bold hidden sm:block">Enregistré</span>
                </button>
            </div>

            {showSuggestions && (
                <div className="absolute top-full left-14 right-14 mt-2 bg-[#1C1C1E] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-30">
                    <div className="max-h-60 overflow-y-auto">
                        {suggestions.length > 0 ? (
                            suggestions.map((field, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => handleSuggestionClick(field)}
                                    className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center gap-3 border-b border-white/5 last:border-0 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                        <Icon name="location_on" className="text-gray-400 text-sm" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold text-white truncate">{field.name}</div>
                                        <div className="text-xs text-gray-400 truncate">{field.location} • {field.type}</div>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-4 text-center">
                                <p className="text-xs text-gray-500">Aucun terrain trouvé.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 pointer-events-auto">
            <button className="flex items-center gap-1 bg-[#FF6900] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg shrink-0 active:scale-95 transition-transform">
                Itinéraires <Icon name="expand_more" className="text-sm" />
            </button>
            {FILTERS.map(filter => (
                <button key={filter} className="bg-[#1C1C1E]/80 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg shrink-0 hover:bg-white/10 transition-colors">
                    {filter}
                </button>
            ))}
        </div>
      </div>

      <div className="absolute top-40 left-1/2 -translate-x-1/2 z-[450] pointer-events-none">
          <button 
            className="bg-white text-black px-4 py-2 rounded-full font-bold text-xs shadow-xl flex items-center gap-2 pointer-events-auto active:scale-95 transition-transform"
          >
              Rechercher dans cette zone
          </button>
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-[450] pointer-events-auto">
          <button className="w-10 h-10 rounded-full bg-[#1C1C1E]/90 backdrop-blur-md border border-white/10 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform">
              <Icon name="layers" className="text-xl" />
          </button>
          <button className="w-10 h-10 rounded-full bg-[#1C1C1E]/90 backdrop-blur-md border border-white/10 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform font-bold text-xs">
              3D
          </button>
          <button className="w-10 h-10 rounded-full bg-[#1C1C1E]/90 backdrop-blur-md border border-white/10 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform">
              <Icon name="my_location" className="text-xl" />
          </button>
      </div>

      {selectedField && (
          <div className="absolute bottom-24 left-0 right-0 z-[500] px-4 animate-in slide-in-from-bottom duration-300 pointer-events-none">
              <div 
                className="bg-[#1C1C1E]/95 backdrop-blur-xl border border-white/10 rounded-[20px] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.6)] pointer-events-auto cursor-pointer active:scale-[0.98] transition-transform"
                onClick={handleDetailsClick}
              >
                  <div className="flex gap-4 mb-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative shadow-sm">
                          <img src={selectedField.image} alt={selectedField.name} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h3 className="text-[16px] font-bold text-white leading-tight mb-1 truncate">{selectedField.name}</h3>
                          <div className="flex items-center gap-2 text-[12px] text-gray-400 mb-2">
                              <span className="font-bold text-white bg-white/10 px-1.5 py-0.5 rounded text-[10px]">{selectedField.type}</span>
                              <span>•</span>
                              <span>{selectedField.distance}</span>
                          </div>
                          
                          <div className={`flex items-center gap-1.5 text-[12px] font-medium ${selectedField.playersPresent > 0 ? 'text-green-400' : 'text-gray-500'}`}>
                              <Icon name="groups" className="text-sm" filled />
                              <span>{selectedField.playersPresent} Joueurs présents</span>
                          </div>
                      </div>
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedField(null); }}
                        className="absolute top-3 right-3 w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:bg-white/20 active:scale-90"
                      >
                          <Icon name="close" className="text-sm" />
                      </button>
                  </div>

                  <div className="flex gap-3">
                      <button 
                        onClick={(e) => { e.stopPropagation(); }}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white h-10 rounded-xl text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
                      >
                          <Icon name="directions" className="text-lg" />
                          Itinéraire
                      </button>
                      <button 
                        onClick={(e) => handleCheckInClick(e, selectedField)}
                        className="flex-1 bg-[#2C2C2E] hover:bg-[#3A3A3C] text-white h-10 rounded-xl text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-all border border-white/10"
                      >
                          <Icon name="check_circle" className="text-lg text-green-500" />
                          Check-in
                      </button>
                  </div>
              </div>
          </div>
      )}

      {showCheckInModal && checkInVenue && (
          <CheckInModal 
              venueName={checkInVenue.name}
              onClose={() => setShowCheckInModal(false)}
              onConfirm={(date, time) => {
                  console.log(`Checked in at ${checkInVenue.name} on ${date} at ${time}`);
                  // Here you would typically call an API
                  setShowCheckInModal(false);
              }}
          />
      )}

      <BottomNav 
          activeTab={undefined} 
          onHomeClick={onBack}
          onOpportunitiesClick={onOpportunities}
      />
    </div>
  );
};
