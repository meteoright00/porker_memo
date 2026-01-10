import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TournamentForm } from '@/components/tournament/TournamentForm';
import { TournamentRepository } from '@/data/TournamentRepository';

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
        <div className="container mx-auto p-4 max-w-lg">
            <h1 className="text-2xl font-bold mb-6">トーナメント作成</h1>
            <TournamentForm onSubmit={handleSubmit} />
        </div>
    );
};

export default TournamentCreatePage;
