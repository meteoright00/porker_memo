import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HandFilter } from './HandFilter';

describe('HandFilter', () => {
    it('2.1. Renders Inputs: Displays date pickers and tag selector', () => {
        render(<HandFilter onFilterChange={vi.fn()} availableTags={['TagA', 'TagB']} />);
        expect(screen.getByText('Filter Hands')).toBeInTheDocument();
        expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
        expect(screen.getByLabelText('End Date')).toBeInTheDocument();
        expect(screen.getByText('Included Tags (Filter)')).toBeInTheDocument();
    });

    it('2.2. Interaction: Emits filter changes on input', async () => {
        const onFilterChange = vi.fn();
        render(<HandFilter onFilterChange={onFilterChange} availableTags={['TagA', 'TagB']} />);

        // Change Start Date
        const startDateInput = screen.getByLabelText('Start Date');
        fireEvent.change(startDateInput, { target: { value: '2023-01-01' } });

        expect(onFilterChange).toHaveBeenCalledWith(expect.objectContaining({
            startDate: expect.any(Date)
        }));

        // Change Tags
        const tagACheckbox = screen.getByLabelText('TagA');
        fireEvent.click(tagACheckbox);

        expect(onFilterChange).toHaveBeenCalledWith(expect.objectContaining({
            tags: ['TagA']
        }));
    });
});
