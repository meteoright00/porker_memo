import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { HandRecord, FilterCriteria } from '@/types/hand';
import { HandWizard } from '@/components/recording/HandWizard';
import { HandRepository } from '@/data/HandRepository';
import { HandFilter } from '@/components/analysis/HandFilter';
import { HandDetail } from '@/components/analysis/HandDetail';
import { DataManagementService } from '@/services/DataManagementService';
import { TournamentRepository } from '@/data/TournamentRepository';

export const HandRecordingPage: React.FC = () => {
    const [hands, setHands] = useState<HandRecord[]>([]);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({});
    const [selectedHand, setSelectedHand] = useState<HandRecord | null>(null);
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const [tournamentName, setTournamentName] = useState<string | undefined>(undefined);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const tournamentIdParam = searchParams.get('tournamentId');
    const tournamentId = tournamentIdParam ? parseInt(tournamentIdParam) : undefined;

    const loadData = React.useCallback(() => {
        HandRepository.query(filterCriteria).then(setHands);
        HandRepository.getUniqueTags().then(setAvailableTags);
    }, [filterCriteria]);

    // Load hands and tags when filter changes
    useEffect(() => {
        loadData();
    }, [loadData]);

    // Auto-open wizard if tournamentId is present
    useEffect(() => {
        if (tournamentId) {
            setIsWizardOpen(true);
            setFilterCriteria(prev => ({ ...prev, tournamentId }));

            // Fetch tournament name for auto-tagging
            TournamentRepository.getById(tournamentId).then(tournament => {
                if (tournament) {
                    setTournamentName(tournament.name);
                }
            });
        }
    }, [tournamentId]);

    const handleSaveHand = async (hand: HandRecord) => {
        const handToSave = { ...hand };
        if (tournamentId) {
            handToSave.tournamentId = tournamentId;
        }
        await HandRepository.save(handToSave);

        if (tournamentId) {
            navigate(`/tournaments/${tournamentId}`);
        } else {
            loadData();
            setIsWizardOpen(false);
        }
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

    return (
        <div className="p-4">
            <div className="mb-4">
                {tournamentId ? (
                    <Button variant="outline" onClick={() => navigate(`/tournaments/${tournamentId}`)} className="shadow-sm">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        トーナメントに戻る
                    </Button>
                ) : (
                    <Button variant="outline" onClick={() => navigate('/')} className="shadow-sm">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        ダッシュボードに戻る
                    </Button>
                )}
            </div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Recorded Hands</h1>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleExport}>Export JSON</Button>
                    <label>
                        <Button variant="outline" size="sm" asChild>
                            <span className="cursor-pointer">Import JSON</span>
                        </Button>
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
                    <div className="bg-white rounded shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-end p-2">
                            <button onClick={() => setIsWizardOpen(false)} className="text-gray-500">Close</button>
                        </div>
                        <HandWizard
                            onSave={handleSaveHand}
                            initialTags={tournamentName ? [tournamentName] : []}
                        />
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
                    <Button
                        className="mt-4 w-full md:w-auto shadow-md"
                        onClick={() => setIsWizardOpen(true)}
                        size="lg"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        New Hand
                    </Button>
                </>
            )}
        </div>
    );
};
