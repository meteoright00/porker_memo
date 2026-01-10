import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TournamentRepository } from '@/data/TournamentRepository';
import { ChipRecordRepository } from '@/data/ChipRecordRepository';
import { Tournament, ChipRecord } from '@/types/tournament';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ChipRecordForm } from '@/components/tournament/ChipRecordForm';
import { ChipHistoryList } from '@/components/tournament/ChipHistoryList';
import { TournamentChart } from '@/components/tournament/TournamentChart';

const TournamentDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [chipRecords, setChipRecords] = useState<ChipRecord[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        if (!id) return;
        const tournamentId = parseInt(id);
        const [tData, cData] = await Promise.all([
            TournamentRepository.getById(tournamentId),
            ChipRecordRepository.getByTournamentId(tournamentId)
        ]);
        setTournament(tData || null);
        setChipRecords(cData);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleRecordSubmit = async (values: { chipCount: number; sb: number; bb: number }) => {
        if (!tournament || !id) return;
        await ChipRecordRepository.save({
            tournamentId: tournament.id!,
            chipCount: values.chipCount,
            sb: values.sb,
            bb: values.bb,
            timestamp: new Date(),
        });
        fetchData(); // Refresh list
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (!tournament) return <div className="p-4">見つかりません</div>;

    const lastRecord = chipRecords.length > 0 ? chipRecords[chipRecords.length - 1] : undefined;

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <div className="mb-4 flex justify-between">
                <Link to="/tournaments">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="mr-2 h-4 w-4" /> 一覧に戻る
                    </Button>
                </Link>
                <Link to={`/record?tournamentId=${tournament.id}`}>
                    <Button disabled={tournament.status !== 'active'}>
                        ハンドを記録する
                    </Button>
                </Link>
            </div>

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">{tournament.name}</h1>
                    <div className="text-gray-500 text-sm mt-1">
                        開始スタック: {tournament.startDate ? tournament.startDate.toLocaleDateString() : ''}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${tournament.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                        }`}>
                        {tournament.status === 'active' ? '進行中' : '完了'}
                    </span>
                    {tournament.status === 'active' && (
                        <Button variant="outline" size="sm" onClick={async () => {
                            if (confirm('トーナメントを終了しますか？')) {
                                await TournamentRepository.save({ ...tournament, status: 'completed' });
                                fetchData();
                            }
                        }}>
                            終了する
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Form */}
                <div className="md:col-span-1">
                    <div className="bg-white p-4 rounded-lg border shadow-sm sticky top-4">
                        <h2 className="text-lg font-semibold mb-4">チップ記録</h2>
                        {tournament.status === 'active' ? (
                            <ChipRecordForm onSubmit={handleRecordSubmit} lastRecord={lastRecord} />
                        ) : (
                            <div className="text-gray-500 text-center py-4">
                                トーナメント終了済みのため<br />記録できません
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: History & Stats */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">推移チャート</h2>
                        {tournament && (
                            <TournamentChart
                                records={chipRecords}
                                startChips={tournament.startChips}
                            />
                        )}
                    </div>

                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">履歴</h2>
                        <ChipHistoryList records={chipRecords} startChips={30000} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TournamentDetailPage;
