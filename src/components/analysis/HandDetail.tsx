import React from 'react';
import { HandRecord } from '@/types/hand';

interface HandDetailProps {
    hand: HandRecord;
    onClose: () => void;
    onDelete?: (id: number) => void;
}

export const HandDetail: React.FC<HandDetailProps> = ({ hand, onClose, onDelete }) => {
    const handleDelete = () => {
        if (onDelete && hand.id && window.confirm('Are you sure you want to delete this hand?')) {
            onDelete(hand.id);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold">Hand Detail</h1>
                        <span className={`px-2 py-1 rounded text-white text-sm font-bold ${hand.winLoss === 'Win' ? 'bg-green-500' : hand.winLoss === 'Lose' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                            {hand.winLoss}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        {onDelete && (
                            <button
                                onClick={handleDelete}
                                className="text-red-500 hover:text-red-700 px-2 py-1 border border-red-500 rounded text-sm"
                            >
                                Delete
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-black p-1"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <span className="text-sm text-gray-500">Date</span>
                        <p>{hand.date.toLocaleDateString()}</p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-500">Position</span>
                        <p className="font-bold">{hand.position} <span className="text-xs font-normal text-gray-500">({hand.playerCount || 6}-Max)</span></p>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="font-bold mb-2">Hole Cards</h3>
                    <div className="flex gap-2">
                        {hand.holeCards.map((card, i) => (
                            <span key={i} className="border p-2 rounded">{card}</span>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="font-bold mb-2">Board</h3>
                    <div className="flex gap-2">
                        {hand.board.length > 0 ? hand.board.map((card, i) => (
                            <span key={i} className="border p-2 rounded">{card}</span>
                        )) : <p className="text-gray-400">No board</p>}
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="font-bold mb-2">Actions</h3>
                    <div className="space-y-2">
                        {hand.actions.map((action, i) => (
                            <div key={i} className="flex gap-2 text-sm border-b pb-1">
                                <span className="font-semibold w-16">{action.phase}</span>
                                <span className="font-semibold w-24">
                                    {action.isHero ? action.actor : `${action.actor} (${action.position || '?'})`}
                                </span>
                                <span className="w-16">{action.type}</span>
                                <span>{action.amount}</span>
                            </div>
                        ))}
                        {hand.actions.length === 0 && <p className="text-gray-400">No actions recorded</p>}
                    </div>
                </div>

                {hand.tags && hand.tags.length > 0 && (
                    <div>
                        <h3 className="font-bold mb-2">Tags</h3>
                        <div className="flex gap-2 flex-wrap">
                            {hand.tags.map(tag => (
                                <span key={tag} className="bg-gray-100 px-2 py-1 rounded text-xs">{tag}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
