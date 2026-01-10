import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import TournamentListPage from './TournamentListPage';
import { TournamentRepository } from '@/data/TournamentRepository';

vi.mock('@/data/TournamentRepository');

describe('TournamentListPage', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('renders list of tournaments', async () => {
        (TournamentRepository.getAll as any).mockResolvedValue([
            { id: 1, name: 'T1', status: 'active', startDate: new Date(), createdAt: new Date() },
            { id: 2, name: 'T2', status: 'completed', startDate: new Date(), createdAt: new Date() },
        ]);

        render(
            <MemoryRouter>
                <TournamentListPage />
            </MemoryRouter>
        );

        expect(await screen.findByText('T1')).toBeInTheDocument();
        expect(screen.getByText('T2')).toBeInTheDocument();
    });

    it('renders empty state', async () => {
        (TournamentRepository.getAll as any).mockResolvedValue([]);

        render(
            <MemoryRouter>
                <TournamentListPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/トーナメントがありません/i)).toBeInTheDocument();
        });
    });
});
