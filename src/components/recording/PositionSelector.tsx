import React from 'react';
import { cn } from '@/lib/utils';

interface PositionSelectorProps {
    selectedPosition: string | null;
    onSelect: (position: string) => void;
    availablePositions?: string[];
}

const POSITIONS = ['SB', 'BB', 'UTG', 'UTG+1', 'EP', 'MP', 'LJ', 'HJ', 'CO', 'BTN'];

export const PositionSelector: React.FC<PositionSelectorProps> = ({ selectedPosition, onSelect, availablePositions }) => {
    return (
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
            {POSITIONS.map(pos => {
                const isAvailable = !availablePositions || availablePositions.includes(pos);
                return (
                    <button
                        key={pos}
                        disabled={!isAvailable}
                        className={cn(
                            "p-3 border rounded-lg font-bold transition-colors",
                            selectedPosition === pos
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white hover:bg-gray-50 border-gray-200",
                            !isAvailable && "opacity-30 cursor-not-allowed bg-gray-100"
                        )}
                        onClick={() => onSelect(pos)}
                    >
                        {pos}
                    </button>
                );
            })}
        </div>
    );
};
