import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import TournamentCreatePage from './TournamentCreatePage';
import { TournamentRepository } from '@/data/TournamentRepository';
import { ChipRecordRepository } from '@/data/ChipRecordRepository';

// Mock Repositories
vi.mock('@/data/TournamentRepository');
vi.mock('@/data/ChipRecordRepository');

// Mock Form component to avoid testing form logic again
vi.mock('@/components/tournament/TournamentForm', () => ({
    TournamentForm: ({ onSubmit }: { onSubmit: (val: any) => void }) => (
        <button onClick={() => onSubmit({
            name: 'Mock Tourney', startChips: 15000, sb: 50, bb: 100
        })}>
            Mock Submit
        </button>
    )
}));

// Mock Navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('TournamentCreatePage', () => {
    it('saves tournament and initial chip record, then navigates on submit', async () => {
        const mockTournamentId = 123;
        (TournamentRepository.save as any).mockResolvedValue(mockTournamentId);
        (ChipRecordRepository.save as any).mockResolvedValue(1);

        render(
            <MemoryRouter>
                <TournamentCreatePage />
            </MemoryRouter>
        );

        const button = screen.getByText('Mock Submit');
        button.click();

        await waitFor(() => {
            // Verify Tournament Creation
            expect(TournamentRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                name: 'Mock Tourney',
                startChips: 15000,
                status: 'active'
            }));

            // Verify Initial Chip Record Creation (Fix for Issue 2 & 3)
            expect(ChipRecordRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                tournamentId: mockTournamentId,
                chipCount: 15000,
                sb: 50,
                bb: 100
            }));

            expect(mockNavigate).toHaveBeenCalledWith(`/tournaments/${mockTournamentId}`);
        });
    });
});
