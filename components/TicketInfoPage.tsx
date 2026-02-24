
import React, { useState } from 'react';
import { Icon } from './Icon';
import { Opportunity } from '../types';

interface TicketInfoPageProps {
  ticket: Opportunity;
  onBack: () => void;
}

export const TicketInfoPage: React.FC<TicketInfoPageProps> = ({ ticket, onBack }) => {
  const [showAnswers, setShowAnswers] = useState(false);

  // Mock data representing what the user filled out during checkout
  const ticketHolder = {
      name: "Kevin Duboi", // Using current user name mock
      email: "kevin.duboi@example.com",
      type: "Billet régulier - Étudiant",
      delivery: "electronic",
      answers: [
          { question: "Date de naissance", answer: "2005-06-15" },
          { question: "Nationalité", answer: "Canada" },
          { question: "Poste principal", answer: "Milieu (CM)" },
          { question: "Plus haut niveau joué", answer: "L1QC (Québec)" },
          { question: "Taille de chandail", answer: "M" },
          { question: "Ville de résidence", answer: "Laval" }
      ]
  };

  return (
    <div className="absolute inset-0 z-[60] bg-[#0F1115] text-white flex flex-col font-sans animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="px-4 pt-12 pb-2 flex items-center bg-[#0F1115]">
        <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors active:scale-95 -ml-2"
        >
            <Icon name="arrow_back_ios" className="text-xl pl-1" />
        </button>
      </div>

      <div className="px-5 pt-4 overflow-y-auto pb-10">
        <h1 className="text-2xl font-bold text-white mb-6 animate-in slide-in-from-bottom-2 fade-in duration-500">Ticket Information</h1>

        {/* Card Container similar to the white card in the reference image, but dark theme */}
        <div className="bg-[#1C1F26] rounded-2xl p-6 shadow-lg border border-white/5 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
            
            <div className="mb-6">
                <span className="text-sm text-gray-400 font-medium mb-1 block">Billet 1/1</span>
                <h2 className="text-xl font-bold text-white">{ticketHolder.name}</h2>
            </div>

            <div className="grid grid-cols-1 gap-y-6 mb-8">
                <div className="flex flex-col">
                    <span className="text-sm text-white font-medium mb-1">Type de billet</span>
                    <span className="text-sm text-gray-400">{ticketHolder.type}</span>
                </div>

                <div className="flex flex-col">
                    <span className="text-sm text-white font-medium mb-1">Livraison des billets</span>
                    <span className="text-sm text-gray-400">{ticketHolder.delivery}</span>
                </div>

                <div className="flex flex-col">
                    <span className="text-sm text-white font-medium mb-1">Courrier électronique</span>
                    <span className="text-sm text-gray-400">{ticketHolder.email}</span>
                </div>
            </div>

            {/* Expandable Section */}
            <div className="border-t border-white/10 pt-6">
                <button 
                    onClick={() => setShowAnswers(!showAnswers)}
                    className="flex items-center gap-3 text-white group w-full text-left"
                >
                    <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                        <Icon name={showAnswers ? "remove" : "add"} className="text-sm" />
                    </div>
                    <span className="text-sm font-medium underline decoration-gray-500 underline-offset-2 group-hover:decoration-white transition-all">
                        Afficher les réponses aux questions de l'organisateur
                    </span>
                </button>

                {showAnswers && (
                    <div className="mt-6 space-y-5 pl-9 animate-in slide-in-from-top-2 duration-200 fade-in">
                        {ticketHolder.answers.map((item, idx) => (
                            <div key={idx} style={{ animationDelay: `${idx * 50}ms` }} className="animate-in fade-in duration-300 fill-mode-both">
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">{item.question}</p>
                                <p className="text-sm text-white font-medium">{item.answer}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
      </div>
    </div>
  );
};
