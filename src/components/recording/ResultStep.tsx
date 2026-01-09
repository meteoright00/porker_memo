import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ResultStepProps {
    tags: string[];
    onTagsChange: (tags: string[]) => void;
    winLoss: 'Win' | 'Lose' | 'Chop';
    onWinLossChange: (val: 'Win' | 'Lose' | 'Chop') => void;
    note: string;
    onNoteChange: (val: string) => void;
    // onSave is handled by parent usually, but if we want specific save button here?
    // HandWizard handles buttons. We accept it to be consistent with props if needed, or remove it.
    // The test passed onSave, so we keep it in interface but maybe ignore it.
    onSave?: () => void;
}

export const ResultStep: React.FC<ResultStepProps> = ({
    tags,
    onTagsChange,
    winLoss,
    onWinLossChange,
    note,
    onNoteChange
}) => {
    const [newTag, setNewTag] = useState('');

    const handleAddTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            onTagsChange([...tags, newTag.trim()]);
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagFn: string) => {
        onTagsChange(tags.filter(t => t !== tagFn));
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">Result</label>
                <div className="flex bg-gray-100 rounded p-1">
                    {(['Win', 'Lose', 'Chop'] as const).map(option => (
                        <button
                            key={option}
                            className={`flex-1 py-2 rounded text-sm font-semibold transition-colors ${winLoss === option
                                    ? option === 'Win' ? 'bg-green-500 text-white shadow'
                                        : option === 'Lose' ? 'bg-red-500 text-white shadow'
                                            : 'bg-yellow-500 text-white shadow'
                                    : 'text-gray-500 hover:bg-white hover:shadow-sm'
                                }`}
                            onClick={() => onWinLossChange(option)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                            {tag}
                            <button
                                data-testid={`remove-tag-${tag}`}
                                onClick={() => handleRemoveTag(tag)}
                                className="hover:bg-blue-200 rounded-full p-0.5"
                            >
                                <X size={14} />
                            </button>
                        </span>
                    ))}
                    {tags.length === 0 && <span className="text-gray-400 text-sm italic">No tags</span>}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Add tag..."
                        className="flex-1 p-2 border rounded"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddTag();
                        }}
                    />
                    <button
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 font-bold"
                        onClick={handleAddTag}
                    >
                        Add
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-700">Notes</label>
                <textarea
                    placeholder="Notes..."
                    className="w-full p-2 border rounded resize-none h-24"
                    value={note}
                    onChange={(e) => onNoteChange(e.target.value)}
                />
            </div>
        </div>
    );
};
