import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import TournamentDetailPage from './TournamentDetailPage';
import { TournamentRepository } from '@/data/TournamentRepository';
import { ChipRecordRepository } from '@/data/ChipRecordRepository';

vi.mock('@/data/TournamentRepository');
vi.mock('@/data/ChipRecordRepository');

// Polyfills
class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}
window.ResizeObserver = ResizeObserver;

class MockPointerEvent extends Event {
    button: number;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
    constructor(type: string, props: PointerEventInit) {
        super(type, props);
        this.button = props.button || 0;
        this.ctrlKey = props.ctrlKey || false;
        this.metaKey = props.metaKey || false;
        this.shiftKey = props.shiftKey || false;
    }
}
window.PointerEvent = MockPointerEvent as any;
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();

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

    it.skip('handles chip record delete and edit', async () => {
        const mockDelete = vi.fn();
        const mockSave = vi.fn();
        const records = [
            { id: 101, tournamentId: 5, chipCount: 35000, sb: 100, bb: 200, timestamp: new Date() }
        ];

        (TournamentRepository.getById as any).mockResolvedValue({
            id: 5,
            name: 'Record Mgmt Tournament',
            status: 'active',
            startDate: new Date(),
            startChips: 30000
        });
        (ChipRecordRepository.getByTournamentId as any).mockResolvedValue(records);
        (ChipRecordRepository.delete as any).mockImplementation(mockDelete);
        (ChipRecordRepository.save as any).mockImplementation(mockSave);

        // Mock confirm
        const confirmSpy = vi.spyOn(window, 'confirm');
        confirmSpy.mockImplementation(() => true);

        render(
            <MemoryRouter initialEntries={['/tournaments/5']}>
                <Routes>
                    <Route path="/tournaments/:id" element={<TournamentDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('35,000')).toBeInTheDocument();
        });

        // 1. Test Delete
        const deleteButton = screen.getByLabelText('記録を削除');
        deleteButton.click();

        expect(confirmSpy).toHaveBeenCalledWith('この記録を削除しますか？');
        await waitFor(() => {
            expect(mockDelete).toHaveBeenCalledWith(101);
        });

        // 2. Test Edit
        const editButton = screen.getByLabelText('記録を編集');
        fireEvent.click(editButton);

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
            expect(screen.getByText('記録の修正')).toBeInTheDocument();
        });

        const chipInput = screen.getByPlaceholderText('例: 30000');
        fireEvent.input(chipInput, { target: { value: '36000' } });

        const submitButton = screen.getByText('更新');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockSave).toHaveBeenCalledWith(expect.objectContaining({
                id: 101, // ChipRecord uses plain id
                chipCount: 36000
            }));
        }, { timeout: 3000 });
    });

    it('hides edit/delete buttons for completed tournament', async () => {
        const records = [
            { id: 102, tournamentId: 6, chipCount: 40000, sb: 200, bb: 400, timestamp: new Date() }
        ];

        (TournamentRepository.getById as any).mockResolvedValue({
            id: 6,
            name: 'Completed No Edit',
            status: 'completed',
            startDate: new Date(),
            startChips: 30000
        });
        (ChipRecordRepository.getByTournamentId as any).mockResolvedValue(records);

        render(
            <MemoryRouter initialEntries={['/tournaments/6']}>
                <Routes>
                    <Route path="/tournaments/:id" element={<TournamentDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('40,000')).toBeInTheDocument();
        });

        const deleteButton = screen.queryByLabelText('記録を削除');
        const editButton = screen.queryByLabelText('記録を編集');

        expect(deleteButton).not.toBeInTheDocument();
        expect(editButton).not.toBeInTheDocument();
    });

    it('adds a new chip record', async () => {
        const mockSave = vi.fn();
        (TournamentRepository.getById as any).mockResolvedValue({
            id: 1,
            name: 'Add Record Tournament',
            status: 'active',
            startDate: new Date(),
            startChips: 30000
        });
        (ChipRecordRepository.getByTournamentId as any).mockResolvedValue([]);
        (ChipRecordRepository.save as any).mockImplementation(mockSave);

        render(
            <MemoryRouter initialEntries={['/tournaments/1']}>
                <Routes>
                    <Route path="/tournaments/:id" element={<TournamentDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Add Record Tournament')).toBeInTheDocument();
        });

        const chipInput = screen.getByPlaceholderText('例: 30000');
        fireEvent.input(chipInput, { target: { value: '31000' } });

        const sbInput = screen.getByLabelText('現在のSB');
        fireEvent.input(sbInput, { target: { value: '200' } });

        const bbInput = screen.getByLabelText('現在のBB');
        fireEvent.input(bbInput, { target: { value: '400' } });

        const submitButton = screen.getByRole('button', { name: '記録' }); // Default label
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockSave).toHaveBeenCalledWith(expect.objectContaining({
                tournamentId: 1,
                chipCount: 31000,
                sb: 200,
                bb: 400
            }));
        });
    });

    it('does not delete record when confirmation is cancelled', async () => {
        const mockDelete = vi.fn();
        const records = [
            { id: 101, tournamentId: 5, chipCount: 35000, sb: 100, bb: 200, timestamp: new Date() }
        ];

        (TournamentRepository.getById as any).mockResolvedValue({
            id: 5,
            name: 'Cancel Delete Tournament',
            status: 'active',
            startDate: new Date(),
            startChips: 30000
        });
        (ChipRecordRepository.getByTournamentId as any).mockResolvedValue(records);
        (ChipRecordRepository.delete as any).mockImplementation(mockDelete);

        // Mock confirm to return false
        const confirmSpy = vi.spyOn(window, 'confirm');
        confirmSpy.mockImplementation(() => false);

        render(
            <MemoryRouter initialEntries={['/tournaments/5']}>
                <Routes>
                    <Route path="/tournaments/:id" element={<TournamentDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('35,000')).toBeInTheDocument();
        });

        const deleteButton = screen.getByLabelText('記録を削除');
        deleteButton.click();

        expect(confirmSpy).toHaveBeenCalledWith('この記録を削除しますか？');
        expect(mockDelete).not.toHaveBeenCalled();

        confirmSpy.mockRestore();
    });
});
