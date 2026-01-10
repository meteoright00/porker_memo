import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ChipRecordForm } from './ChipRecordForm';
import { userEvent } from '@testing-library/user-event';

describe('ChipRecordForm', () => {
    it('renders all fields', () => {
        render(<ChipRecordForm onSubmit={vi.fn()} />);
        expect(screen.getByLabelText('現在のチップ量')).toBeInTheDocument();
        expect(screen.getByLabelText('現在のSB')).toBeInTheDocument();
        expect(screen.getByLabelText('現在のBB')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /記録/i })).toBeInTheDocument();
    });

    it('uses last record for defaults', () => {
        const lastRecord = {
            id: 1,
            tournamentId: 1,
            chipCount: 20000,
            sb: 100,
            bb: 200,
            timestamp: new Date()
        };
        render(<ChipRecordForm onSubmit={vi.fn()} lastRecord={lastRecord} />);

        expect(screen.getByLabelText('現在のSB')).toHaveValue(100);
        expect(screen.getByLabelText('現在のBB')).toHaveValue(200);
    });

    it.skip('submits valid data', async () => {
        const onSubmit = vi.fn();
        const user = userEvent.setup();
        render(<ChipRecordForm onSubmit={onSubmit} />);

        const chipInput = screen.getByLabelText('現在のチップ量');
        const sbInput = screen.getByLabelText('現在のSB');
        const bbInput = screen.getByLabelText('現在のBB');

        fireEvent.change(chipInput, { target: { value: '25000' } });
        fireEvent.change(sbInput, { target: { value: '200' } });
        fireEvent.change(bbInput, { target: { value: '400' } });



        expect(chipInput).toHaveValue(25000);
        expect(sbInput).toHaveValue(200);
        expect(bbInput).toHaveValue(400);

        fireEvent.click(screen.getByRole('button', { name: /記録/i }));


        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith({
                chipCount: 25000,
                sb: 200,
                bb: 400,
            });
        });
    });
});
