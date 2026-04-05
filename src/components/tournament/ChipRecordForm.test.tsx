import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ChipRecordForm } from './ChipRecordForm';
import { StructureItem } from '@/types/tournament';

describe('ChipRecordForm', () => {
    it('auto-fills SB/BB from currentBlind prop', () => {
        const mockSubmit = vi.fn();
        const currentBlind: StructureItem = { sb: 500, bb: 1000, duration: 20 };

        render(<ChipRecordForm onSubmit={mockSubmit} currentBlind={currentBlind} />);

        expect(screen.getByLabelText('SB')).toHaveValue('500');
        expect(screen.getByLabelText('BB')).toHaveValue('1000');
    });

    it('displays calculated BB count when chip count acts', async () => {
        const mockSubmit = vi.fn();
        const currentBlind: StructureItem = { sb: 500, bb: 1000, duration: 20 };

        render(<ChipRecordForm onSubmit={mockSubmit} currentBlind={currentBlind} />);

        const chipInput = screen.getByLabelText('チップ量');
        fireEvent.change(chipInput, { target: { value: '30000' } });

        // 30000 / 1000 = 30 => "30.0 BB"
        await waitFor(() => {
            const display = screen.queryByTestId('bb-display');
            if (!display) screen.debug(undefined, 10000); // Print full tree
            expect(display).toBeInTheDocument();
            expect(display).toHaveTextContent(/30\.0\s*BB/);
        });
    });

    it('resets chip count and SB/BB after submit', async () => {
        const mockSubmit = vi.fn();
        const currentBlind: StructureItem = { sb: 500, bb: 1000, duration: 20 };

        const { rerender } = render(<ChipRecordForm onSubmit={mockSubmit} currentBlind={currentBlind} />);

        const chipInput = screen.getByLabelText('チップ量');
        fireEvent.change(chipInput, { target: { value: '30000' } });

        const submitButton = screen.getByRole('button', { name: /記録/ }); // Adjust name if needed
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockSubmit).toHaveBeenCalled();
            // Chip count should be reset (empty)
            expect(chipInput).toHaveValue('');

            // SB/BB should also be reset
            expect(screen.getByLabelText('SB')).toHaveValue('');
            expect(screen.getByLabelText('BB')).toHaveValue('');
        });

        // Simulate parent re-render with new object ref but same values
        rerender(<ChipRecordForm onSubmit={mockSubmit} currentBlind={{ ...currentBlind }} />);

        // Should STILL be empty
        await waitFor(() => {
            expect(screen.getByLabelText('SB')).toHaveValue('');
            expect(screen.getByLabelText('BB')).toHaveValue('');
        });
    });
    it('shows fallback chip count when input is empty', async () => {
        const mockSubmit = vi.fn();
        const currentBlind: StructureItem = { sb: 500, bb: 1000, duration: 20 };
        const lastRecord = { id: 1, tournamentId: 1, chipCount: 25000, sb: 200, bb: 400, timestamp: new Date() };

        render(<ChipRecordForm onSubmit={mockSubmit} currentBlind={currentBlind} lastRecord={lastRecord} />);

        // Should show empty input when lastRecord exists (user request)
        // Note: Logic changed. If lastRecord exists, we want input to be empty for fresh entry.
        const chipInput = screen.getByLabelText('チップ量');
        expect(chipInput).toHaveValue('');

        // Display area should show lastRecord value as fallback
        expect(screen.getByText('25,000')).toBeInTheDocument();

        // Clear input
        fireEvent.change(chipInput, { target: { value: '' } });
        expect(chipInput).toHaveValue('');

        // Also clear SB/BB inputs manually (as they would be after submit)
        const bbInput = screen.getByLabelText('BB');
        fireEvent.change(bbInput, { target: { value: '' } });
        expect(bbInput).toHaveValue('');

        // Display area should still show 25,000 (fallback)
        // Format: "25,000"
        expect(screen.getByText('25,000')).toBeInTheDocument();

        // And BB should be calculated based on fallback chips (25000) and fallback BB (from lastRecord: 400)
        // 25000 / 400 = 62.5
        // If it was using currentBlind (1000), it would be 25.0. 
        // If it was using default 1 (0 inputs), it would be 25000.
        // We expect it to use lastRecord.bb (400) because that's the "context".
        // Or should it use currentBlind (1000)?
        // User said: "Initial BB if no input, or last entered BB".
        // Here lastRecord has 400. currentBlind has 1000.
        // Logic should probably prioritize form -> lastRecord -> currentBlind?
        // Let's assume lastRecord is the "data source" for fallback if form is empty.
        expect(screen.getByTestId('bb-display')).toHaveTextContent(/\(62\.5\s*BB\)/);
    });
});
