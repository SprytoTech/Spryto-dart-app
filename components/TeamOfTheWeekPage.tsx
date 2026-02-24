
import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';
import { RatingModal } from './RatingModal';
import { ShareModal } from './ShareModal';

interface Player {
    name: string;
    rating: number;
    clubLogo: string;
    team?: string;
    avatar?: string;
}

interface TeamOfTheWeekPageProps {
    team: (Player | null)[];
    leagueLabel: string;
    weekLabel: string;
    onBack: () => void;
    isSaved?: boolean;
    onToggleSave?: () => void;
    isEditable?: boolean;
    onCreateNew?: () => void;
    onModify?: () => void;
    onShowHistory?: () => void;
}

// Positions alignées avec TrendingPage pour le format 3:4
const FORMATION_POSITIONS = [
    { top: '85%', left: '50%' }, // GK
    { top: '70%', left: '20%' }, // CB Left
    { top: '70%', left: '50%' }, // CB Center
    { top: '70%', left: '80%' }, // CB Right
    { top: '50%', left: '15%' }, // LM
    { top: '50%', left: '40%' }, // CM Left
    { top: '50%', left: '60%' }, // CM Right
    { top: '50%', left: '85%' }, // RM
    { top: '25%', left: '20%' }, // LW
    { top: '15%', left: '50%' }, // ST
    { top: '25%', left: '80%' }, // RW
];

// Correction des indices pour mapper les 11 joueurs du tableau aux positions 3-4-3
// GK(0), CB(1,2,3), LM(4), CM(5,6), RM(7), LW(8), ST(9), RW(10)
// Inversion des coordonnées verticales pour avoir le Gardien en BAS (Attaque vers le haut)
const FORMATION_COORDS = [
    { top: '85%', left: '50%' }, // 0: GK (Gardien en bas)
    { top: '70%', left: '20%' }, // 1: CB
    { top: '70%', left: '50%' }, // 2: CB
    { top: '70%', left: '80%' }, // 3: CB
    { top: '50%', left: '15%' }, // 4: LM
    { top: '50%', left: '38%' }, // 5: CM
    { top: '50%', left: '62%' }, // 6: CM
    { top: '50%', left: '85%' }, // 7: RM
    { top: '28%', left: '20%' }, // 8: LW
    { top: '15%', left: '50%' }, // 9: ST (Attaquant en haut)
    { top: '28%', left: '80%' }, // 10: RW
];

const POSITION_LABELS = ['G', 'DC', 'DC', 'DC', 'MG', 'MC', 'MC', 'MD', 'AG', 'BU', 'AD'];

export const TeamOfTheWeekPage: React.FC<TeamOfTheWeekPageProps> = ({ 
    team, 
    leagueLabel, 
    weekLabel, 
    onBack,
    isSaved = false,
    onToggleSave,
    isEditable = false,
    onCreateNew,
    onModify,
    onShowHistory
}) => {
    const [following, setFollowing] = useState<Record<string, boolean>>({});
    
    // Rating State
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [userRating, setUserRating] = useState<number | null>(null);

    // Share Modal State
    const [showShareModal, setShowShareModal] = useState(false);

    // View Counter State
    const [viewCount, setViewCount] = useState(277);

    // --- Bottom Sheet Logic ---
    const [sheetTop, setSheetTop] = useState(68); // Position initiale en % (68% du haut)
    const [isDragging, setIsDragging] = useState(false);
    const dragStartY = useRef(0);
    const dragStartTop = useRef(0);

    // Constantes de limites (en %)
    const MIN_TOP = 15; // Position haute (ouverte)
    const MAX_TOP = 68; // Position basse (fermée)
    const SNAP_THRESHOLD = (MAX_TOP + MIN_TOP) / 2; // Point de bascule

    // --- Effect: Increment Views on Visit ---
    useEffect(() => {
        const STORAGE_KEY = 'spryto_totw_views';
        const savedViews = localStorage.getItem(STORAGE_KEY);
        
        let newCount = 277; // Default start value

        if (savedViews) {
            // If exists, increment
            newCount = parseInt(savedViews, 10) + 1;
        } else {
            // First visit ever (or storage cleared), start at 277
            newCount = 277;
        }

        setViewCount(newCount);
        localStorage.setItem(STORAGE_KEY, newCount.toString());
    }, []);

    const formatViews = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const toggleFollow = (playerName: string) => {
        setFollowing(prev => ({ ...prev, [playerName]: !prev[playerName] }));
    };

    const handleRateSubmit = (rating: number) => {
        setUserRating(rating);
        // Note: Modal closes automatically after success animation
    };

    const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
        setIsDragging(true);
        // Normaliser event souris/toucher
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        dragStartY.current = clientY;
        dragStartTop.current = sheetTop;
    };

    const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
        if (!isDragging) return;
        
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const deltaY = clientY - dragStartY.current;
        
        // Convertir le delta pixels en delta pourcentage hauteur écran
        const windowHeight = window.innerHeight;
        const deltaPercent = (deltaY / windowHeight) * 100;
        
        // Calculer nouvelle position avec limites
        const newTop = Math.min(MAX_TOP, Math.max(MIN_TOP, dragStartTop.current + deltaPercent));
        
        setSheetTop(newTop);
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        // Logique de Snap
        if (sheetTop < SNAP_THRESHOLD) {
            setSheetTop(MIN_TOP); // Snap vers le haut
        } else {
            setSheetTop(MAX_TOP); // Snap vers le bas
        }
    };

    // Calculer l'opacité des éléments de fond basée sur la position de la sheet
    // MAX_TOP = Opacité 1 (visible), MIN_TOP = Opacité 0 (caché)
    const overlayOpacity = Math.max(0, Math.min(1, (sheetTop - MIN_TOP) / (MAX_TOP - MIN_TOP)));
    
    // Calculer la progression de l'ouverture (0 = Fermé, 1 = Ouvert) pour le Dimming
    const openProgress = 1 - overlayOpacity;

    return (
        <div 
            className="absolute inset-0 z-[60] bg-[#001025] text-white font-sans overflow-hidden animate-in slide-in-from-right duration-300"
            // Attacher les écouteurs de souris globaux au cas où on sort de la zone (pour desktop dev)
            onMouseMove={isDragging ? handleTouchMove : undefined}
            onMouseUp={isDragging ? handleTouchEnd : undefined}
            onMouseLeave={isDragging ? handleTouchEnd : undefined}
        >
            {/* Header Overlay - Fixed Position */}
            <div className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-4 pt-12 pb-4 pointer-events-none">
                <button 
                    onClick={onBack}
                    className="w-10 h-10 flex items-center justify-center text-white active:scale-90 transition-transform bg-black/20 backdrop-blur-md rounded-full pointer-events-auto border border-white/10"
                >
                    <Icon name="arrow_back_ios" className="text-xl pl-1" />
                </button>
                <div className="flex gap-3 pointer-events-auto">
                    <button 
                        onClick={() => setShowShareModal(true)}
                        className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center active:scale-95 border border-white/10 text-gray-300 hover:text-white transition-colors"
                    >
                        <Icon name="ios_share" className="text-lg" />
                    </button>
                    
                    {/* Add Button if Editable, else Save Bookmark */}
                    <button 
                        onClick={isEditable ? onCreateNew : onToggleSave}
                        className={`w-9 h-9 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center active:scale-95 border border-white/10 transition-colors ${!isEditable && isSaved ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                    >
                        <Icon name={isEditable ? "add" : "bookmark"} className={isEditable ? "text-xl" : "text-lg"} filled={!isEditable && isSaved} />
                    </button>

                    {/* History Icon if Editable, else More */}
                    <button 
                        onClick={isEditable ? onShowHistory : undefined}
                        className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center active:scale-95 border border-white/10 text-gray-300 hover:text-white transition-colors"
                    >
                        <Icon name={isEditable ? "history" : "more_horiz"} className="text-lg" />
                    </button>
                </div>
            </div>

            {/* PITCH SECTION - Fixed in background */}
            <div className="absolute top-0 left-0 w-full h-[65%] bg-[#002855] border-b border-white/10 shadow-2xl overflow-hidden transition-all duration-500">
                
                {/* Field Lines */}
                <div className="absolute top-4 bottom-4 left-4 right-4 border-2 border-white/20 rounded-lg"></div>
                <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-white/20 -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-40 h-20 border-b-2 border-x-2 border-white/20 rounded-b-lg"></div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 h-20 border-t-2 border-x-2 border-white/20 rounded-t-lg"></div>

                {/* Players on Pitch */}
                {team.map((player, index) => {
                    const pos = FORMATION_COORDS[index] || { top: '50%', left: '50%' };
                    
                    if (!player) {
                        return (
                            <div 
                                key={index} 
                                className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 opacity-50"
                                style={{ top: pos.top, left: pos.left }}
                            >
                                <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/30 bg-white/5 flex items-center justify-center">
                                    <Icon name="person" className="text-white/30" />
                                </div>
                            </div>
                        );
                    }

                    const displayName = player.name.split(' ').pop()?.toUpperCase() || player.name.toUpperCase();
                    
                    return (
                        <div 
                            key={index} 
                            className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 animate-in zoom-in fade-in"
                            style={{ top: pos.top, left: pos.left, animationDelay: `${index * 50}ms` }}
                        >
                            {/* Player Image */}
                            <div className="relative mb-1">
                                <div className="w-12 h-12 rounded-full border-2 border-white/90 bg-[#0F1115] overflow-hidden shadow-lg relative z-10">
                                    <img src={player.avatar || `https://i.pravatar.cc/150?u=${player.name}`} alt={player.name} className="w-full h-full object-cover" />
                                </div>
                                {player.clubLogo && (
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center p-0.5 shadow-sm z-20">
                                        <img src={player.clubLogo} alt="club" className="w-full h-full object-contain" />
                                    </div>
                                )}
                                <div className="absolute -top-1 -left-1 w-6 h-5 bg-[#10B981] rounded text-[9px] font-bold text-black flex items-center justify-center shadow-md z-20 border border-white/20">
                                    {typeof player.rating === 'number' ? player.rating.toFixed(1) : player.rating}
                                </div>
                            </div>
                            
                            <div className="bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shadow-sm whitespace-nowrap border border-white/10">
                                {displayName}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* BACKDROP DIMMING LAYER - Intercepts clicks to dismiss */}
            <div 
                className="absolute inset-0 z-20 bg-black/60 transition-opacity duration-300"
                style={{ 
                    opacity: openProgress * 0.7, // Max opacity 0.7 when fully open
                    pointerEvents: openProgress > 0.1 ? 'auto' : 'none' // Only active when sheet opens a bit
                }}
                onClick={() => setSheetTop(MAX_TOP)}
            />

            {/* DYNAMIC INFO SECTION - Moves with Sheet */}
            <div 
                className="absolute left-0 right-0 z-40 px-4 pb-6 flex items-end justify-between pointer-events-none"
                style={{ 
                    top: `${sheetTop}%`, 
                    transform: 'translateY(-100%)',
                    opacity: overlayOpacity,
                    transition: isDragging ? 'none' : 'top 0.5s cubic-bezier(0.32, 0.72, 0, 1)'
                }}
            >
                {/* Team Info Overlay */}
                <div className="flex flex-col items-start pb-2">
                    <h1 className="text-lg font-black text-white uppercase tracking-tighter leading-none mb-1 shadow-black drop-shadow-md">
                        {leagueLabel}
                    </h1>
                    <p className="text-xs font-medium text-gray-300 drop-shadow-md">
                        TOTM {weekLabel}
                    </p>
                </div>

                {/* Stats / Action */}
                <div className="flex flex-col items-end gap-1 pb-2 pointer-events-auto">
                    {userRating ? (
                        <div className="bg-white/10 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border border-white/20 flex items-center gap-1">
                            <Icon name="star" className="text-yellow-400 text-xs" filled />
                            <span>{userRating.toFixed(1)}</span>
                        </div>
                    ) : (
                        <button 
                            onClick={isEditable ? onModify : () => setShowRatingModal(true)}
                            className={`${isEditable ? 'bg-white text-black' : 'bg-[#FDCB6E] text-black'} text-[10px] font-black px-3 py-1 rounded-full shadow-lg transition-colors active:scale-95 uppercase tracking-wider hover:opacity-90`}
                        >
                            {isEditable ? 'Modifier' : 'Noter'}
                        </button>
                    )}
                    <div className="flex items-center gap-1 text-white/80 drop-shadow-md" title="Vues">
                        <Icon name="visibility" className="text-xs" />
                        <span className="text-[10px] font-bold">{formatViews(viewCount)}</span>
                    </div>
                </div>
            </div>

            {/* LIST SECTION - Interactive Bottom Sheet */}
            <div 
                className={`absolute left-0 right-0 bottom-0 bg-[#0F1115] rounded-t-[32px] shadow-[0_-10px_60px_rgba(0,0,0,0.7)] border-t border-white/10 flex flex-col z-30`}
                style={{ 
                    top: `${sheetTop}%`,
                    transition: isDragging ? 'none' : 'top 0.5s cubic-bezier(0.32, 0.72, 0, 1)' 
                }}
            >
                {/* Drag Handle Area - Trigger Zone */}
                <div 
                    className="w-full pt-4 pb-2 flex flex-col items-center cursor-grab active:cursor-grabbing touch-none"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleTouchStart}
                >
                    <div className="w-12 h-1.5 bg-white/20 rounded-full mb-2 hover:bg-white/30 transition-colors"></div>
                    
                    {/* "VOIR LA LISTE" Label - Fades out when opened */}
                    <div 
                        className="transition-opacity duration-300"
                        style={{ opacity: sheetTop < 50 ? 0 : 1 }}
                    >
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest animate-pulse">
                            Voir la liste
                        </span>
                    </div>
                </div>
                
                {/* List Header */}
                <div className="flex items-center justify-between px-6 py-2 border-b border-white/5 shrink-0">
                    <span className="text-sm font-medium text-gray-400">Player Name</span>
                    <span className="text-sm font-medium text-gray-400">Note</span>
                </div>

                {/* Scrollable Content */}
                <div 
                    className="flex-1 overflow-y-auto px-2 pb-8 overscroll-contain"
                    // Empêcher le scroll si on est en train de draguer la sheet
                    style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
                >
                    {team.map((player, index) => {
                        if (!player) return null;
                        
                        return (
                            <div key={index} className="flex items-center justify-between py-3 px-4 hover:bg-white/5 rounded-xl transition-colors group cursor-default">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img 
                                            src={player.avatar || `https://i.pravatar.cc/150?u=${player.name}`} 
                                            alt={player.name} 
                                            className="w-10 h-10 rounded-full object-cover bg-gray-700 border border-white/10" 
                                        />
                                        {player.clubLogo && (
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#1C1F26] rounded-full flex items-center justify-center border border-white/10">
                                                <img src={player.clubLogo} alt="" className="w-3 h-3 object-contain" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                                            {player.name}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                                            {POSITION_LABELS[index] || '-'} - {player.team || 'Club'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); toggleFollow(player.name); }}
                                        className={`h-7 px-4 rounded-full text-[10px] font-bold transition-all active:scale-95 ${
                                            following[player.name] 
                                            ? 'bg-white/5 text-gray-400 border border-white/10' 
                                            : 'bg-white text-black shadow-sm'
                                        }`}
                                    >
                                        {following[player.name] ? 'Suivi' : 'Suivre'}
                                    </button>
                                    <span className="text-sm font-bold text-white w-8 text-right">
                                        {typeof player.rating === 'number' ? player.rating.toFixed(1) : player.rating}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                    {/* Padding at bottom to ensure last item is visible */}
                    <div className="h-10"></div>
                </div>
            </div>

            {/* Rating Modal */}
            {showRatingModal && (
                <RatingModal 
                    onClose={() => setShowRatingModal(false)}
                    onSubmit={handleRateSubmit}
                    title="Noter l'équipe"
                    subtitle={`${leagueLabel} - ${weekLabel}`}
                />
            )}

            {/* Share Modal */}
            {showShareModal && (
                <ShareModal 
                    team={{ league: leagueLabel, week: weekLabel }}
                    onClose={() => setShowShareModal(false)}
                />
            )}
        </div>
    );
};
