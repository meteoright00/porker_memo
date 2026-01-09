import React from 'react';
import { cn } from '@/lib/utils';

interface CardSelectorProps {
    selectedCards: string[];
    onSelect: (card: string) => void;
    className?: string;
    disabledCards?: string[];
}

const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const SUITS = ['s', 'h', 'd', 'c']; // Internal representation
const SUIT_SYMBOLS: Record<string, string> = { s: '♠', h: '♥', d: '♦', c: '♣' };

export const CardSelector: React.FC<CardSelectorProps> = ({ selectedCards, onSelect, className, disabledCards = [] }) => {
    const [selectedRank, setSelectedRank] = React.useState<string | null>(null);

    const handleRankClick = (rank: string) => {
        if (selectedRank === rank) {
            setSelectedRank(null);
        } else {
            setSelectedRank(rank);
        }
    };

    const handleSuitClick = (suit: string) => {
        if (!selectedRank) return;

        const card = `${selectedRank}${suit}`;

        // If disabled (e.g. board card), ignore
        if (disabledCards.includes(card)) return;

        onSelect(card);
        // Do not reset rank automatically? Or user preference?
        // Resetting rank is standard for single card entry.
        // But for "As Ks" (same rank?) No, A and K.
        // For "Ad As", keeping rank is nice.
        // Let's reset for now to be safe/simple.
        setSelectedRank(null);
    };

    const isSuitDisabled = (suit: string) => {
        if (!selectedRank) return true;
        const card = `${selectedRank}${suit}`;
        return disabledCards.includes(card);
    };

    const isSuitSelected = (suit: string) => {
        if (!selectedRank) return false;
        const card = `${selectedRank}${suit}`;
        return selectedCards.includes(card);
    };

    return (
        <div className={cn("flex flex-col gap-4", className)}>
            <div className="flex flex-wrap gap-2">
                {RANKS.map(rank => (
                    <button
                        key={rank}
                        className={cn(
                            "w-10 h-10 border rounded font-bold",
                            selectedRank === rank ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100"
                        )}
                        onClick={() => handleRankClick(rank)}
                    >
                        {rank}
                    </button>
                ))}
            </div>
            <div className="flex items-center gap-2">
                <span className="text-sm font-bold w-12">{selectedRank ? `Rank: ${selectedRank}` : 'Select Rank'}</span>
                <div className="flex gap-2">
                    {SUITS.map(suit => (
                        <button
                            key={suit}
                            disabled={!selectedRank}
                            className={cn(
                                "w-10 h-10 border rounded flex items-center justify-center text-xl",
                                !selectedRank && "opacity-50 cursor-not-allowed bg-gray-100",
                                isSuitSelected(suit) && "bg-green-100 border-green-500", // Already selected
                                isSuitDisabled(suit) && "opacity-30 cursor-not-allowed bg-red-50", // Disabled (e.g. used)
                                selectedRank && !isSuitDisabled(suit) && !isSuitSelected(suit) && "hover:bg-blue-50"
                            )}
                            onClick={() => handleSuitClick(suit)}
                        >
                            <span className={['h', 'd'].includes(suit) ? "text-red-500" : "text-black"}>
                                {SUIT_SYMBOLS[suit]}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
            <div className="text-sm text-gray-500 min-h-[1.5rem]">
                {!selectedRank ? "Please select a rank (e.g., 'A')" : "Now select a suit"}
            </div>
        </div>
    );
};
