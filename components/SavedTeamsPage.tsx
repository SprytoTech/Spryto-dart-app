
import React from 'react';
import { Icon } from './Icon';
import { SavedTeam } from '../types';

interface SavedTeamsPageProps {
    savedTeams: SavedTeam[];
    onBack: () => void;
    onTeamClick: (savedTeam: SavedTeam) => void;
}

// Reuse formation coords for mini preview
const MINI_PITCH_POSITIONS = [
    { top: '85%', left: '50%' }, // GK
    { top: '70%', left: '20%' }, 
    { top: '70%', left: '50%' }, 
    { top: '70%', left: '80%' }, 
    { top: '50%', left: '15%' }, 
    { top: '50%', left: '40%' }, 
    { top: '50%', left: '60%' }, 
    { top: '50%', left: '85%' }, 
    { top: '28%', left: '20%' }, 
    { top: '15%', left: '50%' }, // ST
    { top: '28%', left: '80%' }, 
];

export const SavedTeamsPage: React.FC<SavedTeamsPageProps> = ({ savedTeams, onBack, onTeamClick }) => {
    
    // Filter teams into Complete and Drafts
    const completeTeams = savedTeams.filter(t => t.team.filter(p => p !== null).length === 11);
    const draftTeams = savedTeams.filter(t => t.team.filter(p => p !== null).length < 11);

    // Helper to render a card to avoid code duplication
    const renderTeamCard = (savedItem: SavedTeam, index: number) => {
        const filledCount = savedItem.team.filter(p => p !== null).length;
        const isComplete = filledCount === 11;

        return (
            <div 
                key={savedItem.id}
                onClick={() => onTeamClick(savedItem)}
                className="bg-[#1C1F26] rounded-2xl overflow-hidden border border-white/10 active:scale-[0.98] transition-transform cursor-pointer group shadow-lg animate-in slide-in-from-bottom-4 fade-in duration-500 fill-mode-both"
                style={{ animationDelay: `${index * 75}ms` }}
            >
                {/* Header Info */}
                <div className="p-4 flex justify-between items-start border-b border-white/5 bg-gradient-to-r from-[#1C1F26] to-[#252A33]">
                    <div>
                        <h3 className="font-black text-white text-base uppercase tracking-tight">{savedItem.leagueLabel}</h3>
                        <p className="text-xs font-medium text-gray-400 mt-0.5">TOTM {savedItem.weekLabel}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${isComplete ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                        {isComplete ? 'Validé' : 'Brouillon'}
                    </div>
                </div>

                {/* Mini Pitch Visual */}
                <div className="relative w-full h-40 bg-[#002855] overflow-hidden">
                    {/* Field Lines */}
                    <div className="absolute top-2 bottom-2 left-2 right-2 border border-white/10 rounded-lg"></div>
                    <div className="absolute top-1/2 left-2 right-2 h-[1px] bg-white/10 -translate-y-1/2"></div>
                    <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>

                    {/* Players Dots */}
                    {savedItem.team.map((p, idx) => {
                        const pos = MINI_PITCH_POSITIONS[idx] || { top: '50%', left: '50%' };
                        return (
                            <div 
                                key={idx} 
                                className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2"
                                style={{ top: pos.top, left: pos.left }}
                            >
                                <div className="w-full h-full rounded-full border border-white/50 bg-gray-800 overflow-hidden shadow-sm flex items-center justify-center">
                                    {p ? (
                                        <img src={p.avatar || `https://i.pravatar.cc/100?u=${p.name}`} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-white/5"></div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer Stats */}
                <div className="px-4 py-3 flex items-center justify-between text-xs text-gray-400 font-medium">
                    <div className="flex items-center gap-1">
                        <Icon name="groups" className="text-sm" />
                        <span>{filledCount} / 11 Joueurs</span>
                    </div>
                    <div className="flex items-center gap-1 text-white">
                        <span>{isComplete ? 'Voir la carte' : 'Continuer'}</span>
                        <Icon name="arrow_forward" className="text-sm" />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="absolute inset-0 z-[60] bg-[#0F1115] text-white font-sans flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 pt-12 pb-4 bg-[#0F1115]/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-20">
                <button 
                    onClick={onBack}
                    className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors active:scale-95"
                >
                    <Icon name="arrow_back" className="text-xl" />
                </button>
                <h1 className="text-lg font-bold tracking-tight text-white flex-1">Équipes enregistrées</h1>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 pb-24">
                {savedTeams.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center px-8 opacity-60 animate-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <Icon name="bookmark_border" className="text-4xl text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Aucune équipe sauvegardée</h3>
                        <p className="text-sm text-gray-400">
                            Enregistrez vos équipes de la semaine préférées pour les retrouver ici.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8">
                        {/* Section Complet */}
                        {completeTeams.length > 0 && (
                            <div className="animate-in fade-in duration-500">
                                <div className="flex items-center gap-2 mb-3 pl-1">
                                    <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        Complet <span className="text-gray-600">({completeTeams.length})</span>
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {completeTeams.map((team, idx) => renderTeamCard(team, idx))}
                                </div>
                            </div>
                        )}

                        {/* Section Brouillon */}
                        {draftTeams.length > 0 && (
                            <div className="animate-in fade-in duration-500 delay-100 fill-mode-both">
                                <div className="flex items-center gap-2 mb-3 pl-1">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        Brouillon <span className="text-gray-600">({draftTeams.length})</span>
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {draftTeams.map((team, idx) => renderTeamCard(team, idx))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
