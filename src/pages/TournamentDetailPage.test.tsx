import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import TournamentDetailPage from './TournamentDetailPage';
import { TournamentRepository } from '@/data/TournamentRepository';

import { ChipRecordRepository } from '@/data/ChipRecordRepository';

vi.mock('@/data/TournamentRepository');
vi.mock('@/data/ChipRecordRepository');

// Mock Navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('TournamentDetailPage', () => {
    it('renders tournament details', async () => {
        (TournamentRepository.getById as any).mockResolvedValue({
            id: 1,
            name: 'Details Tournament',
            status: 'active',
            startDate: new Date(),
        });
        (ChipRecordRepository.getByTournamentId as any).mockResolvedValue([]);

        render(
            <MemoryRouter initialEntries={['/tournaments/1']}>
                <Routes>
                    <Route path="/tournaments/:id" element={<TournamentDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Details Tournament')).toBeInTheDocument();
        });
    });

    it('shows not found for invalid ID', async () => {
        (TournamentRepository.getById as any).mockResolvedValue(undefined);

        render(
            <MemoryRouter initialEntries={['/tournaments/999']}>
                <Routes>
                    <Route path="/tournaments/:id" element={<TournamentDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/見つかりません/i)).toBeInTheDocument();
        });
    });
    it('finishes tournament when confirmed', async () => {
        const mockSave = vi.fn();
        (TournamentRepository.getById as any).mockResolvedValue({
            id: 1,
            name: 'Active Tournament',
            status: 'active',
            startDate: new Date(),
        });
        (TournamentRepository.save as any).mockImplementation(mockSave);
        (ChipRecordRepository.getByTournamentId as any).mockResolvedValue([]);

        // Mock confirm
        const confirmSpy = vi.spyOn(window, 'confirm');
        confirmSpy.mockImplementation(() => true);

        render(
            <MemoryRouter initialEntries={['/tournaments/1']}>
                <Routes>
                    <Route path="/tournaments/:id" element={<TournamentDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Active Tournament')).toBeInTheDocument();
        });

        const finishButton = screen.getByText('終了する');
        expect(finishButton).toBeInTheDocument();

        finishButton.click();

        await waitFor(() => {
            expect(mockSave).toHaveBeenCalledWith(expect.objectContaining({
                id: 1,
                status: 'completed'
            }));
        });

        confirmSpy.mockRestore();
    });

    it('shows completed state correctly', async () => {
        (TournamentRepository.getById as any).mockResolvedValue({
            id: 2,
            name: 'Completed Tournament',
            status: 'completed',
            startDate: new Date(),
        });
        (ChipRecordRepository.getByTournamentId as any).mockResolvedValue([]);

        render(
            <MemoryRouter initialEntries={['/tournaments/2']}>
                <Routes>
                    <Route path="/tournaments/:id" element={<TournamentDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Completed Tournament')).toBeInTheDocument();
        });

        expect(screen.getByText('完了')).toBeInTheDocument();
        expect(screen.queryByText('終了する')).not.toBeInTheDocument();
        expect(screen.getByText(/記録できません/)).toBeInTheDocument();
    });

    it('deletes tournament when confirmed (only if completed)', async () => {
        const mockDelete = vi.fn();
        (TournamentRepository.getById as any).mockResolvedValue({
            id: 3,
            name: 'To Delete',
            status: 'completed', // Must be completed to delete
            startDate: new Date(),
            startChips: 30000
        });
        (TournamentRepository.delete as any).mockImplementation(mockDelete);
        (ChipRecordRepository.getByTournamentId as any).mockResolvedValue([]);

        // Mock confirm
        const confirmSpy = vi.spyOn(window, 'confirm');
        confirmSpy.mockImplementation(() => true);

        render(
            <MemoryRouter initialEntries={['/tournaments/3']}>
                <Routes>
                    <Route path="/tournaments/:id" element={<TournamentDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('To Delete')).toBeInTheDocument();
        });

        const deleteButton = screen.getByLabelText('削除');
        expect(deleteButton).not.toBeDisabled();

        deleteButton.click();

        await waitFor(() => {
            expect(confirmSpy).toHaveBeenCalled();
            expect(mockDelete).toHaveBeenCalledWith(3);
            expect(mockNavigate).toHaveBeenCalledWith('/tournaments');
        });

        confirmSpy.mockRestore();
    });

    it('disable delete button when active', async () => {
        (TournamentRepository.getById as any).mockResolvedValue({
            id: 4,
            name: 'Active No Delete',
            status: 'active',
            startDate: new Date(),
            startChips: 30000
        });
        (ChipRecordRepository.getByTournamentId as any).mockResolvedValue([]);

        render(
            <MemoryRouter initialEntries={['/tournaments/4']}>
                <Routes>
                    <Route path="/tournaments/:id" element={<TournamentDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Active No Delete')).toBeInTheDocument();
        });

        const deleteButton = screen.getByLabelText('削除');
        expect(deleteButton).toBeDisabled();
    });
});
