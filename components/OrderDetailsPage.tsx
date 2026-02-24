
import React from 'react';
import { Icon } from './Icon';
import { Opportunity } from '../types';

interface OrderDetailsPageProps {
  ticket: Opportunity;
  onBack: () => void;
}

export const OrderDetailsPage: React.FC<OrderDetailsPageProps> = ({ ticket, onBack }) => {
  // Mock data based on the ticket
  const orderDate = "oct. 15, 2025"; // Hardcoded to match reference style or derived from ticket
  const orderNumber = "13501755493"; // Hardcoded to match reference style
  const price = ticket.tags.includes('Gratuit') ? "Gratuit" : "CA$30.00";

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

      <div className="px-6 pt-4">
        <h1 className="text-2xl font-bold text-white mb-10 animate-in slide-in-from-bottom-2 fade-in duration-500">Détails de la commande</h1>

        <div className="space-y-8">
            {/* Total Section */}
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 delay-100 fill-mode-both">
                <h3 className="text-sm text-white font-medium mb-1">Total</h3>
                <p className="text-base text-gray-300">{price} • ticket 1</p>
            </div>

            <div className="h-[1px] bg-white/10 w-full animate-in fade-in duration-700 delay-150"></div>

            {/* Date Section */}
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 delay-200 fill-mode-both">
                <h3 className="text-sm text-white font-medium mb-1">Date de commande</h3>
                <p className="text-base text-gray-300">{orderDate}</p>
            </div>

            <div className="h-[1px] bg-white/10 w-full animate-in fade-in duration-700 delay-250"></div>

            {/* Order Number Section */}
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 delay-300 fill-mode-both">
                <h3 className="text-sm text-white font-medium mb-1">Numéro de commande</h3>
                <p className="text-base text-gray-300">{orderNumber}</p>
            </div>
        </div>
      </div>
    </div>
  );
};
