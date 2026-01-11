import React from 'react';
import { HandRecord, Action } from '@/types/hand';
import { CardSelector } from './CardSelector';
import { ActionInput } from './ActionInput';
import { PositionSelector } from './PositionSelector';
import { analyzeGameTags } from '@/utils/tagUtils';
import { getNextActor, getPositionsForCount, checkHandEnded, getInitialActor } from '@/utils/pokerLogic';
import { ResultStep } from './ResultStep';
import { RotateCcw } from 'lucide-react';

interface HandWizardProps {
    onSave: (hand: HandRecord) => void;
    initialTags?: string[];
}

export const HandWizard: React.FC<HandWizardProps> = ({ onSave, initialTags }) => {
    const [step, setStep] = React.useState(0);
    const [holeCards, setHoleCards] = React.useState<string[]>([]);
    const [board, setBoard] = React.useState<string[]>([]);
    const [actions, setActions] = React.useState<Action[]>([]);
    const [position, setPosition] = React.useState<string | null>(null);
    const [playerCount, setPlayerCount] = React.useState<number>(6); // Default 6-max
    const [isHero, setIsHero] = React.useState(true);

    // Result Step State
    const [winLoss, setWinLoss] = React.useState<'Win' | 'Lose' | 'Chop'>('Win');
    const [tags, setTags] = React.useState<string[]>(initialTags || []);
    const [note, setNote] = React.useState('');

    // Define steps
    const steps = [
        { name: 'Preflop', sub: 'Position' },
        { name: 'Preflop', sub: 'Hole Cards' },
        { name: 'Preflop', sub: 'Actions' },
        { name: 'Flop', sub: 'Board' },
        { name: 'Flop', sub: 'Actions' },
        { name: 'Turn', sub: 'Board' },
        { name: 'Turn', sub: 'Actions' },
        { name: 'River', sub: 'Board' },
        { name: 'River', sub: 'Actions' },
        { name: 'Result', sub: 'Details' },
    ];

    const currentStep = steps[step];
    const isLastStep = step === steps.length - 1;

    const isStepValid = () => {
        if (currentStep.sub === 'Position' && !position) return false;
        if (currentStep.sub === 'Hole Cards' && holeCards.length < 2) return false;
        if (currentStep.name === 'Flop' && currentStep.sub === 'Board' && board.length < 3) return false;
        if (currentStep.name === 'Turn' && currentStep.sub === 'Board' && board.length < 4) return false;
        if (currentStep.name === 'River' && currentStep.sub === 'Board' && board.length < 5) return false;
        return true;
    };

    const handleNext = () => {
        if (!isStepValid()) return;

        if (step < steps.length - 1) {
            const nextStepIndex = step + 1;
            const nextStep = steps[nextStepIndex];

            // Auto-analyze tags when entering Result step
            if (nextStep.name === 'Result' && position) {
                const autoTags = analyzeGameTags(actions);
                // Merge tags to avoid duplicates if navigating back/forth
                setTags(prev => Array.from(new Set([...prev, ...autoTags])));
            }

            setStep(nextStepIndex);
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(prev => prev - 1);
        }
    };

    // ... (existing imports)

    const handleSave = () => {
        if (!position) return;

        // Tags are now managed in state (populated by auto-analyze on transition)

        const handRecord: HandRecord = {
            uuid: crypto.randomUUID(), // Generate UUID
            date: new Date(),
            holeCards: holeCards as [string, string],
            board: board,
            actions: actions,
            position: position,
            playerCount: playerCount,
            winLoss: winLoss,
            tags: tags,
            note: note,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        onSave(handRecord);
    };

    const handleCardSelect = (card: string) => {
        if (currentStep.sub === 'Hole Cards') {
            if (holeCards.includes(card)) {
                setHoleCards(prev => prev.filter(c => c !== card));
            } else if (holeCards.length < 2 && !board.includes(card)) {
                setHoleCards(prev => [...prev, card]);
            }
        } else if (currentStep.sub === 'Board') {
            if (board.includes(card)) {
                setBoard(prev => prev.filter(c => c !== card));
            } else if (!holeCards.includes(card)) {
                // Max board cards depends on phase
                let maxBoardCards = 5;
                if (currentStep.name === 'Flop') maxBoardCards = 3;
                else if (currentStep.name === 'Turn') maxBoardCards = 4;
                else if (currentStep.name === 'River') maxBoardCards = 5;

                if (board.length < maxBoardCards) {
                    setBoard(prev => [...prev, card]);
                }
            }
        }
    };

    const [suggestedVillainPos, setSuggestedVillainPos] = React.useState<string | null>(null);

    // Unified logic to determine and set the next actor state
    const updateActorState = (currentActions: Action[]) => {
        if (!position || currentStep.sub !== 'Actions') return;

        const currentPhaseActions = currentActions.filter(a => a.phase === currentStep.name);
        const foldedPositions = currentActions
            .filter(a => a.type === 'Fold')
            .map(a => a.isHero ? position : a.position!);

        let nextActorPos: string | null = null;

        if (currentPhaseActions.length === 0) {
            // Initial actor
            nextActorPos = getInitialActor(
                currentStep.name as Action['phase'],
                foldedPositions,
                playerCount
            );
        } else {
            // Next actor from last action
            const lastAction = currentPhaseActions[currentPhaseActions.length - 1];
            const lastActorPos = lastAction.isHero ? position : lastAction.position;

            if (lastActorPos) {
                nextActorPos = getNextActor(
                    lastActorPos,
                    currentStep.name as Action['phase'],
                    foldedPositions,
                    playerCount
                );
            }
        }

        if (nextActorPos) {
            if (nextActorPos === position) {
                setIsHero(true);
                setSuggestedVillainPos(null);
            } else {
                setIsHero(false);
                setSuggestedVillainPos(nextActorPos);
            }
        }
    };

    // Effect to set initial actor when entering an Actions step
    React.useEffect(() => {
        updateActorState(actions);
    }, [step, position, playerCount, actions]); // Depend on step to trigger on navigation

    const handleAddAction = (action: Omit<Action, 'isHero'> & { isHero: boolean }) => {
        const newActions = [...actions, action as Action];
        setActions(newActions);

        // Check if hand ended
        if (checkHandEnded(newActions, playerCount)) {
            // Find Result step index
            const resultStepIndex = steps.findIndex(s => s.name === 'Result');
            if (resultStepIndex !== -1) {
                // Auto-analyze tags before skip (similar to handleNext)
                if (position) {
                    const autoTags = analyzeGameTags(newActions);
                    setTags(prev => Array.from(new Set([...prev, ...autoTags])));
                }
                setStep(resultStepIndex);
                return;
            }
        }

        // Calculate next actor using unified logic
        updateActorState(newActions);
    };

    const handleUndoAction = () => {
        const newActions = actions.slice(0, -1);
        setActions(newActions);
        updateActorState(newActions);
    };

    return (
        <div className="flex flex-col gap-4 p-4 border rounded">
            <h1>New Hand Recording</h1>
            <div className="text-xl font-bold">
                {currentStep.name} - <span className="text-gray-500">{currentStep.sub}</span>
            </div>

            {/* Selected Cards Display */}
            {(currentStep.sub === 'Hole Cards' || currentStep.sub === 'Board') && (
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border mb-2 min-h-[3rem]">
                    <span className="text-sm font-semibold">Selected:</span>
                    <div className="flex gap-1">
                        {(currentStep.sub === 'Hole Cards' ? holeCards : board).map(card => (
                            <span key={card} className="px-2 py-1 bg-white border rounded shadow-sm text-sm">
                                {card}
                            </span>
                        ))}
                        {(currentStep.sub === 'Hole Cards' ? holeCards : board).length === 0 && (
                            <span className="text-gray-400 text-sm italic">None</span>
                        )}
                    </div>
                </div>
            )}

            {/* Selected Position Display (if not on position step) */}
            {currentStep.sub !== 'Position' && position && (
                <div className="text-sm text-gray-600">
                    Position: <span className="font-bold">{position}</span>
                </div>
            )}

            <div className="min-h-[200px] border p-4">
                {currentStep.sub === 'Position' && (
                    <div className="flex flex-col gap-4">
                        <PositionSelector
                            selectedPosition={position}
                            onSelect={setPosition}
                            availablePositions={getPositionsForCount(playerCount)}
                        />
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-gray-700">Players dealt</label>
                            <div className="flex gap-2">
                                {[2, 6, 9].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => setPlayerCount(num)}
                                        className={`px-3 py-1 border rounded ${playerCount === num ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                                    >
                                        {num}-Max
                                    </button>
                                ))}
                                <input
                                    type="number"
                                    min={2}
                                    max={10}
                                    value={playerCount}
                                    onChange={(e) => setPlayerCount(parseInt(e.target.value) || 2)}
                                    className="border rounded px-2 w-16 text-center"
                                />
                            </div>
                        </div>
                    </div>
                )}
                {currentStep.sub === 'Hole Cards' && (
                    <CardSelector
                        selectedCards={holeCards}
                        onSelect={handleCardSelect}
                        disabledCards={board}
                    />
                )}
                {currentStep.sub === 'Board' && (
                    <CardSelector
                        selectedCards={board}
                        onSelect={handleCardSelect}
                        disabledCards={holeCards}
                    />
                )}
                {currentStep.sub === 'Actions' && (
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-center gap-2 mb-2">
                            <button
                                data-testid="toggle-hero"
                                className={`px-4 py-1 rounded-full text-sm font-bold ${isHero ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                onClick={() => { setIsHero(true); }}
                            >
                                Hero
                            </button>
                            <button
                                data-testid="toggle-villain"
                                className={`px-4 py-1 rounded-full text-sm font-bold ${!isHero ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                onClick={() => { setIsHero(false); }}
                            >
                                Villain
                            </button>
                        </div>

                        <div className="text-sm text-gray-600" data-testid="action-list">
                            {actions.filter(a => a.phase === currentStep.name).map((a, i) => {
                                return (
                                    <div key={i} className={a.isHero ? 'text-blue-600' : 'text-red-600'}>
                                        {a.isHero ? a.actor : `${a.actor} (${a.position || '?'})`} {a.type} {a.amount}
                                    </div>
                                );
                            })}
                        </div>
                        <ActionInput
                            onAddAction={handleAddAction}
                            phase={currentStep.name as Action['phase']}
                            isHero={isHero}
                            suggestedPosition={suggestedVillainPos}
                            availablePositions={
                                getPositionsForCount(playerCount).filter(pos => {
                                    if (pos === position) return false; // Exclude Hero
                                    // Exclude folded
                                    const hasFolded = actions.some(a => a.position === pos && a.type === 'Fold');
                                    return !hasFolded;
                                })
                            }
                            disablePositionSelection={true}
                        />
                        {actions.filter(a => a.phase === currentStep.name).length > 0 && (
                            <div className="flex justify-end mt-2">
                                <button
                                    onClick={handleUndoAction}
                                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
                                >
                                    <RotateCcw size={14} /> Undo Last Action
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {currentStep.name === 'Result' && (
                    <ResultStep
                        tags={tags}
                        onTagsChange={setTags}
                        winLoss={winLoss}
                        onWinLossChange={setWinLoss}
                        note={note}
                        onNoteChange={setNote}
                    />
                )}
            </div>

            <div className="flex justify-end gap-2" data-testid="wizard-nav">
                {step > 0 && (
                    <button
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                        onClick={handleBack}
                    >
                        Back
                    </button>
                )}
                {isLastStep ? (
                    <button
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={handleSave}
                    >
                        Finish
                    </button>
                ) : (
                    <button
                        className={`px-4 py-2 text-white rounded font-bold transition-colors ${isStepValid()
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-gray-400 cursor-not-allowed'
                            }`}
                        onClick={handleNext}
                        disabled={!isStepValid()}
                    >
                        {step === steps.length - 2 ? 'Review' : 'Next'}
                    </button>
                )}
            </div>
        </div>
    );
};
