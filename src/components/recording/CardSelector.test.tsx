import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CardSelector } from './CardSelector';

describe('CardSelector', () => {
    it('1.1. Renders correctly: Displays rank and suit controls', () => {
        render(<CardSelector selectedCards={[]} onSelect={vi.fn()} />);

        // Check for Ranks
        const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
        ranks.forEach(rank => {
            expect(screen.getByText(rank)).toBeInTheDocument();
        });

        // Check for Suits (using text or aria-label, usually text for symbols)
        // s, h, d, c or symbols ♠ ♥ ♦ ♣
        // Let's assume we use standard text representations for now: s, h, d, c
        // Or symbols? Let's stick to simple text 's','h','d','c' as per poker notation for now, or symbols if UI decides.
        // Requirement said: "intuitive card selection".
        // Usually buttons have symbols.
        // Let's assume the test looks for visible text or accessible name.
        // Let's look for buttons with text.
        const suits = ['♠', '♥', '♦', '♣'];
        // Wait, implementation plan/requirements didn't specify symbol vs letter.
        // Let's use symbols for UI, but internal logic uses 's','h','d','c'.
        // Test will check for Symbols logic.
        suits.forEach(suit => {
            expect(screen.getByText(suit)).toBeInTheDocument();
        });
    });

    it('1.2. Selection Helper: Clicking rank then suit triggers onSelect', async () => {
        const onSelect = vi.fn();
        render(<CardSelector selectedCards={[]} onSelect={onSelect} />);

        // Click Rank 'A'
        const rankButton = screen.getByText('A');
        fireEvent.click(rankButton);

        // Verify no emit yet
        expect(onSelect).not.toHaveBeenCalled();

        // Click Suit '♠'
        const suitButton = screen.getByText('♠');
        fireEvent.click(suitButton);

        // Verify emit 'As'
        expect(onSelect).toHaveBeenCalledWith('As');
    });

});
