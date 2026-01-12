import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HandDetail } from './HandDetail';
import { HandRecord, Action } from '@/types/hand';

const mockHand: HandRecord = {
    uuid: 'test-uuid',
    date: new Date('2024-01-01'),
    position: 'BTN',
    holeCards: ['As', 'Ks'],
    board: ['2h', '3h', '4h'],
    actions: [],
    winLoss: 'Win',
    tags: ['TagA'],
    createdAt: new Date(),
    updatedAt: new Date()
};

describe('HandDetail', () => {
    it('3.1. Renders Info: Displays header info (Date, Position, Result)', () => {
        render(<HandDetail hand={mockHand} onClose={vi.fn()} />);

        expect(screen.getByText('Hand Detail')).toBeInTheDocument();
        expect(screen.getByText('BTN')).toBeInTheDocument();
        expect(screen.getByText('Win')).toBeInTheDocument();
        // Date formatting might depend on locale, just check roughly or use formatted
        expect(screen.getByText(/2024/)).toBeInTheDocument();
    });

    it('3.2. Actions: Displays action list', () => {
        const handWithActions = {
            ...mockHand,
            actions: [
                { phase: 'Preflop', actor: 'Hero', type: 'Raise', amount: '2.5bb', isHero: true },
                { phase: 'Preflop', actor: 'Villain', type: 'Call', isHero: false }
            ] as Action[] // weak cast for test simplicity
        };

        render(<HandDetail hand={handWithActions} onClose={vi.fn()} />);

        expect(screen.getByText('Raise')).toBeInTheDocument();
        expect(screen.getByText('2.5bb')).toBeInTheDocument();
        expect(screen.getByText('Call')).toBeInTheDocument();
    });
    it('3.3. Callbacks: Handles delete with confirmation', async () => {
        const mockOnDelete = vi.fn();
        const handWithId = { ...mockHand, id: 123 };

        // Mock confirm
        const confirmSpy = vi.spyOn(window, 'confirm');
        confirmSpy.mockImplementation(() => true);

        render(<HandDetail hand={handWithId} onClose={vi.fn()} onDelete={mockOnDelete} />);

        const deleteBtn = screen.getByText('Delete');
        deleteBtn.click();

        expect(confirmSpy).toHaveBeenCalled();
        expect(mockOnDelete).toHaveBeenCalledWith(123);

        confirmSpy.mockRestore();
    });

    it('3.4. Callbacks: Cancels delete', async () => {
        const mockOnDelete = vi.fn();
        const handWithId = { ...mockHand, id: 123 };

        const confirmSpy = vi.spyOn(window, 'confirm');
        confirmSpy.mockImplementation(() => false); // Cancel

        render(<HandDetail hand={handWithId} onClose={vi.fn()} onDelete={mockOnDelete} />);

        screen.getByText('Delete').click();

        expect(confirmSpy).toHaveBeenCalled();
        expect(mockOnDelete).not.toHaveBeenCalled();

        confirmSpy.mockRestore();
    });
});
