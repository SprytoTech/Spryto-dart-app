
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { Stories } from './components/Stories';
import { FilterTabs } from './components/FilterTabs';
import { PostCard } from './components/PostCard';
import { SuggestedPlays } from './components/SuggestedPlays';
import { TrendingPlayers } from './components/TrendingPlayers';
import { BottomNav } from './components/BottomNav';
import { PublishPage, PublishData, MOCK_TEAMMATES } from './components/PublishPage';
import { SearchPage } from './components/SearchPage';
import { OpportunitiesPage } from './components/OpportunitiesPage';
import { CheckoutPage } from './components/CheckoutPage';
import { HighlightDetailsPage } from './components/HighlightDetailsPage';
import { ShortsFeedPage } from './components/ShortsFeedPage';
import { SoccerMapPage } from './components/SoccerMapPage';
import { VenueDetailsPage } from './components/VenueDetailsPage';
import { TrendingPage } from './components/TrendingPage';
import { TeamOfTheWeekPage } from './components/TeamOfTheWeekPage';
import { SavedTeamsPage } from './components/SavedTeamsPage';
import { TrendingPlayersListPage } from './components/TrendingPlayersListPage';
import { CreateTeamPage } from './components/CreateTeamPage';
import { TicketsPage } from './components/TicketsPage';
import { TicketDetailsPage } from './components/TicketDetailsPage';
import { OrderDetailsPage } from './components/OrderDetailsPage';
import { TicketInfoPage } from './components/TicketInfoPage';
import { OpportunityDetailsPage } from './components/OpportunityDetailsPage';
import { Icon } from './components/Icon';
import { stories, posts, suggestedPlays, trendingPlayers } from './data';
import { Post, SuggestedPlay, TrendingPlayer, User, Opportunity, SavedTeam } from './types';

// Define discriminated union for feed items to handle mixed content types
type FeedItem = 
  | { type: 'post'; id: string; data: Post }
  | { type: 'suggested'; id: string; data: SuggestedPlay[] }
  | { type: 'trending'; id: string; data: TrendingPlayer[] };

type FilterType = 'for-you' | 'elite' | 'friends' | 'men' | 'woman';
type ViewType = 'feed' | 'publish' | 'search' | 'opportunities' | 'saved-opportunities' | 'checkout' | 'highlight-details' | 'shorts-feed' | 'map' | 'venue-details' | 'trending' | 'team-details' | 'saved-teams' | 'all-trending-players' | 'create-team' | 'tickets' | 'ticket-details' | 'order-details' | 'ticket-info' | 'ticket-event-details';

// Define Elite Categories
const ELITE_CATEGORIES = [
  'PLSJQ', 'L1QC', 'L2QC', 'L3QC', 
  'MLS NEXT PRO', 'NCAA D1', 'NCAA D2', 
  'NJCAA D1', 'NJCAA D2', 'USL', 
  'RSEQ D1', 'RSEQ D2', 'PRO', 'ELITE'
];

// Current User Mock
const CURRENT_USER: User = {
  id: 'kp1',
  name: 'Kevin Duboi',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwkQ9fs2m7qgWavEZRcUtFdpDeOG5HugSdI7B8imocyXKEmlsGepg6u3RsOueo_qtpMdL-A3r-Vjy44sb_yg32bt2hrX2twzhcKePgQnij6mcB0sIgyouInveNCPw_iKH4tHvhuIhnwwXa165ZwfLEo-04bp0Z7AtfWraA4HPSXaRf_AfbwP1CLoQd4gtN1o7GLqXSRYtNIHEE5TnUWT2i5vmTdnZm7TEueouf9Iz17LMbRX7-2ngluLnslCwLVZRd-c-Cd3WnayMN',
  isOnline: true,
  team: 'FC Laval',
  profile: {
    dob: '2005-06-15',
    nationality: 'Canada',
    positionCategory: 'Milieu',
    positionDetail: 'CM',
    heightLevel: {
      country: 'Canada',
      region: 'Québec',
      league: 'L1QC',
      level: 'Pro'
    },
    shirtSize: 'M',
    city: 'Laval'
  }
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('feed');
  const [previousView, setPreviousView] = useState<ViewType>('trending'); // Track previous view for navigation history
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('for-you');
  
  // State for all shorts to allow dynamic addition
  const [allSuggestedPlays, setAllSuggestedPlays] = useState<SuggestedPlay[]>(suggestedPlays);

  // Saved Opportunities State
  const [savedOppIds, setSavedOppIds] = useState<string[]>(['opp1', 'opp_f4']); // Pre-filled with some IDs for demo
  const [checkoutOpportunity, setCheckoutOpportunity] = useState<Opportunity | null>(null);
  
  // Tickets State (Purchased Opportunities)
  const [myTickets, setMyTickets] = useState<Opportunity[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Opportunity | null>(null);
  
  // Saved Teams State
  const [savedTeams, setSavedTeams] = useState<SavedTeam[]>([]);

  // Selected Opportunity State (Lifted for persistence)
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  // Selected Post for Highlight Details
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Selected Short Play ID for Shorts Feed
  const [selectedShortId, setSelectedShortId] = useState<string | null>(null);

  // Selected Venue for Map Detail
  const [selectedVenue, setSelectedVenue] = useState<any | null>(null);

  // Selected Team for Team Details Page
  const [selectedTeamContext, setSelectedTeamContext] = useState<{ 
      team: any[], 
      leagueLabel: string, 
      weekLabel: string,
      leagueIds?: string[],
      location?: string,
      id?: string,
      isEditable?: boolean 
  } | null>(null);

  // Editing Team State (when user wants to modify their creation)
  const [editingTeam, setEditingTeam] = useState<any[] | null>(null);
  const [editingTeamMeta, setEditingTeamMeta] = useState<{leagueIds?: string[], location?: string}>({});
  const [editingId, setEditingId] = useState<string | undefined>(undefined);

  // Visibility and Undo Notification State
  const [isStoriesVisible, setIsStoriesVisible] = useState(true);
  const [showStoriesToast, setShowStoriesToast] = useState(false);
  
  const observerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Smart Sticky Header Refs
  const lastScrollY = useRef(0);
  const pivotScrollY = useRef(0);
  const scrollDirection = useRef<'up' | 'down'>('down');

  // Handle scroll for header and sticky filter visibility
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const currentScrollY = scrollContainerRef.current.scrollTop;
    
    // Safety check for bounce scroll
    if (currentScrollY < 0) return;

    // Force show header at the very top
    if (currentScrollY < 60) {
      if (!isHeaderVisible) setIsHeaderVisible(true);
      lastScrollY.current = currentScrollY;
      return;
    }

    const direction = currentScrollY > lastScrollY.current ? 'down' : 'up';
    if (direction !== scrollDirection.current) {
        scrollDirection.current = direction;
        pivotScrollY.current = currentScrollY;
    }

    const diffFromPivot = Math.abs(currentScrollY - pivotScrollY.current);

    // Dynamic Header Hiding Logic
    if (direction === 'down' && diffFromPivot > 20 && isHeaderVisible) {
        setIsHeaderVisible(false);
    } else if (direction === 'up' && diffFromPivot > 10 && !isHeaderVisible) {
        setIsHeaderVisible(true);
    }

    lastScrollY.current = currentScrollY;
  };

  const handleScrollToTop = () => {
    if (currentView !== 'feed') {
        setCurrentView('feed');
        setTimeout(() => {
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 50);
        return;
    }
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getFilteredPosts = useCallback((sourcePosts: Post[], filter: FilterType) => {
    switch (filter) {
      case 'elite':
        return sourcePosts.filter(p => ELITE_CATEGORIES.includes(p.stats.category));
      case 'friends':
        return sourcePosts.filter(p => p.isFollowed === true);
      case 'woman':
        return sourcePosts.filter(p => p.hashtags.includes('#womensfootball') || p.user.name.includes('Sarah'));
      case 'men':
        return sourcePosts.filter(p => !p.hashtags.includes('#womensfootball') && !p.user.name.includes('Sarah'));
      case 'for-you':
      default:
        return sourcePosts;
    }
  }, []);

  useEffect(() => {
    const filtered = getFilteredPosts(posts, activeFilter);
    const initialFeed: FeedItem[] = [];
    if (activeFilter === 'for-you') {
        if (filtered.length > 0) initialFeed.push({ type: 'post', id: 'init-post-1', data: filtered[0] });
        // IMPORTANT: Use the state 'allSuggestedPlays' here so the feed reflects updates
        initialFeed.push({ type: 'suggested', id: 'init-suggested', data: allSuggestedPlays });
        if (filtered.length > 1) initialFeed.push({ type: 'post', id: 'init-post-2', data: filtered[1] });
        initialFeed.push({ type: 'trending', id: 'init-trending', data: trendingPlayers });
        filtered.slice(2).forEach((p, idx) => {
             initialFeed.push({ type: 'post', id: `init-post-rem-${idx}`, data: p });
        });
    } else {
        filtered.forEach((p, idx) => {
             initialFeed.push({ type: 'post', id: `filter-post-${idx}`, data: p });
        });
    }
    setFeedItems(initialFeed);
  }, [activeFilter, getFilteredPosts, allSuggestedPlays]); // Add allSuggestedPlays dependency

  const loadMoreItems = useCallback(() => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      const batchSize = 5;
      const newItems: FeedItem[] = [];
      const sourcePool = getFilteredPosts(posts, activeFilter);
      if (sourcePool.length === 0) {
          setLoading(false);
          return;
      }
      for (let i = 0; i < batchSize; i++) {
        const randomPostIndex = Math.floor(Math.random() * sourcePool.length);
        const basePost = sourcePool[randomPostIndex];
        newItems.push({
          type: 'post',
          id: `infinite-post-${Date.now()}-${i}`,
          data: { ...basePost, reactionCount: basePost.reactionCount + Math.floor(Math.random() * 50), id: `post-data-${Date.now()}-${i}` }
        });
      }
      if (activeFilter === 'for-you' && Math.random() > 0.7) {
        // Use state here as well
        newItems.push({ type: 'suggested', id: `infinite-suggested-${Date.now()}`, data: allSuggestedPlays });
      }
      setFeedItems((prev) => [...prev, ...newItems]);
      setLoading(false);
    }, 1000);
  }, [loading, activeFilter, getFilteredPosts, allSuggestedPlays]);

  useEffect(() => {
    if (currentView !== 'feed') return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMoreItems(); },
      { threshold: 0.1, rootMargin: '100px' }
    );
    const target = observerRef.current;
    if (target) observer.observe(target);
    return () => { if (target) observer.unobserve(target); };
  }, [loadMoreItems, currentView]);

  const handleHideStories = () => {
    setIsStoriesVisible(false);
    setShowStoriesToast(true);
    
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => { 
        setShowStoriesToast(false); 
    }, 5000);
  };

  const handleUndoStories = () => {
    setIsStoriesVisible(true);
    setShowStoriesToast(false);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
  };

  const handleToggleSavedOpportunity = (id: string) => {
    setSavedOppIds(prev => 
      prev.includes(id) ? prev.filter(savedId => savedId !== id) : [...prev, id]
    );
  };

  const handleToggleSaveTeam = (team: any[], leagueLabel: string, weekLabel: string) => {
      const teamId = `${leagueLabel}-${weekLabel}`.replace(/\s+/g, '-').toLowerCase();
      
      setSavedTeams(prev => {
          const exists = prev.some(t => t.id === teamId);
          if (exists) {
              return prev.filter(t => t.id !== teamId);
          } else {
              const newTeam: SavedTeam = {
                  id: teamId,
                  leagueLabel,
                  weekLabel,
                  team,
                  savedAt: new Date().toISOString()
                  // Note: Toggling from view-only mode might miss IDs/Location context if not passed
                  // Ideally pass context here too if available
              };
              return [newTeam, ...prev];
          }
      });
  };

  const handleSaveCreatedTeam = (team: any[], leagueLabel: string, weekLabel: string, leagueIds: string[], location: string, originalId?: string) => {
      setSavedTeams(prev => {
          // If we have an ID, update the existing team
          if (originalId) {
              return prev.map(t => t.id === originalId ? {
                  ...t,
                  team,
                  leagueLabel,
                  weekLabel,
                  leagueIds,
                  location,
                  savedAt: new Date().toISOString()
              } : t);
          }

          // Otherwise, create new (legacy flow)
          // Check if a team with the same League AND Week already exists (content check)
          // We remove the old one and add the new one to the top (update/overwrite behavior)
          const filtered = prev.filter(t => 
              !(t.leagueLabel === leagueLabel && t.weekLabel === weekLabel)
          );

          const newTeam: SavedTeam = {
              id: `draft-${Date.now()}`,
              leagueLabel: leagueLabel || 'Mon Équipe',
              weekLabel: weekLabel,
              team: team,
              savedAt: new Date().toISOString(),
              leagueIds: leagueIds,
              location: location
          };
          
          return [newTeam, ...filtered];
      });
  };

  const handleSubmitCreatedTeam = (team: any[], leagueLabel: string, weekLabel: string, leagueIds: string[], location: string, originalId?: string) => {
      // Automatically save to the list
      handleSaveCreatedTeam(team, leagueLabel, weekLabel, leagueIds, location, originalId);
      
      // Navigate to detail view
      setSelectedTeamContext({ 
          team, 
          leagueLabel, 
          weekLabel, 
          leagueIds,
          location,
          id: originalId,
          isEditable: true 
      });
      setCurrentView('team-details');
  };

  const isTeamSaved = (leagueLabel: string, weekLabel: string) => {
      // Robust check: Check either by exact ID match OR by matching content (League + Week)
      // This ensures that created drafts (which might have random IDs) are still recognized as saved
      const teamId = `${leagueLabel}-${weekLabel}`.replace(/\s+/g, '-').toLowerCase();
      return savedTeams.some(t => t.id === teamId || (t.leagueLabel === leagueLabel && t.weekLabel === weekLabel));
  };

  const handleBuyTickets = (opportunity: Opportunity) => {
      setCheckoutOpportunity(opportunity);
      setCurrentView('checkout');
  };

  const handleTicketPurchaseSuccess = (opportunity: Opportunity) => {
      // Add the opportunity to the list of purchased tickets
      setMyTickets(prev => {
          // Avoid duplicates based on ID
          if (prev.some(t => t.id === opportunity.id)) return prev;
          return [opportunity, ...prev];
      });
  };

  const handlePostClick = (post: Post) => {
      setSelectedPost(post);
      setCurrentView('highlight-details');
  };

  const handleShortPlayClick = (playId: string) => {
      setSelectedShortId(playId);
      setCurrentView('shorts-feed');
  };

  const handleTeamClick = (savedTeam: SavedTeam) => {
      setSelectedTeamContext({ 
          team: savedTeam.team, 
          leagueLabel: savedTeam.leagueLabel, 
          weekLabel: savedTeam.weekLabel, 
          leagueIds: savedTeam.leagueIds,
          location: savedTeam.location,
          id: savedTeam.id, // Store ID for potential updates
          isEditable: true // Allow editing when coming from Saved Teams
      });
      setCurrentView('team-details');
  };

  const handleTicketClick = (ticket: Opportunity) => {
      setSelectedTicket(ticket);
      setCurrentView('ticket-details');
  };

  // Handler for Venue Click on Map
  const handleVenueClick = (venue: any) => {
      setSelectedVenue(venue);
      setCurrentView('venue-details');
  };

  const handlePublish = (data: PublishData) => {
    // Map IDs to User objects
    const resolvedTaggedUsers = data.taggedUserIds.map(id => {
        const teammate = MOCK_TEAMMATES.find(t => t.id === id);
        if (teammate) {
            return {
                id: teammate.id,
                name: teammate.name,
                avatar: teammate.avatar,
                team: teammate.role // Using role as team/description context
            } as User;
        }
        return undefined;
    }).filter((u): u is User => u !== undefined);

    // LOGIC: If 9:16, add to Suggested Plays. Else, add to Posts.
    if (data.aspectRatio === '9:16') {
        const newPlay: SuggestedPlay = {
            id: `new-play-${Date.now()}`,
            image: data.videoUrl, // Use video as placeholder
            video: data.videoUrl,
            title: data.caption ? (data.caption.length > 25 ? data.caption.substring(0, 25) + '...' : data.caption) : 'Nouveau Highlight',
            user: { ...CURRENT_USER, team: data.stats.club || CURRENT_USER.team },
            role: data.stats.position || 'Joueur',
            stats: {
                position: data.stats.position || 'N/A',
                category: data.stats.category || 'N/A',
                age: '19'
            }
        };

        // Update the master list of shorts so it appears in ShortsFeedPage
        setAllSuggestedPlays(prev => [newPlay, ...prev]);

        // Also update the feed to show it immediately in the horizontal list
        setFeedItems(prevItems => {
            const newItems = [...prevItems];
            // Find the suggested plays block
            const suggestedIndex = newItems.findIndex(item => item.type === 'suggested');

            if (suggestedIndex !== -1) {
                // Add to existing block
                const existingItem = newItems[suggestedIndex];
                if (existingItem.type === 'suggested') {
                    newItems[suggestedIndex] = {
                        ...existingItem,
                        data: [newPlay, ...existingItem.data]
                    };
                }
            } else {
                // If block doesn't exist (e.g. filtered out), create it at top
                newItems.unshift({
                    type: 'suggested',
                    id: `suggested-new-${Date.now()}`,
                    data: [newPlay]
                });
            }
            return newItems;
        });

    } else {
        const newPost: Post = {
            id: `new-post-${Date.now()}`,
            user: { ...CURRENT_USER, team: data.stats.club || CURRENT_USER.team },
            timestamp: "À l'instant",
            content: data.caption,
            hashtags: [], // Could parse from caption if needed
            image: data.videoUrl, // Use video frame as image for now
            video: data.videoUrl,
            stats: {
                position: data.stats.position || 'N/A',
                category: data.stats.category || 'N/A',
                age: '19' // Mocked or calculated
            },
            reactionCount: 0,
            ratingCount: 0,
            commentCount: 0,
            recentReactions: [],
            taggedUsers: resolvedTaggedUsers, // Use the resolved users
            isFollowed: false,
            aspectRatio: data.aspectRatio, // Use the selected aspect ratio
        };

        // Add new post to the top of the feed
        setFeedItems(prev => [{ type: 'post', id: newPost.id, data: newPost }, ...prev]);
    }

    setCurrentView('feed');
    // Scroll to top to see the new content
    handleScrollToTop();
  };

  return (
    <div className="max-w-md mx-auto bg-[#0F1115] min-h-screen relative shadow-2xl overflow-hidden flex flex-col">
      
      {currentView === 'shorts-feed' && selectedShortId ? (
          <ShortsFeedPage 
              initialPlayId={selectedShortId}
              plays={allSuggestedPlays} // Pass the dynamic state containing all shorts
              onBack={() => setCurrentView('feed')}
              onPublish={() => setCurrentView('publish')}
          />
      ) : currentView === 'publish' ? (
        <PublishPage 
          onBack={() => setCurrentView('feed')} 
          onPublish={handlePublish} 
        />
      ) : currentView === 'map' ? (
        <SoccerMapPage 
            onBack={() => setCurrentView('feed')} 
            onOpportunities={() => setCurrentView('opportunities')}
            onVenueClick={handleVenueClick}
        />
      ) : currentView === 'venue-details' && selectedVenue ? (
        <VenueDetailsPage 
            venue={selectedVenue}
            onBack={() => setCurrentView('map')}
        />
      ) : currentView === 'trending' ? (
        <TrendingPage 
            onBack={() => setCurrentView('feed')}
            onTrendingClick={() => setCurrentView('trending')}
            onOpportunitiesClick={() => setCurrentView('opportunities')}
            onTeamClick={(team, leagueLabel, weekLabel) => {
                setSelectedTeamContext({ team, leagueLabel, weekLabel }); // Basic view without ID context from trending page unless added there too
                setCurrentView('team-details');
            }}
            onSavedTeamsClick={() => {
                setPreviousView('trending');
                setCurrentView('saved-teams');
            }}
            onShowAllTrending={() => setCurrentView('all-trending-players')}
            onCreateTeamClick={() => {
                setEditingTeam(null);
                setEditingTeamMeta({});
                setEditingId(undefined);
                setCurrentView('create-team');
            }}
        />
      ) : currentView === 'create-team' ? (
        <CreateTeamPage 
            onBack={() => setCurrentView('trending')}
            onShowSavedTeams={() => {
                setPreviousView('create-team');
                setCurrentView('saved-teams');
            }}
            onSave={handleSaveCreatedTeam}
            onSubmit={handleSubmitCreatedTeam}
            initialTeam={editingTeam}
            initialLeagueIds={editingTeamMeta.leagueIds}
            initialLocation={editingTeamMeta.location}
            initialId={editingId}
        />
      ) : currentView === 'all-trending-players' ? (
        <TrendingPlayersListPage 
            onBack={() => setCurrentView('trending')}
        />
      ) : currentView === 'saved-teams' ? (
        <SavedTeamsPage 
            savedTeams={savedTeams}
            onBack={() => setCurrentView(previousView)}
            onTeamClick={handleTeamClick}
        />
      ) : currentView === 'tickets' ? (
        <TicketsPage 
            onBack={() => setCurrentView('opportunities')}
            onFindTickets={() => setCurrentView('opportunities')}
            onViewSaved={() => setCurrentView('saved-opportunities')}
            onTicketClick={handleTicketClick}
            tickets={myTickets}
        />
      ) : currentView === 'ticket-details' && selectedTicket ? (
        <TicketDetailsPage 
            ticket={selectedTicket}
            onBack={() => setCurrentView('tickets')}
            onOrderDetails={() => setCurrentView('order-details')}
            onTicketInfo={() => setCurrentView('ticket-info')}
            onEventDetails={() => setCurrentView('ticket-event-details')}
        />
      ) : currentView === 'order-details' && selectedTicket ? (
        <OrderDetailsPage 
            ticket={selectedTicket}
            onBack={() => setCurrentView('ticket-details')}
        />
      ) : currentView === 'ticket-info' && selectedTicket ? (
        <TicketInfoPage 
            ticket={selectedTicket}
            onBack={() => setCurrentView('ticket-details')}
        />
      ) : currentView === 'ticket-event-details' && selectedTicket ? (
        <OpportunityDetailsPage 
            opportunity={selectedTicket}
            onBack={() => setCurrentView('ticket-details')}
            readOnly={true}
        />
      ) : currentView === 'team-details' && selectedTeamContext ? (
        <TeamOfTheWeekPage 
            team={selectedTeamContext.team}
            leagueLabel={selectedTeamContext.leagueLabel}
            weekLabel={selectedTeamContext.weekLabel}
            onBack={() => setCurrentView('trending')}
            isSaved={isTeamSaved(selectedTeamContext.leagueLabel, selectedTeamContext.weekLabel)}
            onToggleSave={() => handleToggleSaveTeam(selectedTeamContext.team, selectedTeamContext.leagueLabel, selectedTeamContext.weekLabel)}
            isEditable={selectedTeamContext.isEditable}
            onCreateNew={() => {
                setEditingTeam(null);
                setEditingTeamMeta({});
                setEditingId(undefined);
                setCurrentView('create-team');
            }}
            onModify={() => {
                setEditingTeam(selectedTeamContext.team);
                setEditingTeamMeta({
                    leagueIds: selectedTeamContext.leagueIds,
                    location: selectedTeamContext.location
                });
                setEditingId(selectedTeamContext.id);
                setCurrentView('create-team');
            }}
            onShowHistory={() => {
                setPreviousView('team-details');
                setCurrentView('saved-teams');
            }}
        />
      ) : (
        <>
            {/* Main Content Area */}
            {currentView === 'search' && (
                <SearchPage onBack={() => setCurrentView('feed')} />
            )}

            {currentView === 'highlight-details' && selectedPost && (
                <HighlightDetailsPage 
                    post={selectedPost}
                    currentUser={CURRENT_USER}
                    onBack={() => setCurrentView('feed')}
                    onPostClick={handlePostClick}
                />
            )}

            {(currentView === 'opportunities' || currentView === 'saved-opportunities') && (
                <OpportunitiesPage 
                    onBack={() => {
                        if (currentView === 'saved-opportunities') {
                            setCurrentView('opportunities');
                        } else {
                            setCurrentView('feed');
                        }
                    }}
                    currentUser={CURRENT_USER}
                    savedIds={savedOppIds}
                    onToggleSave={handleToggleSavedOpportunity}
                    onViewSaved={() => setCurrentView('saved-opportunities')}
                    isSavedView={currentView === 'saved-opportunities'}
                    onBuyTickets={handleBuyTickets}
                    selectedOpportunity={selectedOpportunity}
                    onSelectOpportunity={setSelectedOpportunity}
                    onTicketsClick={() => setCurrentView('tickets')}
                />
            )}

            {currentView === 'checkout' && checkoutOpportunity && (
                <CheckoutPage 
                    opportunity={checkoutOpportunity}
                    currentUser={CURRENT_USER}
                    onBack={() => setCurrentView('opportunities')}
                    onClose={() => setCurrentView('opportunities')}
                    onPurchaseSuccess={handleTicketPurchaseSuccess}
                />
            )}

            {currentView === 'feed' && (
                <>
                    <Header 
                        isVisible={isHeaderVisible} 
                        onPublishClick={() => setCurrentView('publish')} 
                        onSearchClick={() => setCurrentView('search')}
                        onMapClick={() => setCurrentView('map')} 
                    />
                    
                    <main 
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className="flex-1 overflow-y-auto hide-scrollbar pb-24 pt-[72px] scroll-smooth"
                    >
                        {/* Trending Player (Stories) Section */}
                        <div 
                          className={`grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                            isStoriesVisible ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                          }`}
                        >
                          <div className="overflow-hidden">
                            <Stories stories={stories} onHide={handleHideStories} />
                          </div>
                        </div>
                        
                        {/* Filter Section */}
                        <FilterTabs 
                            isHeaderVisible={isHeaderVisible} 
                            activeFilter={activeFilter} 
                            onFilterChange={setActiveFilter} 
                        />
                        
                        {/* Feed Content */}
                        <div className="flex flex-col min-h-[500px]">
                            {feedItems.length > 0 ? (
                                feedItems.map((item) => {
                                  switch (item.type) {
                                      case 'post': return <PostCard key={item.id} post={item.data} onClick={handlePostClick} />;
                                      case 'suggested': return <SuggestedPlays key={item.id} plays={item.data} onPlayClick={handleShortPlayClick} />;
                                      case 'trending': return <TrendingPlayers key={item.id} players={item.data} />;
                                      default: return null;
                                  }
                                })
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 px-10 text-center opacity-50">
                                    <span className="text-4xl mb-4">⚽️</span>
                                    <p className="text-gray-400 font-medium">Aucun contenu trouvé pour ce filtre.</p>
                                </div>
                            )}
                        </div>

                        <div ref={observerRef} className="h-24 flex items-center justify-center w-full py-6">
                            {loading && (
                                <div className="flex gap-2 items-center p-3 bg-glass rounded-full px-5 border border-white/5">
                                    <div className="w-2 h-2 bg-neon-pink rounded-full animate-[bounce_1s_infinite_0ms]"></div>
                                    <div className="w-2 h-2 bg-secondary rounded-full animate-[bounce_1s_infinite_200ms]"></div>
                                    <div className="w-2 h-2 bg-neon-violet rounded-full animate-[bounce_1s_infinite_400ms]"></div>
                                </div>
                            )}
                        </div>
                    </main>

                    {/* Undo Toast notification */}
                    {showStoriesToast && (
                        <div className="fixed bottom-24 left-0 right-0 z-[100] px-4 pointer-events-none animate-in slide-in-from-bottom-6 duration-500 ease-out flex justify-center">
                          <div className="pointer-events-auto bg-[#1C1F26]/95 backdrop-blur-md border border-white/10 rounded-[22px] p-4 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-[390px]">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                <Icon name="visibility_off" className="text-gray-300 text-xl" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-white font-bold text-[14px] leading-tight">Trending Player masqué</span>
                                <span className="text-gray-400 text-[11px] leading-tight mt-0.5">La section a été retirée.</span>
                              </div>
                            </div>
                            <button 
                              onClick={handleUndoStories}
                              className="text-white font-bold text-sm px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all active:scale-95 border border-white/5"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                    )}
                </>
            )}

            {/* Bottom Nav - Visible for feed, search, opportunities, trending */}
            <BottomNav 
                activeTab={
                    currentView === 'feed' ? 'home' : 
                    (currentView === 'opportunities' || currentView === 'saved-opportunities' || currentView === 'ticket-details' || currentView === 'order-details' || currentView === 'ticket-info' || currentView === 'ticket-event-details' ? 'opportunities' : undefined)
                }
                onHomeClick={handleScrollToTop} 
                onOpportunitiesClick={() => setCurrentView('opportunities')}
                onTrendingClick={() => setCurrentView('trending')}
            />
        </>
      )}
    </div>
  );
};

export default App;
