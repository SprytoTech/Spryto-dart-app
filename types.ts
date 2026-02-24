
export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
  team?: string;
  profile?: {
    dob?: string;
    nationality?: string;
    positionCategory?: string;
    positionDetail?: string;
    heightLevel?: {
      country: string;
      region: string;
      league: string;
      level: string;
    };
    shirtSize?: string;
    city?: string;
  };
}

export interface Story {
  id: string;
  user: User;
  hasUnseen: boolean;
  gradient: string;
}

export interface PostStats {
  position: string;
  category: string;
  age: string;
}

export interface Reaction {
  id: string;
  avatar: string;
}

export interface Post {
  id: string;
  user: User;
  timestamp: string;
  content: string;
  hashtags: string[];
  image: string;
  video?: string;
  stats: PostStats;
  reactionCount: number;
  ratingCount: number;
  commentCount: number; // Ajout du compteur de commentaires
  recentReactions: Reaction[];
  taggedUsers?: User[];
  isFollowed?: boolean;
  aspectRatio?: string; // '16:9' | '9:16' | '1:1' | '4:5' | 'free'
}

export interface SuggestedPlay {
  id: string;
  image: string;
  video: string; // Add video property
  title: string;
  user: User;
  role: string;
  stats?: {
      position: string;
      category: string;
      age: string;
  };
}

export interface TrendingPlayer {
  id: string;
  name: string;
  team: string;
  teamColor: string;
  role: string;
  category: string;
  image: string;
}

export interface Opportunity {
  id: string;
  type: 'Tryout' | 'Showcase' | 'Tournoi' | 'Évènement' | 'Programme';
  title: string;
  club: string;
  clubLogo: string;
  date: string;
  location: string;
  tags: string[];
  image?: string;
  isFeatured?: boolean;
  spotsLeft?: number;
  backgroundColor?: string; // For featured cards
}

export interface SavedTeam {
    id: string;
    leagueLabel: string;
    weekLabel: string;
    team: any[]; // Array of players
    savedAt: string;
    // New fields for editing context
    leagueIds?: string[];
    location?: string;
}
