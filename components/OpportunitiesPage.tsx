
import React, { useState } from 'react';
import { Icon } from './Icon';
import { Opportunity, User } from '../types';
import { ShareModal } from './ShareModal';
import { LocationModal } from './LocationModal';
import { OpportunitiesFilterModal } from './OpportunitiesFilterModal';
import { OpportunityDetailsPage } from './OpportunityDetailsPage';

interface OpportunitiesPageProps {
  onBack: () => void;
  currentUser: User; 
  savedIds?: string[];
  onToggleSave?: (id: string) => void;
  onViewSaved?: () => void;
  isSavedView?: boolean;
  onBuyTickets?: (opportunity: Opportunity) => void;
  selectedOpportunity?: Opportunity | null;
  onSelectOpportunity?: (opp: Opportunity | null) => void;
  onTicketsClick?: () => void;
}

// Mock Data optimisée pour le design
const MOCK_OPPORTUNITIES: Opportunity[] = [
  // --- EXISTING FEATURED ---
  {
    id: 'opp1',
    type: 'Tryout',
    title: 'PLSJQ U15-U18 (Mixte)',
    club: 'CF Montréal',
    clubLogo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/3/3e/CF_Montr%C3%A9al_logo_2023.svg/200px-CF_Montr%C3%A9al_logo_2023.svg.png',
    date: '18-19 Jan',
    location: 'Centre Nutrilait',
    tags: ['Elite', 'Mixte', 'U15', 'U16', 'U17', 'U18'],
    spotsLeft: 3,
    isFeatured: true,
    backgroundColor: 'bg-gradient-to-br from-[#2563eb] to-[#1e40af]', // Royal Blue Deep
  },
  {
    id: 'opp2',
    type: 'Showcase',
    title: 'Showcase Élite 2024',
    club: 'Toronto FC',
    clubLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/78/Toronto_FC_Logo.svg/200px-Toronto_FC_Logo.svg.png',
    date: '20-22 Avr',
    location: 'BMO Field',
    tags: ['Scouts', 'Boys', 'U19'],
    isFeatured: true,
    backgroundColor: 'bg-gradient-to-br from-[#dc2626] to-[#991b1b]', // Red
  },
  {
    id: 'opp_f3',
    type: 'Tryout',
    title: 'ACADEMY U16-U18 (M)',
    club: 'Manchester City',
    clubLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/200px-Manchester_City_FC_badge.svg.png',
    date: '10-12 Juil',
    location: 'Etihad Campus',
    tags: ['Elite', 'U16', 'U17', 'U18'],
    spotsLeft: 5,
    isFeatured: true,
    backgroundColor: 'bg-gradient-to-br from-[#6CABDD] to-[#1C2C5B]', // Sky Blue
  },
  {
    id: 'opp_f4',
    type: 'Programme',
    title: 'Summer Elite Camp',
    club: 'Paris Saint-Germain',
    clubLogo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/8/86/Paris_Saint-Germain_Logo.svg/200px-Paris_Saint-Germain_Logo.svg.png',
    date: '01-15 Août',
    location: 'Campus PSG',
    tags: ['Intensif', 'Mixte', 'U13', 'U14', 'U15'],
    isFeatured: true,
    backgroundColor: 'bg-gradient-to-br from-[#004170] to-[#DA291C]', // PSG Colors
  },
  {
    id: 'opp_f5',
    type: 'Showcase',
    title: 'La Fabrica ID',
    club: 'Real Madrid',
    clubLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/200px-Real_Madrid_CF.svg.png',
    date: '25-27 Juin',
    location: 'Valdebebas',
    tags: ['Scouts', 'Boys', 'U17', 'U18'],
    spotsLeft: 2,
    isFeatured: true,
    backgroundColor: 'bg-gradient-to-br from-[#1E202B] to-[#F1C40F]', // Dark with Gold
  },
   {
    id: 'opp_f6',
    type: 'Tournoi',
    title: 'Masia Cup',
    club: 'FC Barcelona',
    clubLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/200px-FC_Barcelona_%28crest%29.svg.png',
    date: '15-20 Juil',
    location: 'Joan Gamper',
    tags: ['U12', 'U13', 'U14', 'Elite'],
    isFeatured: true,
    backgroundColor: 'bg-gradient-to-br from-[#A50044] to-[#004D98]', // Blaugrana
  },
  {
    id: 'opp_f7',
    type: 'Tryout',
    title: 'BUNDESLIGA PRO (M)',
    club: 'Bayern Munich',
    clubLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg/200px-FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg.png',
    date: '05-07 Sept',
    location: 'Munich',
    tags: ['Gardien', 'Pro'],
    isFeatured: true,
    backgroundColor: 'bg-gradient-to-br from-[#DC052D] to-[#8A001A]', // Bayern Red
  },
  {
    id: 'opp_f8',
    type: 'Évènement',
    title: 'Future Stars Gala',
    club: 'Chelsea FC',
    clubLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/200px-Chelsea_FC.svg.png',
    date: '12 Oct',
    location: 'Cobham',
    tags: ['Networking', 'U18+'],
    isFeatured: true,
    backgroundColor: 'bg-gradient-to-br from-[#034694] to-[#011F4B]', // Chelsea Blue
  },
  
  // --- EXISTING ITEMS ---
  {
    id: 'opp3',
    type: 'Tryout',
    title: 'MLS NEXT PRO (M)',
    club: 'Inter Miami CF',
    clubLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5c/Inter_Miami_CF_logo.svg/200px-Inter_Miami_CF_logo.svg.png',
    date: 'Saison 2024',
    location: 'Chase Stadium',
    tags: ['MLS Next', 'Men', 'Pro', 'Boys'],
    isFeatured: false
  },
  {
    id: 'opp4',
    type: 'Tryout',
    title: 'ACADEMY U10-U16 (Mixte)',
    club: 'Ajax Amsterdam',
    clubLogo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/7/71/Ajax_Amsterdam.svg/200px-Ajax_Amsterdam.svg.png',
    date: '10-15 Juil',
    location: 'De Toekomst',
    tags: ['U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16', 'Mixte'],
    isFeatured: false
  },
  {
    id: 'opp5',
    type: 'Tryout',
    title: 'LIGUE 2 U19 (M)',
    club: 'Paris FC',
    clubLogo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/3/30/Paris_FC_2011.svg/200px-Paris_FC_2011.svg.png',
    date: '05 Mars',
    location: 'Complexe Déjerine',
    tags: ['U17', 'U19', 'Boys', 'Gratuit'],
    isFeatured: false
  },
  {
    id: 'opp6',
    type: 'Tryout',
    title: 'D1 ARKEMA U19 (F)',
    club: 'Olympique Lyonnais',
    clubLogo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/e/e2/Olympique_Lyonnais.svg/200px-Olympique_Lyonnais.svg.png',
    date: '12-14 Juin',
    location: 'Groupama OL',
    tags: ['Féminin', 'Girls', 'U16', 'U19'],
    isFeatured: false
  },
  {
    id: 'opp7',
    type: 'Showcase',
    title: 'Showcase International',
    club: 'Valencia CF',
    clubLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/ce/Valenciacf.svg/200px-Valenciacf.svg.png',
    date: '15-18 Mai',
    location: 'Mestalla',
    tags: ['Elite', 'Boys', 'U19'],
    isFeatured: false
  },
  {
    id: 'opp8',
    type: 'Showcase',
    title: 'Talent ID Camp',
    club: 'Benfica',
    clubLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/SL_Benfica_logo.svg/200px-SL_Benfica_logo.svg.png',
    date: '20-22 Juin',
    location: 'Campus Benfica',
    tags: ['U15', 'U16', 'U17', 'U18', 'U19', 'Mixte'],
    isFeatured: false
  },
  {
    id: 'opp9',
    type: 'Tournoi',
    title: 'PSG Academy Cup',
    club: 'Paris Saint-Germain',
    clubLogo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/8/86/Paris_Saint-Germain_Logo.svg/200px-Paris_Saint-Germain_Logo.svg.png',
    date: '10-12 Juin',
    location: 'Campus PSG',
    tags: ['U11', 'U12', 'U13', 'Boys'],
    isFeatured: false
  },
  {
    id: 'opp10',
    type: 'Programme',
    title: 'Stage Perfectionnement',
    club: 'Real Madrid',
    clubLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/200px-Real_Madrid_CF.svg.png',
    date: '01-05 Août',
    location: 'Madrid, ES',
    tags: ['Technique', 'Mixte', 'Elite', 'Gratuit'],
    isFeatured: false
  },
  {
    id: 'opp11',
    type: 'Tournoi',
    title: 'Youth League Qualifier',
    club: 'Chelsea FC',
    clubLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/200px-Chelsea_FC.svg.png',
    date: 'Sept 2024',
    location: 'London, UK',
    tags: ['U19', 'Elite'],
    isFeatured: false
  },
  {
    id: 'opp12',
    type: 'Programme',
    title: 'Goalkeeper Camp',
    club: 'Bayern Munich',
    clubLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg/200px-FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg.png',
    date: '15-20 Juil',
    location: 'Säbener Strasse',
    tags: ['Gardien', 'Intensif'],
    isFeatured: false
  },
  {
    id: 'opp13',
    type: 'Tryout',
    title: 'LDP U14 (M)',
    club: 'AS Blainville',
    clubLogo: 'https://i.pravatar.cc/150?u=blainville', // Placeholder
    date: '25 Août',
    location: 'Parc Blainville',
    tags: ['U14', 'Boys', 'Gratuit'],
    isFeatured: false
  },
  {
    id: 'opp14',
    type: 'Évènement',
    title: 'Conférence Sportive',
    club: 'Soccer Québec',
    clubLogo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/0/03/Soccer_Qu%C3%A9bec_logo.svg/1200px-Soccer_Qu%C3%A9bec_logo.svg.png',
    date: '10 Sept',
    location: 'Stade Saputo',
    tags: ['Conférence', 'Mixte', 'En ligne'],
    isFeatured: false
  },

  // --- NEW TRYOUTS (20+) ---
  {
    id: 'try_new_1',
    type: 'Tryout',
    title: 'RSEQ D1 (M)',
    club: 'Champlain St-Lambert',
    clubLogo: 'https://ui-avatars.com/api/?name=C+C&background=0D8ABC&color=fff&size=150',
    date: '15-16 Août',
    location: 'Stade Seaway',
    tags: ['Collégial', 'U19', 'Boys'],
    isFeatured: false
  },
  {
    id: 'try_new_2',
    type: 'Tryout',
    title: 'RSEQ D1 (F)',
    club: 'Collège Ahuntsic',
    clubLogo: 'https://ui-avatars.com/api/?name=C+A&background=E53935&color=fff&size=150',
    date: '20 Août',
    location: 'Claude-Robillard',
    tags: ['Collégial', 'U19', 'Girls'],
    isFeatured: false
  },
  {
    id: 'try_new_3',
    type: 'Tryout',
    title: 'L1QC (M)',
    club: 'CS St-Laurent',
    clubLogo: 'https://ui-avatars.com/api/?name=S+T&background=FDB813&color=000&size=150',
    date: '02 Fév',
    location: 'Stade Hébert',
    tags: ['Semi-Pro', 'Senior', 'Men'],
    isFeatured: false
  },
  {
    id: 'try_new_4',
    type: 'Tryout',
    title: 'PLSJQ U17 (M)',
    club: 'CS Mont-Royal Outremont',
    clubLogo: 'https://ui-avatars.com/api/?name=M+R&background=000000&color=FDB813&size=150',
    date: '12 Jan',
    location: 'Parc TMR',
    tags: ['Elite', 'U17', 'Boys'],
    isFeatured: false
  },
  {
    id: 'try_new_5',
    type: 'Tryout',
    title: 'PLSJQ U15 (F)',
    club: 'CS Longueuil',
    clubLogo: 'https://ui-avatars.com/api/?name=C+S+L&background=1E88E5&color=fff&size=150',
    date: '18 Jan',
    location: 'Parc Laurier',
    tags: ['Elite', 'U15', 'Girls'],
    isFeatured: false
  },
  {
    id: 'try_new_6',
    type: 'Tryout',
    title: 'NCAA D1 (M)',
    club: 'Syracuse University',
    clubLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Syracuse_Orange_logo.svg/150px-Syracuse_Orange_logo.svg.png',
    date: '05 Juil',
    location: 'Syracuse, NY',
    tags: ['Universitaire', 'USA', 'Boys'],
    isFeatured: false
  },
  {
    id: 'try_new_7',
    type: 'Tryout',
    title: 'NCAA D1 (F)',
    club: 'Florida State',
    clubLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Florida_State_Seminoles_logo.svg/150px-Florida_State_Seminoles_logo.svg.png',
    date: '10 Juil',
    location: 'Tallahassee, FL',
    tags: ['Universitaire', 'USA', 'Girls'],
    isFeatured: false
  },
  {
    id: 'try_new_8',
    type: 'Tryout',
    title: 'U SPORTS (M)',
    club: 'Carabins Montréal',
    clubLogo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/5/52/Carabins_Montr%C3%A9al.svg/150px-Carabins_Montr%C3%A9al.svg.png',
    date: '25 Août',
    location: 'CEPSUM',
    tags: ['Universitaire', 'Senior', 'Men'],
    isFeatured: false
  },
  {
    id: 'try_new_9',
    type: 'Tryout',
    title: 'U SPORTS (F)',
    club: 'Citadins UQAM',
    clubLogo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/3/39/Citadins_UQAM.svg/150px-Citadins_UQAM.svg.png',
    date: '28 Août',
    location: 'Stade Saputo (Annexe)',
    tags: ['Universitaire', 'Senior', 'Women'],
    isFeatured: false
  },
  {
    id: 'try_new_10',
    type: 'Tryout',
    title: 'NJCAA D1 (M)',
    club: 'Monroe College',
    clubLogo: 'https://ui-avatars.com/api/?name=M+C&background=FDB813&color=000&size=150',
    date: '15 Juin',
    location: 'New York, USA',
    tags: ['College', 'USA', 'Boys'],
    isFeatured: false
  },
  {
    id: 'try_new_11',
    type: 'Tryout',
    title: 'SENIOR AAA (M)',
    club: 'Royal-Sélect Beauport',
    clubLogo: 'https://ui-avatars.com/api/?name=R+S+B&background=FDD835&color=000&size=150',
    date: '20 Mars',
    location: 'Québec, QC',
    tags: ['LSEQ', 'Senior', 'Men'],
    isFeatured: false
  },
  {
    id: 'try_new_12',
    type: 'Tryout',
    title: 'LDP U14 (F)',
    club: 'Celtix Haut-Richelieu',
    clubLogo: 'https://ui-avatars.com/api/?name=C+H+R&background=43A047&color=fff&size=150',
    date: '10 Sept',
    location: 'St-Jean-sur-Richelieu',
    tags: ['Regional', 'U14', 'Girls'],
    isFeatured: false
  },
  {
    id: 'try_new_13',
    type: 'Tryout',
    title: 'LDP U16 (M)',
    club: 'FC Laval',
    clubLogo: 'https://fclaval.qc.ca/wp-content/uploads/2022/09/Logo-FC-Laval-300x300.png',
    date: '15 Sept',
    location: 'Parc Cartier',
    tags: ['Regional', 'U16', 'Boys'],
    isFeatured: false
  },
  {
    id: 'try_new_14',
    type: 'Tryout',
    title: 'ESPOIR U19+ (M)',
    club: 'CS Lanaudière-Nord',
    clubLogo: 'https://ui-avatars.com/api/?name=L+N&background=D32F2F&color=fff&size=150',
    date: '01 Oct',
    location: 'Joliette',
    tags: ['Reserve', 'Senior', 'Men'],
    isFeatured: false
  },
  {
    id: 'try_new_15',
    type: 'Tryout',
    title: 'SENIOR R1 (F)',
    club: 'Mistral Sherbrooke',
    clubLogo: 'https://ui-avatars.com/api/?name=M+S&background=000000&color=fff&size=150',
    date: '05 Avril',
    location: 'Sherbrooke',
    tags: ['Regional', 'Senior', 'Women'],
    isFeatured: false
  },
  {
    id: 'try_new_16',
    type: 'Tryout',
    title: 'RSEQ D2 (M)',
    club: 'Dawson College',
    clubLogo: 'https://ui-avatars.com/api/?name=D+C&background=1565C0&color=fff&size=150',
    date: '12 Août',
    location: 'Westmount',
    tags: ['Collégial', 'U19', 'Boys'],
    isFeatured: false
  },
  {
    id: 'try_new_17',
    type: 'Tryout',
    title: 'OPDL U17 (M)',
    club: 'Ottawa South United',
    clubLogo: 'https://ui-avatars.com/api/?name=O+S+U&background=fff&color=000&size=150',
    date: '22 Fév',
    location: 'Ottawa, ON',
    tags: ['Provincial', 'Ontario', 'Boys'],
    isFeatured: false
  },
  {
    id: 'try_new_18',
    type: 'Tryout',
    title: 'SENIOR LDIR (M)',
    club: 'CS MRO',
    clubLogo: 'https://ui-avatars.com/api/?name=M+R&background=FDB813&color=000&size=150',
    date: '15 Avril',
    location: 'TMR',
    tags: ['Regional', 'Senior', 'Men', 'Gratuit'],
    isFeatured: false
  },
  {
    id: 'try_new_19',
    type: 'Tryout',
    title: 'ESPOIR U13 (M)',
    club: 'Revolution FC',
    clubLogo: 'https://ui-avatars.com/api/?name=R+F+C&background=B71C1C&color=fff&size=150',
    date: '20 Sept',
    location: 'Rosemère',
    tags: ['Regional', 'U13', 'Boys'],
    isFeatured: false
  },
  {
    id: 'try_new_20',
    type: 'Tryout',
    title: 'L1QC (F)',
    club: 'AS Laval',
    clubLogo: 'https://ui-avatars.com/api/?name=A+S+L&background=7B1FA2&color=fff&size=150',
    date: '10 Fév',
    location: 'Centre Sportif Bois-de-Boulogne',
    tags: ['Semi-Pro', 'Senior', 'Women'],
    isFeatured: false
  },
  {
    id: 'try_new_21',
    type: 'Tryout',
    title: 'CPL U21 (M)',
    club: 'Atlético Ottawa',
    clubLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/52/Atl%C3%A9tico_Ottawa.svg/150px-Atl%C3%A9tico_Ottawa.svg.png',
    date: '01 Mars',
    location: 'TD Place',
    tags: ['Pro', 'U21', 'Men'],
    isFeatured: false
  }
];

const FILTERS = ['Tout', 'Tryout', 'Showcase', 'Tournoi', 'Programme', 'Évènements'];

interface AdvancedFilters {
    date: string | { start: Date | null; end: Date | null };
    categories: string[];
    gender: string;
    ages: string[];
    freeOnly: boolean;
    onlineOnly: boolean;
    sortBy: string;
}

export const OpportunitiesPage: React.FC<OpportunitiesPageProps> = ({ 
  onBack, 
  currentUser,
  savedIds = [],
  onToggleSave,
  onViewSaved,
  isSavedView = false,
  onBuyTickets,
  selectedOpportunity,
  onSelectOpportunity,
  onTicketsClick
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('Tout');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Montréal, QC');
  const [sharingOpp, setSharingOpp] = useState<Opportunity | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters | null>(null);
  
  // Internal state fallback if props aren't provided (flexible component)
  const [internalSelectedOpp, setInternalSelectedOpp] = useState<Opportunity | null>(null);
  const activeSelectedOpp = selectedOpportunity !== undefined ? selectedOpportunity : internalSelectedOpp;
  const handleSelectOpp = onSelectOpportunity || setInternalSelectedOpp;
  
  // State for expanded sections that don't have a dedicated filter page (like 'Autres')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Filter Logic
  const filteredOpportunities = MOCK_OPPORTUNITIES.filter(opp => {
      // 1. If in Saved View, ensure ID is in savedIds
      if (isSavedView && !savedIds.includes(opp.id)) {
          return false;
      }

      // Map 'Évènements' filter to 'Évènement' type
      const isEvenementFilter = activeFilter === 'Évènements' && opp.type === 'Évènement';
      
      const filterMatch = activeFilter === 'Tout' || activeFilter === 'All' || opp.type === activeFilter || isEvenementFilter;
      const searchMatch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          opp.club.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!filterMatch || !searchMatch) return false;

      // Advanced Filters
      if (advancedFilters) {
          // Categories
          if (advancedFilters.categories.length > 0 && !advancedFilters.categories.includes(opp.type)) {
              return false;
          }

          // Gender
          if (advancedFilters.gender !== 'any') {
              const isMale = opp.tags.includes('Boys') || opp.tags.includes('Men') || opp.tags.includes('Hommes');
              const isFemale = opp.tags.includes('Girls') || opp.tags.includes('Woman') || opp.tags.includes('Féminin');
              // Note: 'Mixte' opportunities usually allow both, but strict filtering might exclude them if user selects Male/Female
              // Here we assume if user selects Male, they want opportunities open to Men (including Mixte?)
              // For strict filtering:
              if (advancedFilters.gender === 'male' && !isMale && !opp.tags.includes('Mixte')) return false;
              if (advancedFilters.gender === 'female' && !isFemale && !opp.tags.includes('Mixte')) return false;
          }

          // Ages
          if (advancedFilters.ages.length > 0) {
              const hasAgeMatch = advancedFilters.ages.some(age => opp.tags.includes(age) || opp.title.includes(age));
              if (!hasAgeMatch && !opp.tags.includes('U18+')) return false; // Simple check, real app would parse ranges
          }

          // Free Only
          if (advancedFilters.freeOnly && !opp.tags.includes('Gratuit')) {
              return false;
          }

          // Online Only
          if (advancedFilters.onlineOnly && !opp.tags.includes('En ligne') && !opp.location.toLowerCase().includes('zoom')) {
              return false;
          }
      }

      return true;
  });

  // Categorize for "All" view logic
  const featuredOpps = filteredOpportunities.filter(o => o.isFeatured);
  const tryoutOpps = filteredOpportunities.filter(o => !o.isFeatured && o.type === 'Tryout');
  const showcaseOpps = filteredOpportunities.filter(o => !o.isFeatured && o.type === 'Showcase');
  const tournoiOpps = filteredOpportunities.filter(o => !o.isFeatured && o.type === 'Tournoi');
  const programmeOpps = filteredOpportunities.filter(o => !o.isFeatured && o.type === 'Programme');
  const evenementOpps = filteredOpportunities.filter(o => !o.isFeatured && o.type === 'Évènement');
  const otherOpps = filteredOpportunities.filter(o => !o.isFeatured && !['Tryout', 'Showcase', 'Tournoi', 'Programme', 'Évènement'].includes(o.type));
  
  // Relevance Logic: Simple heuristic based on tags (Elite, Pro, Intensif) matching a hypothetical ambitious user profile
  const pertinentOpps = filteredOpportunities.filter(o => 
      (o.tags.includes('Elite') || o.tags.includes('Pro') || o.tags.includes('Intensif'))
  );

  const getGenderSuffix = (tags: string[]) => {
      if (tags.includes('Boys') || tags.includes('Men')) return '(M)';
      if (tags.includes('Girls') || tags.includes('Woman') || tags.includes('Féminin')) return '(F)';
      if (tags.includes('Mixte')) return '(Mixte)';
      return '';
  };

  const toggleSection = (title: string) => {
      const next = new Set(expandedSections);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      setExpandedSections(next);
  };

  const handleShare = (e: React.MouseEvent, opp: Opportunity) => {
      e.stopPropagation();
      setSharingOpp(opp);
  };

  const handleToggle = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if (onToggleSave) onToggleSave(id);
  };

  const handleAdvancedFilters = (filters: AdvancedFilters) => {
      setAdvancedFilters(filters);
  };

  // Helper function to count active filters
  const getFilterCount = () => {
      if (!advancedFilters) return 0;
      let count = 0;
      if (advancedFilters.date !== 'any') count++;
      count += advancedFilters.categories.length;
      if (advancedFilters.gender !== 'any') count++;
      count += advancedFilters.ages.length;
      if (advancedFilters.freeOnly) count++;
      if (advancedFilters.onlineOnly) count++;
      return count;
  };

  const filterCount = getFilterCount();

  const renderSection = (title: string, opportunities: Opportunity[], filterKey?: string) => {
      if (opportunities.length === 0) return null;
      
      const isSummaryView = activeFilter === 'Tout';
      
      let limit = opportunities.length;
      if (isSummaryView && !isSavedView) {
          if (filterKey) {
              limit = 4;
          } else {
              limit = expandedSections.has(title) ? opportunities.length : 4;
          }
      }
      
      const visibleItems = opportunities.slice(0, limit);
      const hasMore = opportunities.length > 4;
      const showButton = isSummaryView && hasMore && !isSavedView;

      const hideTypeBadge = !!filterKey || activeFilter !== 'Tout';

      return (
        <div className="mb-6">
            <div className="px-5 flex justify-between items-end mb-4">
                <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
                {showButton && (
                    <button 
                        onClick={() => {
                            if (filterKey) setActiveFilter(filterKey);
                            else toggleSection(title);
                        }}
                        className="text-[13px] font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-0.5 active:opacity-70"
                    >
                        {(!filterKey && expandedSections.has(title)) ? 'Voir moins' : 'Afficher tout'} 
                        <Icon name={(!filterKey && expandedSections.has(title)) ? "expand_less" : "chevron_right"} className="text-[16px]" />
                    </button>
                )}
            </div>

            <div className="px-5 flex flex-col gap-3">
                {visibleItems.map((opp) => {
                    const genderSuffix = getGenderSuffix(opp.tags);
                    const isSaved = savedIds.includes(opp.id);
                    return (
                        <div 
                            key={opp.id} 
                            onClick={() => handleSelectOpp(opp)}
                            className="group flex items-center p-4 bg-[#1e232e] hover:bg-[#252a35] rounded-2xl active:scale-[0.99] transition-all cursor-pointer border border-white/5"
                        >
                            {/* Left: Logo */}
                            <div className="relative shrink-0 mr-4">
                                <div className="w-16 h-16 bg-[#2C2C2E] rounded-xl flex items-center justify-center p-2 border border-white/5">
                                    <img src={opp.clubLogo} alt={opp.club} className="w-full h-full object-contain" />
                                </div>
                            </div>
                            
                            {/* Middle: Info */}
                            <div className="flex-1 min-w-0 py-1">
                                {!hideTypeBadge && (
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded uppercase tracking-wide border border-blue-400/20">
                                            {opp.type}
                                        </span>
                                    </div>
                                )}
                                
                                <h4 className="text-[16px] font-bold text-white truncate leading-tight mb-0.5">{opp.title}</h4>
                                <p className="text-[13px] text-gray-400 font-medium truncate mb-2">
                                    {opp.club} <span className="text-gray-500/70 ml-1">{genderSuffix}</span>
                                </p>
                                
                                <div className="flex items-center text-gray-500 gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <Icon name="event" className="text-[13px]" />
                                        <span className="text-[12px] font-medium">{opp.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Icon name="location_on" className="text-[13px]" />
                                        <span className="text-[12px] font-medium truncate max-w-[90px]">{opp.location.split(',')[0]}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Actions */}
                            <div className="pl-3 shrink-0 self-center flex flex-col items-center gap-1">
                                <button 
                                    onClick={(e) => handleToggle(e, opp.id)}
                                    className={`w-9 h-9 flex items-center justify-center transition-colors ${isSaved ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                                >
                                    <Icon name={isSaved ? "bookmark" : "bookmark_border"} className="text-[22px]" filled={isSaved} />
                                </button>
                                <button 
                                    onClick={(e) => handleShare(e, opp)}
                                    className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
                                >
                                    <Icon name="ios_share" className="text-[20px]" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
      );
  };

  // If detailed view is active, render it
  if (activeSelectedOpp) {
      return (
          <OpportunityDetailsPage 
              opportunity={activeSelectedOpp} 
              onBack={() => handleSelectOpp(null)}
              onBuyTickets={onBuyTickets} // Pass the callback
          />
      );
  }

  return (
    <div className="min-h-screen bg-[#0F1115] text-white pb-24 font-display animate-in fade-in duration-500 selection:bg-blue-500 selection:text-white">
      
      {/* Sticky Header & Search Area */}
      <div className="sticky top-0 z-40 bg-[#0F1115]/90 backdrop-blur-xl border-b border-white/5 pb-2 transition-all shadow-lg">
          {/* Top Bar */}
          <div className="px-5 pt-12 pb-2 flex items-center justify-between">
            <button 
                onClick={onBack} 
                className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors active:scale-95"
            >
                <Icon name="arrow_back" className="text-xl" />
            </button>
            <h1 className="text-base font-bold tracking-wide uppercase text-white/90">
                {isSavedView ? 'Enregistrements' : 'Opportunités'}
            </h1>
            <div className="flex items-center gap-1">
                 {!isSavedView && (
                    <button 
                        onClick={() => onViewSaved && onViewSaved()}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors active:scale-95"
                    >
                        <Icon name="bookmark_border" className="text-[22px]" />
                    </button>
                 )}
                 <button 
                    onClick={() => onTicketsClick && onTicketsClick()}
                    className="relative w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors active:scale-95"
                 >
                    <Icon name="confirmation_number" className="text-[22px]" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-[#0F1115]"></span>
                 </button>
            </div>
          </div>

          {/* Location Selector */}
          {!isSavedView && (
            <div className="px-5 mb-3 flex items-center">
                <button 
                    onClick={() => setShowLocationModal(true)}
                    className="flex items-center gap-1 group active:scale-95 transition-transform"
                >
                    <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                        <Icon name="location_on" className="text-[12px] text-blue-400" filled />
                    </div>
                    <span className="text-[13px] font-bold text-white group-hover:text-blue-400 transition-colors">{location}</span>
                    <Icon name="expand_more" className="text-[16px] text-gray-500 group-hover:text-blue-400 transition-colors" />
                </button>
            </div>
          )}

          {/* Search Bar */}
          {!isSavedView && (
            <div className="px-5 mb-2">
                <div className="w-full bg-[#1e232e] rounded-xl h-11 flex items-center pl-3 pr-2 transition-all focus-within:ring-1 focus-within:ring-blue-500/50">
                    <Icon name="search" className="text-gray-500 text-lg mr-2" />
                    <input 
                        type="text" 
                        placeholder="Rechercher (Club, Ville...)" 
                        className="flex-1 bg-transparent border-none text-white text-[15px] placeholder-gray-500 focus:ring-0 p-0"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="p-1 text-gray-500 hover:text-white mr-1">
                            <Icon name="close" className="text-sm" />
                        </button>
                    )}
                    <div className="w-[1px] h-5 bg-white/10 mx-1.5"></div>
                    <button 
                        onClick={() => setShowFilterModal(true)}
                        className={`p-1.5 transition-colors relative group ${filterCount > 0 ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Icon name="tune" className="text-[20px]" filled={filterCount > 0} />
                        {filterCount > 0 && (
                            <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-[9px] font-bold h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full border border-[#0F1115]">
                                {filterCount}
                            </div>
                        )}
                    </button>
                </div>
            </div>
          )}
      </div>

      {/* Filters - Pills (Scrollable with content) */}
      <div className="flex gap-2 overflow-x-auto px-5 hide-scrollbar pt-4 pb-1">
        {FILTERS.map(filter => {
            const isActive = activeFilter === filter;
            return (
                <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`snap-start px-4 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap border transition-all duration-200 active:scale-95 ${
                        isActive 
                        ? 'bg-white text-black border-white' 
                        : 'bg-transparent border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                    }`}
                >
                    {filter}
                </button>
            );
        })}
      </div>

      {/* Featured Section - Compact & Vibrant */}
      {/* Hide Featured if in Saved View, to keep list cleaner */}
      {!isSavedView && featuredOpps.length > 0 && (
          <div className="mt-6 mb-8">
            <div className="px-5 flex justify-between items-end mb-4">
                <h2 className="text-lg font-bold text-white tracking-tight">À la une</h2>
            </div>
            
            <div className="flex gap-4 overflow-x-auto px-5 hide-scrollbar snap-x pb-4">
                {featuredOpps.map(opp => {
                    const genderSuffix = getGenderSuffix(opp.tags);
                    const isSaved = savedIds.includes(opp.id);
                    return (
                    <div 
                        key={opp.id} 
                        onClick={() => handleSelectOpp(opp)}
                        className={`min-w-[280px] w-[75vw] max-w-[320px] ${opp.backgroundColor || 'bg-blue-600'} rounded-[24px] p-5 relative snap-center shrink-0 shadow-lg group cursor-pointer active:scale-[0.98] transition-transform flex flex-col justify-between min-h-[180px] overflow-hidden`}
                    >
                        {/* Abstract Shapes/Noise */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none mix-blend-overlay"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

                        {/* Top: Logo & Actions */}
                        <div className="flex items-start justify-between relative z-10">
                             <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1 shadow-sm">
                                 <img src={opp.clubLogo} alt={opp.club} className="w-full h-full object-contain" />
                             </div>
                             
                             <div className="flex flex-col items-end gap-2">
                                 {opp.spotsLeft && (
                                     <div className="bg-black/20 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 flex items-center gap-1.5">
                                         <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
                                         <span className="text-[10px] font-bold text-white leading-none">{opp.spotsLeft} places</span>
                                     </div>
                                 )}
                                 
                                 <div className="flex items-center gap-2">
                                     <button 
                                        onClick={(e) => handleShare(e, opp)}
                                        className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                     >
                                        <Icon name="ios_share" className="text-[16px]" />
                                     </button>
                                     <button 
                                        onClick={(e) => handleToggle(e, opp.id)}
                                        className={`w-8 h-8 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center transition-colors hover:bg-white/20 text-white`}
                                     >
                                        <Icon name={isSaved ? "bookmark" : "bookmark_border"} className="text-[18px]" filled={isSaved} />
                                     </button>
                                 </div>
                             </div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 mt-auto">
                             <div className="mb-3">
                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white backdrop-blur-sm mb-2 border border-white/10 uppercase tracking-wider">
                                    {opp.type}
                                </span>
                                <h3 className="text-[18px] font-black text-white leading-[1.1] tracking-tight">{opp.title}</h3>
                                <p className="text-[13px] font-medium text-white/80 mt-1">
                                    {opp.club} <span className="text-white/60 ml-1">{genderSuffix}</span>
                                </p>
                             </div>

                             <div className="flex items-center justify-between border-t border-white/10 pt-3">
                                <div className="flex flex-col">
                                    <span className="text-[11px] text-white/80 font-medium flex items-center gap-1">
                                        <Icon name="event" className="text-[14px]" /> {opp.date}
                                    </span>
                                    <span className="text-[11px] text-white/60 font-medium flex items-center gap-1">
                                        <Icon name="location_on" className="text-[14px]" /> {opp.location.split(',')[0]}
                                    </span>
                                </div>
                                <button className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                    <Icon name="arrow_forward" className="text-lg" />
                                </button>
                             </div>
                        </div>
                    </div>
                );})}
            </div>
          </div>
      )}

      {/* List Sections */}
      <div>
        {isSavedView ? (
            // In Saved View, just show all saved items in one list unless filtered by type pills
            <>
                {filteredOpportunities.length > 0 ? (
                    renderSection('Enregistrés', filteredOpportunities)
                ) : (
                    <div className="py-20 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-[#1e232e] rounded-full flex items-center justify-center mb-4">
                            <Icon name="bookmark_border" className="text-2xl text-gray-600" />
                        </div>
                        <p className="text-gray-500 text-sm">Aucune opportunité enregistrée.</p>
                    </div>
                )}
            </>
        ) : (
            activeFilter === 'Tout' ? (
                <>
                    {renderSection('Try out', tryoutOpps, 'Tryout')}
                    {renderSection('Showcase', showcaseOpps, 'Showcase')}
                    {renderSection('Tournoi', tournoiOpps, 'Tournoi')}
                    {renderSection('Programme', programmeOpps, 'Programme')}
                    {renderSection('Évènements', evenementOpps, 'Évènements')}
                    {renderSection('Autres', otherOpps)}
                    {/* Pertinent Section */}
                    {renderSection('Pertinent pour toi', pertinentOpps)}
                    
                    {tryoutOpps.length === 0 && showcaseOpps.length === 0 && tournoiOpps.length === 0 && programmeOpps.length === 0 && evenementOpps.length === 0 && otherOpps.length === 0 && (
                        <div className="py-20 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-[#1e232e] rounded-full flex items-center justify-center mb-4">
                                <Icon name="search_off" className="text-2xl text-gray-600" />
                            </div>
                            <p className="text-gray-500 text-sm">Aucune opportunité trouvée.</p>
                        </div>
                    )}
                </>
            ) : (
                <>
                    {renderSection(activeFilter, filteredOpportunities.filter(o => !o.isFeatured))}
                    {filteredOpportunities.filter(o => !o.isFeatured).length === 0 && (
                        <div className="py-20 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-[#1e232e] rounded-full flex items-center justify-center mb-4">
                                <Icon name="search_off" className="text-2xl text-gray-600" />
                            </div>
                            <p className="text-gray-500 text-sm">Aucune opportunité trouvée.</p>
                        </div>
                    )}
                </>
            )
        )}
      </div>

      {sharingOpp && (
          <ShareModal opportunity={sharingOpp} onClose={() => setSharingOpp(null)} />
      )}
      
      {showLocationModal && (
          <LocationModal 
              currentLocation={location}
              onClose={() => setShowLocationModal(false)}
              onSelect={(loc) => setLocation(loc)}
          />
      )}
      
      {showFilterModal && (
          <OpportunitiesFilterModal 
              onClose={() => setShowFilterModal(false)}
              onApply={handleAdvancedFilters}
          />
      )}
    </div>
  );
};
