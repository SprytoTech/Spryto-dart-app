
import React, { useState, useEffect } from 'react';
import { Opportunity, User } from '../types';
import { Icon } from './Icon';

interface CheckoutPageProps {
  opportunity: Opportunity;
  currentUser: User;
  onBack: () => void;
  onClose: () => void;
  onPurchaseSuccess?: (opportunity: Opportunity) => void;
}

// --- CONSTANTS ---
const POSITION_CATEGORIES: Record<string, { label: string; value: string }[]> = {
  "Attaquant": [
    { label: "Buteur (ST)", value: "ST" },
    { label: "Ailier Gauche (LW)", value: "LW" },
    { label: "Ailier Droit (RW)", value: "RW" },
    { label: "Attaquant de soutien (CF)", value: "CF" },
  ],
  "Milieu": [
    { label: "Milieu Offensif (CAM)", value: "CAM" },
    { label: "Milieu Central (CM)", value: "CM" },
    { label: "Milieu Défensif (CDM)", value: "CDM" },
    { label: "Milieu Gauche (LM)", value: "LM" },
    { label: "Milieu Droit (RM)", value: "RM" },
  ],
  "Défenseur": [
    { label: "Défenseur Central (CB)", value: "CB" },
    { label: "Défenseur Gauche (LB)", value: "LB" },
    { label: "Défenseur Droit (RB)", value: "RB" },
    { label: "Piston Gauche (LWB)", value: "LWB" },
    { label: "Piston Droit (RWB)", value: "RWB" },
  ],
  "Gardien": [
    { label: "Gardien (GK)", value: "GK" }
  ]
};

// --- HIERARCHICAL DATA FOR LEVEL ---
const COUNTRIES = ["Canada", "France", "USA", "Spain", "UK", "Italy", "Germany", "Portugal", "Brazil", "Morocco"];

const REGIONS: Record<string, string[]> = {
  "Canada": ["Québec", "Ontario", "British Columbia", "Alberta", "Nova Scotia"],
  "France": ["Île-de-France", "Auvergne-Rhône-Alpes", "PACA", "Hauts-de-France", "Nouvelle-Aquitaine", "Bretagne"],
  "USA": ["New York", "California", "Florida", "Texas", "Massachusetts"],
  "Spain": ["Madrid", "Catalonia", "Andalusia", "Valencia"],
  "UK": ["England", "Scotland", "Wales"],
  "Italy": ["Lombardy", "Lazio", "Piedmont"],
  "Germany": ["Bavaria", "NRW", "Berlin"],
  "Portugal": ["Lisbon", "Porto", "Algarve"],
  "Brazil": ["São Paulo", "Rio de Janeiro"],
  "Morocco": ["Casablanca-Settat", "Rabat-Salé-Kénitra"]
};

const LEAGUES: Record<string, string[]> = {
  // Canada
  "Québec": ["L1QC", "PLSQ", "LDP", "RSEQ D1", "RSEQ D2", "LSEQ AAA", "LDIR"],
  "Ontario": ["League1 Ontario", "OPDL", "OCSL", "League1 Reserve"],
  "British Columbia": ["League1 BC", "BCCSL"],
  // France
  "Île-de-France": ["Ligue 1", "Ligue 2", "National", "National 2", "National 3", "R1", "R2", "U19 National"],
  "Auvergne-Rhône-Alpes": ["Ligue 1", "Ligue 2", "National", "R1", "R2"],
  "PACA": ["Ligue 1", "National 2", "R1"],
  // USA
  "New York": ["MLS", "USL Championship", "NCAA D1", "NCAA D2", "UPSL", "MLS Next"],
  "California": ["MLS", "USL", "NCAA D1", "MLS Next"],
  "Florida": ["MLS", "USL", "NCAA D1", "UPSL"],
  // UK
  "England": ["Premier League", "Championship", "League One", "League Two", "National League", "Academy"],
  // Spain
  "Madrid": ["La Liga", "Segunda", "Primera RFEF", "Segunda RFEF"],
  "Catalonia": ["La Liga", "Segunda", "Primera RFEF"],
  // Default fallback
  "default": ["Pro League", "Semi-Pro", "Division 1", "Division 2", "Academy", "Regional"]
};

const CATEGORIES: Record<string, string[]> = {
  "L1QC": ["Pro", "Réserve", "U21", "U19"],
  "PLSQ": ["Pro", "Réserve"],
  "LDP": ["U17 AAA", "U16 AAA", "U15 AAA", "U14 AAA"],
  "RSEQ D1": ["Universitaire", "Collégial"],
  "RSEQ D2": ["Collégial"],
  "Ligue 1": ["Pro", "Réserve", "U19 National", "U17 National"],
  "Ligue 2": ["Pro", "Réserve", "U19 National"],
  "National": ["Senior", "U19"],
  "R1": ["Senior", "U20", "U18"],
  "Premier League": ["First Team", "U23", "U21", "U18"],
  "MLS": ["First Team", "MLS Next Pro", "Academy"],
  "MLS Next": ["U19", "U17", "U16", "U15"],
  "NCAA D1": ["Senior", "Junior", "Sophomore", "Freshman"],
  // Default fallback
  "default": ["Senior", "U23", "U21", "U19", "U17", "U16", "U15", "U14", "U13"]
};

// --- SUB-COMPONENTS ---
const InputField = ({ label, value, placeholder, onChange, type = "text", required = false }: any) => (
    <div className="space-y-1.5">
        <label className="text-[13px] text-gray-300 font-bold flex gap-0.5">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input 
            type={type} 
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-[#1C1F26] text-white border border-white/10 rounded-xl py-3 px-4 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all text-[15px]" 
        />
    </div>
);

const CheckboxPolicy = ({ checked, onChange, title, text }: any) => (
    <div className="space-y-3">
        {text && (
            <div className="bg-[#1C1F26] text-gray-400 p-4 rounded-xl border border-white/5 text-[11px] leading-relaxed h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 shadow-inner">
                {text}
            </div>
        )}
        <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5">
                <input 
                    type="checkbox" 
                    checked={checked}
                    onChange={() => onChange(!checked)}
                    className="peer sr-only"
                />
                <div className={`w-6 h-6 rounded border transition-all flex items-center justify-center ${checked ? 'bg-blue-600 border-blue-600' : 'bg-transparent border-gray-500 group-hover:border-gray-300'}`}>
                    {checked && <Icon name="check" className="text-white text-sm font-bold" />}
                </div>
            </div>
            <span className="text-[13px] text-gray-300 leading-snug select-none group-hover:text-white transition-colors pt-0.5">
                {title}
            </span>
        </label>
    </div>
);

// Individual Ticket Form Component
const TicketForm = ({ index, data, onChange, onCopyBuyer, canCopyBuyer, isCopyChecked, allTickets, onUpdateTicket }: any) => {
    const [copySource, setCopySource] = useState<number>(-1);

    // Helper to get dropdown options based on current selection for this specific ticket
    const getRegions = () => REGIONS[data.historyCountry] || [];
    const getLeagues = () => LEAGUES[data.historyRegion] || LEAGUES["default"];
    const getCategories = () => CATEGORIES[data.historyLeague] || CATEGORIES["default"];

    const handleLocalChange = (field: string, value: any) => {
        setCopySource(-1); // Reset copy source to "Autre participant" if user edits manually
        onChange(index, field, value);
    };

    const handleCopySelect = (e: any) => {
        const val = parseInt(e.target.value);
        setCopySource(val);
        
        if (val === -1) {
            // "Autre participant" - Option to clear fields or leave them. 
            // Here we clear them to simulate a "New" entry state.
            const empty = {
                firstName: '', lastName: '', email: '', phone: '', 
                dob: '', nationality: '', positionCategory: '', position: '', 
                shirtSize: '', city: '', level: '', historyCountry: '', historyRegion: '', historyLeague: ''
            };
            onUpdateTicket(index, empty);
        } else {
            const source = allTickets[val];
            // Copy fields from source
            onUpdateTicket(index, {
                firstName: source.firstName,
                lastName: source.lastName,
                email: source.email,
                phone: source.phone,
                dob: source.dob,
                nationality: source.nationality,
                positionCategory: source.positionCategory,
                position: source.position,
                shirtSize: source.shirtSize,
                city: source.city,
                level: source.level,
                historyCountry: source.historyCountry,
                historyRegion: source.historyRegion,
                historyLeague: source.historyLeague
            });
        }
    };

    return (
        <div className="mb-8 border-b border-white/10 pb-8 last:border-0 last:pb-0">
            <h3 className="font-bold text-[17px] mb-4 text-white">Billet {index + 1} • General Admission</h3>
            
            {/* Option to copy from buyer (Only for Ticket 1) */}
            {canCopyBuyer && (
                <div 
                    className="flex items-center gap-3 mb-6 cursor-pointer"
                    onClick={onCopyBuyer}
                >
                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${isCopyChecked ? 'bg-white' : 'bg-transparent border border-gray-500'}`}>
                        {isCopyChecked && <Icon name="check" className="text-black text-xs font-bold" />}
                    </div>
                    <span className="text-[14px] font-medium text-gray-200">Copier les renseignements sur l'acheteur</span>
                </div>
            )}

            {/* Option to copy from other tickets (For Ticket 2+) */}
            {index > 0 && (
                <div className="mb-6 space-y-1.5">
                    <label className="text-[13px] text-gray-300 font-bold">Copier les données de</label>
                    <div className="relative">
                        <select 
                            className="w-full bg-[#1C1F26] text-white border border-white/10 rounded-xl py-3 px-4 appearance-none focus:outline-none focus:border-blue-500 text-[15px]"
                            onChange={handleCopySelect}
                            value={copySource}
                        >
                            <option value={-1}>Autre participant</option>
                            {allTickets.map((t: any, i: number) => {
                                if (i === index) return null;
                                const label = t.firstName && t.lastName 
                                    ? `Billet ${i + 1} • ${t.firstName} ${t.lastName}`
                                    : `Billet ${i + 1} • General Admission`;
                                return (
                                    <option key={i} value={i}>
                                        {label}
                                    </option>
                                );
                            })}
                        </select>
                        <Icon name="expand_more" className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            )}
            
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <InputField 
                        label="Prénom" 
                        value={data.firstName} 
                        required 
                        onChange={(e: any) => handleLocalChange('firstName', e.target.value)} 
                    />
                    <InputField 
                        label="Nom de famille" 
                        value={data.lastName} 
                        required 
                        onChange={(e: any) => handleLocalChange('lastName', e.target.value)} 
                    />
                </div>
                
                <InputField 
                    label="Adresse de courriel" 
                    type="email" 
                    value={data.email} 
                    required 
                    onChange={(e: any) => handleLocalChange('email', e.target.value)} 
                />

                <InputField 
                    label="Téléphone cellulaire" 
                    type="tel" 
                    placeholder="+1 (555) 000-0000" 
                    value={data.phone} 
                    required 
                    onChange={(e: any) => handleLocalChange('phone', e.target.value)} 
                />

                {/* Date of Birth & Nationality Row */}
                <div className="grid grid-cols-2 gap-4">
                    <InputField 
                        label="Date de naissance" 
                        type="date"
                        value={data.dob} 
                        required 
                        onChange={(e: any) => handleLocalChange('dob', e.target.value)} 
                    />
                    
                    <div className="space-y-1.5">
                        <label className="text-[13px] text-gray-300 font-bold flex gap-0.5">Nationalité <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select 
                                className="w-full bg-[#1C1F26] text-white border border-white/10 rounded-xl py-3 px-4 appearance-none focus:outline-none focus:border-blue-500 text-[15px]"
                                value={data.nationality}
                                onChange={(e) => handleLocalChange('nationality', e.target.value)}
                            >
                                <option value="">Sélectionner</option>
                                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <Icon name="expand_more" className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>
                
                {/* Custom Questions - Two Step Position */}
                <div className="space-y-1.5">
                    <label className="text-[13px] text-gray-300 font-bold flex gap-0.5">Your Primary Position: <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Category Select */}
                        <div className="relative">
                            <select 
                                className="w-full bg-[#1C1F26] text-white border border-white/10 rounded-xl py-3 px-4 appearance-none focus:outline-none focus:border-blue-500 text-[15px]"
                                value={data.positionCategory}
                                onChange={(e) => {
                                    handleLocalChange('positionCategory', e.target.value);
                                    handleLocalChange('position', ''); // Reset specific position
                                }}
                            >
                                <option value="">Poste général</option>
                                {Object.keys(POSITION_CATEGORIES).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <Icon name="expand_more" className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Specific Role Select */}
                        <div className="relative">
                            <select 
                                className={`w-full bg-[#1C1F26] text-white border border-white/10 rounded-xl py-3 px-4 appearance-none focus:outline-none focus:border-blue-500 text-[15px] ${!data.positionCategory ? 'opacity-50 cursor-not-allowed' : ''}`}
                                value={data.position}
                                onChange={(e) => handleLocalChange('position', e.target.value)}
                                disabled={!data.positionCategory}
                            >
                                <option value="">Rôle spécifique</option>
                                {data.positionCategory && POSITION_CATEGORIES[data.positionCategory].map((role: any) => (
                                    <option key={role.value} value={role.value}>{role.label}</option>
                                ))}
                            </select>
                            <Icon name="expand_more" className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* HIGHEST LEVEL PLAYED - 4 Step Hierarchy */}
                <div className="space-y-3">
                    <label className="text-[13px] text-gray-300 font-bold flex gap-0.5">Highest level played? <span className="text-red-500">*</span></label>
                    
                    <div className="grid grid-cols-2 gap-3">
                        {/* 1. Country */}
                        <div className="relative">
                            <select 
                                className="w-full bg-[#1C1F26] text-white border border-white/10 rounded-xl py-3 px-4 appearance-none focus:outline-none focus:border-blue-500 text-[13px]"
                                value={data.historyCountry}
                                onChange={(e) => {
                                    handleLocalChange('historyCountry', e.target.value);
                                    handleLocalChange('historyRegion', '');
                                    handleLocalChange('historyLeague', '');
                                    handleLocalChange('level', '');
                                }}
                            >
                                <option value="">Pays</option>
                                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <Icon name="expand_more" className="absolute right-3 top-3.5 text-gray-400 pointer-events-none text-base" />
                        </div>

                        {/* 2. Region */}
                        <div className="relative">
                            <select 
                                className={`w-full bg-[#1C1F26] text-white border border-white/10 rounded-xl py-3 px-4 appearance-none focus:outline-none focus:border-blue-500 text-[13px] ${!data.historyCountry ? 'opacity-50 cursor-not-allowed' : ''}`}
                                value={data.historyRegion}
                                onChange={(e) => {
                                    handleLocalChange('historyRegion', e.target.value);
                                    handleLocalChange('historyLeague', '');
                                    handleLocalChange('level', '');
                                }}
                                disabled={!data.historyCountry}
                            >
                                <option value="">Région/Province</option>
                                {getRegions().map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                            <Icon name="expand_more" className="absolute right-3 top-3.5 text-gray-400 pointer-events-none text-base" />
                        </div>

                        {/* 3. League */}
                        <div className="relative">
                            <select 
                                className={`w-full bg-[#1C1F26] text-white border border-white/10 rounded-xl py-3 px-4 appearance-none focus:outline-none focus:border-blue-500 text-[13px] ${!data.historyRegion ? 'opacity-50 cursor-not-allowed' : ''}`}
                                value={data.historyLeague}
                                onChange={(e) => {
                                    handleLocalChange('historyLeague', e.target.value);
                                    handleLocalChange('level', '');
                                }}
                                disabled={!data.historyRegion}
                            >
                                <option value="">Ligue</option>
                                {getLeagues().map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                            <Icon name="expand_more" className="absolute right-3 top-3.5 text-gray-400 pointer-events-none text-base" />
                        </div>

                        {/* 4. Category / Level */}
                        <div className="relative">
                            <select 
                                className={`w-full bg-[#1C1F26] text-white border border-white/10 rounded-xl py-3 px-4 appearance-none focus:outline-none focus:border-blue-500 text-[13px] ${!data.historyLeague ? 'opacity-50 cursor-not-allowed' : ''}`}
                                value={data.level}
                                onChange={(e) => handleLocalChange('level', e.target.value)}
                                disabled={!data.historyLeague}
                            >
                                <option value="">Catégorie</option>
                                {getCategories().map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <Icon name="expand_more" className="absolute right-3 top-3.5 text-gray-400 pointer-events-none text-base" />
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[13px] text-gray-300 font-bold flex gap-0.5">Which shirt size best fits you? <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <select 
                            className="w-full bg-[#1C1F26] text-white border border-white/10 rounded-xl py-3 px-4 appearance-none focus:outline-none focus:border-blue-500 text-[15px]"
                            value={data.shirtSize}
                            onChange={(e) => handleLocalChange('shirtSize', e.target.value)}
                        >
                            <option value="">Faire un choix</option>
                            <option value="XS">XS</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                        </select>
                        <Icon name="expand_more" className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <InputField 
                    label="What city do you currently live in?" 
                    value={data.city} 
                    required 
                    placeholder="ex: Montréal" 
                    onChange={(e: any) => handleLocalChange('city', e.target.value)} 
                />
            </div>
        </div>
    );
};

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ opportunity, currentUser, onBack, onClose, onPurchaseSuccess }) => {
  const [step, setStep] = useState<'cart' | 'payment' | 'processing' | 'success'>('cart');
  const [quantity, setQuantity] = useState(1);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  
  // Payment Step State
  const [timeLeft, setTimeLeft] = useState(1777); 
  const [paymentMethod, setPaymentMethod] = useState<'apple' | 'card' | 'paypal'>('apple');
  const [saveCardInfo, setSaveCardInfo] = useState(false);
  
  // Logic to split user name
  const names = currentUser.name.split(' ');
  const firstName = names[0] || '';
  const lastName = names.slice(1).join(' ') || '';
  // Generate a mock email if one isn't provided (for demo purposes)
  const userEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/\s+/g, '')}@example.com`;

  // Buyer / Billing Info
  const [buyerInfo, setBuyerInfo] = useState({
      firstName: firstName,
      lastName: lastName,
      email: userEmail,
      phone: '+1 (514) 555-0199', // Pre-fill phone for better UX in demo
      city: '',
      marketing: false,
      notifications: false
  });

  // Default empty ticket data structure
  const getEmptyTicket = () => ({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dob: '',
      nationality: '',
      positionCategory: '',
      position: '',
      shirtSize: '',
      city: '',
      level: '',
      historyCountry: '',
      historyRegion: '',
      historyLeague: ''
  });

  // Pre-fill profile data for the first ticket if available
  const profile = currentUser.profile || {};
  const initialFirstTicket = {
      firstName: firstName,
      lastName: lastName,
      email: userEmail,
      phone: '+1 (514) 555-0199',
      dob: profile.dob || '',
      nationality: profile.nationality || '',
      positionCategory: profile.positionCategory || '',
      position: profile.positionDetail || '',
      shirtSize: profile.shirtSize || '',
      city: profile.city || '',
      level: profile.heightLevel?.level || '', 
      historyCountry: profile.heightLevel?.country || '',
      historyRegion: profile.heightLevel?.region || '',
      historyLeague: profile.heightLevel?.league || ''
  };

  // Ticket Holders Array State
  const [ticketHolders, setTicketHolders] = useState<any[]>([initialFirstTicket]);
  
  // Controls if the FIRST ticket copies buyer info
  const [copyBuyerInfo, setCopyBuyerInfo] = useState(true);

  // Policies State
  const [policies, setPolicies] = useState({
      waiver: false,
      release: false,
      refund: false,
      signature: false
  });

  // Timer Logic
  useEffect(() => {
    if (step === 'payment') {
        const timer = setInterval(() => {
          setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }
  }, [step]);

  // Handle Quantity Changes - Resize array
  useEffect(() => {
      setTicketHolders(prev => {
          if (quantity > prev.length) {
              // Add new empty tickets
              const newTickets = Array(quantity - prev.length).fill(null).map(() => getEmptyTicket());
              return [...prev, ...newTickets];
          } else {
              // Remove excess tickets
              return prev.slice(0, quantity);
          }
      });
  }, [quantity]);

  // Sync First Ticket Holder with Buyer if Copy is checked
  useEffect(() => {
      if (copyBuyerInfo && ticketHolders.length > 0) {
          setTicketHolders(prev => {
              const newHolders = [...prev];
              newHolders[0] = {
                  ...newHolders[0],
                  firstName: buyerInfo.firstName,
                  lastName: buyerInfo.lastName,
                  email: buyerInfo.email,
                  phone: buyerInfo.phone
              };
              return newHolders;
          });
      }
  }, [buyerInfo, copyBuyerInfo]);

  // Generic handler for updating any field in any ticket
  const handleTicketChange = (index: number, field: string, value: any) => {
      if (index === 0 && copyBuyerInfo && ['firstName', 'lastName', 'email', 'phone'].includes(field)) {
          setCopyBuyerInfo(false);
      }
      
      setTicketHolders(prev => {
          const newHolders = [...prev];
          newHolders[index] = { ...newHolders[index], [field]: value };
          return newHolders;
      });
  };

  // Handler for bulk update of a ticket (used for copying data)
  const handleUpdateTicket = (index: number, newData: any) => {
      setTicketHolders(prev => {
          const newHolders = [...prev];
          newHolders[index] = { ...newHolders[index], ...newData };
          return newHolders;
      });
  };

  const handleExitAttempt = (action: () => void) => {
      setPendingAction(() => action);
      setShowExitConfirm(true);
  };

  const confirmExit = () => {
      if (pendingAction) pendingAction();
      setShowExitConfirm(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };
  
  // Pricing Logic
  const basePrice = opportunity.tags.includes('Gratuit') ? 0 : 35;
  const fees = basePrice === 0 ? 0 : 4.50;
  const taxes = basePrice === 0 ? 0 : (basePrice * quantity * 0.15);
  const totalFees = fees + taxes; 
  const subTotal = basePrice * quantity;
  const total = subTotal + totalFees;

  const handlePayment = () => {
    if (!policies.waiver || !policies.release || !policies.refund || !policies.signature) return;
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      // TRIGGER THE CALLBACK HERE
      if (onPurchaseSuccess) {
          onPurchaseSuccess(opportunity);
      }
    }, 2500);
  };

  // --- SUCCESS VIEW ---
  if (step === 'success') {
    return (
      <div className="absolute inset-0 z-[70] bg-[#0F1115] text-white flex flex-col font-sans animate-in fade-in duration-500">
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="relative z-10 w-full max-w-sm">
                <div className="text-center mb-8 animate-in slide-in-from-bottom-8 duration-700 delay-100">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.5)] mx-auto mb-6">
                        <Icon name="check" className="text-3xl text-white font-bold" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">C'est confirmé !</h2>
                    <p className="text-gray-400 text-sm">Votre billet a été ajouté à votre portefeuille.</p>
                </div>
                <div className="animate-in zoom-in-95 duration-700 delay-200">
                    <div className={`w-full rounded-3xl overflow-hidden shadow-2xl relative text-white ${opportunity.backgroundColor || 'bg-blue-600'}`}>
                        <div className="p-6 flex justify-between items-start">
                            <img src={opportunity.clubLogo} alt="Logo" className="w-12 h-12 object-contain bg-white rounded-lg p-1" />
                            <span className="px-3 py-1 bg-black/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/10">
                                {opportunity.type}
                            </span>
                        </div>
                        <div className="px-6 pb-2">
                            <h3 className="text-2xl font-black uppercase tracking-tight leading-none mb-2">{opportunity.title}</h3>
                            <p className="text-sm font-medium opacity-90">{opportunity.club}</p>
                        </div>
                        <div className="px-6 py-6 flex justify-between items-end">
                            <div><p className="text-[10px] uppercase font-bold opacity-60 mb-1">Date</p><p className="text-sm font-bold">{opportunity.date}</p></div>
                            <div className="text-right"><p className="text-[10px] uppercase font-bold opacity-60 mb-1">Quantité</p><p className="text-sm font-bold">{quantity}</p></div>
                        </div>
                        <div className="bg-white p-4 flex flex-col items-center justify-center relative">
                            <div className="absolute top-0 left-0 right-0 h-4 -mt-2 overflow-hidden">
                                <div className="w-full h-4 bg-[#0F1115]" style={{ clipPath: 'polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)' }}></div>
                            </div>
                            <div className="w-full h-16 bg-black pattern-grid-lg opacity-90 mt-2 mb-2" style={{ backgroundImage: 'linear-gradient(90deg, #000 2px, transparent 2px, transparent 4px, #000 4px, #000 8px, transparent 8px)', backgroundSize: '10px 100%' }}></div>
                            <p className="text-[9px] text-gray-400 font-mono tracking-[0.2em]">8392 2930 4921</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="p-6 bg-[#0F1115] border-t border-white/5 safe-area-bottom">
            <button onClick={onClose} className="w-full bg-[#1C1F26] text-white font-bold py-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors active:scale-[0.98]">Fermer</button>
        </div>
      </div>
    );
  }

  // --- MAIN RENDER ---
  return (
    <div className="absolute inset-0 z-[70] bg-[#0F1115] text-white flex flex-col font-sans animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className={`relative px-4 pb-4 flex flex-col items-center bg-[#0F1115] border-b border-white/5 z-20 transition-all ${step === 'payment' ? 'pt-12' : 'pt-10'}`}>
        {step === 'payment' ? (
            <div className="w-full flex justify-between items-center relative">
                <button onClick={() => handleExitAttempt(() => setStep('cart'))} className="p-2 -ml-2 text-gray-400 hover:text-white"><Icon name="arrow_back" className="text-2xl" /></button>
                <div className="flex flex-col items-center">
                    <span className="text-[16px] font-bold">Compléter</span>
                    <span className="text-[13px] text-gray-400 font-medium tabular-nums">Temps restant {formatTime(timeLeft)}</span>
                </div>
                <button onClick={() => handleExitAttempt(onClose)} className="p-2 -mr-2 text-gray-400 hover:text-white"><Icon name="close" className="text-2xl" /></button>
            </div>
        ) : (
            <>
                <h1 className="text-base font-bold text-center leading-tight max-w-[80%] text-white">{opportunity.title}</h1>
                <p className="text-xs text-gray-400 mt-1 font-medium">{opportunity.date} • 9:00</p>
                <button onClick={onClose} className="absolute top-10 right-5 p-2 -mr-2 text-gray-400 hover:text-white"><Icon name="close" className="text-2xl" /></button>
            </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto bg-[#0F1115]">
        
        {step === 'cart' ? (
            // --- CART VIEW ---
            <div className="px-5 py-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#1C1F26]">
                    <div className="p-5 flex items-center justify-between">
                        <span className="font-bold text-sm text-white">Admission Générale</span>
                        <div className="flex items-center gap-4">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity === 1} className={`w-8 h-8 rounded-full border border-white/20 flex items-center justify-center transition-colors ${quantity === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 text-white'}`}><Icon name="remove" className="text-base" /></button>
                            <span className="font-bold text-base w-4 text-center text-white">{quantity}</span>
                            <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 text-white"><Icon name="add" className="text-base" /></button>
                        </div>
                    </div>
                    <div className="h-[1px] bg-white/5 w-full"></div>
                    <div className="p-5">
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-lg font-bold text-white">{(basePrice * quantity).toFixed(2)} $</span>
                            <span className="text-xs text-gray-500 font-medium">incl. {fees.toFixed(2)} $ frais</span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium mt-1">Les ventes se terminent le 7 mars 2026</p>
                    </div>
                </div>
            </div>
        ) : step === 'payment' ? (
            // --- PAYMENT VIEW (REDESIGNED) ---
            <div className="px-5 pb-32 pt-2 space-y-8 animate-in slide-in-from-right-8 duration-300">
                
                {/* Event Summary */}
                <div className="flex gap-4 items-start">
                    <img src={opportunity.clubLogo} alt="" className="w-20 h-20 object-contain bg-white rounded-lg p-2 shadow-sm" />
                    <div>
                        <h2 className="font-bold text-[16px] leading-tight mb-1">{opportunity.title}</h2>
                        <p className="text-xs text-gray-400 mb-2">{opportunity.date} • 9:00 am</p>
                    </div>
                </div>

                {/* Info Text */}
                <div className="text-[13px] text-gray-400 leading-relaxed bg-[#1C1F26] p-4 rounded-xl border border-white/5">
                    Registration will begin at 9 am. Due to league rules, players with 3+ years professional experience are not eligible. 
                    <br/><br/>
                    <span className="font-bold text-white uppercase">AFTER MARCH 1st, 2025: NO REFUNDS FOR ANY REASON.</span>
                </div>

                {/* Billing Info */}
                <div>
                    <h3 className="font-bold text-[17px] mb-4 text-white">Informations de facturation</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Prénom" value={buyerInfo.firstName} required onChange={(e: any) => setBuyerInfo({...buyerInfo, firstName: e.target.value})} />
                            <InputField label="Nom de famille" value={buyerInfo.lastName} required onChange={(e: any) => setBuyerInfo({...buyerInfo, lastName: e.target.value})} />
                        </div>
                        <InputField label="Adresse de courriel" type="email" value={buyerInfo.email} required onChange={(e: any) => setBuyerInfo({...buyerInfo, email: e.target.value})} />
                        <InputField label="Téléphone cellulaire" type="tel" placeholder="+1 (555) 000-0000" value={buyerInfo.phone} required onChange={(e: any) => setBuyerInfo({...buyerInfo, phone: e.target.value})} />
                    </div>
                    
                    {/* Marketing Checkboxes */}
                    <div className="space-y-4 pt-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" className="mt-1 rounded border-gray-600 bg-transparent text-blue-500 focus:ring-0" checked={buyerInfo.marketing} onChange={(e) => setBuyerInfo({...buyerInfo, marketing: e.target.checked})} />
                            <span className="text-[12px] text-gray-400 leading-snug">Tenez-moi au courant des autres événements et des nouvelles de cet organisateur.</span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input type="checkbox" className="mt-1 rounded border-gray-600 bg-transparent text-blue-500 focus:ring-0" checked={buyerInfo.notifications} onChange={(e) => setBuyerInfo({...buyerInfo, notifications: e.target.checked})} />
                            <span className="text-[12px] text-gray-400 leading-snug">Envoyez-moi des courriels sur les meilleurs événements ayant lieu près de moi.</span>
                        </label>
                    </div>
                </div>

                {/* Ticket Details - Dynamic Loop */}
                <div>
                    {ticketHolders.map((data, index) => (
                        <TicketForm 
                            key={index}
                            index={index}
                            data={data}
                            onChange={handleTicketChange}
                            onCopyBuyer={() => setCopyBuyerInfo(!copyBuyerInfo)}
                            canCopyBuyer={index === 0}
                            isCopyChecked={index === 0 && copyBuyerInfo}
                            allTickets={ticketHolders}
                            onUpdateTicket={handleUpdateTicket}
                        />
                    ))}
                </div>

                {/* Policies Section */}
                <div>
                    <h3 className="font-bold text-[17px] mb-5 text-white">Politiques et Accords</h3>
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-2">WAIVER OF LIABILITY 2025 <span className="text-red-500">*</span></h4>
                            <CheckboxPolicy 
                                title="J'accepte les conditions additionnelles ci-dessus." 
                                checked={policies.waiver}
                                onChange={(val: boolean) => setPolicies({...policies, waiver: val})}
                                text={`WAIVER OF LIABILITY AND HOLD HARMLESS AGREEMENT 2025\n\nI hereby acknowledge that I have voluntarily applied/agreed to participate in an event taking place at Raimondi Park, operated by Oakland Ballers Baseball Club, Inc., which is a professional baseball organization.\n\nI hereby RELEASE, WAIVE, DISCHARGE, AND COVENANT NOT TO SUE Oakland Ballers Baseball Club, Inc...`}
                            />
                        </div>
                        <div>
                            <h4 className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-2">APPEARANCE RELEASE AGREEMENT <span className="text-red-500">*</span></h4>
                            <CheckboxPolicy 
                                title="J'accepte l'accord de droit à l'image." 
                                checked={policies.release}
                                onChange={(val: boolean) => setPolicies({...policies, release: val})}
                                text={`I hereby grant permission to the rights of my image, likeness and sound of my voice as recorded on audio or video tape without payment or any other consideration. I understand that my image may be edited, copied, exhibited, published or distributed and waive the right to inspect or approve the finished product wherein my likeness appears. Additionally, I waive any right to royalties or other compensation arising or related to the use of my image or recording.`}
                            />
                        </div>
                        <div>
                            <h4 className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-2">Politique d'annulation <span className="text-red-500">*</span></h4>
                            <CheckboxPolicy 
                                title="J'accepte la politique d'annulation." 
                                checked={policies.refund}
                                onChange={(val: boolean) => setPolicies({...policies, refund: val})}
                                text="AFTER MARCH 1st, 2025 at 11:59PM Pacific, THERE ARE NO REFUNDS FOR ANY REASON. To cancel before March 1st at 11:59pm Pacific, please email players@oaklandballers.com."
                            />
                        </div>
                        <div>
                            <h4 className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-2">Signature numérique <span className="text-red-500">*</span></h4>
                            <CheckboxPolicy 
                                title="I agree to this digital signature being my binding agreement." 
                                checked={policies.signature}
                                onChange={(val: boolean) => setPolicies({...policies, signature: val})}
                                text="I agree to this digital signature being my binding agreement and I have read all of the terms and conditions in detail."
                            />
                        </div>
                    </div>
                </div>

                <div className="h-[1px] bg-white/10 w-full"></div>

                {/* Payment Methods */}
                <div>
                    <h3 className="font-bold text-[17px] mb-4 text-white">Payer avec</h3>
                    <div className="space-y-3">
                        {/* Apple Pay */}
                        <button onClick={() => setPaymentMethod('apple')} className={`w-full p-4 rounded-xl flex items-center justify-between border transition-all active:scale-[0.98] ${paymentMethod === 'apple' ? 'bg-white text-black border-white' : 'bg-[#1C1F26] text-white border-white/10 hover:bg-white/5'}`}>
                            <div className="flex items-center gap-3"><Icon name="apple" className="text-2xl" /><span className="font-bold text-[15px]">Apple Pay</span></div>
                            {paymentMethod === 'apple' && <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center"><Icon name="check" className="text-white text-xs font-bold" /></div>}
                        </button>

                        {/* Card Section - Container */}
                        <div className={`w-full rounded-xl border transition-all overflow-hidden ${paymentMethod === 'card' ? 'bg-[#0F1115] text-white border-white/20' : 'bg-[#1C1F26] text-white border-white/10'}`}>
                            <div 
                                onClick={() => setPaymentMethod('card')}
                                className={`flex items-center justify-between p-4 cursor-pointer ${paymentMethod === 'card' ? '' : 'hover:bg-white/5'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon name="credit_card" className={`text-2xl ${paymentMethod === 'card' ? 'text-white' : 'text-gray-400'}`} />
                                    <span className="font-bold text-[15px]">Carte de crédit ou de débit</span>
                                </div>
                            </div>

                            {/* Card Form - Nested */}
                            {paymentMethod === 'card' && (
                                <div className="px-4 pb-6 pt-0 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                                     {/* Card Number */}
                                     <div className="space-y-1.5">
                                        <label className="text-[12px] font-bold text-gray-400 flex gap-0.5">Numéro de carte <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                className="w-full bg-[#1C1F26] border border-white/10 rounded-lg py-3 px-3 text-white placeholder-gray-500 text-[14px] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-sm" 
                                            />
                                            <Icon name="credit_card" className="absolute right-3 top-3.5 text-gray-500 text-lg pointer-events-none" />
                                        </div>
                                     </div>

                                     {/* Expiry & CVC */}
                                     <div className="flex gap-4">
                                         <div className="w-1/2 space-y-1.5">
                                             <label className="text-[12px] font-bold text-gray-400 flex gap-0.5">Date d'expiration <span className="text-red-500">*</span></label>
                                             <input 
                                                type="text" 
                                                placeholder="MM / AA" 
                                                className="w-full bg-[#1C1F26] border border-white/10 rounded-lg py-3 px-3 text-white placeholder-gray-500 text-[14px] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-sm" 
                                             />
                                         </div>
                                         <div className="w-1/2 space-y-1.5">
                                             <label className="text-[12px] font-bold text-gray-400 flex gap-0.5">Code de sécurité <span className="text-red-500">*</span></label>
                                             <input 
                                                type="text" 
                                                placeholder="123" 
                                                className="w-full bg-[#1C1F26] border border-white/10 rounded-lg py-3 px-3 text-white placeholder-gray-500 text-[14px] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-sm" 
                                             />
                                         </div>
                                     </div>

                                     {/* Zip Code */}
                                     <div className="space-y-1.5">
                                        <label className="text-[12px] font-bold text-gray-400 flex gap-0.5">Code postal <span className="text-red-500">*</span></label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-[#1C1F26] border border-white/10 rounded-lg py-3 px-3 text-white placeholder-gray-500 text-[14px] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-sm" 
                                        />
                                     </div>

                                     {/* Save Card */}
                                     <label className="flex items-start gap-3 cursor-pointer pt-1 group">
                                        <div className="relative mt-0.5">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only"
                                                checked={saveCardInfo}
                                                onChange={(e) => setSaveCardInfo(e.target.checked)}
                                            />
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${saveCardInfo ? 'bg-blue-600 border-blue-600' : 'bg-[#1C1F26] border-gray-500'}`}>
                                                <Icon name="check" className={`text-white text-xs font-bold transition-opacity ${saveCardInfo ? 'opacity-100' : 'opacity-0'}`} />
                                            </div>
                                        </div>
                                        <span className="text-[13px] text-gray-400 leading-snug group-hover:text-white transition-colors">Enregistrer les détails de paiement sur votre compte Spryto (facultatif)</span>
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* PayPal */}
                        <button onClick={() => setPaymentMethod('paypal')} className={`w-full p-4 rounded-xl flex items-center justify-between border transition-all active:scale-[0.98] ${paymentMethod === 'paypal' ? 'bg-white text-black border-white' : 'bg-[#1C1F26] text-white border-white/10 hover:bg-white/5'}`}>
                            <div className="flex items-center gap-3"><span className="font-bold text-[#003087] italic text-xl pr-1">PayPal</span></div>
                            {paymentMethod === 'paypal' && <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center"><Icon name="check" className="text-white text-xs font-bold" /></div>}
                        </button>
                    </div>
                </div>

                {/* Price Summary & Legal - Moved from Footer */}
                <div className="pt-2">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[13px] font-medium text-gray-300">{opportunity.date} • 9:00</span>
                        <div 
                            className="flex items-center gap-1.5 cursor-pointer active:opacity-60 transition-opacity"
                            onClick={() => setShowOrderSummary(!showOrderSummary)}
                        >
                            <Icon name="info" className="text-gray-400 text-xs" />
                            <span className="font-bold text-[15px] text-white">{total.toFixed(2)} $</span>
                        </div>
                    </div>
                    
                    <p className="text-[11px] text-gray-500 leading-snug">
                        En sélectionnant {paymentMethod === 'apple' ? 'Payer' : 'Commander'}, j'accepte les <span className="underline decoration-gray-600 underline-offset-2">conditions d'utilisation du service Spryto</span>.
                    </p>
                </div>
            </div>
        ) : null}
      </div>

      {/* Sticky Footer */}
      <div className="p-5 pb-[max(2rem,env(safe-area-inset-bottom))] border-t border-white/10 bg-[#0F1115] relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          {step === 'processing' ? (
              <button disabled className="w-full h-14 bg-[#1C1F26] text-white rounded-xl font-bold text-[16px] flex items-center justify-center gap-3 cursor-wait border border-white/10">
                  <div className="w-5 h-5 border-2 border-gray-500 border-t-white rounded-full animate-spin"></div>
                  Traitement...
              </button>
          ) : step === 'cart' ? (
              <div className="animate-in fade-in duration-300">
                  <div onClick={() => setShowOrderSummary(!showOrderSummary)} className="flex items-center gap-2 mb-4 px-1 cursor-pointer active:opacity-70 transition-opacity w-fit">
                      <Icon name="info" className="text-gray-400 text-sm" />
                      <span className="font-bold text-xl text-white">{total.toFixed(2)} $</span>
                  </div>
                  <button onClick={() => setStep('payment')} className="w-full h-11 bg-white text-black rounded-xl font-bold text-[15px] hover:bg-gray-200 active:scale-[0.98] transition-all shadow-lg">Consultez</button>
              </div>
          ) : (
              <button 
                onClick={handlePayment}
                disabled={!policies.waiver || !policies.release || !policies.refund || !policies.signature}
                className={`w-full h-12 rounded-xl font-bold text-[16px] active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2 ${
                    (policies.waiver && policies.release && policies.refund && policies.signature) ? 'bg-white text-black hover:bg-gray-200' : 'bg-[#1C1F26] text-gray-500 border border-white/10 cursor-not-allowed'
                }`}
              >
                  {paymentMethod === 'apple' ? (<>Payer avec <Icon name="apple" className="text-xl pb-0.5" /></>) : 'Commander'}
              </button>
          )}
      </div>

      {/* Exit Confirmation Screen (Z-Index 100 to overlay everything) */}
      {showExitConfirm && (
        <div className="absolute inset-0 z-[100] bg-[#0F1115] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
            <h2 className="text-2xl font-bold text-white mb-2">Quitter la caisse?</h2>
            <p className="text-gray-400 text-sm mb-8">Il se peut que vos billets ne soient plus disponibles.</p>

            <div className="w-full max-w-xs space-y-3">
                <button 
                    onClick={confirmExit} 
                    className="w-full bg-white text-black font-bold py-4 rounded-full active:scale-95 transition-transform"
                >
                    Oui, quitter
                </button>

                <button 
                    onClick={() => setShowExitConfirm(false)} 
                    className="w-full bg-transparent border border-white/20 text-white font-bold py-4 rounded-full active:scale-95 transition-transform hover:bg-white/5"
                >
                    Non, rester
                </button>
            </div>
        </div>
      )}

      {/* Order Summary Modal (Bottom Sheet) */}
      {showOrderSummary && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center isolate">
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={() => setShowOrderSummary(false)}
            ></div>
            <div className="relative w-full max-w-md bg-[#1C1F26] rounded-t-[20px] pb-safe animate-in slide-in-from-bottom duration-300 overflow-hidden shadow-2xl">
                <div className="p-5">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-[17px] font-bold text-white">Résumé de la commande</h3>
                        <button onClick={() => setShowOrderSummary(false)} className="text-gray-400 hover:text-white p-1">
                            <Icon name="close" className="text-xl" />
                        </button>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-[14px]">
                            <span className="text-gray-300">{quantity} x General Admission</span>
                            <span className="text-white font-medium">{subTotal.toFixed(2)} $</span>
                        </div>
                        <div className="flex justify-between text-[14px]">
                            <span className="text-gray-300">Total partiel</span>
                            <span className="text-white font-medium">{subTotal.toFixed(2)} $</span>
                        </div>
                        <div className="flex justify-between text-[14px]">
                            <span className="text-gray-300 flex items-center gap-1">Frais <Icon name="info" className="text-[12px]" /></span>
                            <span className="text-white font-medium">{totalFees.toFixed(2)} $</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-6 pt-4 border-t border-white/10">
                        <span className="text-[16px] font-bold text-white">Total</span>
                        <span className="text-[16px] font-bold text-white">{total.toFixed(2)} $</span>
                    </div>

                    <div className="bg-[#151518] rounded-xl p-4 border border-white/5 mb-6">
                        <div className="flex items-start gap-3">
                            <Icon name="undo" className="text-gray-400 text-lg mt-0.5" />
                            <div>
                                <h4 className="text-[13px] font-bold text-white mb-1">Politique de remboursement</h4>
                                <p className="text-[12px] text-gray-400 leading-snug">
                                    Refunds up to 7 days before event. Les frais de Spryto ne sont pas remboursables.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mb-6">
                        <Icon name="info" className="text-gray-400 text-sm" />
                        <span className="text-[14px] font-bold text-white">{total.toFixed(2)} $</span>
                    </div>

                    <button 
                        onClick={() => setShowOrderSummary(false)}
                        className="w-full bg-white text-black font-bold py-3.5 rounded-xl active:scale-[0.98] transition-transform"
                    >
                        Consultez
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
