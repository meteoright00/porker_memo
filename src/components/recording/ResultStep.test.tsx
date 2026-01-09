import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResultStep } from './ResultStep';

describe('ResultStep', () => {
    it('renders Win/Loss selectors', () => {
        render(
            <ResultStep
                tags={[]}
                onTagsChange={vi.fn()}
                winLoss="Win"
                onWinLossChange={vi.fn()}
                note=""
                onNoteChange={vi.fn()}
                onSave={vi.fn()}
            />
        );
        expect(screen.getByText('Win')).not.toBeNull();
        expect(screen.getByText('Lose')).not.toBeNull();
        expect(screen.getByText('Chop')).not.toBeNull();
    });

    it('displays initial tags and allows adding/removing', async () => {
        const user = userEvent.setup();
        const onTagsChange = vi.fn();
        const tags = ['3Bet Pot'];

        render(
            <ResultStep
                tags={tags}
                onTagsChange={onTagsChange}
                winLoss="Win"
                onWinLossChange={vi.fn()}
                note=""
                onNoteChange={vi.fn()}
                onSave={vi.fn()}
            />
        );

        expect(screen.getByText('3Bet Pot')).not.toBeNull();

        // Add tag
        const input = screen.getByPlaceholderText('Add tag...');
        await user.type(input, 'Bluff');
        await user.click(screen.getByText('Add'));

        expect(onTagsChange).toHaveBeenCalledWith(['3Bet Pot', 'Bluff']);

        // Remove tag (mocking interactive update would require state in test wrapper, but unit test checks callback)
        // Assuming we render remove button (X)
        const removeButton = screen.getByTestId('remove-tag-3Bet Pot');
        await user.click(removeButton);
        expect(onTagsChange).toHaveBeenCalledWith([]);
        // Note: checking call with [] logic depends on implementation
    });

    it('allows entering notes', async () => {
        const user = userEvent.setup();
        const onNoteChange = vi.fn();

        render(
            <ResultStep
                tags={[]}
                onTagsChange={vi.fn()}
                winLoss="Win"
                onWinLossChange={vi.fn()}
                note=""
                onNoteChange={onNoteChange}
                onSave={vi.fn()}
            />
        );

        const textarea = screen.getByPlaceholderText('Notes...');
        await user.type(textarea, 'Villain was tight');
        expect(onNoteChange).toHaveBeenCalled(); // simplistic check
    });
});
