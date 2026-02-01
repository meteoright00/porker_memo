import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
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
        <div>
            <button onClick={() => onSubmit({
                name: 'Mock Tourney', startChips: 15000, sb: 50, bb: 100
            })}>
                Mock Submit
            </button>
            <button onClick={() => onSubmit({
                name: 'Pending Tourney', startChips: 15000, sb: 50, bb: 100, isPending: true
            })}>
                Mock Submit Later
            </button>
            <button onClick={() => onSubmit({
                name: 'Structured Tourney',
                startChips: 30000,
                sb: 100,
                bb: 200,
                structure: [{ sb: 100, bb: 200, duration: 20 }]
            })}>
                Mock Submit Structure
            </button>
        </div>
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
    afterEach(() => {
        vi.clearAllMocks();
    });

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
    it('saves tournament with pending status and skips chip record when "Start Later" is selected', async () => {
        const mockTournamentId = 124;
        (TournamentRepository.save as any).mockResolvedValue(mockTournamentId);
        (ChipRecordRepository.save as any).mockResolvedValue(1); // Should not be called, but mock just in case

        render(
            <MemoryRouter>
                <TournamentCreatePage />
            </MemoryRouter>
        );

        const button = screen.getByText('Mock Submit Later');
        button.click();

        await waitFor(() => {
            // Verify Tournament Creation with pending status
            expect(TournamentRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                name: 'Pending Tourney',
                startChips: 15000,
                status: 'pending'
            }));

            // Verify Initial Chip Record is NOT created
            expect(ChipRecordRepository.save).not.toHaveBeenCalled();

            expect(mockNavigate).toHaveBeenCalledWith(`/tournaments/${mockTournamentId}`);
        });
    });
});

it('saves tournament with structure data', async () => {
    const mockTournamentId = 125;
    (TournamentRepository.save as any).mockResolvedValue(mockTournamentId);
    (ChipRecordRepository.save as any).mockResolvedValue(1);

    render(
        <MemoryRouter>
            <TournamentCreatePage />
        </MemoryRouter>
    );

    const button = screen.getByText('Mock Submit Structure');
    button.click();

    await waitFor(() => {
        expect(TournamentRepository.save).toHaveBeenCalledWith(expect.objectContaining({
            name: 'Structured Tourney',
            structure: expect.arrayContaining([
                expect.objectContaining({ sb: 100, bb: 200, duration: 20 })
            ])
        }));
        expect(mockNavigate).toHaveBeenCalledWith(`/tournaments/${mockTournamentId}`);
    });
});
