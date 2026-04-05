import '@testing-library/jest-dom'; // Ensure matchers are available
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StructureEditor } from './StructureEditor';

describe('StructureEditor', () => {
    it('renders empty list initially or provided value', () => {
        render(<StructureEditor value={[]} onChange={vi.fn()} />);
        // Expect header
        expect(screen.getByText('ストラクチャー設定')).toBeInTheDocument();
        // Should have 1 row (Header) + 1 row (Empty message) = 2 rows
        // Or if empty message is a row, we check specifically.
        // Let's check for the empty message text instead of row counting for clarity.
        expect(screen.getByText('レベル追加')).toBeInTheDocument();
        expect(screen.getByText('レベルが追加されていません')).toBeInTheDocument();
    });

    it('adds a new level when "Add" button is clicked', () => {
        const mockOnChange = vi.fn();
        render(<StructureEditor value={[]} onChange={mockOnChange} />);

        const addButton = screen.getByText('レベル追加');
        fireEvent.click(addButton);

        // Expect onChange to be called with one item
        expect(mockOnChange).toHaveBeenCalledWith(expect.arrayContaining([
            expect.objectContaining({ sb: 100, bb: 200, duration: 15 })
        ]));
    });

    it('toggles break mode', () => {
        const mockOnChange = vi.fn();
        const initialValue = [{ sb: 100, bb: 200, duration: 15, isBreak: false }];
        render(<StructureEditor value={initialValue} onChange={mockOnChange} />);

        const breakCheckbox = screen.getByRole('checkbox', { name: /休憩/ });
        fireEvent.click(breakCheckbox);

        expect(mockOnChange).toHaveBeenCalledWith(expect.arrayContaining([
            expect.objectContaining({ isBreak: true })
        ]));
    });

    it('removes a level when delete button is clicked', () => {
        const mockOnChange = vi.fn();
        const initialValue = [
            { sb: 100, bb: 200, duration: 15, isBreak: false },
            { sb: 200, bb: 400, duration: 15, isBreak: false }
        ];
        render(<StructureEditor value={initialValue} onChange={mockOnChange} />);

        // Get all delete buttons
        const deleteButtons = screen.getAllByRole('button');
        const trashButton = deleteButtons.find(btn => btn.querySelector('.lucide-trash-2'));
        if (trashButton) {
            fireEvent.click(trashButton);
        }

        expect(mockOnChange).toHaveBeenCalledWith([
            expect.objectContaining({ sb: 200, bb: 400 })
        ]);
    });

    it('changes values when inputs are modified', () => {
        const mockOnChange = vi.fn();
        const initialValue = [{ sb: 100, bb: 200, duration: 15, isBreak: false }];
        render(<StructureEditor value={initialValue} onChange={mockOnChange} />);

        const inputs = screen.getAllByRole('textbox');
        // SB input should be the first one
        fireEvent.change(inputs[0], { target: { value: '150' } });

        expect(mockOnChange).toHaveBeenCalledWith([
            expect.objectContaining({ sb: 150 })
        ]);
    });

    it('syncs Ante with BB when anteSameAsBB is toggled on', () => {
        const mockOnChange = vi.fn();
        const initialValue = [{ sb: 100, bb: 200, ante: 100, duration: 15, isBreak: false }];
        render(<StructureEditor value={initialValue} onChange={mockOnChange} />);

        const anteSameAsBBCheckbox = screen.getByLabelText('AnteをBBと同じにする');
        fireEvent.click(anteSameAsBBCheckbox);

        // Expect ante to become 200 (same as BB)
        expect(mockOnChange).toHaveBeenCalledWith([
            expect.objectContaining({ sb: 100, bb: 200, ante: 200 })
        ]);
    });
});
