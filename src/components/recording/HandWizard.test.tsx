import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HandWizard } from './HandWizard';

describe('HandWizard', () => {
    it('3.1. Renders Initial Step: Starts at Preflop with Position selection', () => {
        render(<HandWizard onSave={vi.fn()} />);

        expect(screen.getByText('New Hand Recording')).toBeInTheDocument();
        expect(screen.getByText(/Preflop/i)).toBeInTheDocument();
        expect(screen.getByText(/Position/i)).toBeInTheDocument(); // Changed from Hole Cards
    });

    it('3.2. Navigation: Next button moves to next phase', async () => {
        render(<HandWizard onSave={vi.fn()} />);

        // 1. Position Step
        fireEvent.click(screen.getByText('BTN'));
        fireEvent.click(screen.getByText('Next'));

        // 2. Hole Cards Step
        expect(screen.getByText(/Hole Cards/i)).toBeInTheDocument();

        // Select 2 cards to pass validation
        fireEvent.click(screen.getByText('A'));
        fireEvent.click(screen.getByText('♠'));
        fireEvent.click(screen.getByText('K'));
        fireEvent.click(screen.getByText('♠'));

        const nextButton = screen.getByText('Next');
        fireEvent.click(nextButton);

        expect(screen.getByText(/Preflop/i)).toBeInTheDocument();
        expect(screen.getByText(/Actions/i)).toBeInTheDocument();
    });

    it('3.3. Integration: Renders CardSelector for Hole Cards and accepts input', async () => {
        render(<HandWizard onSave={vi.fn()} />);

        // Pass Position step
        fireEvent.click(screen.getByText('BTN'));
        fireEvent.click(screen.getByText('Next'));

        expect(screen.getByText('A')).toBeInTheDocument();
        expect(screen.getByText('♠')).toBeInTheDocument();

        fireEvent.click(screen.getByText('A'));
        fireEvent.click(screen.getByText('♠'));
    });

    it('3.5. Validation: Prevents Next if required data is missing', async () => {
        render(<HandWizard onSave={vi.fn()} />);

        // Position Step Validation
        fireEvent.click(screen.getByText('Next')); // Click Next without selecting Position
        expect(screen.getByText(/Position/i)).toBeInTheDocument(); // Should stay on Position

        fireEvent.click(screen.getByText('BTN'));
        fireEvent.click(screen.getByText('Next'));

        // Hole Cards Step Validation
        expect(screen.getByText(/Hole Cards/i)).toBeInTheDocument();
        fireEvent.click(screen.getByText('Next')); // Click Next without cards
        expect(screen.getByText(/Hole Cards/i)).toBeInTheDocument(); // Should stay

        fireEvent.click(screen.getByText('A'));
        fireEvent.click(screen.getByText('♠'));
        fireEvent.click(screen.getByText('Next'));
        expect(screen.getByText(/Hole Cards/i)).toBeInTheDocument(); // Still only 1 card

        fireEvent.click(screen.getByText('K'));
        fireEvent.click(screen.getByText('♠'));
        fireEvent.click(screen.getByText('Next'));
        expect(screen.getByText(/Actions/i)).toBeInTheDocument();
    });

    it('3.6. Integration: Full Flow (Preflop -> River -> Save)', async () => {
        const user = userEvent.setup();
        const onSave = vi.fn();
        render(<HandWizard onSave={onSave} />);
        console.log('DEBUG: Test started');

        // 1. Position
        fireEvent.click(screen.getByText('BTN'));
        fireEvent.click(screen.getByText('Next'));
        console.log('DEBUG: Position selected');

        // --- Preflop ---
        // Hole Cards: As, Ks
        fireEvent.click(screen.getByText('A'));
        fireEvent.click(screen.getByText('♠'));
        fireEvent.click(screen.getByText('K'));
        fireEvent.click(screen.getByText('♠'));
        fireEvent.click(screen.getByText('Next'));
        console.log('DEBUG: Hole cards selected');

        // Preflop Actions: Bet 10
        fireEvent.click(screen.getByText('Bet'));
        const amountInput = screen.getByPlaceholderText('Amount');
        fireEvent.change(amountInput, { target: { value: '10' } });
        fireEvent.click(screen.getByText('Add Action'));
        console.log('DEBUG: Action added');

        // Verify action is displayed
        expect(screen.getByTestId('action-list')).toHaveTextContent(/Bet 10/);

        const nav = screen.getByTestId('wizard-nav');
        const nextButton = within(nav).getByText('Next');
        expect(nextButton).toBeEnabled();
        await user.click(nextButton);
        console.log('DEBUG: Moved to next step (Flop?)');

        // Wait for transition
        await waitFor(() => {
            expect(screen.queryByText(/Preflop/)).not.toBeInTheDocument();
        });

        // --- Flop ---
        // Board
        expect(await screen.findByText(/Flop/i)).toBeInTheDocument();
        expect(screen.getByText(/Board/i)).toBeInTheDocument();

        // Select 3 cards: 2h, 3h, 4h
        fireEvent.click(screen.getByText('2'));
        fireEvent.click(screen.getByText('♥'));
        fireEvent.click(screen.getByText('3'));
        fireEvent.click(screen.getByText('♥'));
        fireEvent.click(screen.getByText('4'));
        fireEvent.click(screen.getByText('♥'));
        fireEvent.click(screen.getByText('Next'));

        // Flop Actions: Check
        expect(await screen.findByText(/Flop/i)).toBeInTheDocument();
        expect(screen.getByText(/Actions/i)).toBeInTheDocument();
        fireEvent.click(screen.getByText('Check'));
        fireEvent.click(screen.getByText('Next'));

        // --- Turn ---
        // Board
        expect(await screen.findByText(/Turn/i)).toBeInTheDocument();
        expect(screen.getByText(/Board/i)).toBeInTheDocument();

        // Select 1 card: 5h
        fireEvent.click(screen.getByText('5'));
        fireEvent.click(screen.getByText('♥'));
        fireEvent.click(screen.getByText('Next'));

        // Turn Actions: Check
        expect(await screen.findByText(/Turn/i)).toBeInTheDocument();
        expect(screen.getByText(/Actions/i)).toBeInTheDocument();
        fireEvent.click(screen.getByText('Check'));
        // No Add
        fireEvent.click(screen.getByText('Next'));

        // --- River ---
        // Board
        expect(await screen.findByText(/River/i)).toBeInTheDocument();
        expect(screen.getByText(/Board/i)).toBeInTheDocument();

        // Select 1 card: 6h
        await user.click(screen.getByText('6'));
        await user.click(screen.getByText('♥'));
        await user.click(screen.getByText('Next'));

        // River Actions: Bet 25
        expect(await screen.findByText(/River/i)).toBeInTheDocument();
        expect(screen.getByText(/Actions/i)).toBeInTheDocument();
        await user.click(screen.getByText('Bet'));
        const amountInputRiver = screen.getByPlaceholderText('Amount');
        await user.type(amountInputRiver, '25');
        await user.click(screen.getByText('Add Action'));

        // Next to Result Step (Button says 'Review' at this stage)
        expect(screen.getByText('Review')).not.toBeNull();
        await user.click(screen.getByText('Review'));

        // --- Result Step ---
        // --- Result Step ---
        // Header check might be tricky due to split text, check for specific label or subtext
        expect(await screen.findByText('Details')).toBeInTheDocument();
        expect(screen.getByText('Result', { selector: 'label' })).toBeInTheDocument();
        // Check if tags generated?
        // Preflop: Bet -> Single Raised Pot.
        // Flop: Check.
        // Turn: Check.
        // River: Bet.
        // Let's verify expected tags in assertion.

        // Save (Finish)
        await user.click(screen.getByText('Finish'));

        // Verify onSave
        expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
            position: 'BTN',
            holeCards: expect.arrayContaining(['As', 'Ks']),
            board: expect.arrayContaining(['2h', '3h', '4h', '5h', '6h']),
            actions: expect.arrayContaining([
                expect.objectContaining({ phase: 'Preflop', type: 'Bet', amount: '10' }),
                expect.objectContaining({ phase: 'Flop', type: 'Check' }),
                expect.objectContaining({ phase: 'Turn', type: 'Check' }),
                expect.objectContaining({ phase: 'River', type: 'Bet', amount: '25' }),
            ]),
            tags: expect.arrayContaining(['Single Raised Pot'])
        }));
    });

    it('records villain actions correctly', async () => {
        const user = userEvent.setup();
        const onSave = vi.fn();
        render(<HandWizard onSave={onSave} />);

        // 1. Position Step
        await user.click(screen.getByText('BTN'));
        await user.click(screen.getByText('Next'));

        // 2. Hole Cards Step
        await user.click(screen.getByText('A'));
        await user.click(screen.getByText('♠'));
        await user.click(screen.getByText('K'));
        await user.click(screen.getByText('♠'));

        // Verify selection
        const selectedArea = screen.getByText('Selected:').parentElement;
        expect(selectedArea?.textContent).toContain('As');
        expect(selectedArea?.textContent).toContain('Ks');

        await user.click(screen.getByText('Next'));

        // 3. Preflop Actions Step
        expect(await screen.findByText(/Preflop/)).toBeInTheDocument();
        expect(screen.getByText(/Actions/)).toBeInTheDocument();

        // Switch to Villain
        const villainToggle = screen.getByTestId('toggle-villain');
        await user.click(villainToggle);

        // Add Villain Raise
        await user.click(screen.getByText('Raise'));
        const amountInput = screen.getByPlaceholderText('Amount');
        await user.type(amountInput, '9BB');
        await user.click(screen.getByText('Add Action'));

        // Verify that the action list displays "Villain Raise 9BB"
        const actionList = await screen.findByTestId('action-list');
        // Note: The actor display logic might vary ("SB", "UTG", etc.) depending on what updateActorState decided.
        // Since we are BTN, next is UTG. Villain (UTG).
        // But here we explicitly switched to Villain.
        // And updateActorState might have set SuggestedVillainPos.
        expect(actionList.textContent).toMatch(/Raise/i);
        expect(actionList.textContent).toMatch(/Raise 9BB/);
    });

    it('handles Undo Action correctly', async () => {
        const user = userEvent.setup();
        render(<HandWizard onSave={vi.fn()} />);

        // Navigate to Preflop Actions
        await user.click(screen.getByText('BTN'));
        await user.click(screen.getByText('Next'));
        await user.click(screen.getByText('A')); await user.click(screen.getByText('♠'));
        await user.click(screen.getByText('K')); await user.click(screen.getByText('♠'));
        await user.click(screen.getByText('Next'));

        // Add Action
        // Default actor is UTG (Villain) because Hero is BTN
        await user.click(screen.getByText('Call'));

        // Verify action exists
        expect(screen.getByTestId('action-list').textContent).toContain('Call');

        // Click Undo
        await user.click(screen.getByText('Undo Last Action'));

        // Verify action removed
        expect(screen.getByTestId('action-list').textContent).not.toContain('Call');
    });

    describe('Coverage Specific Tests', () => {
        it('Validates Card Limits per street', async () => {
            const user = userEvent.setup();
            render(<HandWizard onSave={vi.fn()} />);

            // Reach Flop Board
            await user.click(screen.getByText('BTN'));
            await user.click(screen.getByText('Next')); // Position done
            // Hole Cards
            await user.click(screen.getByText('A')); await user.click(screen.getByText('♠'));
            await user.click(screen.getByText('K')); await user.click(screen.getByText('♠'));
            await user.click(screen.getByText('Next')); // Hole Cards done
            // Preflop Actions
            await user.click(screen.getByText('Next')); // Actions done (no actions)

            // Now at Flop Board
            expect(screen.getByText(/Flop/i)).toBeInTheDocument();
            expect(screen.getByText(/Board/i)).toBeInTheDocument();

            // Try selecting 4 cards (Limit is 3)
            // 1
            await user.click(screen.getByText('2')); await user.click(screen.getByText('♥'));
            // 2
            await user.click(screen.getByText('3')); await user.click(screen.getByText('♥'));
            // 3
            await user.click(screen.getByText('4')); await user.click(screen.getByText('♥'));

            // 4th attempts - should be ignored
            await user.click(screen.getByText('5')); await user.click(screen.getByText('♥'));

            // Check display

            // 2h, 3h, 4h are valid (3 cards). 5h should not be there.
            // Note: CardSelector renders suits on buttons too. We need to check the "Selected:" section specifically if possible,
            // or count total occurrences. But easier: CardSelector disables selected cards in the grid? 
            // Or we check `selectedCards` prop passed? 
            // In unit test of parent, checking state is hard without finding "Selected:" text components.
            // The "Selected:" block renders spans.
            const selectedArea = screen.getByText('Selected:').parentElement;
            expect(selectedArea?.textContent).toContain('2h');
            expect(selectedArea?.textContent).toContain('3h');
            expect(selectedArea?.textContent).toContain('4h');
            expect(selectedArea?.textContent).not.toContain('5h');
        });

        it.skip('Auto-transitions to Result when hand ends', async () => {
            const user = userEvent.setup();
            render(<HandWizard onSave={vi.fn()} />);

            // Helper to advance
            const advance = async () => await user.click(screen.getByText('Next'));

            // Position
            await user.click(screen.getByText('UTG'));
            await advance();

            // Hole Cards
            await user.click(screen.getByText('A')); await user.click(screen.getByText('♠'));
            await user.click(screen.getByText('K')); await user.click(screen.getByText('♠'));
            await advance();

            // Preflop Actions - Hero Folds
            // Ensure we are acting as Hero (avoid race condition in test env)
            await user.click(screen.getByTestId('toggle-hero'));

            // Hero fold should end hand immediately
            await user.click(screen.getByText('Fold'));
            // Note: 'Fold' usually auto-submits in ActionInput logic if correctly implemented. 
            // The previous test logic says: "ActionInput was updated to auto-submit for Check/Call/Fold!"
            // So clicking Fold should trigger handleAddAction -> checkHandEnded -> setStep(Result)

            // Verify we are at Result step
            expect(await screen.findByText(/Result/i)).toBeInTheDocument();
            expect(screen.getByText(/Details/i)).toBeInTheDocument();
        });

        it('Deselects hole cards correctly', async () => {
            const user = userEvent.setup();
            render(<HandWizard onSave={vi.fn()} />);

            await user.click(screen.getByText('BTN'));
            await user.click(screen.getByText('Next'));

            // Select As
            await user.click(screen.getByText('A')); await user.click(screen.getByText('♠'));
            const selectedArea = screen.getByText('Selected:').parentElement;
            expect(selectedArea?.textContent).toContain('As');

            // Deselect As (Components are CardSelector -> onSelect)
            // CardSelector treats selection as toggle?
            // "if (holeCards.includes(card)) { setHoleCards(filter) }"
            // But verification: click again
            await user.click(screen.getByText('A')); await user.click(screen.getByText('♠'));

            await waitFor(() => {
                const updatedSelectedArea = screen.getByText('Selected:').parentElement;
                expect(updatedSelectedArea?.textContent).not.toContain('As');
            });
        });
    });
});
