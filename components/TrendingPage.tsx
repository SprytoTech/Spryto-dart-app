
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Icon } from './Icon';
import { BottomNav } from './BottomNav';
import { LocationModal } from './LocationModal';
import { LeagueSelectorModal } from './LeagueSelectorModal';

interface TrendingPageProps {
  onBack: () => void;
  onTrendingClick: () => void;
  onOpportunitiesClick: () => void;
  onTeamClick?: (team: any[], leagueLabel: string, weekLabel: string) => void;
  onSavedTeamsClick?: () => void;
  onShowAllTrending?: () => void;
  onCreateTeamClick?: () => void;
}

// Génération dynamique des semaines : Passé + Présent uniquement
const generateDynamicWeeks = () => {
    const weeks = [];
    const today = new Date();
    // Trouver le Lundi de la semaine actuelle
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); 
    const currentMonday = new Date(today); // Clone pour ne pas muter today directement si utilisé ailleurs
    currentMonday.setDate(diff);

    // Générer 9 semaines : 8 avant (historique) et la semaine actuelle (0)
    // Pas de semaines futures (i > 0)
    for (let i = -8; i <= 0; i++) {
        const start = new Date(currentMonday);
        start.setDate(currentMonday.getDate() + (i * 7));
        
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        
        const monthNames = ['Jan.', 'Fév.', 'Mars', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'];
        
        const month = monthNames[start.getMonth()];
        const range = `${start.getDate()}-${end.getDate().toString().padStart(2, '0')}`;
        
        weeks.push({
            month,
            range,
            id: `w${i + 8}` // IDs uniques basés sur l'index décalé
        });
    }
    return weeks;
};

const WEEKS = generateDynamicWeeks();
// L'index par défaut est la dernière semaine de la liste (la semaine actuelle)
const CURRENT_WEEK_INDEX = WEEKS.length - 1; 

// Inversion pour avoir le Gardien en BAS (Standard View)
const PITCH_POSITIONS = [
    { top: '85%', left: '50%' }, // GK (Gardien en bas)
    { top: '70%', left: '20%' }, // CB Left
    { top: '70%', left: '50%' }, // CB Center
    { top: '70%', left: '80%' }, // CB Right
    { top: '50%', left: '15%' }, // LM
    { top: '50%', left: '40%' }, // CM Left
    { top: '50%', left: '60%' }, // CM Right
    { top: '50%', left: '85%' }, // RM
    { top: '25%', left: '20%' }, // LW
    { top: '15%', left: '50%' }, // ST (Attaquant en haut)
    { top: '25%', left: '80%' }, // RW
];

// Correction des indices pour mapper les 11 joueurs du tableau aux positions 3-4-3
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

const POSITION_FILTERS = [
    { id: 'GB', label: 'Gardien De But' },
    { id: 'DEF', label: 'Défenseur' },
    { id: 'MIL', label: 'Milieu' },
    { id: 'ATT', label: 'Attaquant' },
];

// --- DATA GENERATION FOR 10,000+ PLAYERS ---
const FIRST_NAMES = ["Lamine", "Lionel", "Cristiano", "Kylian", "Erling", "Vinicius", "Jude", "Kevin", "Harry", "Mohamed", "Rodri", "Luka", "Virgil", "Bernardo", "Antoine", "Lautaro", "Victor", "Declan", "Bukayo", "Phil", "Bruno", "Pedri", "Gavi", "Jamal", "Frenkie", "Marcus", "Martin", "Son", "Rafael", "Ousmane"];
const LAST_NAMES = ["Yamal", "Messi", "Ronaldo", "Mbappé", "Haaland", "Jr", "Bellingham", "De Bruyne", "Kane", "Salah", "Hernandez", "Modric", "Van Dijk", "Silva", "Griezmann", "Martinez", "Osimhen", "Rice", "Saka", "Foden", "Fernandes", "Gonzalez", "Lopez", "Musiala", "De Jong", "Rashford", "Odegaard", "Heung-min", "Leão", "Dembélé"];
const CLUBS = [
    { name: 'FC Barcelona', short: 'FCB', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/100px-FC_Barcelona_%28crest%29.svg.png' },
    { name: 'Real Madrid', short: 'RMA', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/100px-Real_Madrid_CF.svg.png' },
    { name: 'Man City', short: 'MCI', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/100px-Manchester_City_FC_badge.svg.png' },
    { name: 'Arsenal', short: 'ARS', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/100px-Arsenal_FC.svg.png' },
    { name: 'Liverpool', short: 'LIV', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/100px-Liverpool_FC.svg.png' },
    { name: 'Bayern Munich', short: 'BAY', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg/100px-FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg.png' },
    { name: 'PSG', short: 'PSG', logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/8/86/Paris_Saint-Germain_Logo.svg/100px-Paris_Saint-Germain_Logo.svg.png' },
    { name: 'Inter Milan', short: 'INT', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/FC_Internazionale_Milano_2021.svg/100px-FC_Internazionale_Milano_2021.svg.png' },
    { name: 'AC Milan', short: 'ACM', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Logo_of_AC_Milan.svg/100px-Logo_of_AC_Milan.svg.png' },
    { name: 'Juventus', short: 'JUV', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Juventus_FC_2017_icon_%28black%29.svg/100px-Juventus_FC_2017_icon_%28black%29.svg.png' },
];

const generateMockRankedPlayers = (count: number) => {
    return Array.from({ length: count }).map((_, i) => {
        const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
        const lastName = LAST_NAMES[(i + Math.floor(i / FIRST_NAMES.length)) % LAST_NAMES.length];
        const club = CLUBS[i % CLUBS.length];
        
        // Distribute positions roughly realistically
        const randPos = Math.random();
        let position = 'MIL';
        if (randPos < 0.1) position = 'GB';      // 10% Goalkeepers
        else if (randPos < 0.45) position = 'DEF'; // 35% Defenders
        else if (randPos < 0.75) position = 'MIL'; // 30% Midfielders
        else position = 'ATT';                   // 25% Attackers

        return {
            id: `rk-${i}`,
            name: `${firstName} ${lastName}`,
            team: club.name,
            teamShort: club.short,
            position: position,
            rating: 'A', // Simplified rating for now, or calc based on rank
            avatar: `https://i.pravatar.cc/150?u=${i}-${firstName}`,
            clubLogo: club.logo
        };
    });
};

// Generate 10020 players (334 pages of 30)
const ALL_RANKED_PLAYERS = generateMockRankedPlayers(10020);

const LEAGUE_TEAMS: Record<string, any[]> = {
    'global': [
        { name: 'Ederson', rating: 8.7, team: 'Man City', clubLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/100px-Manchester_City_FC_badge.svg.png' },
        { name: 'Saliba', rating: 7.9, team: 'Arsenal', clubLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/100px-Arsenal_FC.svg.png' },
        { name: 'Rüdiger', rating: 8.2, team: 'Real Madrid', clubLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/100px-Real_Madrid_CF.svg.png' },
        { name: 'Van Dijk', rating: 7.7, team: 'Liverpool', clubLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/100px-Liverpool_FC.svg.png' },
        { name: 'Davies', rating: 8.0, team: 'Bayern', clubLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg/100px-FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg.png' },
        { name: 'Rodri', rating: 9.3, team: 'Man City', clubLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/100px-Manchester_City_FC_badge.svg.png' },
        { name: 'Bellingham', rating: 8.9, team: 'Real Madrid', clubLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/100px-Real_Madrid_CF.svg.png' },
        { name: 'Saka', rating: 8.8, team: 'Arsenal', clubLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/100px-Arsenal_FC.svg.png' },
        { name: 'Vinicius Jr', rating: 7.7, team: 'Real Madrid', clubLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/100px-Real_Madrid_CF.svg.png' },
        { name: 'Haaland', rating: 9.1, team: 'Man City', clubLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/100px-Manchester_City_FC_badge.svg.png' },
        { name: 'Mbappé', rating: 8.5, team: 'PSG', clubLogo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/8/86/Paris_Saint-Germain_Logo.svg/100px-Paris_Saint-Germain_Logo.svg.png' },
    ],
    // ... (Other LEAGUE_TEAMS entries kept as is) ...
    'sq_prov_l1qc_m': [
        { name: 'Melvin', rating: 8.2, team: 'CS St-Laurent', clubLogo: 'https://ui-avatars.com/api/?name=CS+StL&background=FDB813&color=000' }, 
        { name: 'Goulet', rating: 7.8, team: 'CS MRO', clubLogo: 'https://ui-avatars.com/api/?name=CS+MRO&background=000000&color=FDB813' }, 
        { name: 'Maltais', rating: 7.5, team: 'Beauport', clubLogo: 'https://ui-avatars.com/api/?name=Beauport&background=FDD835&color=000' }, 
        { name: 'Wandje', rating: 7.9, team: 'CS Longueuil', clubLogo: 'https://ui-avatars.com/api/?name=CS+LUE&background=1E88E5&color=fff' }, 
        { name: 'K. Duboi', rating: 8.8, team: 'FC Laval', clubLogo: 'https://fclaval.qc.ca/wp-content/uploads/2022/09/Logo-FC-Laval-300x300.png' }, 
        { name: 'Si-Ahmed', rating: 8.1, team: 'CS St-Laurent', clubLogo: 'https://ui-avatars.com/api/?name=CS+StL&background=FDB813&color=000' },
        { name: 'Brunet', rating: 7.7, team: 'Blainville', clubLogo: 'https://ui-avatars.com/api/?name=Blainville&background=1E88E5&color=fff' },
        { name: 'Diallo', rating: 8.0, team: 'CS MRO', clubLogo: 'https://ui-avatars.com/api/?name=CS+MRO&background=000000&color=FDB813' },
        { name: 'Kwemi', rating: 8.5, team: 'CS St-Laurent', clubLogo: 'https://ui-avatars.com/api/?name=CS+StL&background=FDB813&color=000' },
        { name: 'Sissoko', rating: 8.3, team: 'CS Longueuil', clubLogo: 'https://ui-avatars.com/api/?name=CS+LUE&background=1E88E5&color=fff' },
        { name: 'Boughanmi', rating: 7.9, team: 'FC Laval', clubLogo: 'https://fclaval.qc.ca/wp-content/uploads/2022/09/Logo-FC-Laval-300x300.png' },
    ],
};

const LEAGUE_TRENDING_PLAYERS: Record<string, any[]> = {
    'global': [
        { id: 'tp_yamal', name: 'L. Yamal', fullName: 'Lamine Yamal', position: 'AD', age: '17', height: '1.78m', weight: '68kg', team: 'FC Barcelona', league: 'La Liga', gender: '(M)', chart: [30, 45, 60, 55, 75, 90, 95], rating: '9.2' },
        { id: 'tp_wze', name: 'Zaire-Emery', fullName: 'Warren Zaïre-Emery', position: 'MC', age: '18', height: '1.78m', weight: '73kg', team: 'PSG', league: 'Ligue 1', gender: '(M)', chart: [40, 50, 55, 65, 70, 85, 88], rating: '8.9' },
        { id: 'tp_mainoo', name: 'K. Mainoo', fullName: 'Kobbie Mainoo', position: 'MDC', age: '18', height: '1.75m', weight: '70kg', team: 'Man Utd', league: 'Premier League', gender: '(M)', chart: [20, 35, 50, 65, 80, 85, 90], rating: '8.7' },
        { id: 'tp_cubarsi', name: 'P. Cubarsí', fullName: 'Pau Cubarsí', position: 'DC', age: '17', height: '1.84m', weight: '75kg', team: 'FC Barcelona', league: 'La Liga', gender: '(M)', chart: [10, 30, 50, 70, 85, 88, 92], rating: '8.8' },
        { id: 'tp_yoro', name: 'L. Yoro', fullName: 'Leny Yoro', position: 'DC', age: '18', height: '1.90m', weight: '80kg', team: 'Lille', league: 'Ligue 1', gender: '(M)', chart: [40, 55, 65, 70, 75, 85, 89], rating: '8.6' },
        { id: 'tp_guler', name: 'A. Güler', fullName: 'Arda Güler', position: 'MOC', age: '19', height: '1.76m', weight: '69kg', team: 'Real Madrid', league: 'La Liga', gender: '(M)', chart: [50, 55, 60, 70, 75, 80, 85], rating: '8.5' },
    ],
    'pl': [
        { id: 'tp_mainoo', name: 'K. Mainoo', fullName: 'Kobbie Mainoo', position: 'MDC', age: '18', height: '1.75m', weight: '70kg', team: 'Man Utd', league: 'Premier League', gender: '(M)', chart: [20, 35, 50, 65, 80, 85, 90], rating: '8.7' },
        { id: 'tp_palmer', name: 'C. Palmer', fullName: 'Cole Palmer', position: 'MOC', age: '21', height: '1.89m', weight: '74kg', team: 'Chelsea', league: 'Premier League', gender: '(M)', chart: [40, 50, 60, 75, 80, 88, 92], rating: '9.0' },
        { id: 'tp_garnacho', name: 'A. Garnacho', fullName: 'Alejandro Garnacho', position: 'AG', age: '19', height: '1.80m', weight: '73kg', team: 'Man Utd', league: 'Premier League', gender: '(M)', chart: [30, 45, 50, 65, 75, 85, 88], rating: '8.6' },
        { id: 'tp_bobb', name: 'O. Bobb', fullName: 'Oscar Bobb', position: 'AD', age: '20', height: '1.75m', weight: '70kg', team: 'Man City', league: 'Premier League', gender: '(M)', chart: [20, 30, 45, 55, 65, 75, 82], rating: '8.3' },
    ],
    'laliga': [
        { id: 'tp_yamal', name: 'L. Yamal', fullName: 'Lamine Yamal', position: 'AD', age: '17', height: '1.78m', weight: '68kg', team: 'FC Barcelona', league: 'La Liga', gender: '(M)', chart: [30, 45, 60, 55, 75, 90, 95], rating: '9.2' },
        { id: 'tp_guler', name: 'A. Güler', fullName: 'Arda Güler', position: 'MOC', age: '19', height: '1.76m', weight: '69kg', team: 'Real Madrid', league: 'La Liga', gender: '(M)', chart: [50, 55, 60, 70, 75, 80, 85], rating: '8.5' },
        { id: 'tp_cubarsi', name: 'P. Cubarsí', fullName: 'Pau Cubarsí', position: 'DC', age: '17', height: '1.84m', weight: '75kg', team: 'FC Barcelona', league: 'La Liga', gender: '(M)', chart: [10, 30, 50, 70, 85, 88, 92], rating: '8.8' },
        { id: 'tp_barrios', name: 'P. Barrios', fullName: 'Pablo Barrios', position: 'MC', age: '20', height: '1.81m', weight: '76kg', team: 'Atlético', league: 'La Liga', gender: '(M)', chart: [35, 45, 55, 60, 70, 78, 83], rating: '8.4' },
    ],
    'sq_prov_l1qc_m': [
        { id: 'tp_l1qc_1', name: 'M. Sissoko', fullName: 'Mahamadou Sissoko', position: 'BU', age: '21', height: '1.85m', weight: '78kg', team: 'CS Longueuil', league: 'L1QC', gender: '(M)', chart: [20, 30, 45, 50, 60, 75, 80], rating: '8.4' },
        { id: 'tp_l1qc_2', name: 'K. St-Fort', fullName: 'Karl St-Fort', position: 'AG', age: '20', height: '1.75m', weight: '70kg', team: 'CS St-Laurent', league: 'L1QC', gender: '(M)', chart: [30, 40, 45, 55, 65, 70, 78], rating: '8.1' },
        { id: 'tp_l1qc_3', name: 'O. Diop', fullName: 'Oumar Diop', position: 'MC', age: '19', height: '1.80m', weight: '72kg', team: 'FC Laval', league: 'L1QC', gender: '(M)', chart: [40, 45, 50, 60, 65, 75, 79], rating: '7.9' },
        { id: 'tp_l1qc_4', name: 'A. Toure', fullName: 'Amadou Toure', position: 'DC', age: '22', height: '1.88m', weight: '82kg', team: 'CS MRO', league: 'L1QC', gender: '(M)', chart: [50, 55, 60, 65, 70, 75, 82], rating: '8.3' },
    ]
};

const getLeagueLabel = (leagueId: string | undefined, location: string) => {
    if (leagueId) {
        if (leagueId === 'pl') return 'PREMIER LEAGUE';
        if (leagueId.includes('l1qc')) return 'L1QC';
        return 'GLOBAL';
    } 
    return 'GLOBAL';
};

const getTeamOfTheMoment = (leagueIds: string[], location: string, weekIndex: number) => {
    let basePlayers: any[] = [];
    let sourceId = 'global';

    if (leagueIds.length > 0) {
        const id = leagueIds[0];
        if (LEAGUE_TEAMS[id]) sourceId = id;
        else if (id.includes('l1qc')) sourceId = 'sq_prov_l1qc_m';
    } 

    basePlayers = [...LEAGUE_TEAMS[sourceId] || LEAGUE_TEAMS['global']];
    return basePlayers;
};

const MiniChart = ({ data }: { data: number[] }) => (
    <div className="flex items-end gap-0.5 h-6 w-12">
        {data.map((val, i) => (
            <div key={i} style={{ height: `${val}%` }} className="w-2 bg-green-500/50 rounded-t-sm"></div>
        ))}
    </div>
);

const BigChart = ({ data }: { data: number[] }) => {
    const max = 100;
    const min = 0;
    const width = 300;
    const height = 100;
    
    if (!data || data.length < 2) return null;

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

const HexagonBadge = ({ rank, tier }: { rank: number, tier: 'gold' | 'silver' | 'bronze' }) => {
    // Colors based on tier (ratio)
    let style = { background: '#CD7F32', color: 'white', shadow: 'rgba(205,127,50,0.4)' }; // Default Bronze
    
    if (tier === 'gold') {
        style = { background: '#FFD700', color: 'black', shadow: 'rgba(255,215,0,0.4)' };
    } else if (tier === 'silver') {
        style = { background: '#C0C0C0', color: 'black', shadow: 'rgba(192,192,192,0.4)' };
    }

    return (
        <div className="relative w-8 h-8 flex items-center justify-center">
            <div 
                className="absolute inset-0"
                style={{ 
                    backgroundColor: style.background,
                    boxShadow: `0 0 10px ${style.shadow}`,
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                }}
            ></div>
            <span className="relative z-10 font-black text-xs" style={{ color: style.color }}>
                {rank}
            </span>
        </div>
    );
};

export const TrendingPage: React.FC<TrendingPageProps> = ({ 
    onBack, 
    onTrendingClick, 
    onOpportunitiesClick, 
    onTeamClick, 
    onSavedTeamsClick, 
    onShowAllTrending,
    onCreateTeamClick
}) => {
    const [activeTab, setActiveTab] = useState('matchs');
    const [activeWeekIndex, setActiveWeekIndex] = useState(CURRENT_WEEK_INDEX);
    const [selectedLeagues, setSelectedLeagues] = useState<string[]>(['sq_prov_l1qc_m']);
    const [location, setLocation] = useState('Montréal, QC');
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [showLeagueSelector, setShowLeagueSelector] = useState(false);
    
    // State for Selected Player Modal
    const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);

    // State for Position Filter
    const [selectedPosition, setSelectedPosition] = useState<string>('ALL');
    const [showPositionModal, setShowPositionModal] = useState(false);

    // Search State (Quick Search on Ranking List)
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchActive, setIsSearchActive] = useState(false);

    // --- Global Player Search State ---
    const [showPlayerSearch, setShowPlayerSearch] = useState(false);
    const [playerSearchQuery, setPlayerSearchQuery] = useState('');
    const [viewingPlayerHistory, setViewingPlayerHistory] = useState<any | null>(null);

    // --- PAGINATION STATE ---
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 30;
    const playersContainerRef = useRef<HTMLDivElement>(null);

    const weeksContainerRef = useRef<HTMLDivElement>(null);

    // Effect to scroll to current week on mount
    useEffect(() => {
        if (weeksContainerRef.current) {
            const itemWidth = 64; 
            const containerWidth = weeksContainerRef.current.clientWidth;
            const scrollPos = (activeWeekIndex * itemWidth) - (containerWidth / 2) + (itemWidth / 2);
            
            weeksContainerRef.current.scrollTo({
                left: Math.max(0, scrollPos),
                behavior: 'smooth'
            });
        }
    }, [activeWeekIndex]);

    // Validation Logic: Ensure required filters are present
    const isFilterReady = useMemo(() => {
        if (!location) return false;
        if (selectedLeagues.length === 0) return false;
        const id = selectedLeagues[0].toLowerCase();
        if (id.includes('ldp') || id.includes('plsjq')) {
            return /_u\d+/.test(id);
        }
        return true;
    }, [location, selectedLeagues]);

    const activeTeam = useMemo(() => {
        if (!isFilterReady) return [];
        return getTeamOfTheMoment(selectedLeagues, location, activeWeekIndex);
    }, [selectedLeagues, location, activeWeekIndex, isFilterReady]);

    const teamSectionTitle = useMemo(() => {
        if (!isFilterReady) return 'Veuillez configurer les filtres';
        const week = WEEKS[activeWeekIndex];
        const league = getLeagueLabel(selectedLeagues[0], location);
        return `${league} - TOTM ${week.month} ${week.range}`;
    }, [activeWeekIndex, selectedLeagues, location, isFilterReady]);

    // Dynamic Trending Players based on League Filter
    const projectedPlayers = useMemo(() => {
        if (!isFilterReady || selectedLeagues.length === 0) return [];
        
        const leagueId = selectedLeagues[0];
        let trendingSource = LEAGUE_TRENDING_PLAYERS['global'];

        if (LEAGUE_TRENDING_PLAYERS[leagueId]) {
            trendingSource = LEAGUE_TRENDING_PLAYERS[leagueId];
        } else if (leagueId.includes('l1qc')) {
            trendingSource = LEAGUE_TRENDING_PLAYERS['sq_prov_l1qc_m'];
        } else if (leagueId === 'pl') {
            trendingSource = LEAGUE_TRENDING_PLAYERS['pl'];
        } else if (leagueId === 'laliga') {
            trendingSource = LEAGUE_TRENDING_PLAYERS['laliga'];
        }

        return trendingSource;
    }, [selectedLeagues, isFilterReady]); 

    // Changed chunk size from 3 to 2
    const chunkedPlayers = useMemo(() => {
        const size = 2; // Updated to 2
        const result = [];
        for (let i = 0; i < projectedPlayers.length; i += size) {
            result.push(projectedPlayers.slice(i, i + size));
        }
        return result;
    }, [projectedPlayers]);

    // --- FILTERED & PAGINATED PLAYERS ---
    const filteredTopPlayers = useMemo(() => {
        let players = ALL_RANKED_PLAYERS;
        
        if (selectedPosition !== 'ALL') {
            players = players.filter(p => p.position === selectedPosition);
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            players = players.filter(p => 
                p.name.toLowerCase().includes(q) || 
                p.team.toLowerCase().includes(q)
            );
        }

        return players;
    }, [selectedPosition, searchQuery]);

    const totalPages = Math.ceil(filteredTopPlayers.length / ITEMS_PER_PAGE);

    const paginatedPlayers = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredTopPlayers.slice(startIndex, endIndex);
    }, [filteredTopPlayers, currentPage]);

    // Reset pagination when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedPosition, searchQuery]);

    // Scroll to top of list when page changes
    useEffect(() => {
        if (playersContainerRef.current) {
            playersContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
        // Also scroll the main container if needed, but the ref above is for local list if separated
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    // Global Search Logic
    const globalSearchResults = useMemo(() => {
        if (!playerSearchQuery || playerSearchQuery.length < 2) return [];
        const q = playerSearchQuery.toLowerCase();
        
        // Combine all potential sources: Ranked Players + Team of Week + Trending
        // Deduplicate by name for simplicity in this demo
        const allSources = [
            ...ALL_RANKED_PLAYERS,
            ...Object.values(LEAGUE_TEAMS).flat(),
            ...Object.values(LEAGUE_TRENDING_PLAYERS).flat()
        ];

        const seen = new Set();
        const results = [];

        for (const p of allSources) {
            if (!p.name) continue;
            if (seen.has(p.name)) continue;
            
            if (p.name.toLowerCase().includes(q)) {
                seen.add(p.name);
                results.push(p);
            }
        }
        
        return results.slice(0, 20); // Limit results
    }, [playerSearchQuery]);

    // Helper to calculate stats for history view
    const getPlayerHistoryStats = (player: any) => {
        const name = player.name;
        
        // 1. Check Ranking
        const rankIndex = ALL_RANKED_PLAYERS.findIndex(p => p.name === name);
        const rank = rankIndex !== -1 ? rankIndex + 1 : null;

        // 2. Check TOTW History (Mock: check if name is in any LEAGUE_TEAMS list)
        const totwAppearances: { label: string, date: string }[] = [];
        Object.entries(LEAGUE_TEAMS).forEach(([leagueKey, team]) => {
            if (team.some(p => p.name === name)) {
                let label = "Global";
                if(leagueKey.includes('l1qc')) label = "L1QC";
                
                // Add mock dates for history
                const mockDates = ["Semaine 12 - Oct. 2023", "Semaine 24 - Fév. 2024"];
                mockDates.forEach(d => totwAppearances.push({ label, date: d }));
            }
        });

        // 3. Check Trending
        let isTrending = false;
        let chartData: number[] = [];
        // Attempt to find detailed data (chart, age, height, etc) from LEAGUE_TRENDING_PLAYERS
        // Or generate it if missing
        let enrichedPlayer = { ...player };

        // Search in trending lists first
        let foundTrending = false;
        Object.values(LEAGUE_TRENDING_PLAYERS).flat().forEach(p => {
            if (p.name === name) {
                isTrending = true;
                foundTrending = true;
                chartData = p.chart || [];
                enrichedPlayer = { ...enrichedPlayer, ...p }; // Merge details
            }
        });

        if (!foundTrending) {
            // Generate plausible random stats if not found in detailed lists
            if (!enrichedPlayer.age) enrichedPlayer.age = Math.floor(Math.random() * (32 - 17) + 17).toString();
            if (!enrichedPlayer.height) enrichedPlayer.height = `1.${Math.floor(Math.random() * (95 - 70) + 70)}m`;
            if (!enrichedPlayer.weight) enrichedPlayer.weight = `${Math.floor(Math.random() * (85 - 65) + 65)}kg`;
            if (!enrichedPlayer.league) enrichedPlayer.league = "L1QC"; // Default
            
            // Mock chart data for general players
            chartData = Array.from({length: 7}, () => Math.floor(Math.random() * 40 + 40)).sort((a, b) => a - b);
        }

        return { 
            rank, 
            totwAppearances, 
            isTrending, 
            chartData,
            ...enrichedPlayer 
        };
    };

    const handleGlobalPlayerClick = (player: any) => {
        const stats = getPlayerHistoryStats(player);
        setViewingPlayerHistory(stats);
    };

    const handleHistoryItemClick = (item: { label: string, date: string }) => {
        // Generate a mock team for this historical week
        // In a real app, this would fetch by ID.
        // For prototype, we use the league label to pick a mock team
        let sourceId = 'global';
        if (item.label.includes('L1QC')) sourceId = 'sq_prov_l1qc_m';
        
        const mockHistoricalTeam = [...(LEAGUE_TEAMS[sourceId] || LEAGUE_TEAMS['global'])]; 
        const leagueLabel = item.label;
        const weekLabel = item.date;

        if (onTeamClick) {
            onTeamClick(mockHistoricalTeam, leagueLabel, weekLabel);
        }
    };

    // Changed to Plural
    const trendingSectionTitle = "Joueurs à surveiller";

    const handleLeagueApply = (ids: string[]) => {
        setSelectedLeagues(ids);
    };

    const handleCardClick = () => {
        if (!isFilterReady) return;
        const week = WEEKS[activeWeekIndex];
        const label = getLeagueLabel(selectedLeagues[0], location);
        const weekLabel = `${week.month} ${week.range}`;
        if (onTeamClick) {
            onTeamClick(activeTeam, label, weekLabel);
        }
    };

    const handlePlayerClick = (player: any) => {
        setSelectedPlayer(player);
        setIsFollowing(false);
    };

    const getMissingCriteria = () => {
        if (!location) return "une localisation";
        if (selectedLeagues.length === 0) return "une ligue et un sexe";
        const id = selectedLeagues[0].toLowerCase();
        if ((id.includes('ldp') || id.includes('plsjq')) && !/_u\d+/.test(id)) {
            return "une catégorie d'âge";
        }
        return "";
    };

    // Helper to display friendly name for selected leagues (reused logic)
    const getLeagueDisplay = () => {
        if (selectedLeagues.length === 0) return 'Ligue';
        if (selectedLeagues.length > 1) return `${selectedLeagues.length} Ligues`;
        
        const id = selectedLeagues[0];
        const parts = id.split('_');
        let leagueName = '';
        
        if (id === 'pl') leagueName = 'Premier League';
        else if (id === 'laliga') leagueName = 'La Liga';
        else if (id === 'bundesliga') leagueName = 'Bundesliga';
        else if (id === 'ligue1') leagueName = 'Ligue 1';
        else if (id === 'seriea') leagueName = 'Serie A';
        else if (id === 'mls') leagueName = 'MLS';
        else if (parts.includes('l1qc')) leagueName = 'L1QC';
        else if (id.includes('soccer_quebec')) leagueName = 'Soccer Québec';
        else {
             leagueName = id.charAt(0).toUpperCase() + id.slice(1);
             if (leagueName.includes('_')) leagueName = 'Ligue';
        }
        return leagueName;
    };

    const toggleSearch = () => {
        if (isSearchActive) {
            setIsSearchActive(false);
            setSearchQuery('');
        } else {
            setIsSearchActive(true);
        }
    };

    return (
        <div className="absolute inset-0 z-[50] bg-[#0F1115] text-white font-sans flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="bg-[#0F1115] pt-12 pb-0 z-20">
          <div className="px-4 flex items-center justify-between mb-4">
              <button onClick={onBack} className="text-gray-300 hover:text-white">
                  <Icon name="arrow_back" className="text-2xl" />
              </button>
              <div className="flex flex-col items-center">
                  <h1 className="text-[15px] font-bold uppercase tracking-widest text-white">SCENE</h1>
                  <button 
                        onClick={() => setShowLocationModal(true)}
                        className="flex items-center gap-1 mt-0.5 group"
                    >
                        <Icon name="location_on" className="text-[10px] text-blue-500" filled />
                        <span className="text-[11px] font-bold text-gray-300 group-hover:text-white transition-colors">{location.split(',')[0]}</span>
                        <Icon name="expand_more" className="text-[10px] text-gray-500" />
                    </button>
              </div>
              <div className="flex items-center gap-4">
                  <button 
                    onClick={onSavedTeamsClick}
                    className="text-gray-300 hover:text-white"
                  >
                      <Icon name="bookmark_border" className="text-2xl" />
                  </button>
                  {/* Search Button for Global Player Search */}
                  <button 
                    onClick={() => setShowPlayerSearch(true)}
                    className="text-gray-300 hover:text-white"
                  >
                      <Icon name="search" className="text-2xl" />
                  </button>
              </div>
          </div>

          {/* Tabs */}
          <div className="flex w-full border-b border-white/10 relative px-4">
              <button 
                onClick={() => setActiveTab('matchs')}
                className={`flex-1 text-center pb-3 text-[14px] font-bold transition-colors relative ${activeTab === 'matchs' ? 'text-white' : 'text-gray-500'}`}
              >
                  Tendance
                  {activeTab === 'matchs' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-t-full"></div>}
              </button>
              <button 
                onClick={() => setActiveTab('players')}
                className={`flex-1 text-center pb-3 text-[14px] font-bold transition-colors relative ${activeTab === 'players' ? 'text-white' : 'text-gray-500'}`}
              >
                  Top joueurs
                  {activeTab === 'players' && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-t-full"></div>}
              </button>
          </div>
      </div>

      {/* Main Content */}
      <div 
        className="flex-1 overflow-y-auto hide-scrollbar pb-24 bg-[#0F1115]"
        ref={activeTab === 'players' ? playersContainerRef : undefined}
      >
          
          {/* Calendar Strip */}
          <div className="py-6 border-b border-white/5">
              <div 
                ref={weeksContainerRef}
                className="flex items-center gap-5 px-4 overflow-x-auto hide-scrollbar snap-x"
              >
                  {WEEKS.map((item, idx) => {
                      const isActive = idx === activeWeekIndex;
                      return (
                          <div 
                            key={idx} 
                            onClick={() => setActiveWeekIndex(idx)}
                            className={`flex flex-col items-center gap-2 cursor-pointer group snap-center min-w-[44px] shrink-0`}
                          >
                              <span className={`text-[10px] font-medium uppercase transition-colors whitespace-nowrap ${isActive ? 'text-white font-bold' : 'text-gray-400 group-hover:text-gray-200'}`}>
                                  {item.month}
                              </span>
                              <div className={`h-10 px-2.5 min-w-[44px] flex items-center justify-center rounded-xl text-[12px] font-bold transition-all ${isActive ? 'bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.2)] scale-110' : 'text-white hover:bg-white/5'}`}>
                                  {item.range}
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>

          {/* Filters Bar - Toggle Search (List Filter) */}
          <div className="px-4 py-6 flex items-center justify-between gap-2">
              {activeTab === 'players' && isSearchActive ? (
                  <div className="flex-1 bg-[#1C1F26] rounded-full flex items-center px-4 py-2 border border-white/10 animate-in fade-in duration-200">
                      <Icon name="search" className="text-gray-400 text-lg mr-2" />
                      <input 
                          type="text" 
                          placeholder="Filtrer la liste..." 
                          className="bg-transparent border-none text-white text-[13px] font-bold w-full focus:outline-none placeholder-gray-500 p-0"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          autoFocus
                      />
                  </div>
              ) : (
                  <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar animate-in fade-in duration-200">
                      {activeTab === 'players' && (
                          <button 
                              onClick={() => setShowPositionModal(true)}
                              className={`flex items-center gap-2 bg-[#1C1F26] text-white px-4 py-2 rounded-full border transition-colors active:scale-95 ${selectedPosition !== 'ALL' ? 'border-white bg-white/10' : 'border-white/10 hover:bg-white/5'}`}
                          >
                              <span className="text-[13px] font-bold whitespace-nowrap">
                                  {selectedPosition === 'ALL' ? 'Position' : POSITION_FILTERS.find(f => f.id === selectedPosition)?.label || 'Position'}
                              </span>
                              <Icon name="expand_more" className="text-gray-400 text-lg" />
                          </button>
                      )}

                      <button 
                          onClick={() => setShowLeagueSelector(true)}
                          className={`flex items-center gap-2 bg-[#1C1F26] text-white px-4 py-2 rounded-full border transition-colors active:scale-95 ${!isFilterReady && selectedLeagues.length === 0 ? 'border-blue-500 ring-1 ring-blue-500/50' : 'border-white/10 hover:bg-white/5'}`}
                      >
                          <span className="text-[13px] font-bold whitespace-nowrap">
                              {getLeagueDisplay()}
                          </span>
                          <Icon name="expand_more" className="text-gray-400 text-lg" />
                      </button>
                  </div>
              )}

              {activeTab === 'players' ? (
                  <button 
                      onClick={toggleSearch}
                      className={`w-10 h-10 flex items-center justify-center rounded-full border transition-colors shrink-0 ${isSearchActive ? 'bg-white text-black border-white' : 'bg-[#1C1F26] border-white/10 text-gray-400 hover:text-white'}`}
                  >
                      <Icon name={isSearchActive ? "close" : "filter_list"} className="text-lg" />
                  </button>
              ) : (
                  <button className="w-10 h-10 flex items-center justify-center bg-[#1C1F26] rounded-full border border-white/10 shrink-0">
                      <Icon name="swap_vert" className="text-gray-400 text-lg" />
                  </button>
              )}
          </div>

          {/* CONTENT SWITCHER */}
          {activeTab === 'players' ? (
              // --- TOP PLAYERS LIST VIEW ---
              <div className="px-4 pb-20 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                          LES PLUS PERFORMANTS
                      </h3>
                      <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-500">
                              {filteredTopPlayers.length} Joueurs
                          </span>
                          {selectedPosition !== 'ALL' && (
                              <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full border border-blue-400/20">
                                  {POSITION_FILTERS.find(f => f.id === selectedPosition)?.label}
                              </span>
                          )}
                      </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                      {paginatedPlayers.length > 0 ? (
                          paginatedPlayers.map((player, index) => {
                              // Global rank calculation
                              const globalRank = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                              const totalCount = filteredTopPlayers.length;
                              
                              // Logic for tier distribution based on Ratio (Requested feature)
                              // Gold: Top 15%
                              // Silver: Next 35% (Cumulative 50%)
                              // Bronze: Rest (Bottom 50%)
                              const goldThreshold = Math.max(3, Math.ceil(totalCount * 0.15));
                              const silverThreshold = Math.max(10, Math.ceil(totalCount * 0.50));
                              
                              let tier: 'gold' | 'silver' | 'bronze' = 'bronze';
                              if (globalRank <= goldThreshold) tier = 'gold';
                              else if (globalRank <= silverThreshold) tier = 'silver';

                              return (
                                  <div 
                                    key={player.id}
                                    className="flex items-center justify-between p-3 bg-[#1C1F26]/50 hover:bg-[#1C1F26] rounded-2xl border border-white/5 active:scale-[0.99] transition-all cursor-pointer"
                                  >
                                      <div className="flex items-center gap-4">
                                          {/* Avatar */}
                                          <div className="relative">
                                              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 border border-white/10">
                                                  <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                                              </div>
                                          </div>

                                          <div className="flex flex-col">
                                              <span className="text-[15px] font-bold text-white leading-tight">
                                                  {player.name}
                                              </span>
                                              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-400 font-medium">
                                                  {player.clubLogo && (
                                                      <img src={player.clubLogo} alt="" className="w-3.5 h-3.5 object-contain" />
                                                  )}
                                                  <span className="uppercase tracking-wide">{player.teamShort} • {player.position}</span>
                                              </div>
                                          </div>
                                      </div>

                                      {/* Rating Hexagon Badge - Passes global rank and tier */}
                                      <HexagonBadge rank={globalRank} tier={tier} />
                                  </div>
                              );
                          })
                      ) : (
                          <div className="py-10 text-center text-gray-500 text-sm italic">
                              Aucun joueur trouvé pour ce poste.
                          </div>
                      )}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-4 mt-8 pt-4 border-t border-white/5">
                          <button 
                              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                              disabled={currentPage === 1}
                              className={`w-10 h-10 flex items-center justify-center rounded-full bg-[#1C1F26] border border-white/10 transition-all ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10 active:scale-95'}`}
                          >
                              <Icon name="chevron_left" className="text-white" />
                          </button>
                          
                          <span className="text-xs font-bold text-gray-400 tabular-nums">
                              Page <span className="text-white">{currentPage}</span> / {totalPages}
                          </span>

                          <button 
                              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                              disabled={currentPage === totalPages}
                              className={`w-10 h-10 flex items-center justify-center rounded-full bg-[#1C1F26] border border-white/10 transition-all ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10 active:scale-95'}`}
                          >
                              <Icon name="chevron_right" className="text-white" />
                          </button>
                      </div>
                  )}
              </div>
          ) : (
              // --- TRENDING / TEAM VIEW (Default) ---
              isFilterReady ? (
                  <>
                    {/* Section: Team of the Moment */}
                    <div className="mb-12 animate-in fade-in duration-500">
                        <div className="px-4 flex items-center justify-between mb-4">
                            <h3 className="text-[14px] font-black text-white uppercase tracking-wide truncate max-w-[80%]">
                                {teamSectionTitle}
                            </h3>
                            <button className="w-6 h-6 rounded-full bg-[#1C1F26] flex items-center justify-center border border-white/10"><Icon name="chevron_right" className="text-xs text-gray-400" /></button>
                        </div>
                        
                        <div className="flex gap-4 overflow-x-auto px-4 hide-scrollbar snap-x">
                            <div 
                                onClick={handleCardClick}
                                className="w-full aspect-[3/4] bg-blue-900 rounded-2xl relative overflow-hidden border border-white/10 shadow-lg snap-center cursor-pointer active:scale-[0.99] transition-transform"
                            >
                                <div className="absolute inset-0 bg-[#002855]">
                                    <div className="absolute top-4 bottom-4 left-4 right-4 border-2 border-white/20 rounded-lg"></div>
                                    <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-white/20 -translate-y-1/2"></div>
                                    <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-40 h-20 border-b-2 border-x-2 border-white/20 rounded-b-lg"></div>
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 h-20 border-t-2 border-x-2 border-white/20 rounded-t-lg"></div>
                                </div>

                                <div className="absolute top-3 right-3 z-30 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 shadow-sm">
                                    <span className="text-[10px] font-black text-white uppercase tracking-wider">
                                        {getLeagueDisplay()}
                                    </span>
                                </div>

                                {activeTeam.map((p, index) => {
                                    const pos = PITCH_POSITIONS[index] || { top: '50%', left: '50%' };
                                    return (
                                        <div key={index} className="absolute flex flex-col items-center" style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)' }}>
                                            <div className="relative">
                                                <div className="w-11 h-11 rounded-full border-2 border-white overflow-hidden bg-gray-800 shadow-md relative z-10">
                                                    <img src={`https://i.pravatar.cc/100?u=${p.name}`} alt={p.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="absolute top-1.5 -left-3 z-20 bg-[#6CC070] text-black text-[10px] font-bold px-1 py-0.5 rounded-sm shadow-sm leading-none min-w-[22px] text-center border border-white/10">
                                                    {p.rating}
                                                </div>
                                                <div className="absolute bottom-0 -right-2 z-20 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 overflow-hidden p-0.5">
                                                    <img src={p.clubLogo} alt="" className="w-full h-full object-contain" />
                                                </div>
                                            </div>
                                            <div className="mt-1 bg-black/40 backdrop-blur-[2px] text-white text-[9px] font-medium px-2 py-0.5 rounded-full uppercase leading-none max-w-[80px] truncate text-center shadow-sm">
                                                {p.name.split(' ').slice(-1)[0]}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Section: Players to Watch - Updated to 2 rows */}
                    <div className="mb-12 animate-in fade-in duration-500">
                        <div 
                            className="px-4 flex items-center justify-between mb-4 cursor-pointer group"
                            onClick={onShowAllTrending}
                        >
                            <h3 className="text-[14px] font-black text-white uppercase tracking-wide group-hover:text-blue-400 transition-colors">
                                {trendingSectionTitle}
                            </h3>
                            <button className="w-6 h-6 rounded-full bg-[#1C1F26] flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors"><Icon name="chevron_right" className="text-xs text-gray-400 group-hover:text-white" /></button>
                        </div>

                        <div className="flex gap-4 overflow-x-auto px-4 hide-scrollbar snap-x">
                            {chunkedPlayers.map((group, groupIndex) => (
                                <div key={groupIndex} className="min-w-[300px] flex flex-col gap-2 snap-center">
                                    {group.map((player) => (
                                        <div 
                                            key={player.id}
                                            onClick={() => handlePlayerClick(player)}
                                            className="bg-[#1C1F26] p-3 rounded-xl flex items-center justify-between border border-white/5 active:scale-[0.98] transition-transform cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-500 font-bold text-xs w-4">{(groupIndex * 2) + group.indexOf(player) + 1}</span>
                                                <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden border border-white/10">
                                                    <img src={`https://i.pravatar.cc/100?u=${player.fullName.replace(' ', '')}`} alt={player.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-white">{player.name}</span>
                                                    <span className="text-[10px] text-gray-400">{player.team} • {player.position}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-3">
                                                <MiniChart data={player.chart} />
                                                <div className="w-8 h-8 rounded-full bg-[#10B981]/10 flex items-center justify-center border border-[#10B981]/20">
                                                    <span className="text-[10px] font-bold text-[#10B981]">{player.rating}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                  </>
              ) : (
                  /* EMPTY STATE / CONFIGURATION PROMPT */
                  <div className="flex flex-col items-center justify-center py-16 px-8 animate-in fade-in zoom-in duration-300">
                      <div className="relative mb-6">
                          <div className="w-24 h-24 bg-[#1C1F26] rounded-full flex items-center justify-center border border-white/10 relative z-10">
                              <Icon name="tune" className="text-4xl text-gray-500" />
                          </div>
                          <div className="absolute top-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-4 border-[#0F1115] z-20 animate-bounce">
                              <Icon name="priority_high" className="text-white text-sm font-bold" />
                          </div>
                      </div>
                      
                      <h3 className="text-lg font-black text-white uppercase tracking-wide mb-2 text-center">
                          Configuration requise
                      </h3>
                      
                      <p className="text-sm text-gray-400 text-center leading-relaxed max-w-[280px] mb-8">
                          Pour afficher l'équipe du moment et les joueurs à surveiller, veuillez sélectionner <strong>{getMissingCriteria()}</strong>.
                      </p>

                      <button 
                          onClick={() => !location ? setShowLocationModal(true) : setShowLeagueSelector(true)}
                          className="bg-white text-black px-8 py-3 rounded-full font-bold text-sm shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95 transition-all hover:bg-gray-200"
                      >
                          Configurer maintenant
                  </button>
                  </div>
              )
          )}

          {activeTab === 'matchs' && (
            <>
                <div className="mb-12 px-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[14px] font-black text-white uppercase tracking-wide">VOTE</h3>
                    </div>
                    <div 
                        onClick={onCreateTeamClick}
                        className="relative w-full h-[220px] rounded-3xl overflow-hidden shadow-2xl group cursor-pointer border border-white/10 active:scale-[0.98] transition-transform"
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=1000')] bg-cover bg-center"></div>
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-red-900/90 via-[#2a0a0a]/80 to-black/90 mix-blend-multiply"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                            {/* Badge */}
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full mb-3 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                                <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-1">
                                    <Icon name="whatshot" className="text-sm" filled />
                                    En cours
                                </span>
                            </div>

                            {/* Title */}
                            <h2 className="text-3xl font-black italic text-white tracking-tighter uppercase mb-1 drop-shadow-xl text-center leading-none">
                                Équipe de la <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Semaine</span>
                            </h2>

                            <p className="text-xs text-gray-300 font-medium mb-6 opacity-80">Votez pour les meilleurs talents</p>

                            {/* Avatar Stack (Redesigned) */}
                            <div className="flex items-center justify-center -space-x-4">
                                {/* Left */}
                                <div className="w-10 h-10 rounded-full border-2 border-red-500/50 relative z-10 opacity-60 scale-90 grayscale">
                                    <img src="https://images.fotmob.com/image_resources/playerimages/198205.png" className="w-full h-full object-cover rounded-full" alt="" />
                                </div>
                                {/* Center (Hero) */}
                                <div className="w-14 h-14 rounded-full border-2 border-red-500 relative z-20 shadow-[0_0_20px_rgba(220,38,38,0.6)] bg-black">
                                    <img src="https://images.fotmob.com/image_resources/playerimages/737066.png" className="w-full h-full object-cover rounded-full" alt="" />
                                    <div className="absolute -bottom-2 -right-2 bg-white text-black rounded-full w-6 h-6 flex items-center justify-center border-2 border-black">
                                        <Icon name="add" className="text-sm font-bold" />
                                    </div>
                                </div>
                                {/* Right */}
                                <div className="w-10 h-10 rounded-full border-2 border-red-500/50 relative z-10 opacity-60 scale-90 grayscale">
                                    <img src="https://images.fotmob.com/image_resources/playerimages/292462.png" className="w-full h-full object-cover rounded-full" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: Stats CTA */}
                <div className="mb-12 px-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[14px] font-black text-white uppercase tracking-wide">Récupère tes stats</h3>
                    </div>
                    
                    <div className="w-full bg-[#151517] rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden border border-white/5">
                        <div className="relative h-24 w-64 mb-4">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                                <div className="w-16 h-16 rounded-full bg-[#151517] flex items-center justify-center p-1">
                                    <div className="w-full h-full rounded-full bg-gradient-to-b from-cyan-400 to-cyan-600 flex items-end justify-center overflow-hidden">
                                        <Icon name="person" className="text-[#003d3d] text-[40px] translate-y-1" filled />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="text-[15px] text-white font-medium mb-8 leading-snug max-w-[260px]">
                            Trouve ton profil et récupère tes stats de ligue
                        </p>

                        <button className="w-full bg-[#262626] hover:bg-[#303030] transition-colors rounded-2xl flex items-center px-4 py-3.5 group">
                            <Icon name="search" className="text-gray-400 text-xl mr-3 group-hover:text-white transition-colors" />
                            <span className="text-gray-400 text-[15px] font-medium group-hover:text-white transition-colors">Écris le nom complet</span>
                        </button>
                    </div>
                </div>
            </>
          )}

      </div>

      {/* Global Player Search Modal */}
      {showPlayerSearch && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center isolate">
              <div 
                  className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
                  onClick={() => { setShowPlayerSearch(false); setPlayerSearchQuery(''); }}
              ></div>
              <div className="relative w-full h-[90vh] bg-[#0F1115] rounded-t-[24px] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
                  <div className="flex items-center gap-3 p-4 pb-2 border-b border-white/10 shrink-0">
                      <div className="flex-1 h-12 bg-[#1C1F26] rounded-xl flex items-center px-4 border border-white/10 focus-within:border-blue-500/50 transition-colors">
                          <Icon name="search" className="text-gray-400 text-xl mr-3" />
                          <input 
                              type="text" 
                              placeholder="Rechercher un joueur..." 
                              className="bg-transparent border-none text-white text-base w-full focus:outline-none placeholder-gray-500 p-0"
                              value={playerSearchQuery}
                              onChange={(e) => setPlayerSearchQuery(e.target.value)}
                              autoFocus
                          />
                          {playerSearchQuery && (
                              <button onClick={() => setPlayerSearchQuery('')} className="p-1 text-gray-500 hover:text-white">
                                  <Icon name="close" className="text-lg" />
                              </button>
                          )}
                      </div>
                      <button 
                          onClick={() => { setShowPlayerSearch(false); setPlayerSearchQuery(''); }}
                          className="text-gray-400 hover:text-white font-medium p-2"
                      >
                          Annuler
                      </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4">
                      {globalSearchResults.length > 0 ? (
                          globalSearchResults.map((player, idx) => (
                              <div 
                                  key={idx}
                                  onClick={() => handleGlobalPlayerClick(player)}
                                  className="flex items-center gap-4 p-3 hover:bg-[#1C1F26] rounded-xl cursor-pointer transition-colors border-b border-white/5 last:border-0"
                              >
                                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-800 border border-white/10 shrink-0">
                                      <img src={player.avatar || `https://i.pravatar.cc/150?u=${player.name}`} alt={player.name} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="flex flex-col">
                                      <span className="text-[15px] font-bold text-white">{player.name}</span>
                                      <span className="text-xs text-gray-400 font-medium">
                                          {player.team || 'Club Inconnu'}
                                          {player.position && ` • ${player.position}`}
                                      </span>
                                  </div>
                                  <div className="ml-auto">
                                      <Icon name="chevron_right" className="text-gray-600" />
                                  </div>
                              </div>
                          ))
                      ) : (
                          playerSearchQuery ? (
                              <div className="py-20 text-center text-gray-500 flex flex-col items-center">
                                  <Icon name="person_off" className="text-3xl mb-2 opacity-50" />
                                  <span className="text-sm">Aucun joueur trouvé</span>
                              </div>
                          ) : (
                              <div className="py-20 text-center text-gray-600 text-sm">
                                  Recherchez un joueur pour voir son historique
                              </div>
                          )
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* Player History/Details Modal - FULL SCREEN REDESIGN */}
      {viewingPlayerHistory && (
          <div className="fixed inset-0 z-[150] bg-[#0F1115] text-white flex flex-col animate-in slide-in-from-right duration-300">
              
              {/* Header */}
              <div className="flex items-center justify-between px-4 pt-12 pb-4 bg-[#0F1115]/95 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
                  <button 
                      onClick={() => setViewingPlayerHistory(null)}
                      className="w-10 h-10 -ml-2 flex items-center justify-center text-white active:scale-90 transition-transform hover:bg-white/5 rounded-full"
                  >
                      <Icon name="arrow_back_ios" className="text-xl pl-1" />
                  </button>
                  <h2 className="text-lg font-bold text-center">Historique du Joueur</h2>
                  <button className="w-10 h-10 -mr-2 flex items-center justify-center text-white active:scale-90 transition-transform hover:bg-white/5 rounded-full">
                      <Icon name="more_horiz" className="text-xl" />
                  </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto pb-12">
                  
                  {/* Hero Section */}
                  <div className="flex flex-col items-center pt-8 pb-8 px-6 bg-gradient-to-b from-[#1C1F26] to-[#0F1115]">
                      <div className="relative mb-4">
                          <div className="w-28 h-28 rounded-full border-4 border-[#0F1115] overflow-hidden bg-[#2C2C2E] shadow-2xl">
                              <img 
                                  src={viewingPlayerHistory.avatar || `https://i.pravatar.cc/150?u=${viewingPlayerHistory.name}`} 
                                  alt={viewingPlayerHistory.name} 
                                  className="w-full h-full object-cover" 
                              />
                          </div>
                          {viewingPlayerHistory.rank && (
                              <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#10B981] rounded-full flex items-center justify-center border-4 border-[#0F1115] text-[#0F1115] font-black text-xs shadow-lg">
                                  {viewingPlayerHistory.rank}
                              </div>
                          )}
                      </div>
                      
                      <h1 className="text-2xl font-black text-white text-center mb-1">{viewingPlayerHistory.name}</h1>
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                          {viewingPlayerHistory.team && <span>{viewingPlayerHistory.team}</span>}
                          {viewingPlayerHistory.team && viewingPlayerHistory.league && <span>•</span>}
                          {viewingPlayerHistory.league && <span>{viewingPlayerHistory.league}</span>}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 px-8 mt-6 w-full">
                          <button 
                              onClick={() => setIsFollowing(!isFollowing)}
                              className={`flex-1 py-2.5 rounded-full font-bold text-xs transition-all active:scale-[0.98] shadow-lg border ${
                                  isFollowing 
                                  ? 'bg-[#1C1F26] text-white border-white/10 hover:bg-[#252830]' 
                                  : 'bg-white text-black border-transparent hover:bg-gray-200'
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
                  </div>

                  {/* Bio / Stats Grid */}
                  <div className="px-5 mb-8">
                      <div className="bg-[#1C1F26] rounded-2xl p-4 border border-white/5 grid grid-cols-4 divide-x divide-white/5">
                          <div className="flex flex-col items-center gap-1">
                              <span className="text-[10px] uppercase font-bold text-gray-500">Âge</span>
                              <span className="text-sm font-bold text-white">{viewingPlayerHistory.age || '-'}</span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                              <span className="text-[10px] uppercase font-bold text-gray-500">Taille</span>
                              <span className="text-sm font-bold text-white">{viewingPlayerHistory.height || '-'}</span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                              <span className="text-[10px] uppercase font-bold text-gray-500">Poids</span>
                              <span className="text-sm font-bold text-white">{viewingPlayerHistory.weight || '-'}</span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                              <span className="text-[10px] uppercase font-bold text-gray-500">Poste</span>
                              <span className="text-sm font-bold text-white">{viewingPlayerHistory.position || '-'}</span>
                          </div>
                      </div>
                  </div>

                  {/* Section: Historique TOTW */}
                  <div className="px-5 mb-8">
                      <h3 className="text-[15px] font-bold text-white mb-4 flex items-center gap-2">
                          <Icon name="verified" className="text-blue-500" />
                          Historique Équipe du moment
                      </h3>
                      
                      <div className="bg-[#1C1F26] rounded-2xl overflow-hidden border border-white/5">
                          {viewingPlayerHistory.totwAppearances && viewingPlayerHistory.totwAppearances.length > 0 ? (
                              viewingPlayerHistory.totwAppearances.map((item: any, idx: number) => (
                                  <div 
                                    key={idx} 
                                    onClick={() => handleHistoryItemClick(item)}
                                    className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 cursor-pointer hover:bg-white/5 transition-colors active:bg-white/10 group"
                                  >
                                      <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                              <Icon name="star" className="text-lg" filled />
                                          </div>
                                          <div className="flex flex-col">
                                              <span className="text-sm font-bold text-white">{item.label}</span>
                                              <span className="text-xs text-gray-400">{item.date}</span>
                                          </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                          <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold border border-blue-500/30">
                                              Sélectionné
                                          </div>
                                          <Icon name="chevron_right" className="text-gray-600 group-hover:text-white transition-colors" />
                                      </div>
                                  </div>
                              ))
                          ) : (
                              <div className="p-6 text-center text-gray-500 text-sm">
                                  Jamais sélectionné dans l'équipe du moment.
                              </div>
                          )}
                      </div>
                  </div>

                  {/* Section: Historique Trending */}
                  <div className="px-5 mb-8">
                      <div className="flex items-center justify-between mb-4">
                          <h3 className="text-[15px] font-bold text-white flex items-center gap-2">
                              <Icon name="trending_up" className="text-green-500" />
                              Historique Joueur à surveiller
                          </h3>
                          {viewingPlayerHistory.isTrending && (
                              <span className="text-[10px] font-bold bg-green-500/20 text-green-500 px-2 py-0.5 rounded border border-green-500/30">
                                  Actuellement
                              </span>
                          )}
                      </div>

                      <div className="bg-[#1C1F26] rounded-2xl p-5 border border-white/5">
                          {viewingPlayerHistory.chartData && viewingPlayerHistory.chartData.length > 0 ? (
                              <>
                                  <div className="flex items-center justify-between mb-4">
                                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Courbe de progression</span>
                                      <div className="flex items-center gap-1 text-green-500 text-xs font-bold">
                                          <Icon name="arrow_upward" className="text-[10px]" />
                                          <span>Performance</span>
                                      </div>
                                  </div>
                                  <BigChart data={viewingPlayerHistory.chartData} />
                                  <div className="mt-4 flex justify-between text-[10px] text-gray-500 font-medium px-1">
                                      <span>Saison début</span>
                                      <span>Mi-saison</span>
                                      <span>Actuel</span>
                                  </div>
                              </>
                          ) : (
                              <div className="text-center text-gray-500 text-sm py-4">
                                  Aucune donnée de progression disponible.
                              </div>
                          )}
                      </div>
                  </div>

              </div>
          </div>
      )}

      {/* Selected Player Detail Modal (from List) - Reused Design */}
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
                              <img src={selectedPlayer.avatar || `https://i.pravatar.cc/150?u=${selectedPlayer.fullName?.replace(' ', '')}`} alt={selectedPlayer.name} className="w-full h-full object-cover" />
                          </div>
                          {/* Rating Badge */}
                          <div className="absolute bottom-1 right-1 z-20 w-7 h-7 bg-[#10B981] rounded-full flex items-center justify-center border-4 border-[#0F1115] text-[#0F1115] font-black text-[10px] shadow-md">
                              {selectedPlayer.rating || 'A'}
                          </div>
                      </div>

                      {/* Name & Subtitle */}
                      <h2 className="text-lg font-black text-white leading-tight mb-1">{selectedPlayer.name}</h2>
                      <p className="text-xs text-gray-400 font-medium mb-5">
                          {selectedPlayer.team} • {selectedPlayer.position}
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
                                  <span>+{(selectedPlayer.chart && selectedPlayer.chart.length > 0 ? (selectedPlayer.chart[selectedPlayer.chart.length-1] - selectedPlayer.chart[0] > 0 ? (selectedPlayer.chart[selectedPlayer.chart.length-1] - selectedPlayer.chart[0])/10 : 2.4) : 2.4).toFixed(1)}</span>
                              </div>
                          </div>
                          <BigChart data={selectedPlayer.chart} />
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Position Selector Modal */}
      {showPositionModal && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center isolate">
              <div 
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                  onClick={() => setShowPositionModal(false)}
              ></div>
              <div className="relative w-full max-w-md bg-[#151518] rounded-t-[20px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 border-t border-white/10 flex flex-col">
                  {/* Handle */}
                  <div className="flex justify-center pt-3 pb-2" onClick={() => setShowPositionModal(false)}>
                      <div className="w-10 h-1 bg-white/20 rounded-full"></div>
                  </div>

                  <div className="p-5 pb-8 flex-1 flex flex-col">
                      <h3 className="text-white font-bold text-[17px] mb-6 text-center">Position</h3>
                      <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
                          {POSITION_FILTERS.map(opt => {
                              const isSelected = selectedPosition === opt.id;
                              return (
                                  <button
                                      key={opt.id}
                                      onClick={() => setSelectedPosition(isSelected ? 'ALL' : opt.id)}
                                      className={`w-full p-4 rounded-xl text-left font-bold text-[15px] transition-all border flex justify-between items-center ${
                                          isSelected
                                          ? 'bg-white/10 border-white/20 text-white' 
                                          : 'bg-transparent text-gray-300 border-white/5 hover:bg-white/5'
                                      }`}
                                  >
                                      {opt.label}
                                      {isSelected && (
                                          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shrink-0">
                                              <Icon name="check" className="text-black text-sm font-bold" />
                                          </div>
                                      )}
                                  </button>
                              );
                          })}
                      </div>
                      
                      <div className="p-5 border-t border-white/10 bg-[#151518] -mx-5 -mb-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
                          <div className="flex gap-3">
                              <button 
                                  onClick={() => setSelectedPosition('ALL')}
                                  className="flex-1 bg-[#2C2C2E] text-white font-bold py-2.5 rounded-full hover:bg-[#3A3A3C] transition-colors active:scale-95 text-[13px]"
                              >
                                  Tout effacer
                              </button>
                              <button 
                                  onClick={() => setShowPositionModal(false)}
                                  className="flex-1 bg-white text-black font-bold py-2.5 rounded-full hover:bg-gray-200 transition-colors active:scale-95 text-[13px]"
                              >
                                  Afficher les résultats
                              </button>
                          </div>
                      </div>
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

      <BottomNav 
          activeTab="trending"
          onHomeClick={onBack}
          onTrendingClick={onTrendingClick}
          onOpportunitiesClick={onOpportunitiesClick}
      />
    </div>
  );
};
