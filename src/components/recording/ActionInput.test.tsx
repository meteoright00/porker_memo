import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ActionInput } from './ActionInput';

describe('ActionInput', () => {
    it('2.1. Renders Action Types: Displays buttons for fold, check, call, bet, raise, all-in', () => {
        const baseProps = { phase: 'Preflop' as const, isHero: true };
        render(<ActionInput onAddAction={vi.fn()} {...baseProps} />);

        const actionTypes = ['Fold', 'Check', 'Call', 'Bet', 'Raise', 'All-in'];
        actionTypes.forEach(type => {
            expect(screen.getByText(type)).toBeInTheDocument();
        });
    });

    it('2.2. Amount Input: Displays amount input only for Bet/Raise/All-in', async () => {
        const baseProps = { phase: 'Preflop' as const, isHero: true };
        render(<ActionInput onAddAction={vi.fn()} {...baseProps} />);

        // Initially no input
        expect(screen.queryByPlaceholderText('Amount')).not.toBeInTheDocument();

        // Click Fold -> No input
        fireEvent.click(screen.getByText('Fold'));
        expect(screen.queryByPlaceholderText('Amount')).not.toBeInTheDocument();

        // Click Bet -> Input appears
        fireEvent.click(screen.getByText('Bet'));
        expect(screen.getByPlaceholderText('Amount')).toBeInTheDocument();

        // Click Raise -> Input appears
        fireEvent.click(screen.getByText('Raise'));
        expect(screen.getByPlaceholderText('Amount')).toBeInTheDocument();

        // Click Check -> Input disappears
        fireEvent.click(screen.getByText('Check'));
        expect(screen.queryByPlaceholderText('Amount')).not.toBeInTheDocument();
    });

    it('2.3. Emits Action: Clicking Add triggers onAction with constructed action', async () => {
        const onAddAction = vi.fn();
        const baseProps = { phase: 'Preflop' as const, isHero: true };
        render(<ActionInput onAddAction={onAddAction} {...baseProps} />);

        // Select Bet
        fireEvent.click(screen.getByText('Bet'));

        // Enter Amount
        const amountInput = screen.getByPlaceholderText('Amount');
        fireEvent.change(amountInput, { target: { value: '50' } });

        // Click Add Action
        const addButton = screen.getByText('Add Action');
        fireEvent.click(addButton);

        expect(onAddAction).toHaveBeenCalledWith({
            phase: 'Preflop',
            actor: 'Hero',
            isHero: true,
            type: 'Bet',
            amount: '50',
        });
    });

    it('2.4. Validation: Amount required for Bet/Raise', async () => {
        const onAddAction = vi.fn();
        const baseProps = { phase: 'Preflop' as const, isHero: true };
        render(<ActionInput onAddAction={onAddAction} {...baseProps} />);

        // Select Bet
        fireEvent.click(screen.getByText('Bet'));

        // Click Add without amount
        fireEvent.click(screen.getByText('Add Action'));

        // Should not emit
        expect(onAddAction).not.toHaveBeenCalled();

        // Select Call (no amount needed)
        fireEvent.click(screen.getByText('Call'));
        fireEvent.click(screen.getByText('Add Action'));

        // Should emit
        expect(onAddAction).toHaveBeenCalled();
    });

    it('renders amount shortcuts for Bet/Raise and sets amount on click', () => {
        const handleAddAction = vi.fn();
        render(<ActionInput onAddAction={handleAddAction} phase="Flop" isHero={true} />);

        // Select Bet
        fireEvent.click(screen.getByText('Bet'));

        // Check for shortcuts
        expect(screen.getByText('33%')).toBeInTheDocument();
        expect(screen.getByText('50%')).toBeInTheDocument();
        expect(screen.getByText('100%')).toBeInTheDocument();
        expect(screen.getByText('AI')).toBeInTheDocument();

        // Click 33%
        fireEvent.click(screen.getByText('33%'));

        // Input should have 33%
        const input = screen.getByPlaceholderText('Amount') as HTMLInputElement;
        expect(input.value).toBe('33%');

        // Click Add
        fireEvent.click(screen.getByText('Add Action'));

        expect(handleAddAction).toHaveBeenCalledWith(expect.objectContaining({
            type: 'Bet',
            amount: '33%'
        }));
    });
});
