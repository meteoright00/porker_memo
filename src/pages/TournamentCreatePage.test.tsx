import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TournamentCreatePage from './TournamentCreatePage';
import { TournamentRepository } from '@/data/TournamentRepository';

// Mock Repository
vi.mock('@/data/TournamentRepository');

// Mock Form component to avoid testing form logic again
vi.mock('@/components/tournament/TournamentForm', () => ({
    TournamentForm: ({ onSubmit }: { onSubmit: (val: any) => void }) => (
        <button onClick={() => onSubmit({
            name: 'Mock Tourney', startChips: 100, sb: 1, bb: 2
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
    it('saves tournament and navigates on submit', async () => {
        (TournamentRepository.save as any).mockResolvedValue(123);

        render(
            <MemoryRouter>
                <TournamentCreatePage />
            </MemoryRouter>
        );

        const button = screen.getByText('Mock Submit');
        button.click();

        await waitFor(() => {
            expect(TournamentRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                name: 'Mock Tourney',
                status: 'active'
            }));
            expect(mockNavigate).toHaveBeenCalledWith('/tournaments/123'); // Adjust expectation based on implementation
        });
    });
});
