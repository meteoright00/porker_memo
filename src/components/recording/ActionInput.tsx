import React from 'react';
import { Action } from '@/types/hand';
// Assuming Button might be available, otherwise stick to standard button for now to pass test
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

interface ActionInputProps {
    onAddAction: (action: Omit<Action, 'isHero'> & { isHero: boolean }) => void;
    phase: Action['phase'];
    isHero: boolean;
    availablePositions?: string[];
    suggestedPosition?: string | null;
    disablePositionSelection?: boolean;
}

const ACTION_TYPES = ['Fold', 'Check', 'Call', 'Bet', 'Raise', 'All-in'] as const;

export const ActionInput: React.FC<ActionInputProps> = ({ onAddAction, phase, isHero, availablePositions, suggestedPosition, disablePositionSelection }) => {
    const [selectedType, setSelectedType] = React.useState<Action['type'] | null>(null);
    const [amount, setAmount] = React.useState('');
    const [villainPos, setVillainPos] = React.useState('BTN'); // Default or none

    React.useEffect(() => {
        if (suggestedPosition) {
            setVillainPos(suggestedPosition);
        }
    }, [suggestedPosition]);

    const handleTypeClick = (type: Action['type']) => {
        const isInstant = ['Fold', 'Check', 'Call'].includes(type);

        if (isInstant) {
            onAddAction({
                phase,
                actor: isHero ? 'Hero' : 'Villain',
                isHero,
                type,
                amount: undefined,
                position: !isHero ? villainPos : undefined
            });
            setSelectedType(null);
        } else {
            setSelectedType(type);
            setAmount('');
        }
    };

    const handleAdd = () => {
        console.log('ActionInput handleAdd:', { selectedType, amount, isHero });
        if (!selectedType) return;

        // Validation
        if (['Bet', 'Raise'].includes(selectedType) && !amount) {
            console.log('ActionInput validation failed: amount missing');
            return;
        }

        // construct and emit
        const action = {
            phase,
            actor: isHero ? 'Hero' : 'Villain',
            isHero,
            type: selectedType,
            amount: amount || undefined, // undefined if empty string
            position: !isHero ? villainPos : undefined
        };
        // Zod schema might require checks, but strict typing of 'Action' might complain if actor is string.
        // ActionSchema.actor is enum 'Hero' | 'Villain'.
        // Action.isHero is boolean.

        // cast actor to match literal types if needed, but 'Hero' | 'Villain' is string.
        onAddAction(action as any);
        /*
        onAddAction({
            phase,
            actor: isHero ? 'Hero' : 'Villain',
            isHero,
            type: selectedType,
            amount: amount || undefined
        });
        */
    };

    const showAmount = selectedType && ['Bet', 'Raise', 'All-in'].includes(selectedType);

    return (
        <div className="flex flex-col gap-4">
            {!isHero && (
                <div className="flex gap-2 items-center overflow-x-auto pb-2">
                    <span className="text-sm font-bold whitespace-nowrap">Pos:</span>
                    {['SB', 'BB', 'UTG', 'UTG+1', 'EP', 'MP', 'LJ', 'HJ', 'CO', 'BTN'].map(pos => {
                        const isAvailable = !availablePositions || availablePositions.includes(pos);
                        return (
                            <button
                                key={pos}
                                disabled={!isAvailable || disablePositionSelection}
                                className={cn(
                                    "px-2 py-1 border rounded text-xs font-medium transition-colors whitespace-nowrap",
                                    villainPos === pos
                                        ? "bg-red-600 text-white border-red-600 opacity-100" // Keep selected visible
                                        : "bg-white hover:bg-gray-50 border-gray-200",
                                    (!isAvailable || (disablePositionSelection && villainPos !== pos)) && "opacity-30 cursor-not-allowed bg-gray-100",
                                    // If disabled but selected, ensure it looks "read-only" but visible
                                    disablePositionSelection && villainPos === pos && "cursor-not-allowed"
                                )}
                                onClick={() => setVillainPos(pos)}
                            >
                                {pos}
                            </button>
                        )
                    })}
                </div>
            )}
            <div className="flex flex-wrap gap-2">
                {ACTION_TYPES.map(type => (
                    <button
                        key={type}
                        className={cn(
                            "p-2 border rounded bg-secondary text-secondary-foreground hover:bg-secondary/80",
                            selectedType === type && "bg-blue-500 text-white"
                        )}
                        onClick={() => handleTypeClick(type)}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {showAmount && (
                <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                        {['33%', '50%', '100%', 'AI'].map(val => (
                            <button
                                key={val}
                                className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                                onClick={() => setAmount(val)}
                            >
                                {val}
                            </button>
                        ))}
                    </div>
                    <input
                        type="text"
                        placeholder="Amount"
                        className="p-2 border rounded"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
            )}

            <button
                className={`w-full p-3 rounded font-bold text-white flex items-center justify-center gap-2 transition-colors ${selectedType
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-sm'
                    : 'bg-gray-300 cursor-not-allowed'
                    }`}
                onClick={handleAdd}
                disabled={!selectedType}
            >
                <Plus size={20} />
                Add Action
            </button>
        </div>
    );
};
