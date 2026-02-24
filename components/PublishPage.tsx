
import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';

// Define the data structure passed back to App
export interface PublishData {
  videoUrl: string;
  caption: string;
  activityType: string;
  stats: {
    position: string;
    club: string;
    category: string;
    season: string;
  };
  taggedUserIds: string[];
  aspectRatio: string;
  videoType: 'SHORT' | 'LONG';
}

interface PublishPageProps {
  onBack: () => void;
  onPublish: (data: PublishData) => void;
}

const ModeButton = ({ label, isActive, onClick }: { label: string, isActive: boolean, onClick: () => void }) => (
    <button 
        onClick={onClick}
        className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all duration-300 whitespace-nowrap ${
            isActive 
            ? 'bg-[#262626] text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
            : 'text-gray-500 hover:text-white hover:bg-white/5'
        }`}
    >
        {label}
    </button>
);

const MetadataItem = ({ icon, label, value, valueColor = "text-white", onClick }: { icon: string, label: string, value: string, valueColor?: string, onClick?: () => void }) => (
    <div onClick={onClick} className="flex items-center justify-between py-4 border-b border-white/5 hover:bg-white/5 px-2 -mx-2 rounded-lg transition-colors cursor-pointer group">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                 <Icon name={icon} className="text-gray-400 group-hover:text-white text-lg transition-colors" />
            </div>
            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{label}</span>
        </div>
        <div className="flex items-center gap-2">
            <span className={`text-sm font-bold ${valueColor} text-right truncate max-w-[180px]`}>{value}</span>
            <Icon name="chevron_right" className="text-gray-600 group-hover:text-white transition-colors" />
        </div>
    </div>
);

const POSITION_CATEGORIES = {
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

const SKILLS_DATA: Record<string, string[]> = {
  "Attaquant": ["Finition", "Vitesse", "Dribble", "Tirs de loin", "Jeu de tête", "Appels de balle", "Sang-froid", "Penalty", "Pression"],
  "Milieu": ["Vision", "Passes courtes", "Passes longues", "Contrôle", "Endurance", "Tirs de loin", "Coup franc", "Dribble", "Interceptions"],
  "Défenseur": ["Tacles debouts", "Tacles glissés", "Marquage", "Physique", "Jeu de tête", "Relance", "Agressivité", "Placement", "Blocage"],
  "Gardien": ["Réflexes", "Plongeon", "Jeu au pied", "Sorties aériennes", "1 contre 1", "Placement", "Relance à la main", "Communication"]
};

const MOCK_CLUBS = [
  "PSG Academy", "FC Laval", "Montreal Impact", "Olympique Lyonnais",
  "Real Madrid", "FC Barcelona", "Manchester City", "Liverpool FC",
  "Chelsea FC", "Arsenal", "Juventus", "AC Milan", "Inter Milan",
  "Bayern Munich", "Borussia Dortmund", "Ajax Amsterdam",
  "Benfica", "FC Porto", "Sporting CP", "Boca Juniors",
  "River Plate", "Flamengo", "Santos FC", "Inter Miami",
  "LA Galaxy", "Toronto FC", "CS Longueuil", "AS Blainville"
];

const LEAGUE_LEVELS = [
  "Pro", "Semi-Pro", "Senior", "Senior AAA", "Senior AA",
  "L1QC", "PLSQ", "LDP", "RSEQ D1", "RSEQ D2", "LSEQ AAA", "LDIR",
  "National", "AAA", "AA", "Espoir", "D1", "D2", "D3"
];

const NO_AGE_REQUIRED = [
  "Pro", "Semi-Pro", "Senior", "Senior AAA", "Senior AA", 
  "Ligue 1", "Premier League", "MLS", 
  "RSEQ Universitaire", "RSEQ Collégial D1", "RSEQ Collégial D2",
  "NCAA D1", "NCAA D2"
];

const AGE_GROUPS = [
  "U4", "U5", "U6", "U7", "U8", "U9", "U10", "U11", "U12",
  "U13", "U14", "U15", "U16", "U17", "U18", "U19", "U21", "U23"
];

export const MOCK_TEAMMATES = [
  { id: 'tm1', name: 'Lucas Hernandez', avatar: 'https://i.pravatar.cc/150?u=lucas', role: 'Défenseur' },
  { id: 'tm2', name: 'Ousmane Dembélé', avatar: 'https://i.pravatar.cc/150?u=ousmane', role: 'Attaquant' },
  { id: 'tm3', name: 'Achraf Hakimi', avatar: 'https://i.pravatar.cc/150?u=achraf', role: 'Défenseur' },
  { id: 'tm4', name: 'Warren Zaïre-Emery', avatar: 'https://i.pravatar.cc/150?u=warren', role: 'Milieu' },
  { id: 'tm5', name: 'Gigio Donnarumma', avatar: 'https://i.pravatar.cc/150?u=gigio', role: 'Gardien' },
  { id: 'tm6', name: 'Randal Kolo Muani', avatar: 'https://i.pravatar.cc/150?u=randal', role: 'Attaquant' },
  { id: 'tm7', name: 'Marquinhos', avatar: 'https://i.pravatar.cc/150?u=marqui', role: 'Défenseur' },
  { id: 'tm8', name: 'Vitinha', avatar: 'https://i.pravatar.cc/150?u=vitinha', role: 'Milieu' },
  { id: 'tm9', name: 'Nuno Mendes', avatar: 'https://i.pravatar.cc/150?u=nuno', role: 'Défenseur' },
  { id: 'tm10', name: 'Kang-in Lee', avatar: 'https://i.pravatar.cc/150?u=kangin', role: 'Milieu' },
  { id: 'tm11', name: 'Gonçalo Ramos', avatar: 'https://i.pravatar.cc/150?u=goncalo', role: 'Attaquant' },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 20 }, (_, i) => (currentYear + 2 - i).toString());

export const PublishPage: React.FC<PublishPageProps> = ({ onBack, onPublish }) => {
  const [selectedMode, setSelectedMode] = useState<'video' | 'short'>('video');
  const [detectedType, setDetectedType] = useState<'SHORT' | 'LONG' | null>(null);
  const [classificationReason, setClassificationReason] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  
  const [activityType, setActivityType] = useState('');
  const [showActivitySelector, setShowActivitySelector] = useState(false);
  const [position, setPosition] = useState('');
  const [showPositionSelector, setShowPositionSelector] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [showSeasonSelector, setShowSeasonSelector] = useState(false);
  const [club, setClub] = useState('');
  const [showClubSelector, setShowClubSelector] = useState(false);
  const [clubSearchQuery, setClubSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [categoryStep, setCategoryStep] = useState<'level' | 'age'>('level');
  const [tempLevel, setTempLevel] = useState(''); 
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);
  const [showTeammateSelector, setShowTeammateSelector] = useState(false);
  const [teammateSearchQuery, setTeammateSearchQuery] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [showSkillsSelector, setShowSkillsSelector] = useState(false);
  const [caption, setCaption] = useState('');
  const userName = "Kevin Duboi";
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [showCoverEditor, setShowCoverEditor] = useState(false);
  const [coverTimestamp, setCoverTimestamp] = useState(0);
  const coverVideoRef = useRef<HTMLVideoElement>(null);
  const [activeTool, setActiveTool] = useState<'trim' | 'speed' | 'crop' | 'volume'>('trim');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [aspectRatio, setAspectRatio] = useState<'free' | '9:16' | '4:5' | '1:1' | '16:9'>('free');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [draggingHandle, setDraggingHandle] = useState<'start' | 'end' | null>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const editorVideoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const clubInputRef = useRef<HTMLInputElement>(null);
  const categoryInputRef = useRef<HTMLInputElement>(null);
  const teammateInputRef = useRef<HTMLInputElement>(null);

  const getCategoryForPosition = (posValue: string) => {
    for (const [cat, items] of Object.entries(POSITION_CATEGORIES)) {
        if (items.some(item => item.value === posValue)) return cat;
    }
    return "Milieu";
  };

  const currentPosCategory = getCategoryForPosition(position);
  const isFormValid = activityType !== '' && 
                      position !== '' && 
                      startYear !== '' && 
                      endYear !== '' && 
                      (activityType === 'Entraînement' ? true : (club !== '' && category !== ''));

  useEffect(() => {
    const activityLabel = activityType === 'Match' ? 'Match Highlights' : (activityType === 'Entraînement' ? 'Training Session' : '');
    let generatedCaption = userName;
    if (position) generatedCaption += ` – ${position}`;
    if (activityType !== 'Entraînement') {
        if (club) generatedCaption += ` | ${club}`;
        if (category) generatedCaption += ` | ${category}`;
    }
    if (startYear && endYear) generatedCaption += ` | ${startYear}-${endYear}`;
    if (activityLabel) generatedCaption += ` | ${activityLabel}`;
    setCaption(generatedCaption);
  }, [activityType, position, club, category, startYear, endYear]);

  useEffect(() => {
    setSkills([]);
  }, [position]);

  useEffect(() => {
    if (editorVideoRef.current) {
        editorVideoRef.current.volume = volume;
        editorVideoRef.current.playbackRate = playbackSpeed;
    }
    if (videoRef.current) {
        videoRef.current.volume = volume;
        videoRef.current.playbackRate = playbackSpeed;
    }
  }, [volume, playbackSpeed, isEditing]);

  useEffect(() => {
    const handleMove = (clientX: number) => {
        if (!draggingHandle || !timelineRef.current || duration === 0) return;
        const rect = timelineRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percentage = x / rect.width;
        const newTime = percentage * duration;
        if (editorVideoRef.current && !editorVideoRef.current.paused) {
             editorVideoRef.current.pause();
             setIsPlaying(false);
        }
        if (draggingHandle === 'start') {
            const maxStart = trimEnd - 1; 
            const validStart = Math.max(0, Math.min(newTime, maxStart));
            setTrimStart(validStart);
            if (editorVideoRef.current) {
                editorVideoRef.current.currentTime = validStart;
            }
        } else {
             const minEnd = trimStart + 1;
             const validEnd = Math.min(duration, Math.max(newTime, minEnd));
             setTrimEnd(validEnd);
             if (editorVideoRef.current) {
                editorVideoRef.current.currentTime = validEnd;
            }
        }
    };
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    const onEnd = () => setDraggingHandle(null);
    if (draggingHandle) {
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('touchmove', onTouchMove);
        window.addEventListener('mouseup', onEnd);
        window.addEventListener('touchend', onEnd);
    }
    return () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('mouseup', onEnd);
        window.removeEventListener('touchend', onEnd);
    };
  }, [draggingHandle, duration, trimStart, trimEnd]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      startProcessing(file);
    }
  };

  const startProcessing = (file: File) => {
    setIsProcessing(true);
    setProgress(0);
    setDetectedType(null);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 15;
      });
    }, 200);

    const url = URL.createObjectURL(file);
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.muted = true;
    tempVideo.playsInline = true;
    
    tempVideo.onloadedmetadata = () => {
        const width = tempVideo.videoWidth;
        const height = tempVideo.videoHeight;
        const dur = tempVideo.duration;
        const ratio = height / width;

        // --- BACKEND RULES IMPLEMENTATION ---
        let type: 'SHORT' | 'LONG' = 'LONG';
        let reason = "";

        if (dur > 180) {
            type = 'LONG';
            reason = "Durée supérieure à 3 minutes";
        } else if (height >= width) {
            // Includes Vertical (ratio > 1) and Square (ratio = 1)
            type = 'SHORT';
            reason = "Durée ≤ 3 minutes et format vertical ou carré";
        } else {
            // Landscape
            type = 'LONG';
            reason = "Format horizontal";
        }

        setDetectedType(type);
        setClassificationReason(reason);
        setSelectedMode(type === 'SHORT' ? 'short' : 'video');
        setAspectRatio(type === 'SHORT' ? '9:16' : 'free');
        
        setDuration(dur);
        setTrimStart(0);
        setTrimEnd(dur);
        setCoverTimestamp(0);
    };
    
    tempVideo.src = url;

    setTimeout(() => {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
            setPreviewUrl(url);
            setIsPlaying(true);
            setIsProcessing(false);
        }, 500);
    }, 1500);
  };

  const handleCancelProcessing = () => {
      setIsProcessing(false);
      setProgress(0);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
  };
  
  const handleInternalBack = () => {
      if (showDetails) {
          setShowDetails(false);
          return;
      }
      if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
          setIsPlaying(false);
          setCurrentTime(0);
          setDuration(0);
          setIsEditing(false);
          setTrimStart(0);
          setTrimEnd(0);
          setPlaybackSpeed(1);
          setVolume(1);
          setAspectRatio('free');
          setZoomLevel(1);
          setActiveTool('trim');
          setCoverTimestamp(0);
          setDetectedType(null);
      } else {
          onBack();
      }
  };

  const togglePlay = (ref: React.RefObject<HTMLVideoElement>) => {
      if (!ref.current) return;
      if (isPlaying) {
          ref.current.pause();
      } else {
          ref.current.play();
          ref.current.playbackRate = playbackSpeed;
      }
      setIsPlaying(!isPlaying);
  };

  const onMainTimeUpdate = () => {
      if (videoRef.current) {
          const t = videoRef.current.currentTime;
          if (t >= trimEnd) {
              videoRef.current.currentTime = trimStart;
              if(!videoRef.current.paused) videoRef.current.play();
          }
          setCurrentTime(t);
      }
  };

  const onEditorTimeUpdate = () => {
      if (editorVideoRef.current) {
          const t = editorVideoRef.current.currentTime;
          if (t >= trimEnd) {
              editorVideoRef.current.currentTime = trimStart;
              if(!editorVideoRef.current.paused) editorVideoRef.current.play();
          }
          setCurrentTime(t);
      }
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      const time = parseFloat(e.target.value);
      const clampedTime = Math.max(trimStart, Math.min(time, trimEnd));
      if (videoRef.current) {
          videoRef.current.currentTime = clampedTime;
          setCurrentTime(clampedTime);
      }
  };

  const formatTime = (seconds: number) => {
      if (isNaN(seconds)) return "0:00";
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleLevelSelect = (level: string) => {
    if (NO_AGE_REQUIRED.includes(level)) {
        setCategory(level);
        setShowCategorySelector(false);
    } else {
        setTempLevel(level);
        setCategoryStep('age');
        setCategorySearchQuery('');
    }
  };

  const handleAgeGroupSelect = (group: string) => {
    setCategory(`${tempLevel} ${group}`);
    setShowCategorySelector(false);
    setCategoryStep('level');
  };

  const toggleSkill = (skill: string) => {
    setSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const toggleTeammate = (userId: string) => {
    setTaggedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleEditorDone = () => {
      setIsEditing(false);

      // 1. Get Effective Duration
      const effectiveDuration = trimEnd - trimStart;

      // 2. Get Effective Ratio / Orientation
      let effectiveRatio = 0;
      let isVertical = false;

      // Check explicit crop settings
      if (aspectRatio === '9:16') {
          effectiveRatio = 16 / 9; // ~1.77
          isVertical = true;
      } else if (aspectRatio === '4:5') {
          effectiveRatio = 5 / 4; // 1.25
          isVertical = true;
      } else if (aspectRatio === '1:1') {
          effectiveRatio = 1;
          isVertical = false;
      } else if (aspectRatio === '16:9') {
          effectiveRatio = 9 / 16; // ~0.56
          isVertical = false;
      } else {
          // Free mode: fallback to original video dimensions
          const vid = editorVideoRef.current || videoRef.current;
          if (vid) {
              const w = vid.videoWidth;
              const h = vid.videoHeight;
              if (w > 0) {
                  effectiveRatio = h / w;
                  isVertical = h > w;
              }
          }
      }

      // 3. Apply Classification Rules
      let type: 'SHORT' | 'LONG' = 'LONG';
      let reason = "";

      if (effectiveDuration > 180) {
          type = 'LONG';
          reason = "Durée supérieure à 3 minutes";
      } else if (effectiveRatio >= 1) { // Vertical (>= 1.something) or Square (=1)
          type = 'SHORT';
          reason = "Durée ≤ 3 minutes et format vertical ou carré";
      } else {
          // Horizontal
          type = 'LONG';
          reason = "Format horizontal";
      }

      setDetectedType(type);
      setClassificationReason(reason);
      setSelectedMode(type === 'SHORT' ? 'short' : 'video');

      // Resume main player logic
      setTimeout(() => { 
          if (videoRef.current) { 
              videoRef.current.currentTime = trimStart; 
              videoRef.current.playbackRate = playbackSpeed; 
          } 
      }, 50);
  };

  const handlePublishClick = () => {
      if (!isFormValid || !previewUrl) return;
      setIsPublishing(true);
      setPublishProgress(0);
      const interval = setInterval(() => {
        setPublishProgress(prev => {
            if (prev >= 100) {
                clearInterval(interval);
                return 100;
            }
            return prev + Math.random() * 20;
        });
      }, 300);
      setTimeout(() => {
          clearInterval(interval);
          setPublishProgress(100);
          setTimeout(() => {
             const publishData: PublishData = {
                videoUrl: previewUrl,
                caption: caption,
                activityType: activityType,
                stats: {
                    position: position,
                    club: club,
                    category: category,
                    season: (startYear && endYear) ? `${startYear} - ${endYear}` : '',
                },
                taggedUserIds: taggedUsers,
                aspectRatio: aspectRatio,
                videoType: detectedType || 'LONG'
            };
            onPublish(publishData);
            setIsPublishing(false);
          }, 500);
      }, 2000);
  };

  const getVideoStyle = () => {
    const baseStyle = { transform: `scale(${zoomLevel})` };
    switch (aspectRatio) {
        case '1:1': return { ...baseStyle, className: 'aspect-square w-full max-h-[50vh] object-cover' };
        case '4:5': return { ...baseStyle, className: 'aspect-[4/5] w-full max-h-[55vh] object-cover' };
        case '16:9': return { ...baseStyle, className: 'aspect-video w-full object-cover' };
        case '9:16': return { ...baseStyle, className: 'w-full h-full object-cover' };
        case 'free':
        default: return { ...baseStyle, className: 'w-full h-full object-contain' };
    }
  };

  if (showCoverEditor && previewUrl) {
      return (
        <div className="absolute inset-0 z-[150] bg-[#050507] text-white flex flex-col font-sans">
            <div className="flex items-center justify-between p-4 z-20">
                <button onClick={() => setShowCoverEditor(false)} className="p-1"><Icon name="close" className="text-2xl text-white" /></button>
                <h3 className="text-base font-bold text-white">Photo de couverture</h3>
                <button onClick={() => setShowCoverEditor(false)} className="p-1 text-blue-500"><Icon name="check" className="text-2xl font-bold" /></button>
            </div>
            <div className="flex-1 flex items-center justify-center bg-[#0F1115] relative overflow-hidden">
                <video ref={coverVideoRef} src={previewUrl} className="w-full h-full object-contain max-h-[60vh]" muted playsInline onLoadedData={(e) => e.currentTarget.currentTime = coverTimestamp} />
            </div>
            <div className="bg-[#050507] pb-10 pt-6 px-4">
                <div className="relative w-full h-16 rounded-lg overflow-hidden border border-white/20 bg-gray-800">
                    <div className="absolute inset-0 flex opacity-30">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className={`flex-1 border-r border-white/10 ${i % 2 === 0 ? 'bg-gray-700' : 'bg-gray-600'}`}></div>
                        ))}
                    </div>
                    <input type="range" min={trimStart} max={trimEnd} step="0.01" value={coverTimestamp} onChange={(e) => setCoverTimestamp(parseFloat(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                    <div className="absolute top-0 bottom-0 w-12 border-2 border-white bg-transparent rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] pointer-events-none z-10 transition-all duration-75 ease-linear" style={{ left: `calc(${duration > 0 ? ((coverTimestamp - trimStart) / (trimEnd - trimStart)) * 100 : 0}% - 24px)` }}></div>
                </div>
            </div>
        </div>
      );
  }

  if (showDetails && previewUrl) {
      const videoStyleProps = getVideoStyle();
      return (
        <div className="absolute inset-0 z-[100] bg-[#0F1115] text-white flex flex-col font-sans">
             <div className="flex items-center gap-4 p-4 border-b border-white/10 bg-[#0F1115]/80 backdrop-blur-xl sticky top-0 z-20">
                <button onClick={handleInternalBack} className="p-1 rounded-full hover:bg-white/10 transition-colors"><Icon name="arrow_back" className="text-2xl text-white" /></button>
                <h1 className="text-lg font-bold tracking-tight text-white flex-1 text-center pr-8 uppercase">{detectedType === 'SHORT' ? 'Nouveau Short Play' : 'Nouveau Highlight'}</h1>
             </div>
             <div className="flex-1 overflow-y-auto p-5 pb-32">
                 <div className="flex justify-center mb-8">
                     <div className="relative w-[140px] aspect-[9/16] bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center">
                         <video src={previewUrl} className={`transition-all duration-300 ${videoStyleProps.className}`} style={{ transform: `scale(${zoomLevel})` }} muted playsInline onLoadedData={(e) => { e.currentTarget.currentTime = coverTimestamp; }} ref={(el) => { if (el) el.currentTime = coverTimestamp; }} />
                         <div className="absolute top-2 left-2 z-10">
                             <button onClick={() => setShowCoverEditor(true)} className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors shadow-sm"><Icon name="edit" className="text-sm" /></button>
                         </div>
                         <div className="absolute bottom-2 right-2 z-10">
                             <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${detectedType === 'SHORT' ? 'bg-neon-pink text-white' : 'bg-blue-600 text-white'}`}>
                                 {detectedType}
                             </span>
                         </div>
                     </div>
                 </div>
                 <div className="mb-6 relative">
                     <div className="absolute top-0 right-0 pointer-events-none"><Icon name="auto_fix_high" className="text-neon-violet text-xl animate-pulse" /></div>
                     <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Ajouter une légende..." className="w-full bg-transparent text-white text-base placeholder-gray-500 border-none focus:ring-0 resize-none p-0 h-16 pr-8"></textarea>
                     <div className="h-[1px] w-full bg-white/10 mt-2"></div>
                 </div>
                 <div className="flex flex-col gap-0">
                     <MetadataItem icon={activityType === 'Match' ? "sports_soccer" : (activityType === 'Entraînement' ? "fitness_center" : "help_outline")} label="Type d'activité" value={activityType || "Sélectionner..."} valueColor={activityType ? "text-white" : "text-gray-500"} onClick={() => setShowActivitySelector(true)} />
                     <MetadataItem icon="directions_run" label="Poste" value={position || "Sélectionner..."} valueColor={position ? "text-white" : "text-gray-500"} onClick={() => { setShowPositionSelector(true); setCurrentCategory(null); }} />
                     <MetadataItem icon="calendar_today" label="Saison" value={(startYear && endYear) ? `${startYear} - ${endYear}` : "Sélectionner..."} valueColor={(startYear && endYear) ? "text-white" : "text-gray-500"} onClick={() => setShowSeasonSelector(true)} />
                     {activityType !== 'Entraînement' && (
                        <><MetadataItem icon="shield" label="Club" value={club || "Sélectionner..."} valueColor={club ? "text-white" : "text-gray-500"} onClick={() => { setClubSearchQuery(''); setShowClubSelector(true); }} /><MetadataItem icon="category" label="Catégorie" value={category || "Sélectionner..."} valueColor={category ? "text-white" : "text-gray-500"} onClick={() => { setCategorySearchQuery(''); setCategoryStep('level'); setShowCategorySelector(true); }} /></>
                     )}
                     <MetadataItem icon="bolt" label="Skills" value={skills.length > 0 ? `${skills.length} skills` : "Ajouter (Optionnel)"} valueColor={skills.length > 0 ? "text-white" : "text-gray-500"} onClick={() => setShowSkillsSelector(true)} />
                     <MetadataItem icon="group" label="Coéquipiers" value={taggedUsers.length > 0 ? (taggedUsers.length === 1 ? MOCK_TEAMMATES.find(u => u.id === taggedUsers[0])?.name || '1 personne' : `${taggedUsers.length} personnes`) : "Identifier (Optionnel)"} valueColor={taggedUsers.length > 0 ? "text-white" : "text-gray-500"} onClick={() => setShowTeammateSelector(true)} />
                 </div>
             </div>
             <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#0F1115] border-t border-white/10 flex gap-3 z-30">
                 <button className="flex-1 py-3.5 rounded-xl border border-white/20 text-white font-bold text-xs hover:bg-white/5 transition-colors uppercase tracking-wide">Enregistrer le brouillon</button>
                 <button onClick={handlePublishClick} disabled={!isFormValid} className={`flex-1 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wide transition-all ${isFormValid ? 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white hover:opacity-90 shadow-lg shadow-indigo-500/20' : 'bg-[#1C1F26] text-gray-500 border border-white/5 cursor-not-allowed'}`}>Publier</button>
             </div>
             
             {isPublishing && (
                <div className="absolute inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center px-6">
                    <div className="bg-[#1C1F26] w-full max-w-sm rounded-2xl p-6 border border-white/10 shadow-2xl animate-in zoom-in-95 flex flex-col items-center text-center">
                        <div className="w-12 h-12 mb-4 rounded-full border-4 border-white/10 border-t-blue-500 animate-spin"></div>
                        <h3 className="text-lg font-bold text-white mb-2">Publication en cours...</h3>
                        <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden"><div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-200 ease-out" style={{ width: `${publishProgress}%` }}></div></div>
                    </div>
                </div>
             )}
             {showActivitySelector && (
                <div className="absolute inset-0 z-[120] flex items-end justify-center isolate">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowActivitySelector(false)}></div>
                    <div className="relative w-full max-w-md bg-[#151518] rounded-t-[20px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
                        <div className="flex justify-center pt-3 pb-2" onClick={() => setShowActivitySelector(false)}><div className="w-10 h-1 bg-white/20 rounded-full"></div></div>
                        <div className="p-6 pt-2 pb-10">
                            <h3 className="text-lg font-bold text-white text-center mb-6">Choisir le type d'activité</h3>
                            <div className="flex flex-col gap-3">
                                <button onClick={() => { setActivityType('Match'); setShowActivitySelector(false); }} className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${activityType === 'Match' ? 'bg-white text-black' : 'bg-[#1C1F26] text-white border border-white/5 hover:bg-white/5'}`}><div className="flex items-center gap-3"><Icon name="sports_soccer" className="text-xl" /><span className="font-bold">Match</span></div>{activityType === 'Match' && <Icon name="check_circle" className="text-xl text-black" filled />}</button>
                                <button onClick={() => { setActivityType('Entraînement'); setShowActivitySelector(false); }} className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${activityType === 'Entraînement' ? 'bg-white text-black' : 'bg-[#1C1F26] text-white border border-white/5 hover:bg-white/5'}`}><div className="flex items-center gap-3"><Icon name="fitness_center" className="text-xl" /><span className="font-bold">Entraînement</span></div>{activityType === 'Entraînement' && <Icon name="check_circle" className="text-xl text-black" filled />}</button>
                            </div>
                        </div>
                    </div>
                </div>
             )}
             {showPositionSelector && (
                <div className="absolute inset-0 z-[120] flex items-end justify-center isolate">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowPositionSelector(false)}></div>
                    <div className="relative w-full max-w-md bg-[#151518] rounded-t-[20px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[80vh] flex flex-col">
                        <div className="flex justify-center pt-3 pb-2 shrink-0 bg-[#151518] z-10" onClick={() => setShowPositionSelector(false)}><div className="w-10 h-1 bg-white/20 rounded-full"></div></div>
                        <div className="p-6 pt-2 pb-10 overflow-y-auto">
                            <div className="sticky top-0 bg-[#151518] py-2 z-10 mb-2">{currentCategory ? (<div className="flex items-center relative justify-center"><button onClick={() => setCurrentCategory(null)} className="absolute left-0 p-1 text-gray-400 hover:text-white"><Icon name="arrow_back" className="text-xl" /></button><h3 className="text-lg font-bold text-white text-center">{currentCategory}</h3></div>) : (<h3 className="text-lg font-bold text-white text-center">Choisir la catégorie</h3>)}</div>
                            <div className="flex flex-col gap-2">{!currentCategory ? (Object.keys(POSITION_CATEGORIES).map((cat) => (<button key={cat} onClick={() => { if (cat === 'Gardien') { setPosition("GK"); setShowPositionSelector(false); } else { setCurrentCategory(cat); } }} className={`w-full p-4 rounded-xl flex items-center justify-between transition-all bg-[#1C1F26] text-white border border-white/5 hover:bg-white/5 group`}><span className="font-bold">{cat}</span><Icon name="chevron_right" className="text-gray-500 group-hover:text-white transition-colors" /></button>))) : (POSITION_CATEGORIES[currentCategory as keyof typeof POSITION_CATEGORIES].map((pos) => (<button key={pos.value} onClick={() => { setPosition(pos.value); setShowPositionSelector(false); }} className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${position === pos.value ? 'bg-white text-black' : 'bg-[#1C1F26] text-white border border-white/5 hover:bg-white/5'}`}><span className="font-bold">{pos.label}</span>{position === pos.value && <Icon name="check_circle" className="text-xl text-black" filled />}</button>)))}</div>
                        </div>
                    </div>
                </div>
             )}
             {showSeasonSelector && (
                <div className="absolute inset-0 z-[120] flex items-end justify-center isolate">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowSeasonSelector(false)}></div>
                    <div className="relative w-full max-w-md bg-[#151518] rounded-t-[20px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300"><div className="flex justify-center pt-3 pb-2" onClick={() => setShowSeasonSelector(false)}><div className="w-10 h-1 bg-white/20 rounded-full"></div></div><div className="p-6 pt-2 pb-6"><h3 className="text-lg font-bold text-white text-center mb-6">Choisir la saison</h3><div className="flex gap-4 h-64"><div className="flex-1 flex flex-col bg-[#1C1F26] rounded-xl overflow-hidden border border-white/5"><div className="text-center py-2 bg-white/5 border-b border-white/5 text-xs font-bold text-gray-400 uppercase tracking-wider sticky top-0">Début</div><div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/20">{YEARS.map(year => (<button key={`start-${year}`} onClick={() => setStartYear(year)} className={`w-full py-2.5 mb-1 rounded-lg text-sm font-bold transition-all ${startYear === year ? 'bg-white text-black' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>{year}</button>))}</div></div><div className="flex flex-col justify-center"><Icon name="arrow_forward" className="text-gray-600" /></div><div className="flex-1 flex flex-col bg-[#1C1F26] rounded-xl overflow-hidden border border-white/5"><div className="text-center py-2 bg-white/5 border-b border-white/5 text-xs font-bold text-gray-400 uppercase tracking-wider sticky top-0">Fin</div><div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/20">{YEARS.map(year => (<button key={`end-${year}`} onClick={() => setEndYear(year)} className={`w-full py-2.5 mb-1 rounded-lg text-sm font-bold transition-all ${endYear === year ? 'bg-white text-black' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>{year}</button>))}</div></div></div><button onClick={() => setShowSeasonSelector(false)} className="w-full mt-6 bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors active:scale-95">Valider</button></div></div></div>
             )}
             {showClubSelector && (
                <div className="absolute inset-0 z-[120] flex items-end justify-center isolate"><div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowClubSelector(false)}></div><div className="relative w-full max-w-md bg-[#151518] rounded-t-[20px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[80vh] flex flex-col"><div className="flex justify-center pt-3 pb-2 shrink-0 bg-[#151518] z-10" onClick={() => setShowClubSelector(false)}><div className="w-10 h-1 bg-white/20 rounded-full"></div></div><div className="p-6 pt-2 pb-10 flex-1 flex flex-col min-h-0"><h3 className="text-lg font-bold text-white text-center mb-6">Choisir le club</h3><div className="relative mb-4"><input ref={clubInputRef} type="text" value={clubSearchQuery} onChange={(e) => setClubSearchQuery(e.target.value)} placeholder="Rechercher un club..." className="w-full bg-[#1C1F26] text-white text-base py-3 pl-10 pr-4 rounded-xl border border-white/10 focus:outline-none focus:border-white/30 transition-colors" autoFocus /><div className="absolute left-3 top-3 text-gray-400"><Icon name="search" className="text-xl" /></div></div><div className="flex-1 overflow-y-auto min-h-0 space-y-2">{MOCK_CLUBS.filter(c => c.toLowerCase().includes(clubSearchQuery.toLowerCase())).map((c) => (<button key={c} onClick={() => { setClub(c); setShowClubSelector(false); }} className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${club === c ? 'bg-white text-black' : 'bg-[#1C1F26] text-white border border-white/5 hover:bg-white/5'}`}><span className="font-bold">{c}</span>{club === c && <Icon name="check_circle" className="text-xl text-black" filled />}</button>))}{clubSearchQuery.length > 0 && !MOCK_CLUBS.includes(clubSearchQuery) && (<button onClick={() => { setClub(clubSearchQuery); setShowClubSelector(false); }} className="w-full p-4 rounded-xl flex items-center justify-between transition-all bg-[#1C1F26] text-white border border-dashed border-white/20 hover:bg-white/5"><div className="flex items-center gap-2"><Icon name="add" className="text-xl text-gray-400" /><span className="font-medium text-gray-300">Utiliser "<span className="text-white font-bold">{clubSearchQuery}</span>"</span></div></button>)}</div></div></div></div>
             )}
             {showCategorySelector && (
                <div className="absolute inset-0 z-[120] flex items-end justify-center isolate"><div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowCategorySelector(false)}></div><div className="relative w-full max-w-md bg-[#151518] rounded-t-[20px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[80vh] flex flex-col"><div className="flex justify-center pt-3 pb-2 shrink-0 bg-[#151518] z-10" onClick={() => setShowCategorySelector(false)}><div className="w-10 h-1 bg-white/20 rounded-full"></div></div><div className="p-6 pt-2 pb-10 flex-1 flex flex-col min-h-0"><div className="flex items-center justify-between mb-6 relative">{categoryStep === 'age' && (<button onClick={() => setCategoryStep('level')} className="absolute left-0 text-gray-400 hover:text-white"><Icon name="arrow_back" className="text-2xl" /></button>)}<h3 className="text-lg font-bold text-white text-center w-full">{categoryStep === 'level' ? "Choisir le niveau / ligue" : `Préciser la catégorie d'âge`}</h3></div>{categoryStep === 'level' && (<div className="relative mb-4"><input ref={categoryInputRef} type="text" value={categorySearchQuery} onChange={(e) => setCategorySearchQuery(e.target.value)} placeholder="Rechercher (ex: L1QC, National)" className="w-full bg-[#1C1F26] text-white text-base py-3 pl-10 pr-4 rounded-xl border border-white/10 focus:outline-none focus:border-white/30 transition-colors" autoFocus /><div className="absolute left-3 top-3 text-gray-400"><Icon name="search" className="text-xl" /></div></div>)}<div className="flex-1 overflow-y-auto min-h-0 space-y-2">{categoryStep === 'level' ? (<>{LEAGUE_LEVELS.filter(c => c.toLowerCase().includes(categorySearchQuery.toLowerCase())).map((level) => (<button key={level} onClick={() => handleLevelSelect(level)} className={`w-full p-4 rounded-xl flex items-center justify-between transition-all ${category.startsWith(level) ? 'bg-white text-black' : 'bg-[#1C1F26] text-white border border-white/5 hover:bg-white/5'}`}><span className="font-bold">{level}</span>{!NO_AGE_REQUIRED.includes(level) ? (<Icon name="chevron_right" className="text-gray-500" />) : (category === level && <Icon name="check_circle" className="text-xl text-black" filled />)}</button>))}{categorySearchQuery.length > 0 && !LEAGUE_LEVELS.includes(categorySearchQuery) && (<button onClick={() => { setTempLevel(categorySearchQuery); setCategoryStep('age'); setCategorySearchQuery(''); }} className="w-full p-4 rounded-xl flex items-center justify-between transition-all bg-[#1C1F26] text-white border border-dashed border-white/20 hover:bg-white/5"><div className="flex items-center gap-2"><Icon name="add" className="text-xl text-gray-400" /><span className="font-medium text-gray-300">Utiliser "<span className="text-white font-bold">{categorySearchQuery}</span>"</span></div></button>)}</>) : (AGE_GROUPS.map((group) => (<button key={group} onClick={() => handleAgeGroupSelect(group)} className={`w-full p-4 rounded-xl flex items-center justify-between transition-all bg-[#1C1F26] text-white border border-white/5 hover:bg-white/5`}><span className="font-bold">{group}</span></button>)))}</div></div></div></div>
             )}
             {showSkillsSelector && (
                <div className="absolute inset-0 z-[120] flex items-end justify-center isolate"><div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowSkillsSelector(false)}></div><div className="relative w-full max-w-md bg-[#151518] rounded-t-[20px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] flex flex-col"><div className="flex justify-center pt-3 pb-2 shrink-0 bg-[#151518] z-10" onClick={() => setShowSkillsSelector(false)}><div className="w-10 h-1 bg-white/20 rounded-full"></div></div><div className="p-6 pt-2 pb-0 flex-1 flex flex-col min-h-0"><div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold text-white text-center flex-1">Skills ({currentPosCategory})</h3><button onClick={() => setShowSkillsSelector(false)} className="text-blue-500 font-bold text-sm absolute right-6">Terminé</button></div><div className="flex-1 overflow-y-auto min-h-0 -mx-6 px-6 pb-8">{(SKILLS_DATA[currentPosCategory] || []).map((skill) => { const isSelected = skills.includes(skill); return (<div key={skill} onClick={() => toggleSkill(skill)} className="flex items-center justify-between py-3 cursor-pointer group active:opacity-70 transition-opacity border-b border-white/5"><span className="font-semibold text-white text-sm">{skill}</span><div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-600 group-hover:border-gray-400'}`}>{isSelected && <Icon name="check" className="text-white text-sm font-bold" />}</div></div>); })}</div></div></div></div>
             )}
             {showTeammateSelector && (
                <div className="absolute inset-0 z-[120] flex items-end justify-center isolate"><div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowTeammateSelector(false)}></div><div className="relative w-full max-w-md bg-[#151518] rounded-t-[20px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] flex flex-col"><div className="flex justify-center pt-3 pb-2 shrink-0 bg-[#151518] z-10" onClick={() => setShowTeammateSelector(false)}><div className="w-10 h-1 bg-white/20 rounded-full"></div></div><div className="p-6 pt-2 pb-0 flex-1 flex flex-col min-h-0"><div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold text-white text-center flex-1">Identifier des coéquipiers</h3><button onClick={() => setShowTeammateSelector(false)} className="text-blue-500 font-bold text-sm absolute right-6">Terminé</button></div><div className="relative mb-4"><input ref={teammateInputRef} type="text" value={teammateSearchQuery} onChange={(e) => setTeammateSearchQuery(e.target.value)} placeholder="Rechercher..." className="w-full bg-[#1C1F26] text-white text-sm py-2.5 pl-9 pr-4 rounded-xl border border-white/10 focus:outline-none focus:border-white/30 transition-colors placeholder-gray-500" autoFocus /><div className="absolute left-3 top-2.5 text-gray-500"><Icon name="search" className="text-lg" /></div></div><div className="flex-1 overflow-y-auto min-h-0 -mx-6 px-6 pb-8">{MOCK_TEAMMATES.filter(u => u.name.toLowerCase().includes(teammateSearchQuery.toLowerCase())).map((user) => { const isSelected = taggedUsers.includes(user.id); return (<div key={user.id} onClick={() => toggleTeammate(user.id)} className="flex items-center justify-between py-3 cursor-pointer group active:opacity-70 transition-opacity"><div className="flex items-center gap-3"><img src={user.avatar} alt={user.name} className="w-11 h-11 rounded-full object-cover border border-white/10" /><div className="flex flex-col"><span className="font-semibold text-white text-sm">{user.name}</span><span className="text-xs text-gray-500">{user.role}</span></div></div><div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-600 group-hover:border-gray-400'}`}>{isSelected && <Icon name="check" className="text-white text-sm font-bold" />}</div></div>); })}</div></div></div></div>
             )}
        </div>
      );
  }

  if (isEditing && previewUrl) {
      const startPercent = duration > 0 ? (trimStart / duration) * 100 : 0;
      const endPercent = duration > 0 ? (trimEnd / duration) * 100 : 100;
      const widthPercent = endPercent - startPercent;
      const videoStyleProps = getVideoStyle();
      return (
        <div className="absolute inset-0 z-[110] bg-black text-white flex flex-col font-sans">
            <div className="flex items-center justify-between px-4 py-4 bg-black/80 backdrop-blur-md border-b border-white/5 z-20">
                <button onClick={() => setIsEditing(false)} className="text-white text-sm font-medium hover:text-gray-300 transition-colors">Annuler</button>
                <h3 className="text-base font-bold text-white">Modifier</h3>
                <button onClick={handleEditorDone} className="px-4 py-1.5 bg-white text-black text-xs font-bold rounded-full hover:bg-gray-200 transition-colors shadow-lg active:scale-95">Terminé</button>
            </div>
            <div className="flex-1 relative flex items-center justify-center bg-[#0F1115] overflow-hidden group" onClick={() => togglePlay(editorVideoRef)}>
                <div className={`relative transition-all duration-300 ${aspectRatio === '9:16' ? 'w-full h-full' : 'w-full flex items-center justify-center'}`}><video ref={editorVideoRef} src={previewUrl} className={`shadow-2xl transition-all duration-300 ${videoStyleProps.className}`} style={{ transform: `scale(${zoomLevel})` }} autoPlay loop={false} muted={false} playsInline onTimeUpdate={onEditorTimeUpdate} onPlay={() => { setIsPlaying(true); if(editorVideoRef.current) editorVideoRef.current.playbackRate = playbackSpeed; }} onPause={() => setIsPlaying(false)} /></div>
                {!isPlaying && (<div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none z-10"><div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20"><Icon name="play_arrow" className="text-4xl text-white" filled /></div></div>)}
            </div>
            <div className="bg-black border-t border-white/10 px-5 pt-6 pb-8 flex flex-col justify-end min-h-[260px]">
                 <div className="flex items-center justify-between px-6 mb-8">
                     <button onClick={() => setActiveTool('trim')} className={`flex flex-col items-center gap-2 transition-colors ${activeTool === 'trim' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}><div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${activeTool === 'trim' ? 'bg-white/10 border-white/40 shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'bg-transparent border-white/5'}`}><Icon name="content_cut" className="text-lg" /></div><span className="text-[10px] font-bold uppercase tracking-wider">Couper</span></button>
                     <button onClick={() => setActiveTool('speed')} className={`flex flex-col items-center gap-2 transition-colors ${activeTool === 'speed' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}><div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${activeTool === 'speed' ? 'bg-white/10 border-white/40 shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'bg-transparent border-white/5'}`}><Icon name="speed" className="text-lg" /></div><span className="text-[10px] font-bold uppercase tracking-wider">Vitesse</span></button>
                     <button onClick={() => setActiveTool('crop')} className={`flex flex-col items-center gap-2 transition-colors ${activeTool === 'crop' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}><div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${activeTool === 'crop' ? 'bg-white/10 border-white/40 shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'bg-transparent border-white/5'}`}><Icon name="crop" className="text-lg" /></div><span className="text-[10px] font-bold uppercase tracking-wider">Rogner</span></button>
                     <button onClick={() => setActiveTool('volume')} className={`flex flex-col items-center gap-2 transition-colors ${activeTool === 'volume' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}><div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${activeTool === 'volume' ? 'bg-white/10 border-white/40 shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'bg-transparent border-white/5'}`}><Icon name={volume === 0 ? "volume_off" : "volume_up"} className="text-lg" /></div><span className="text-[10px] font-bold uppercase tracking-wider">Volume</span></button>
                 </div>
                 <div className="h-28 w-full flex flex-col justify-end">
                     {activeTool === 'trim' && (<div className="animate-in fade-in duration-300"><div ref={timelineRef} className="relative h-14 w-full mb-3 select-none touch-none"><div className="absolute inset-0 rounded-lg overflow-hidden flex opacity-40 bg-gray-800">{[...Array(8)].map((_, i) => (<div key={i} className={`flex-1 border-r border-white/5 ${i%2===0 ? 'bg-gray-700' : 'bg-gray-600'}`}></div>))}</div><div className="absolute inset-0"><div className="absolute left-0 top-0 bottom-0 bg-black/70 backdrop-blur-[1px] rounded-l-lg border-r border-white/20" style={{ width: `${startPercent}%` }}></div><div className="absolute right-0 top-0 bottom-0 bg-black/70 backdrop-blur-[1px] rounded-r-lg border-l border-white/20" style={{ width: `${100 - endPercent}%` }}></div><div className="absolute top-0 bottom-0 border-y-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]" style={{ left: `${startPercent}%`, width: `${widthPercent}%` }}><div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-full bg-white rounded-l-md flex items-center justify-center shadow-lg cursor-col-resize touch-manipulation z-10" onMouseDown={() => setDraggingHandle('start')} onTouchStart={() => setDraggingHandle('start')}><div className="w-1 h-4 bg-black/20 rounded-full"></div></div><div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-full bg-white rounded-r-md flex items-center justify-center shadow-lg cursor-col-resize touch-manipulation z-10" onMouseDown={() => setDraggingHandle('end')} onTouchStart={() => setDraggingHandle('end')}><div className="w-1 h-4 bg-black/20 rounded-full"></div></div></div></div></div><div className="flex justify-center text-xs font-medium text-gray-400 font-mono">{formatTime(trimStart)} - {formatTime(trimEnd)} <span className="ml-2 text-gray-600">({(trimEnd - trimStart).toFixed(1)}s)</span></div></div>)}
                     {activeTool === 'speed' && (<div className="flex items-center justify-center gap-3 pb-4 animate-in fade-in duration-300">{[0.5, 1, 1.5, 2].map(speed => (<button key={speed} onClick={() => setPlaybackSpeed(speed)} className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${playbackSpeed === speed ? 'bg-white text-black scale-110 shadow-lg' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}>{speed}x</button>))}</div>)}
                     {activeTool === 'crop' && (<div className="flex flex-col gap-4 animate-in fade-in duration-300 pb-1"><div className="flex items-center justify-between px-2 gap-2 overflow-x-auto hide-scrollbar">{[{ id: 'free', label: 'Original', icon: 'crop_free' }, { id: '9:16', label: '9:16', icon: 'crop_portrait' }, { id: '4:5', label: '4:5', icon: 'crop_7_5' }, { id: '1:1', label: '1:1', icon: 'crop_square' }, { id: '16:9', label: '16:9', icon: 'crop_landscape' }].map((ratio) => (<button key={ratio.id} onClick={() => { setAspectRatio(ratio.id as any); setZoomLevel(1); }} className={`flex flex-col items-center gap-1.5 min-w-[50px] p-2 rounded-xl transition-all ${aspectRatio === ratio.id ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}><Icon name={ratio.icon} className="text-xl" /><span className="text-[10px] font-bold whitespace-nowrap">{ratio.label}</span></button>))}</div>{aspectRatio !== 'free' && (<div className="flex items-center gap-3 px-4"><Icon name="zoom_out" className="text-gray-500 text-sm" /><input type="range" min="1" max="3" step="0.05" value={zoomLevel} onChange={(e) => setZoomLevel(parseFloat(e.target.value))} className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white" /><Icon name="zoom_in" className="text-gray-500 text-sm" /></div>)}</div>)}
                     {activeTool === 'volume' && (<div className="px-4 pb-4 animate-in fade-in duration-300"><div className="flex items-center gap-4"><button onClick={() => setVolume(volume === 0 ? 1 : 0)}><Icon name={volume === 0 ? "volume_off" : "volume_up"} className="text-gray-400" /></button><input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white" /><span className="text-xs font-mono text-gray-400 w-8 text-right">{Math.round(volume * 100)}%</span></div></div>)}
                 </div>
            </div>
        </div>
      );
  }

  if (previewUrl) {
      const sliderMin = trimStart;
      const sliderMax = trimEnd;
      const sliderValue = Math.max(sliderMin, Math.min(currentTime, sliderMax));
      const videoStyleProps = getVideoStyle();
      return (
        <div className="absolute inset-0 bg-black text-white font-sans z-[100]">
             <div className="absolute top-0 left-0 right-0 z-20 p-4 pt-6 bg-gradient-to-b from-black/60 to-transparent"><button onClick={handleInternalBack} className="p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-colors"><Icon name="arrow_back" className="text-2xl" /></button></div>
             <div className="absolute inset-0 flex items-center justify-center bg-[#050507]" onClick={() => togglePlay(videoRef)}><video ref={videoRef} src={previewUrl} className={`transition-all duration-300 ${videoStyleProps.className}`} style={{ transform: `scale(${zoomLevel})` }} playsInline autoPlay loop={false} muted={false} onTimeUpdate={onMainTimeUpdate} onEnded={() => { if (videoRef.current) { videoRef.current.currentTime = trimStart; videoRef.current.play(); } }} onPlay={() => { setIsPlaying(true); if(videoRef.current) videoRef.current.playbackRate = playbackSpeed; }} onPause={() => setIsPlaying(false)} />{!isPlaying && (<div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none z-10"><div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20"><Icon name="play_arrow" className="text-4xl text-white" filled /></div></div>)}</div>
             <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 bg-gradient-to-t from-black via-black/80 to-transparent pt-20 z-20">
                 <div className="flex items-center justify-between text-xs font-medium text-gray-300 mb-3 px-1"><span>{formatTime(currentTime)}</span><span>{formatTime(trimEnd)}</span></div>
                 <input type="range" min={sliderMin} max={sliderMax} step="0.01" value={sliderValue} onChange={onSeek} className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer mb-8 accent-white hover:accent-gray-200" />
                 <div className="flex items-center justify-between gap-4"><button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-[#262626]/80 backdrop-blur-md hover:bg-[#333] text-white px-5 py-3 rounded-xl transition-colors active:scale-95 border border-white/10"><Icon name="content_cut" className="text-lg" /><span className="text-sm font-bold whitespace-nowrap">Modifier</span></button><button onClick={() => { if (videoRef.current) videoRef.current.pause(); setIsPlaying(false); setShowDetails(true); }} className="bg-white text-black px-8 py-3 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors active:scale-95 whitespace-nowrap shadow-[0_0_20px_rgba(255,255,255,0.2)]">Suivant</button></div>
             </div>
        </div>
      );
  }

  return (
    <div className="absolute inset-0 z-[50] bg-[#0F1115] text-white flex flex-col font-sans w-full h-full">
      {isProcessing && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-6">
              <div className="bg-[#1C1F26] w-full max-w-sm rounded-2xl p-6 border border-white/10 shadow-2xl animate-in zoom-in-95">
                  <h3 className="text-lg font-bold text-white mb-2">Analyse de la vidéo...</h3>
                  <div className="w-full bg-gray-700 h-1.5 rounded-full mb-4 overflow-hidden"><div className="bg-blue-500 h-full rounded-full transition-all duration-200 ease-out" style={{ width: `${progress}%` }}></div></div>
                  {detectedType && (
                      <div className="animate-in fade-in slide-in-from-top-2 flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5 mb-4">
                          <div className={`w-2 h-2 rounded-full animate-pulse ${detectedType === 'SHORT' ? 'bg-neon-pink' : 'bg-blue-400'}`}></div>
                          <div>
                              <p className="text-[11px] font-black uppercase text-gray-400 leading-none mb-1">Type détecté</p>
                              <p className="text-sm font-bold text-white leading-none">{detectedType === 'SHORT' ? 'Short Play' : 'Highlight'}</p>
                          </div>
                      </div>
                  )}
                  <div className="flex justify-end"><button onClick={handleCancelProcessing} className="text-blue-400 font-bold text-sm hover:text-blue-300">Annuler</button></div>
              </div>
          </div>
      )}
      <input type="file" ref={galleryInputRef} onChange={handleFileChange} accept="video/*" className="hidden" />
      <input type="file" ref={cameraInputRef} onChange={handleFileChange} accept="video/*" capture="environment" className="hidden" />
      <div className="flex items-center gap-4 p-4 pb-2 bg-transparent z-20"><button onClick={onBack} className="p-1 rounded-full hover:bg-white/10 transition-colors"><Icon name="close" className="text-2xl text-white" /></button><h1 className="text-xl font-bold tracking-tight text-white">Téléverser</h1></div>
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10"><div className="w-full max-w-sm grid grid-cols-2 gap-4"><button onClick={() => cameraInputRef.current?.click()} className="aspect-square bg-[#1C1F26] rounded-3xl border border-white/10 flex flex-col items-center justify-center gap-4 hover:bg-[#252932] active:scale-95 transition-all group shadow-glass"><div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors border border-white/5"><Icon name="videocam" className="text-3xl text-gray-200" /></div><div className="flex flex-col gap-1"><span className="font-bold text-base text-white">Caméra</span><span className="text-[11px] text-gray-500 font-medium">Enregistrer</span></div></button><button onClick={() => galleryInputRef.current?.click()} className="aspect-square bg-[#1C1F26] rounded-3xl border border-white/10 flex flex-col items-center justify-center gap-4 hover:bg-[#252932] active:scale-95 transition-all group shadow-glass"><div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors border border-white/5"><Icon name="photo_library" className="text-3xl text-gray-200" /></div><div className="flex flex-col gap-1"><span className="font-bold text-base text-white">Pellicule</span><span className="text-[11px] text-gray-500 font-medium">Importer</span></div></button></div><div className="mt-8 flex items-center gap-3 text-gray-500 bg-[#1C1F26]/50 px-4 py-3 rounded-xl border border-white/5"><Icon name="info" className="text-lg" /><p className="text-xs font-medium text-left">Les vidéos de moins de 3min en format vertical ou carré sont automatiquement traitées comme des Short Plays.</p></div></div>
      <div className="absolute bottom-0 left-0 right-0 bg-[#0F1115] pb-8 pt-4 px-4 flex justify-center items-center gap-1 z-20 border-t border-white/5"><ModeButton label="Vidéo" isActive={selectedMode === 'video'} onClick={() => setSelectedMode('video')} /><ModeButton label="Courte vidéo" isActive={selectedMode === 'short'} onClick={() => setSelectedMode('short')} /></div>
    </div>
  );
};
