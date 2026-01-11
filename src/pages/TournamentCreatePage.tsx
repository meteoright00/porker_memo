import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { TournamentForm } from '@/components/tournament/TournamentForm';
import { TournamentRepository } from '@/data/TournamentRepository';
import { Layout } from '@/components/layout/Layout';

const TournamentCreatePage: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = async (values: { name: string; startChips: number; sb: number; bb: number }) => {
        const id = await TournamentRepository.save({
            name: values.name,
            startChips: values.startChips,
            startDate: new Date(),
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        navigate(`/tournaments/${id}`);
    };

    return (
        <Layout className="max-w-lg">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/tournaments">
                    <Button variant="outline" size="icon" className="shadow-sm">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">トーナメント作成</h1>
            </div>
            <TournamentForm onSubmit={handleSubmit} />
        </Layout>
    );
};

export default TournamentCreatePage;
