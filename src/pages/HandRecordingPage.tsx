import React, { useState, useEffect } from 'react';
import { HandRecord, FilterCriteria } from '@/types/hand';
import { HandWizard } from '@/components/recording/HandWizard';
import { HandRepository } from '@/data/HandRepository';
import { HandFilter } from '@/components/analysis/HandFilter';

import { HandDetail } from '@/components/analysis/HandDetail';
import { DataManagementService } from '@/services/DataManagementService';

export const HandRecordingPage: React.FC = () => {
    const [hands, setHands] = useState<HandRecord[]>([]);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({});
    const [selectedHand, setSelectedHand] = useState<HandRecord | null>(null);

    const [availableTags, setAvailableTags] = useState<string[]>([]);

    const loadData = () => {
        HandRepository.query(filterCriteria).then(setHands);
        HandRepository.getUniqueTags().then(setAvailableTags);
    };

    // Load hands and tags when filter changes
    useEffect(() => {
        loadData();
    }, [filterCriteria]);

    const handleSaveHand = async (hand: HandRecord) => {
        await HandRepository.save(hand);
        loadData();
        setIsWizardOpen(false);
    };

    const handleFilterChange = (criteria: FilterCriteria) => {
        setFilterCriteria(criteria);
    };

    const handleExport = async () => {
        const json = await DataManagementService.exportData();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `porker_hands_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const text = await file.text();
        try {
            await DataManagementService.importData(text);
            loadData();
            alert('Import successful');
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteHand = async (id: number) => {
        await HandRepository.delete(id);
        loadData();
        setSelectedHand(null);
    };

    // Extract all unique tags from current hands? 
    // Issue: If we filter, we lose tags. Ideally we need all tags.
    // For now, let's just use a hardcoded list or derived from current view (suboptimal).
    // Or fetch all hands once for tags?
    // Let's rely on empty tags or hardcoded for MVP test functionality.

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Recorded Hands</h1>
                <div className="flex gap-2">
                    <button onClick={handleExport} className="border px-2 py-1 rounded text-sm">Export JSON</button>
                    <label className="border px-2 py-1 rounded text-sm cursor-pointer">
                        Import JSON
                        <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                    </label>
                </div>
            </div>

            <div className="mb-4">
                <HandFilter
                    onFilterChange={handleFilterChange}
                    availableTags={availableTags}
                />
            </div>

            {isWizardOpen ? (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded shadow-lg max-w-2xl w-full">
                        <div className="flex justify-end p-2">
                            <button onClick={() => setIsWizardOpen(false)} className="text-gray-500">Close</button>
                        </div>
                        <HandWizard onSave={handleSaveHand} />
                    </div>
                </div>
            ) : selectedHand ? (
                <HandDetail
                    hand={selectedHand}
                    onClose={() => setSelectedHand(null)}
                    onDelete={handleDeleteHand}
                />
            ) : (
                <>
                    <div className="space-y-2">
                        {hands.length === 0 ? (
                            <p>No hands recorded.</p>
                        ) : (
                            hands.map(hand => (
                                <div
                                    key={hand.uuid}
                                    className="border p-2 rounded cursor-pointer hover:bg-gray-50"
                                    onClick={() => setSelectedHand(hand)}
                                >
                                    {hand.date.toLocaleString()} - {hand.holeCards.join(', ')}
                                </div>
                            ))
                        )}
                    </div>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                        onClick={() => setIsWizardOpen(true)}
                    >
                        New Hand
                    </button>
                </>
            )}
        </div>
    );
};
