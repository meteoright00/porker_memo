import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PositionSelector } from './PositionSelector';

describe('PositionSelector', () => {
    const defaultPositions = ['SB', 'BB', 'UTG', 'UTG+1', 'EP', 'MP', 'LJ', 'HJ', 'CO', 'BTN'];

    it('renders all default positions if availablePositions is not provided', () => {
        render(<PositionSelector selectedPosition={null} onSelect={vi.fn()} />);
        
        defaultPositions.forEach(pos => {
            const btn = screen.getByRole('button', { name: pos });
            expect(btn).toBeInTheDocument();
            expect(btn).not.toBeDisabled();
        });
    });

    it('applies selected styling to the selectedPosition', () => {
        render(<PositionSelector selectedPosition="BB" onSelect={vi.fn()} />);
        
        const bbBtn = screen.getByRole('button', { name: 'BB' });
        expect(bbBtn).toHaveClass('bg-blue-600');
        
        const sbBtn = screen.getByRole('button', { name: 'SB' });
        expect(sbBtn).not.toHaveClass('bg-blue-600');
    });

    it('disables positions not in availablePositions', () => {
        const available = ['SB', 'BB', 'BTN'];
        render(<PositionSelector selectedPosition={null} onSelect={vi.fn()} availablePositions={available} />);
        
        const sbBtn = screen.getByRole('button', { name: 'SB' });
        expect(sbBtn).not.toBeDisabled();
        
        const utgBtn = screen.getByRole('button', { name: 'UTG' });
        expect(utgBtn).toBeDisabled();
    });

    it('calls onSelect with correct position when clicked', () => {
        const mockOnSelect = vi.fn();
        render(<PositionSelector selectedPosition={null} onSelect={mockOnSelect} />);
        
        const btn = screen.getByRole('button', { name: 'CO' });
        fireEvent.click(btn);
        
        expect(mockOnSelect).toHaveBeenCalledWith('CO');
    });
});
