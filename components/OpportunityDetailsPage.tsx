
import React, { useState, useMemo } from 'react';
import { Opportunity } from '../types';
import { Icon } from './Icon';
import { ShareModal } from './ShareModal';

interface OpportunityDetailsPageProps {
  opportunity: Opportunity;
  onBack: () => void;
  onBuyTickets?: (opportunity: Opportunity) => void;
  readOnly?: boolean;
}

const REPORT_REASONS = [
    "Demander un remboursement",
    "Posez une question ou donnez votre avis sur l'événement",
    "L'événement ne s'est pas produit ou ne correspondait pas à la description",
    "Contenu indésirable ou trompeur",
    "Événement non autorisé à vendre des billets ou signaler des billets non valides",
    "Paiement requis à l'extérieur de Spryto",
    "Contenu nuisible",
    "Contenu ou activités réglementés",
    "Contenu sexuellement explicite",
    "Contenu haineux",
    "Violence ou extrémisme",
    "Violation de droit d'auteur ou contrefaçon de marque de commerce"
];

const REPORT_PLACEHOLDERS: Record<string, string> = {
    "Demander un remboursement": "Veuillez expliquer la raison de votre demande (ex : erreur de commande, événement annulé, maladie...)",
    "Posez une question ou donnez votre avis sur l'événement": "Quelle est votre question ou votre commentaire concernant cet événement ?",
    "L'événement ne s'est pas produit ou ne correspondait pas à la description": "Décrivez ce qui manquait ou ce qui était différent de la description originale.",
    "Contenu indésirable ou trompeur": "En quoi ce contenu est-il du spam, une arnaque ou trompeur ?",
    "Événement non autorisé à vendre des billets ou signaler des billets non valides": "Détaillez pourquoi vous pensez que cette vente de billets n'est pas autorisée.",
    "Paiement requis à l'extérieur de Spryto": "Expliquez comment on vous a demandé d'effectuer un paiement en dehors de la plateforme.",
    "Contenu nuisible": "Décrivez comment ce contenu encourage des comportements nuisibles ou dangereux.",
    "Contenu ou activités réglementés": "Précisez quel type de biens ou services réglementés est concerné (ex: armes, jeux d'argent).",
    "Contenu sexuellement explicite": "Décrivez la nudité ou l'activité sexuelle représentée.",
    "Contenu haineux": "Décrivez les propos haineux, le harcèlement ou l'intimidation présents.",
    "Violence ou extrémisme": "Par exemple : violence graphique, organisations dangereuses ou menaces.",
    "Violation de droit d'auteur ou contrefaçon de marque de commerce": "Veuillez indiquer quel contenu vous appartient et a été utilisé sans autorisation."
};

export const OpportunityDetailsPage: React.FC<OpportunityDetailsPageProps> = ({ opportunity, onBack, onBuyTickets, readOnly = false }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Replaced simple boolean with object to handle different share contexts
  const [opportunityToShare, setOpportunityToShare] = useState<Opportunity | null>(null);
  
  const [showMapOptions, setShowMapOptions] = useState(false);
  const [showOverviewModal, setShowOverviewModal] = useState(false);
  
  // State for saved similar opportunities
  const [savedSimilarIds, setSavedSimilarIds] = useState<Set<string>>(new Set());

  // Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportStep, setReportStep] = useState<'intro' | 'reason' | 'details' | 'success'>('intro');
  const [selectedReason, setSelectedReason] = useState('');
  const [reportEmail, setReportEmail] = useState('nom@Exemple.com');
  const [reportDescription, setReportDescription] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Mock data for details
  const followersCount = (Math.random() * 10 + 1).toFixed(1) + 'K';
  const eventsCount = Math.floor(Math.random() * 50) + 5;
  const organizerSince = Math.floor(Math.random() * 5) + 2;
  const priceRange = opportunity.tags.includes('Gratuit') ? 'Gratuit' : `${Math.floor(Math.random() * 20 + 10)} $CA - ${Math.floor(Math.random() * 50 + 40)} $CA`;

  // Helper to generate category string for Tryouts (e.g., "PLSJQ U17 M")
  const categoryString = (() => {
    const division = opportunity.tags.includes('Elite') || opportunity.tags.includes('Pro') ? 'PLSJQ' : 'L1QC';
    const age = opportunity.tags.find(t => t.startsWith('U')) || 'U17';
    let gender = 'M';
    if (opportunity.tags.some(t => ['Girls', 'Woman', 'Féminin'].includes(t))) gender = 'F';
    else if (opportunity.tags.includes('Mixte')) gender = 'Mixte';
    return `${division} ${age} ${gender}`;
  })();

  const parkingStatus = "Stationnement gratuit"; 

  const handleOpenMapOptions = () => {
    setShowMapOptions(true);
  };

  const openAppleMaps = () => {
    const query = encodeURIComponent(`${opportunity.location} ${opportunity.club}`);
    // Apple maps URL scheme
    window.open(`http://maps.apple.com/?q=${query}`, '_blank');
    setShowMapOptions(false);
  };

  const openGoogleMaps = () => {
    const query = encodeURIComponent(`${opportunity.location} ${opportunity.club}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    setShowMapOptions(false);
  };

  const handleCloseReport = () => {
      setShowReportModal(false);
      setTimeout(() => {
          setReportStep('intro');
          setSelectedReason('');
          setReportEmail('nom@Exemple.com');
          setReportDescription('');
          setIsDropdownOpen(false);
          setIsSubmittingReport(false);
      }, 300);
  };

  const handleSubmitReport = () => {
      setIsSubmittingReport(true);
      setTimeout(() => {
          setReportStep('success');
          setIsSubmittingReport(false);
      }, 1500);
  };

  const toggleSaveSimilar = (id: string) => {
      setSavedSimilarIds(prev => {
          const next = new Set(prev);
          if (next.has(id)) {
              next.delete(id);
          } else {
              next.add(id);
          }
          return next;
      });
  };

  const handleShareSimilar = (opp: Opportunity) => {
      setOpportunityToShare(opp);
  };

  // Generate 8 Similar Opportunities matching Opportunity type structure
  // Memoized to prevent recreation on re-renders which would cause flickering or state loss if not handled
  const similarOpportunities: Opportunity[] = useMemo(() => Array.from({ length: 8 }).map((_, i) => {
      const clubs = ['CS Longueuil', 'AS Blainville', 'CS St-Laurent', 'Mont-Royal Outremont', 'Celtix', 'Ottawa TFC', 'CS Aylmer', 'Mistral Sherbrooke'];
      const titles = [
          'L1QC U21 (M)', 
          'PLSJQ U17 (M)', 
          'RSEQ D1 (M)', 
          'NCAA D2 (F)', 
          'LDP U16 (M)', 
          'SENIOR AAA (M)', 
          'ACADEMY U15 (Mixte)', 
          'PRO TRIAL (M)'
      ];
      
      const type = i === 3 ? 'Showcase' : (i === 6 ? 'Programme' : 'Tryout');
      // Fix: Generate consistent colors for mock avatars based on index
      const colors = ['0D8ABC', 'E53935', 'FDB813', '000000', '1E88E5', '43A047', 'D32F2F', '1565C0'];
      const clubLogo = `https://ui-avatars.com/api/?name=${clubs[i].replace(/ /g, '+')}&background=${colors[i]}&color=fff&size=128`;

      return {
          id: `sim_${i}`,
          type: type as any,
          title: titles[i],
          club: clubs[i],
          clubLogo: clubLogo,
          date: ['14 Mars', '20 Mars', '02 Avril', '10 Avril', '15 Mai', '20 Mai', '01 Juin', '15 Juin'][i],
          location: 'Montréal, QC',
          tags: [] // Added empty tags to satisfy Opportunity interface
      };
  }), []);

  return (
    <div className="absolute inset-0 z-[60] bg-[#0F1115] text-white flex flex-col font-sans animate-in slide-in-from-right duration-300 overflow-hidden w-full h-full">
      
      {/* Top Navigation (Floating) */}
      <div className="absolute top-0 left-0 right-0 z-30 flex justify-between items-center px-4 pt-12 pb-4 pointer-events-none">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-colors pointer-events-auto active:scale-95"
        >
          <Icon name="arrow_back_ios" className="text-lg pl-1" />
        </button>
        <div className="flex gap-3 pointer-events-auto">
          <button 
            onClick={() => setOpportunityToShare(opportunity)}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-colors active:scale-95"
          >
            <Icon name="ios_share" className="text-xl" />
          </button>
          <button 
            onClick={() => setIsSaved(!isSaved)}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-colors active:scale-95"
          >
            <Icon name={isSaved ? "bookmark" : "bookmark_border"} className="text-xl" filled={isSaved} />
          </button>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className={`flex-1 overflow-y-auto ${readOnly ? 'pb-8' : 'pb-32'} hide-scrollbar bg-[#0F1115]`}>
        
        {/* Top Artwork Images (Side by Side like screenshot) */}
        <div className="relative w-full h-[240px] flex animate-in fade-in duration-500">
            <div className="flex-1 overflow-hidden border-r border-[#0F1115]">
                <img 
                    src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop" 
                    alt="Event 1" 
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex-1 overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1000&auto=format&fit=crop" 
                    alt="Event 2" 
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0F1115] to-transparent"></div>
        </div>

        <div className="px-5 mt-4">
            {/* Title & Primary Info */}
            <div className="mb-6 animate-in slide-in-from-bottom-2 fade-in duration-500 delay-100 fill-mode-both">
                <h1 className="text-2xl font-bold text-white leading-tight mb-3">
                    {opportunity.title}
                </h1>
                <p className="text-gray-400 text-[13px] font-medium leading-relaxed">
                    {opportunity.club} • {opportunity.location.split(',')[0]}, QC
                    <br />
                    13 mars à 21:30 HE
                </p>
            </div>

            {/* Friends Section (See if friends are going) */}
            <button className="flex items-center gap-2 mb-8 active:opacity-70 group w-full animate-in slide-in-from-bottom-2 fade-in duration-500 delay-150 fill-mode-both">
                <div className="flex -space-x-2">
                    <img className="w-6 h-6 rounded-full border border-[#0F1115] object-cover" src="https://i.pravatar.cc/100?u=1" alt="" />
                    <img className="w-6 h-6 rounded-full border border-[#0F1115] object-cover" src="https://i.pravatar.cc/100?u=2" alt="" />
                    <div className="w-6 h-6 rounded-full border border-[#0F1115] bg-gray-700 flex items-center justify-center">
                        <Icon name="lock" className="text-[10px] text-white" filled />
                    </div>
                </div>
                <span className="text-xs font-bold text-white">Voir si des amis y participent</span>
                <div className="flex-1"></div>
                <Icon name="chevron_right" className="text-lg text-gray-500 group-hover:text-white" />
            </button>

            <div className="h-[1px] w-full bg-white/5 mb-8 animate-in fade-in duration-700 delay-200 fill-mode-both"></div>

            {/* Organizer Simple Row */}
            <div className="flex items-center justify-between mb-8 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-200 fill-mode-both">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full p-1 overflow-hidden shrink-0">
                        <img src={opportunity.clubLogo} alt={opportunity.club} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[13px] text-gray-400 font-medium leading-none mb-1">Par <span className="text-white font-bold">{opportunity.club}</span></span>
                        <span className="text-[11px] text-gray-500 font-medium leading-none">{followersCount} abonnés</span>
                    </div>
                </div>
                <button 
                    onClick={() => setIsFollowing(!isFollowing)}
                    className="bg-[#1C1F26] text-white px-5 py-1.5 rounded-full font-bold text-[13px] border border-white/10 active:scale-95 transition-all"
                >
                    {isFollowing ? 'Suivi' : 'Suivre'}
                </button>
            </div>

            <div className="h-[1px] w-full bg-white/5 mb-8"></div>

            {/* Overview / Description */}
            <div className="mb-10 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-300 fill-mode-both">
                <h3 className="text-[17px] font-bold text-white mb-3">Vue d'ensemble</h3>
                <div className="text-sm text-gray-300 leading-relaxed line-clamp-3 mb-2">
                    Découvrez une occasion unique de briller sous les projecteurs du {opportunity.club}. Assistez à des prestations dynamiques de nos meilleurs talents et participez à des sessions exclusives de recrutement. Une chance à ne pas manquer pour votre carrière.
                </div>
                <button 
                    onClick={() => setShowOverviewModal(true)}
                    className="text-sm font-bold text-white flex items-center gap-1 active:opacity-70"
                >
                    En savoir plus <Icon name="chevron_right" className="text-lg" />
                </button>
            </div>

            <div className="h-[1px] w-full bg-white/5 mb-10"></div>

            {/* "Bon à savoir" Section */}
            <div className="mb-10 animate-in slide-in-from-right duration-500 delay-300 fill-mode-both">
                <h3 className="text-[17px] font-bold text-white mb-4">Bon à savoir</h3>
                <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-5 px-5">
                    {/* Card 1: Main Info */}
                    <div className="min-w-[280px] w-[280px] bg-[#1C1F26] rounded-2xl p-5 border border-white/5 flex flex-col gap-4">
                        <h4 className="text-[15px] font-bold text-white">Principales infos</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Icon name="schedule" className="text-gray-400 text-xl" />
                                <span className="text-sm font-medium text-gray-200">Durée : 1h 30min</span>
                            </div>
                            
                            {/* Display Division/Age/Sex only for Tryouts */}
                            {opportunity.type === 'Tryout' && (
                                <div className="flex items-center gap-3">
                                    <Icon name="groups" className="text-gray-400 text-xl" />
                                    <span className="text-sm font-medium text-gray-200">{categoryString}</span>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <Icon name="local_parking" className="text-gray-400 text-xl" />
                                <span className="text-sm font-medium text-gray-200">{parkingStatus}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <Icon name="location_on" className="text-gray-400 text-xl" />
                                <span className="text-sm font-medium text-gray-200">En personne</span>
                            </div>
                        </div>
                    </div>
                    {/* Card 2: Refund Policy */}
                    <div className="min-w-[280px] w-[280px] bg-[#1C1F26] rounded-2xl p-5 border border-white/5 flex flex-col gap-4">
                        <h4 className="text-[15px] font-bold text-white">Politique de remboursement</h4>
                        <span className="text-sm font-medium text-gray-400 leading-relaxed">
                            Aucun remboursement n'est possible pour cet événement, sauf annulation.
                        </span>
                    </div>
                </div>
            </div>

            <div className="h-[1px] w-full bg-white/5 mb-10"></div>

            {/* Location Detail Section */}
            <div className="mb-10 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-500 fill-mode-both">
                <h3 className="text-[17px] font-bold text-white mb-4">Lieu</h3>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-1 pr-4">
                        <span className="text-sm font-bold text-white leading-tight">
                            {opportunity.club}
                        </span>
                        <span className="text-[13px] text-gray-400 leading-relaxed">
                            {opportunity.location}
                        </span>
                    </div>
                    <button 
                        onClick={handleOpenMapOptions}
                        className="w-10 h-10 rounded-xl bg-[#1C1F26] border border-white/10 flex items-center justify-center text-white active:scale-95 transition-all hover:bg-[#252a35]"
                    >
                        <Icon name="map" className="text-xl" />
                    </button>
                </div>

                {/* Real Map Iframe with Interaction Overlay */}
                <div 
                    className="relative w-full h-[160px] rounded-2xl overflow-hidden bg-[#1C1F26] border border-white/5 mb-10"
                >
                    <iframe
                        title="Map"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight={0}
                        marginWidth={0}
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(opportunity.club + ' ' + opportunity.location)}&t=m&z=15&output=embed&iwloc=near`}
                        className="w-full h-full object-cover"
                        style={{ filter: 'invert(90%) hue-rotate(180deg) contrast(0.8)' }} // Dark mode map hack
                    ></iframe>
                    
                    {/* Overlay to capture clicks for the Action Sheet */}
                    <div 
                        onClick={handleOpenMapOptions}
                        className="absolute inset-0 bg-transparent cursor-pointer z-10"
                    ></div>
                </div>
            </div>

            <div className="h-[1px] w-full bg-white/5 mb-10"></div>

            {/* Full Organizer Card */}
            <div className="mb-10 animate-in slide-in-from-bottom-4 fade-in duration-500 delay-500 fill-mode-both">
                <h3 className="text-[17px] font-bold text-white mb-4">Organisé par</h3>
                <div className="bg-[#1C1F26] rounded-2xl p-6 border border-white/5 shadow-xl">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-14 h-14 bg-white rounded-xl p-1 shrink-0 overflow-hidden">
                            <img src={opportunity.clubLogo} alt={opportunity.club} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-bold text-white truncate mb-1">{opportunity.club}</h4>
                            <div className="flex items-center gap-4 text-gray-400 text-[11px] font-medium">
                                <div className="flex flex-col">
                                    <span className="text-white font-bold">{followersCount}</span>
                                    <span>Abonnés</span>
                                </div>
                                <div className="w-[1px] h-6 bg-white/10"></div>
                                <div className="flex flex-col">
                                    <span className="text-white font-bold">{eventsCount}</span>
                                    <span>Événements</span>
                                </div>
                                <div className="w-[1px] h-6 bg-white/10"></div>
                                <div className="flex flex-col">
                                    <span className="text-white font-bold">{organizerSince} ans</span>
                                    <span>Organisateur</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setIsFollowing(!isFollowing)}
                            className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 border ${isFollowing ? 'bg-transparent text-white border-white/20' : 'bg-white text-black border-transparent'}`}
                        >
                            {isFollowing ? 'Suivi' : 'Suivre'}
                        </button>
                        <button className="flex-1 py-3 rounded-2xl font-bold text-sm bg-transparent text-white border border-white/20 hover:bg-white/5 transition-all active:scale-95">
                            Contacter
                        </button>
                    </div>
                </div>
            </div>

            {/* Report Button */}
            <button 
                onClick={() => setShowReportModal(true)}
                className="flex items-center gap-3 text-gray-500 hover:text-gray-300 transition-colors mb-12 group w-full animate-in fade-in duration-500 delay-700 fill-mode-both"
            >
                <Icon name="flag" className="text-xl group-active:scale-90" />
                <span className="text-[13px] font-medium underline decoration-gray-700 underline-offset-4">Signaler un événement</span>
            </button>

            {/* "You might also like" Section */}
            <div className="mb-12 animate-in slide-in-from-right duration-500 delay-700 fill-mode-both">
                <h3 className="text-[17px] font-bold text-white mb-6">Vous aimerez peut-être aussi...</h3>
                <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-4 snap-x">
                    {similarOpportunities.map((simOpp) => {
                        const isSimilarSaved = savedSimilarIds.has(simOpp.id);
                        return (
                            <div 
                                key={simOpp.id} 
                                className="min-w-[310px] max-w-[310px] group flex items-center p-4 bg-[#1e232e] hover:bg-[#252a35] rounded-2xl active:scale-[0.99] transition-all cursor-pointer border border-white/5 snap-center"
                            >
                                {/* Left: Logo */}
                                <div className="relative shrink-0 mr-4">
                                    <div className="w-16 h-16 bg-[#2C2C2E] rounded-xl flex items-center justify-center p-2 border border-white/5">
                                        <img src={simOpp.clubLogo} alt={simOpp.club} className="w-full h-full object-contain" />
                                    </div>
                                </div>
                                
                                {/* Middle: Info */}
                                <div className="flex-1 min-w-0 py-1">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded uppercase tracking-wide border border-blue-400/20">
                                            {simOpp.type}
                                        </span>
                                    </div>
                                    
                                    <h4 className="text-[15px] font-bold text-white truncate leading-tight mb-0.5">{simOpp.title}</h4>
                                    <p className="text-[13px] text-gray-400 font-medium truncate mb-2">
                                        {simOpp.club}
                                    </p>
                                    
                                    <div className="flex items-center text-gray-500 gap-4">
                                        <div className="flex items-center gap-1.5">
                                            <Icon name="event" className="text-[13px]" />
                                            <span className="text-[12px] font-medium">{simOpp.date}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Icon name="location_on" className="text-[13px]" />
                                            <span className="text-[12px] font-medium truncate max-w-[80px]">{simOpp.location.split(',')[0]}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Actions */}
                                <div className="pl-3 shrink-0 self-center flex flex-col items-center gap-1">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSaveSimilar(simOpp.id);
                                        }}
                                        className={`w-9 h-9 flex items-center justify-center transition-colors ${isSimilarSaved ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        <Icon name={isSimilarSaved ? "bookmark" : "bookmark_border"} className="text-[22px]" filled={isSimilarSaved} />
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleShareSimilar(simOpp);
                                        }}
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
        </div>
      </div>

      {/* Sticky Bottom Bar - Only if not readOnly */}
      {!readOnly && (
          <div className="shrink-0 p-5 bg-[#0F1115]/95 backdrop-blur-xl border-t border-white/10 pb-[max(1.5rem,env(safe-area-inset-bottom))] z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] absolute bottom-0 left-0 right-0 animate-in slide-in-from-bottom duration-500 delay-500 fill-mode-both">
              <div className="flex items-center justify-between gap-6 max-w-md mx-auto">
                  <div className="flex flex-col min-w-0">
                      <span className="text-base font-bold text-white tracking-tight">{priceRange}</span>
                      <span className="text-[11px] text-gray-500 font-medium whitespace-nowrap mt-0.5">13 mars à 21:30 HE</span>
                  </div>
                  
                  <button 
                      onClick={() => onBuyTickets && onBuyTickets(opportunity)}
                      className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm active:scale-95 transition-all shadow-[0_4px_20px_rgba(255,255,255,0.2)] hover:bg-gray-200 shrink-0"
                  >
                      Obtenir des billets
                  </button>
              </div>
          </div>
      )}

      {opportunityToShare && (
        <ShareModal 
            opportunity={opportunityToShare} 
            onClose={() => setOpportunityToShare(null)} 
        />
      )}

      {/* Map Options Action Sheet (iOS Style) */}
      {showMapOptions && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center isolate animate-in fade-in duration-200">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setShowMapOptions(false)}
            ></div>
            
            <div className="relative w-full max-w-sm mx-4 mb-6 z-10 animate-in slide-in-from-bottom-10 duration-300">
                <div className="bg-[#151518]/90 backdrop-blur-xl rounded-[14px] overflow-hidden mb-2">
                    <div className="py-3 px-4 text-center border-b border-white/10">
                        <span className="text-xs font-semibold text-gray-400">Ouvrir dans Maps</span>
                    </div>
                    
                    <button 
                        onClick={openAppleMaps}
                        className="w-full py-3.5 text-[17px] text-blue-400 font-medium border-b border-white/10 bg-transparent hover:bg-white/5 active:bg-white/10 transition-colors"
                    >
                        Apple Maps
                    </button>
                    
                    <button 
                        onClick={openGoogleMaps}
                        className="w-full py-3.5 text-[17px] text-blue-400 font-medium bg-transparent hover:bg-white/5 active:bg-white/10 transition-colors"
                    >
                        Google Maps
                    </button>
                </div>
                
                <button 
                    onClick={() => setShowMapOptions(false)}
                    className="w-full py-3.5 bg-[#151518]/90 backdrop-blur-xl rounded-[14px] text-[17px] text-blue-400 font-bold hover:bg-white/5 active:bg-white/10 transition-colors"
                >
                    Annuler
                </button>
            </div>
        </div>
      )}

      {/* Overview Modal (What to expect) */}
      {showOverviewModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center isolate animate-in fade-in duration-200">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowOverviewModal(false)}
            ></div>
            
            {/* Modal Sheet */}
            <div className="relative w-full max-w-md mx-auto bg-[#151518] rounded-t-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-2" onClick={() => setShowOverviewModal(false)}>
                    <div className="w-10 h-1 bg-white/20 rounded-full"></div>
                </div>
                
                {/* Content */}
                <div className="p-6 pt-2 pb-12">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-xl font-bold text-white">À quoi s'attendre</h3>
                        <button 
                            onClick={() => setShowOverviewModal(false)}
                            className="p-1 -mr-2 text-gray-400 hover:text-white rounded-full bg-white/5 transition-colors"
                        >
                            <Icon name="close" className="text-2xl" />
                        </button>
                    </div>
                    
                    <div className="text-[15px] text-gray-300 leading-relaxed space-y-4">
                        <p>
                            Découvrez une occasion unique de briller sous les projecteurs du {opportunity.club}. Assistez à des prestations dynamiques de nos meilleurs talents et participez à des sessions exclusives de recrutement.
                        </p>
                        <p>
                            Nos entraîneurs et recruteurs seront présents pour évaluer les performances. C'est le moment idéal pour montrer votre technique, votre vision du jeu et votre esprit d'équipe.
                        </p>
                        <p>
                            Une chance à ne pas manquer pour votre carrière.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Report Event Modal (Sheet) */}
      {showReportModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center isolate animate-in fade-in duration-200">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleCloseReport}
            ></div>
            
            {/* Modal Sheet */}
            <div className="relative w-full h-[95vh] bg-[#0F1115] rounded-t-[20px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col">
                {/* Handle */}
                <div className="flex justify-center pt-3 pb-1" onClick={handleCloseReport}>
                    <div className="w-10 h-1 bg-white/20 rounded-full"></div>
                </div>

                {/* Header */}
                <div className="flex items-center justify-between p-4 pb-2 relative shrink-0">
                    <button 
                        onClick={handleCloseReport}
                        className="w-8 h-8 -ml-1 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                        <Icon name="close" className="text-xl" />
                    </button>
                    <h2 className="text-[15px] font-bold text-white absolute left-1/2 -translate-x-1/2 top-5">
                        Signaler cet événement
                    </h2>
                    <div className="w-8"></div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4 pb-20 relative">
                    
                    {reportStep === 'intro' && (
                        /* STEP 1: Intro */
                        <div className="animate-in fade-in duration-300">
                            <div className="space-y-5 text-[13px] leading-relaxed text-gray-300">
                                <p>
                                    Notre <span className="text-blue-400 font-medium cursor-pointer">Directives de la communauté</span> décrit le type de contenu que nous interdisons sur Spryto. Si vous pensez qu'un événement ne respecte pas les règles, signalez-le nous pour que nous puissions enquêter.
                                </p>
                                <p>
                                    Si vous avez une question au sujet d'un événement, avez besoin de résoudre un différend ou souhaitez demander un remboursement, nous vous encourageons à d'abord <span className="text-blue-400 font-medium cursor-pointer">communiquer avec l'organisateur</span> directement.
                                </p>
                                <p>
                                    Si vous ou quelqu'un d'autre êtes en danger imminent à cause de la page d'un événement, communiquez avec votre service de police local pour obtenir de l'aide.
                                </p>
                            </div>
                        </div>
                    )}

                    {reportStep === 'reason' && (
                        /* STEP 2: Reason Selection */
                        <div className="animate-in slide-in-from-right duration-300">
                            <p className="text-[13px] leading-relaxed text-gray-300 mb-6">
                                Veuillez aider Spryto à faire une enquête sur cet événement en fournissant les raisons pour lesquelles vous le signalez.
                            </p>
                            
                            <div className="relative">
                                <label className="block text-[13px] font-medium text-gray-300 mb-2">Raison du signalement</label>
                                
                                <button 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full bg-[#1C1F26] border border-white/10 rounded-xl px-4 py-3.5 flex items-center justify-between text-left active:bg-[#252a33] transition-colors"
                                >
                                    <span className={`text-[14px] ${selectedReason ? 'text-white font-medium' : 'text-gray-500'}`}>
                                        {selectedReason || "Sélectionnez une raison"}
                                    </span>
                                    <Icon name={isDropdownOpen ? "expand_less" : "expand_more"} className="text-gray-400" />
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#1C1C1E] border border-white/10 rounded-xl shadow-2xl z-20 max-h-[50vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                                        {REPORT_REASONS.map((reason, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setSelectedReason(reason);
                                                    setIsDropdownOpen(false);
                                                    // Auto advance for smoother UX, or keep button logic
                                                    setReportStep('details');
                                                }}
                                                className={`w-full text-left px-4 py-3.5 text-[13px] border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors flex items-center justify-between group ${selectedReason === reason ? 'bg-white/5 text-white font-bold' : 'text-gray-300'}`}
                                            >
                                                <span className="pr-4">{reason}</span>
                                                {selectedReason === reason && <Icon name="check" className="text-blue-500 text-sm shrink-0" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {reportStep === 'details' && (
                        /* STEP 3: Details Form */
                        <div className="animate-in slide-in-from-right duration-300">
                            <p className="text-[13px] leading-relaxed text-gray-300 mb-6">
                                Veuillez aider Spryto à faire une enquête sur cet événement en fournissant les raisons pour lesquelles vous le signalez.
                            </p>

                            <div className="space-y-5">
                                {/* Selected Reason (Interactive Dropdown) */}
                                <div className="relative">
                                    <label className="block text-[13px] font-medium text-gray-300 mb-2">Raison du signalement</label>
                                    <button 
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="w-full bg-[#1C1F26] border border-white/10 rounded-xl px-4 py-3.5 flex items-center justify-between text-left active:bg-[#252a33] transition-colors"
                                    >
                                        <span className="text-[14px] text-white font-medium pr-4 truncate">{selectedReason}</span>
                                        <Icon name={isDropdownOpen ? "expand_less" : "expand_more"} className="text-gray-400 shrink-0" />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isDropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1C1C1E] border border-white/10 rounded-xl shadow-2xl z-20 max-h-[40vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                                            {REPORT_REASONS.map((reason, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => {
                                                        setSelectedReason(reason);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-3.5 text-[13px] border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors flex items-center justify-between group ${selectedReason === reason ? 'bg-white/5 text-white font-bold' : 'text-gray-300'}`}
                                                >
                                                    <span className="pr-4">{reason}</span>
                                                    {selectedReason === reason && <Icon name="check" className="text-blue-500 text-sm shrink-0" />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Email Input */}
                                <div>
                                    <label className="block text-[13px] font-medium text-gray-300 mb-2">
                                        Votre courriel <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="email"
                                        value={reportEmail}
                                        onChange={(e) => setReportEmail(e.target.value)}
                                        placeholder="nom@Exemple.com"
                                        className="w-full bg-[#1C1F26] border border-white/10 rounded-xl px-4 py-3.5 text-[14px] text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
                                    />
                                </div>

                                {/* Description Textarea */}
                                <div>
                                    <label className="block text-[13px] font-medium text-gray-300 mb-2">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea 
                                        value={reportDescription}
                                        onChange={(e) => setReportDescription(e.target.value)}
                                        placeholder={REPORT_PLACEHOLDERS[selectedReason] || "Veuillez fournir plus de détails..."}
                                        rows={5}
                                        className="w-full bg-[#1C1F26] border border-white/10 rounded-xl px-4 py-3.5 text-[14px] text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors resize-none"
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    )}

                    {reportStep === 'success' && (
                        /* STEP 4: Success */
                        <div className="flex flex-col items-center justify-center h-full pt-10 animate-in fade-in duration-500">
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)] mb-6">
                                <Icon name="check" className="text-4xl text-white font-bold" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Signalement envoyé</h3>
                            <p className="text-gray-400 text-center text-sm px-8 leading-relaxed">
                                Merci de nous avoir signalé ce contenu. Notre équipe va examiner votre signalement dans les plus brefs délais.
                            </p>
                        </div>
                    )}
                </div>

                {/* Bottom Action */}
                {reportStep !== 'success' && (
                    <div className="p-6 bg-[#0F1115] border-t border-white/5 pb-[max(2rem,env(safe-area-inset-bottom))]">
                        {reportStep === 'intro' ? (
                            <button 
                                onClick={() => setReportStep('reason')} 
                                className="w-full bg-white text-black font-bold py-3 text-[13px] rounded-xl active:scale-95 transition-transform hover:bg-gray-200"
                            >
                                Commencer le signalement
                            </button>
                        ) : reportStep === 'reason' ? (
                            <button 
                                onClick={() => setReportStep('details')} 
                                disabled={!selectedReason}
                                className={`w-full font-bold py-3 text-[13px] rounded-xl active:scale-95 transition-transform ${selectedReason ? 'bg-white text-black hover:bg-gray-200' : 'bg-[#1C1F26] text-gray-500 cursor-not-allowed border border-white/5'}`}
                            >
                                Suivant
                            </button>
                        ) : (
                            /* Details Step Buttons */
                            <div className="flex gap-3">
                                <button 
                                    onClick={handleSubmitReport}
                                    disabled={!reportEmail || !reportDescription || isSubmittingReport}
                                    className={`flex-1 font-bold py-3 text-[13px] rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-2 ${reportEmail && reportDescription && !isSubmittingReport ? 'bg-white text-black hover:bg-gray-200' : 'bg-[#1C1F26] text-gray-500 cursor-not-allowed border border-white/5'}`}
                                >
                                    {isSubmittingReport ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-gray-500 border-t-black rounded-full animate-spin"></div>
                                            Envoi...
                                        </>
                                    ) : (
                                        'Soumettre le signalement'
                                    )}
                                </button>
                                <button 
                                    onClick={() => setReportStep('reason')}
                                    className="px-6 bg-[#1C1F26] text-white font-bold py-3 text-[13px] rounded-xl active:scale-95 transition-transform hover:bg-white/10 border border-white/10"
                                >
                                    Retour
                                </button>
                            </div>
                        )}
                    </div>
                )}
                
                {reportStep === 'success' && (
                    <div className="p-6 bg-[#0F1115] border-t border-white/5 pb-[max(2rem,env(safe-area-inset-bottom))]">
                        <button 
                            onClick={handleCloseReport} 
                            className="w-full bg-[#1C1F26] text-white font-bold py-3 text-[13px] rounded-xl active:scale-95 transition-transform hover:bg-white/10 border border-white/10"
                        >
                            Fermer
                        </button>
                    </div>
                )}
            </div>
        </div>
      )}

    </div>
  );
};
