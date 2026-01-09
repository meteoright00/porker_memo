import { describe, it, expect } from 'vitest';
import { analyzeGameTags } from './tagUtils';
import { Action } from '@/types/hand';

describe('tagUtils', () => {
    // Helper to create basic actions
    const createAction = (
        phase: Action['phase'],
        isHero: boolean,
        type: Action['type'],
        amount?: string
    ): Action => ({
        phase,
        actor: isHero ? 'Hero' : 'Villain',
        isHero,
        type,
        amount
    });

    describe('Pot Size tags', () => {
        it('identifies Single Raised Pot (SRP) when simple raise occurred', () => {
            const actions: Action[] = [
                // Villain Open Raise
                createAction('Preflop', false, 'Raise', '2.5BB'),
                // Hero Call
                createAction('Preflop', true, 'Call')
            ];
            const tags = analyzeGameTags(actions); // Hero in BB
            expect(tags).toContain('Single Raised Pot');
        });

        it('identifies 3Bet Pot when 3 betting occurred', () => {
            const actions: Action[] = [
                createAction('Preflop', false, 'Open', '2.5BB'), // Villain Open (Open is not standard, Use Raise?)
                // Assuming Raise types
                createAction('Preflop', false, 'Raise', '2.5BB'),
                createAction('Preflop', true, 'Raise', '9BB'), // Hero 3Bet
                createAction('Preflop', false, 'Call')
            ];
            const tags = analyzeGameTags(actions);
            expect(tags).toContain('3Bet Pot');
            expect(tags).not.toContain('Single Raised Pot');
        });

        it('identifies 4Bet Pot', () => {
            const actions: Action[] = [
                createAction('Preflop', false, 'Raise', '2.5BB'),
                createAction('Preflop', true, 'Raise', '9BB'), // 3Bet
                createAction('Preflop', false, 'Raise', '24BB'), // 4Bet
                createAction('Preflop', true, 'Call')
            ];
            const tags = analyzeGameTags(actions);
            expect(tags).toContain('4Bet Pot');
            expect(tags).not.toContain('3Bet Pot');
        });
    });

    describe('Postflop Aggression tags', () => {
        it('identifies C-Bet (Continuation Bet)', () => {
            // Need to know who was the aggressor preflop.
            // Simplified logic: If Hero raised preflop and Bets flop -> C-Bet?
            // TagUtils needs to know who was Aggressor.
            const actions: Action[] = [
                // Hero Raises Preflop
                createAction('Preflop', true, 'Raise', '2.5BB'),
                createAction('Preflop', false, 'Call'),
                // Flop
                createAction('Flop', true, 'Bet', '33%')
            ];
            const tags = analyzeGameTags(actions);
            expect(tags).toContain('C-Bet');
        });

        it('identifies Check-Raise', () => {
            const actions: Action[] = [
                createAction('Flop', true, 'Check'),
                createAction('Flop', false, 'Bet', '33%'),
                createAction('Flop', true, 'Raise', '100%')
            ];
            const tags = analyzeGameTags(actions);
            expect(tags).toContain('Check-Raise');
        });

        it('identifies Donk Bet', () => {
            // Hero OOP calls preflop, then leads flop
            const actions: Action[] = [
                // Villain Raise
                createAction('Preflop', false, 'Raise', '2.5BB'),
                // Hero Call OOP (e.g. BB)
                createAction('Preflop', true, 'Call'),
                // Flop: Hero leads
                createAction('Flop', true, 'Bet', '33%')
            ];
            const tags = analyzeGameTags(actions);
            expect(tags).toContain('Donk Bet');
        });
    });
});
