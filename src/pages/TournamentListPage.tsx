import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TournamentRepository } from '@/data/TournamentRepository';
import { Tournament } from '@/types/tournament';

const TournamentListPage: React.FC = () => {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTournaments = async () => {
            const data = await TournamentRepository.getAll();
            // Sort by createdAt desc
            data.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            setTournaments(data);
            setLoading(false);
        };
        fetchTournaments();
    }, []);

    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <Link to="/">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">トーナメント一覧</h1>
                </div>
                <Link to="/tournaments/new">
                    <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" /> 新規作成
                    </Button>
                </Link>
            </div>

            {tournaments.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                    トーナメントがありません
                </div>
            ) : (
                <div className="grid gap-4">
                    {tournaments.map((tournament) => (
                        <Link key={tournament.id} to={`/tournaments/${tournament.id}`}>
                            <Card className="hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">{tournament.name}</CardTitle>
                                    <CardDescription>
                                        {format(tournament.startDate, 'yyyy/MM/dd HH:mm')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between text-sm">
                                        <span className={`px-2 py-1 rounded-full ${tournament.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {tournament.status === 'active' ? '進行中' : '完了'}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TournamentListPage;
