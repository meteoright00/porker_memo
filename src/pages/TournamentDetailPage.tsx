import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Trophy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ChipRecordRepository } from '@/data/ChipRecordRepository';
import { TournamentRepository } from '@/data/TournamentRepository';
import { ChipRecord, Tournament, StructureItem } from '@/types/tournament';
import { ChipRecordForm } from '@/components/tournament/ChipRecordForm';
import { ChipHistoryList } from '@/components/tournament/ChipHistoryList';
import { TournamentChart } from '@/components/tournament/TournamentChart';
import { Layout } from '@/components/layout/Layout';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { calculateCurrentBlind } from '@/utils/blindStructure';

export const TournamentDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [records, setRecords] = useState<ChipRecord[]>([]);
    const [isLoadingRecords, setIsLoadingRecords] = useState(true);
    const [editingRecord, setEditingRecord] = useState<ChipRecord | null>(null);
    const [currentBlind, setCurrentBlind] = useState<StructureItem | undefined>(undefined);
    const [showCompleteDialog, setShowCompleteDialog] = useState(false);
    const [resultRank, setResultRank] = useState<string>('');
    const [totalPlayers, setTotalPlayers] = useState<string>('');

    const loadData = async () => {
        if (!id) return;
        const tournamentId = Number(id);
        const t = await TournamentRepository.getById(tournamentId);
        if (t) {
            setTournament(t);
        }
        const r = await ChipRecordRepository.getByTournamentId(tournamentId);
        setRecords(r);
        setIsLoadingRecords(false);
    };

    useEffect(() => {
        loadData();
    }, [id]);

    useEffect(() => {
        if (!tournament || tournament.status !== 'active') return;

        const updateBlind = () => {
            const now = new Date();
            const blind = calculateCurrentBlind(tournament.startDate, tournament.structure || [], now);
            setCurrentBlind(blind);
        };

        updateBlind(); // Initial call
        const interval = setInterval(updateBlind, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [tournament]);

    const handleRecordSubmit = async (values: any) => {
        if (!tournament || !id) return;

        await ChipRecordRepository.save({
            tournamentId: Number(id),
            chipCount: values.chipCount,
            sb: values.sb,
            bb: values.bb,
            timestamp: new Date(),
        });

        loadData();
    };

    const handleDeleteRecord = async (record: ChipRecord) => {
        if (confirm('この記録を削除しますか？')) {
            await ChipRecordRepository.delete(record.id!);
            loadData();
        }
    };

    const handleUpdateRecord = async (values: any) => {
        if (!editingRecord || !tournament) return;
        await ChipRecordRepository.save({
            ...editingRecord,
            chipCount: values.chipCount,
            sb: values.sb,
            bb: values.bb,
        });
        setEditingRecord(null);
        loadData();
    };

    const handleStart = async () => {
        if (!tournament) return;
        if (confirm('トーナメントを開始しますか？')) {
            await TournamentRepository.update(tournament.id!, { status: 'active', startDate: new Date() });
            // Create initial chip record
            await ChipRecordRepository.save({
                tournamentId: tournament.id!,
                chipCount: tournament.startChips,
                sb: tournament.structure?.[0]?.sb ?? 100,
                bb: tournament.structure?.[0]?.bb ?? 200,
                timestamp: new Date(),
            });
            loadData();
        }
    };

    const handleComplete = () => {
        if (!tournament) return;
        setShowCompleteDialog(true);
    };

    const handleCompleteConfirm = async () => {
        if (!tournament) return;
        const rank = resultRank ? Number(resultRank) : undefined;
        const total = totalPlayers ? Number(totalPlayers) : undefined;
        await TournamentRepository.update(tournament.id!, {
            status: 'completed',
            resultRank: rank,
            totalPlayers: total,
        });
        setShowCompleteDialog(false);
        setResultRank('');
        setTotalPlayers('');
        loadData();
    };

    const handleDeleteTournament = async () => {
        if (!tournament) return;
        if (confirm('本当に削除しますか？この操作は取り消せません。')) {
            await TournamentRepository.delete(tournament.id!);
            navigate('/tournaments');
        }
    };

    if (!tournament) return <Layout><div>Loading...</div></Layout>;

    const lastRecord = records.length > 0 ? records[records.length - 1] : undefined;

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate('/tournaments')}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h1 className="text-2xl font-bold">{tournament.name}</h1>
                    </div>
                    <div className="sm:ml-auto flex items-center gap-2 flex-wrap">
                        {tournament.status === 'pending' && (
                            <div className="flex items-center gap-2">
                                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded whitespace-nowrap">未開始</span>
                                <Button size="sm" onClick={handleStart}>
                                    <Play className="h-4 w-4 mr-1" />
                                    開始
                                </Button>
                            </div>
                        )}
                        {tournament.status === 'active' && (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded whitespace-nowrap">進行中</span>
                        )}
                        {tournament.status === 'completed' && (
                            <div className="flex items-center gap-2">
                                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded whitespace-nowrap">完了</span>
                                {tournament.resultRank && tournament.totalPlayers && (
                                    <span className="flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-medium px-2.5 py-0.5 rounded whitespace-nowrap">
                                        <Trophy className="h-3 w-3" />
                                        {tournament.totalPlayers}人中{tournament.resultRank}位
                                    </span>
                                )}
                            </div>
                        )}
                        {tournament.status === 'active' && (
                            <Button variant="outline" size="sm" onClick={handleComplete}>
                                終了する
                            </Button>
                        )}
                        <Button
                            variant="destructive"
                            size="sm"
                            disabled={tournament.status === 'active'}
                            onClick={handleDeleteTournament}
                        >
                            削除
                        </Button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <section className="bg-white p-4 rounded-lg shadow space-y-4">
                            <h2 className="font-semibold text-lg">チップ記録</h2>
                            {tournament.status === 'active' ? (
                                isLoadingRecords ? (
                                    <div className="text-gray-500 text-sm">読み込み中...</div>
                                ) : (
                                    <ChipRecordForm
                                        onSubmit={handleRecordSubmit}
                                        lastRecord={lastRecord}
                                        currentBlind={currentBlind}
                                    />
                                )
                            ) : (
                                <div className="text-gray-500 text-sm">
                                    {tournament.status === 'pending' ? 'トーナメント開始後に記録できます' : 'トーナメントは完了しました'}
                                </div>
                            )}
                        </section>

                        <section className="bg-white p-4 rounded-lg shadow space-y-4">
                            <h2 className="font-semibold text-lg">ストラクチャー</h2>
                            {tournament.structure && tournament.structure.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="py-2 text-left font-medium text-gray-500">Lvl</th>
                                                <th className="py-2 text-left font-medium text-gray-500">Blinds</th>
                                                <th className="py-2 text-left font-medium text-gray-500">Ante</th>
                                                <th className="py-2 text-right font-medium text-gray-500">Min</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tournament.structure.map((item, index) => {
                                                const isCurrent = currentBlind && item.sb === currentBlind.sb && item.bb === currentBlind.bb;
                                                return (
                                                    <tr key={index} className={`border-b last:border-0 ${isCurrent ? 'bg-blue-50' : ''}`}>
                                                        <td className="py-2 px-1">{index + 1}</td>
                                                        <td className="py-2">
                                                            {item.isBreak ? (
                                                                <span className="text-gray-500 italic">{item.label || 'Break'}</span>
                                                            ) : (
                                                                <span className={isCurrent ? 'font-bold text-blue-700' : ''}>
                                                                    {item.sb.toLocaleString()} / {item.bb.toLocaleString()}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="py-2 text-gray-600">{item.ante ? item.ante.toLocaleString() : '-'}</td>
                                                        <td className="py-2 text-right text-gray-600">{item.duration}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-gray-500 text-sm">ストラクチャー未設定</div>
                            )}
                        </section>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-4 rounded-lg border shadow-sm">
                            <h2 className="text-lg font-semibold mb-4">推移チャート</h2>
                            <TournamentChart
                                records={records}
                                startChips={tournament.startChips}
                            />
                        </div>

                        <div className="bg-white p-4 rounded-lg border shadow-sm">
                            <h2 className="text-lg font-semibold mb-4">履歴</h2>
                            <ChipHistoryList
                                records={records}
                                startChips={tournament.startChips}
                                onEdit={tournament.status === 'active' ? setEditingRecord : undefined}
                                onDelete={tournament.status === 'active' ? handleDeleteRecord : undefined}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={!!editingRecord} onOpenChange={(open) => !open && setEditingRecord(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>記録の修正</DialogTitle>
                    </DialogHeader>
                    {editingRecord && (
                        <ChipRecordForm
                            initialValues={editingRecord}
                            onSubmit={handleUpdateRecord}
                            submitLabel="更新"
                        />
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={showCompleteDialog} onOpenChange={(open) => !open && setShowCompleteDialog(false)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>トーナメント終了</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600">順位を入力してください（任意）</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium block mb-1">参加人数</label>
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    placeholder="例: 50"
                                    value={totalPlayers}
                                    onChange={(e) => setTotalPlayers(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium block mb-1">順位</label>
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    placeholder="例: 3"
                                    value={resultRank}
                                    onChange={(e) => setResultRank(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
                                キャンセル
                            </Button>
                            <Button onClick={handleCompleteConfirm}>
                                終了する
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </Layout>
    );
};
