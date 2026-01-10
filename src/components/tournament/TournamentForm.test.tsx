import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TournamentForm } from './TournamentForm';
import { userEvent } from '@testing-library/user-event';

describe('TournamentForm', () => {
    it('renders all fields', () => {
        render(<TournamentForm onSubmit={vi.fn()} />);
        expect(screen.getByLabelText('トーナメント名')).toBeInTheDocument();
        expect(screen.getByLabelText('開始チップ量')).toBeInTheDocument();
        expect(screen.getByLabelText('初期SB')).toBeInTheDocument();
        expect(screen.getByLabelText('初期BB')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /作成/i })).toBeInTheDocument();
    });

    it('submits valid data', async () => {
        const onSubmit = vi.fn();
        const user = userEvent.setup();
        render(<TournamentForm onSubmit={onSubmit} />);

        const nameInput = screen.getByLabelText('トーナメント名');
        const chipsInput = screen.getByLabelText('開始チップ量');
        const sbInput = screen.getByLabelText('初期SB');
        const bbInput = screen.getByLabelText('初期BB');

        await user.type(nameInput, 'Test Tournament');

        await user.clear(chipsInput);
        await user.type(chipsInput, '10000');
        expect(chipsInput).toHaveValue(10000);

        await user.clear(sbInput);
        await user.type(sbInput, '100');
        expect(sbInput).toHaveValue(100);

        await user.clear(bbInput);
        await user.type(bbInput, '200');
        expect(bbInput).toHaveValue(200);

        await user.click(screen.getByRole('button', { name: /作成/i }));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith({
                name: 'Test Tournament',
                startChips: 10000,
                sb: 100,
                bb: 200,
            }, expect.anything());
        });
    });

    it('shows validation error for empty name', async () => {
        const onSubmit = vi.fn();
        const user = userEvent.setup();
        render(<TournamentForm onSubmit={onSubmit} />);

        await user.click(screen.getByRole('button', { name: /作成/i }));

        expect(await screen.findByText(/名前を入力してください/i)).toBeInTheDocument();
        expect(onSubmit).not.toHaveBeenCalled();
    });
});
