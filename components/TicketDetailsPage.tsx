
import React, { useState } from 'react';
import { Icon } from './Icon';
import { Opportunity } from '../types';

interface TicketDetailsPageProps {
  ticket: Opportunity;
  onBack: () => void;
  onOrderDetails?: () => void;
  onTicketInfo?: () => void;
  onEventDetails?: () => void;
}

const CONTACT_REASONS = [
    "Question sur l'événement",
    "Problème avec mon billet",
    "Demande de remboursement",
    "Accessibilité",
    "Autre"
];

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

export const TicketDetailsPage: React.FC<TicketDetailsPageProps> = ({ ticket, onBack, onOrderDetails, onTicketInfo, onEventDetails }) => {
  const [showMapOptions, setShowMapOptions] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Contact Modal State
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactName, setContactName] = useState('Kevin Duboi');
  const [contactEmail, setContactEmail] = useState('kevin.duboi@example.com');
  const [contactReason, setContactReason] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  // Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportStep, setReportStep] = useState<'intro' | 'reason' | 'details' | 'success'>('intro');
  const [selectedReason, setSelectedReason] = useState('');
  const [reportEmail, setReportEmail] = useState('kevin.duboi@example.com');
  const [reportDescription, setReportDescription] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleAddToCalendar = () => {
      // Mock event details matching the UI text
      const event = {
          title: ticket.title,
          location: "Orford Musique Orford",
          description: `Billet pour ${ticket.title} - Organisé par ${ticket.club}`,
          // 2025-10-16 13:00 to 19:00
          start: "20251016T130000", 
          end: "20251016T190000"
      };

      const icsContent = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'BEGIN:VEVENT',
          `SUMMARY:${event.title}`,
          `LOCATION:${event.location}`,
          `DESCRIPTION:${event.description}`,
          `DTSTART:${event.start}`,
          `DTEND:${event.end}`,
          'END:VEVENT',
          'END:VCALENDAR'
      ].join('\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleShowMap = () => {
      setShowMapOptions(true);
  };

  const locationName = "Orford Musique Orford"; // Hardcoded matching the UI

  const openGoogleMaps = () => {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}`;
      window.open(url, '_blank');
      setShowMapOptions(false);
  };

  const openAppleMaps = () => {
      const url = `http://maps.apple.com/?q=${encodeURIComponent(locationName)}`;
      window.open(url, '_blank');
      setShowMapOptions(false);
  };

  const openUber = () => {
      // Uber universal link with destination
      const url = `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[nickname]=${encodeURIComponent(locationName)}&dropoff[formatted_address]=${encodeURIComponent(locationName)}`;
      window.open(url, '_blank');
      setShowMapOptions(false);
  };

  const handleContactSubmit = () => {
      setIsSubmittingContact(true);
      setTimeout(() => {
          setIsSubmittingContact(false);
          setContactSuccess(true);
          setTimeout(() => {
              setContactSuccess(false);
              setShowContactModal(false);
              setContactReason('');
              setContactMessage('');
          }, 2000);
      }, 1500);
  };

  const handleCloseReport = () => {
      setShowReportModal(false);
      setTimeout(() => {
          setReportStep('intro');
          setSelectedReason('');
          setReportEmail('kevin.duboi@example.com');
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

  return (
    <div className="absolute inset-0 z-[60] bg-[#0F1115] text-white flex flex-col font-sans animate-in slide-in-from-right duration-300 overflow-hidden">
      
      {/* Header */}
      <div className="px-4 pt-12 pb-2 flex items-center justify-between bg-[#0F1115] z-10">
        <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors active:scale-95"
        >
            <Icon name="arrow_back_ios" className="text-xl pl-1" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors active:scale-95">
            <Icon name="ios_share" className="text-xl" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-8">
          <div className="px-6 pt-4 pb-8">
              {/* Event Date & Time */}
              <div className="mb-6">
                  <h2 className="text-sm font-bold text-white">octobre 16, 2025</h2>
                  <p className="text-sm text-gray-400">1:00pm</p>
              </div>

              {/* Thumbnail & Title */}
              <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 shadow-sm bg-white p-1">
                      <img src={ticket.clubLogo} alt={ticket.title} className="w-full h-full object-contain" />
                  </div>
                  <h1 className="text-xl font-bold text-white leading-tight">{ticket.title}</h1>
              </div>

              {/* QR Code Section */}
              <div className="flex flex-col items-center mb-8">
                  <div className="w-64 h-64 bg-white p-4 rounded-3xl shadow-lg mb-4 flex items-center justify-center relative overflow-hidden">
                        {/* Placeholder QR Code */}
                        <img 
                            src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=SprytoTicketExample" 
                            alt="QR Code" 
                            className="w-full h-full object-contain mix-blend-multiply opacity-90"
                        />
                        {/* Central Logo Overlay */}
                        <div className="absolute w-12 h-12 bg-white rounded-full flex items-center justify-center p-1 shadow-md border border-gray-100">
                             <img src={ticket.clubLogo} alt="" className="w-full h-full object-contain" />
                        </div>
                  </div>
                  
                  <div className="text-center">
                      <p className="text-sm font-medium text-white">Kevin Duboi • Billet 1 de 1</p>
                      <p className="text-sm text-gray-400">Billet régulier - Étudiant</p>
                  </div>
              </div>

              {/* Wallet Button */}
              <button className="w-full bg-[#1C1C1E] border border-white/10 text-white py-3.5 rounded-full font-bold text-sm flex items-center justify-center gap-3 mb-10 shadow-lg active:scale-[0.98] transition-transform hover:bg-[#252525]">
                  <div className="w-6 h-4 bg-gradient-to-r from-blue-400 via-yellow-400 to-green-400 rounded-[2px] border border-white/20"></div>
                  Ajouter à Apple Wallet
              </button>

              {/* Details List */}
              <div className="border-t border-white/10 pt-6 space-y-6">
                  {/* Date & Time Row */}
                  <div>
                      <h3 className="text-sm font-bold text-white mb-1">Date et heure</h3>
                      <div className="flex justify-between items-start text-sm text-gray-400">
                          <div>
                              <p>jeu., oct. 16, 2025</p>
                              <p>1:00pm</p>
                          </div>
                          <div className="text-right">
                              <p>jeu., oct. 16, 2025</p>
                              <p>7:00pm</p>
                          </div>
                      </div>
                      <button 
                        onClick={handleAddToCalendar}
                        className="mt-2 text-sm text-gray-400 underline decoration-gray-600 underline-offset-2 hover:text-white"
                      >
                        Ajouter au calendrier
                      </button>
                  </div>

                  <div className="h-[1px] bg-white/5 w-full"></div>

                  {/* Location Row */}
                  <div>
                      <h3 className="text-sm font-bold text-white mb-1">Lieu</h3>
                      <p className="text-sm text-gray-200 mb-2">Orford Musique Orford</p>
                      <button 
                        onClick={handleShowMap}
                        className="text-sm text-gray-400 underline decoration-gray-600 underline-offset-2 hover:text-white"
                      >
                        Afficher la carte
                      </button>
                  </div>

                  <div className="h-[1px] bg-white/5 w-full"></div>

                  {/* Refund Policy */}
                  <div>
                      <h3 className="text-sm font-bold text-white mb-1">Politique de remboursement</h3>
                      <p className="text-sm text-gray-400">Remboursements jusqu'à 1 jours avant l'événement</p>
                  </div>
              </div>

              <div className="h-[1px] bg-white/5 w-full my-6"></div>

              {/* Action Rows */}
              <div className="space-y-1">
                  <ActionRow icon="event" label="Détails de l'événement" onClick={onEventDetails} />
                  <div className="h-[1px] bg-white/5 w-full ml-10"></div>
                  <ActionRow icon="receipt" label="Détails de la commande" onClick={onOrderDetails} />
                  <div className="h-[1px] bg-white/5 w-full ml-10"></div>
                  <ActionRow icon="file_download" label="Télécharger le billet" />
                  <div className="h-[1px] bg-white/5 w-full ml-10"></div>
                  <ActionRow icon="confirmation_number" label="Informations sur les billets" onClick={onTicketInfo} />
                  <div className="h-[1px] bg-white/5 w-full ml-10"></div>
                  <ActionRow 
                    icon="flag" 
                    label="Signaler un événement" 
                    onClick={() => setShowReportModal(true)}
                  />
              </div>

              <div className="h-[1px] bg-white/5 w-full my-8"></div>

              {/* Organizer Section */}
              <div className="mb-6">
                  <h3 className="text-sm font-bold text-white mb-4">Organisé par</h3>
                  <div className="bg-[#1C1F26] rounded-xl p-4 shadow-sm border border-white/5">
                      <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden border border-white/10 p-1 shrink-0">
                              <img src={ticket.clubLogo} alt={ticket.club} className="w-full h-full object-contain" />
                          </div>
                          
                          <div className="flex-1 px-4">
                              <h4 className="text-sm font-bold text-white mb-2">{ticket.club}</h4>
                              <div className="grid grid-cols-3 gap-2">
                                  <div className="flex flex-col">
                                      <span className="text-[10px] text-gray-500">Abonnés</span>
                                      <span className="text-sm font-bold text-white">59</span>
                                  </div>
                                  <div className="flex flex-col border-l border-white/10 pl-2">
                                      <span className="text-[10px] text-gray-500">Évèneme...</span>
                                      <span className="text-sm font-bold text-white">7</span>
                                  </div>
                                  <div className="flex flex-col border-l border-white/10 pl-2">
                                      <span className="text-[10px] text-gray-500">Héberge...</span>
                                      <span className="text-sm font-bold text-white">7 années</span>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="flex gap-3">
                          <button 
                              onClick={() => setIsFollowing(!isFollowing)}
                              className={`flex-1 py-2.5 rounded-full text-xs font-bold active:scale-95 transition-transform border ${
                                isFollowing 
                                  ? 'bg-transparent text-white border-white/20 hover:bg-white/5' 
                                  : 'bg-white text-black border-transparent hover:bg-gray-200'
                              }`}
                          >
                              {isFollowing ? 'Suivi' : 'Suivre'}
                          </button>
                          <button 
                              onClick={() => setShowContactModal(true)}
                              className="flex-1 bg-transparent text-white border border-white/20 py-2.5 rounded-full text-xs font-bold active:scale-95 transition-transform hover:bg-white/5"
                          >
                              Contacter
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* Map Options Modal */}
      {showMapOptions && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center isolate px-4 pb-8">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                onClick={() => setShowMapOptions(false)}
            ></div>
            
            <div className="relative w-full max-w-sm z-10 animate-in slide-in-from-bottom duration-300">
                <div className="bg-[#1C1C1E] rounded-[14px] overflow-hidden mb-2 shadow-2xl">
                    <div className="py-4 px-4 text-center border-b border-white/10 bg-[#1C1C1E]">
                        <h3 className="text-[17px] font-bold text-white mb-1">Open in Maps</h3>
                        <p className="text-[13px] text-gray-400">What app would you like to use?</p>
                    </div>
                    
                    <button 
                        onClick={openGoogleMaps}
                        className="w-full py-4 px-5 flex items-center gap-4 hover:bg-white/10 active:bg-white/15 transition-colors border-b border-white/10 bg-[#1C1C1E]"
                    >
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg" alt="Google Maps" className="w-[30px] h-[30px] object-contain rounded-lg" />
                        <span className="text-[17px] text-white">Google Maps</span>
                    </button>

                    <button 
                        onClick={openUber}
                        className="w-full py-4 px-5 flex items-center gap-4 hover:bg-white/10 active:bg-white/15 transition-colors border-b border-white/10 bg-[#1C1C1E]"
                    >
                        <div className="w-[30px] h-[30px] bg-black rounded-[8px] flex items-center justify-center border border-white/10 shrink-0">
                             <span className="text-white font-bold text-[8px] tracking-tighter">Uber</span>
                        </div>
                        <span className="text-[17px] text-white">Uber</span>
                    </button>
                    
                    <button 
                        onClick={openAppleMaps}
                        className="w-full py-4 px-5 flex items-center gap-4 hover:bg-white/10 active:bg-white/15 transition-colors bg-[#1C1C1E]"
                    >
                        <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Apple_Maps_icon.svg" alt="Apple Maps" className="w-[30px] h-[30px] object-contain" />
                        <span className="text-[17px] text-white">Apple Maps</span>
                    </button>
                </div>
                
                <button 
                    onClick={() => setShowMapOptions(false)}
                    className="w-full py-3.5 bg-[#1C1C1E] rounded-[14px] text-[17px] font-bold text-red-500 active:scale-[0.98] transition-transform hover:bg-white/10 shadow-lg"
                >
                    Cancel
                </button>
            </div>
        </div>
      )}

      {/* Contact Organizer Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center isolate">
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={() => setShowContactModal(false)}
            ></div>
            
            <div className="relative w-full max-w-md h-[95vh] bg-[#0F1115] rounded-t-[20px] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                    <button 
                        onClick={() => setShowContactModal(false)}
                        className="text-gray-400 hover:text-white p-2 -ml-2 rounded-full transition-colors"
                    >
                        <Icon name="close" className="text-xl" />
                    </button>
                    <h2 className="text-[15px] font-bold text-white">Contacter l'organisateur</h2>
                    <div className="w-8"></div>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {contactSuccess ? (
                        <div className="h-full flex flex-col items-center justify-center animate-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)] mb-4">
                                <Icon name="check" className="text-4xl text-white font-bold" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">Message envoyé !</h3>
                            <p className="text-gray-400 text-sm">L'organisateur vous répondra sous peu.</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-medium text-gray-400 block">Nom</label>
                                <input 
                                    type="text" 
                                    value={contactName}
                                    onChange={(e) => setContactName(e.target.value)}
                                    className="w-full bg-[#1C1F26] text-white border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-white/30 transition-colors font-medium"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[13px] font-medium text-gray-400 block">E-mail</label>
                                <input 
                                    type="email" 
                                    value={contactEmail}
                                    onChange={(e) => setContactEmail(e.target.value)}
                                    className="w-full bg-[#1C1F26] text-white border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-white/30 transition-colors font-medium"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[13px] font-medium text-gray-400 block">Raison</label>
                                <div className="relative">
                                    <select 
                                        value={contactReason}
                                        onChange={(e) => setContactReason(e.target.value)}
                                        className="w-full bg-[#1C1F26] text-white border border-white/10 rounded-xl px-4 py-3.5 appearance-none focus:outline-none focus:border-white/30 transition-colors font-medium"
                                    >
                                        <option value="" disabled>Choisissez une raison</option>
                                        {CONTACT_REASONS.map(reason => (
                                            <option key={reason} value={reason}>{reason}</option>
                                        ))}
                                    </select>
                                    <Icon name="expand_more" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[13px] font-medium text-gray-400 block">Message</label>
                                <textarea 
                                    rows={6}
                                    value={contactMessage}
                                    onChange={(e) => setContactMessage(e.target.value)}
                                    className="w-full bg-[#1C1F26] text-white border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-white/30 transition-colors resize-none font-medium"
                                ></textarea>
                                <div className="text-right text-[11px] text-gray-500">
                                    {contactMessage.length}/1000
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer Button */}
                {!contactSuccess && (
                    <div className="p-6 border-t border-white/10 bg-[#0F1115] pb-[max(2rem,env(safe-area-inset-bottom))]">
                        <button 
                            onClick={handleContactSubmit}
                            disabled={!contactReason || !contactMessage || isSubmittingContact}
                            className={`w-full font-bold py-3.5 rounded-full text-[15px] active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
                                contactReason && contactMessage && !isSubmittingContact
                                ? 'bg-white text-black hover:bg-gray-200 shadow-lg' 
                                : 'bg-[#1C1F26] text-gray-500 border border-white/10 cursor-not-allowed'
                            }`}
                        >
                            {isSubmittingContact ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-gray-500 border-t-black rounded-full animate-spin"></div>
                                    Envoi...
                                </>
                            ) : (
                                'Envoyer message'
                            )}
                        </button>
                    </div>
                )}
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
            <div className="relative w-full max-w-md h-[95vh] bg-[#0F1115] rounded-t-[20px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 flex flex-col">
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
                                        className="w-full bg-[#1C1F26] border border-white/10 rounded-xl px-4 py-3.5 text-[14px] text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors resize-none font-medium"
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

const ActionRow = ({ icon, label, onClick }: { icon: string; label: string; onClick?: () => void }) => (
    <button 
        onClick={onClick}
        className="w-full flex items-center justify-between py-4 group active:bg-white/5 transition-colors"
    >
        <div className="flex items-center gap-4">
            <Icon name={icon} className="text-white text-xl" />
            <span className="text-sm font-medium text-white">{label}</span>
        </div>
        <Icon name="chevron_right" className="text-gray-500 text-xl" />
    </button>
);
