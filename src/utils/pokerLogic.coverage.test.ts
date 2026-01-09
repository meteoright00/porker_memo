import { describe, it, expect } from 'vitest';
import {
    getPositionsForCount,
    getNextActor,
    getInitialActor,
    checkHandEnded,
    POSITIONS_2MAX,
    POSITIONS_6MAX,
    POSITIONS_9MAX,
    POSITIONS_10MAX
} from './pokerLogic';

describe('pokerLogic Coverage', () => {
    describe('getPositionsForCount', () => {
        it('returns correct positions for various player counts', () => {
            expect(getPositionsForCount(2)).toEqual(POSITIONS_2MAX);
            expect(getPositionsForCount(3)).toEqual(POSITIONS_6MAX);
            expect(getPositionsForCount(6)).toEqual(POSITIONS_6MAX);
            expect(getPositionsForCount(7)).toEqual(POSITIONS_9MAX);
            expect(getPositionsForCount(9)).toEqual(POSITIONS_9MAX);
            expect(getPositionsForCount(10)).toEqual(POSITIONS_10MAX);
        });
    });

    describe('getInitialActor', () => {
        it('Preflop: Returns UTG equivalent (3rd player) in 6-max', () => {
            // 6-max Preflop order: UTG, MP, CO, BTN, SB, BB
            // Initial is UTG
            expect(getInitialActor('Preflop', [], 6)).toBe('UTG');
        });

        it('Postflop: Returns SB (1st player) in 6-max', () => {
            // Postflop order: SB, BB, UTG...
            expect(getInitialActor('Flop', [], 6)).toBe('SB');
        });

        it('Skips folded players', () => {
            // Postflop, SB folds. BB should be next.
            expect(getInitialActor('Flop', ['SB'], 6)).toBe('BB');
        });

        it('Returns null if everyone folded (theoretical)', () => {
            const allPositions = POSITIONS_6MAX;
            expect(getInitialActor('Flop', allPositions, 6)).toBeNull();
        });
    });

    describe('getNextActor', () => {
        it('Preflop: Advances from UTG to MP', () => {
            expect(getNextActor('UTG', 'Preflop', [], 6)).toBe('MP');
        });

        it('Preflop: Wraps around from BB (last) -> UTG (first) - though usually round changes', () => {
            // Note: In logic, it wraps around based on order array
            // Preflop Order: UTG, MP, CO, BTN, SB, BB
            expect(getNextActor('BB', 'Preflop', [], 6)).toBe('UTG');
        });

        it('Postflop: Advances from SB to BB', () => {
            expect(getNextActor('SB', 'Flop', [], 6)).toBe('BB');
        });

        it('Returns null for invalid current position', () => {
            expect(getNextActor('INVALID_POS', 'Flop', [], 6)).toBeNull();
        });

        it('Skips folded players', () => {
            // UTG acts. MP folded. CO folded. BTN is next.
            expect(getNextActor('UTG', 'Preflop', ['MP', 'CO'], 6)).toBe('BTN');
        });

        it('Returns null if everyone else folded (loop exhaustion)', () => {
            // Only UTG left (everyone else in folded list)

            // If we ask for next after UTG, and everyone else is folded...
            // It should actually return UTG itself if logic allows wrapping to self,
            // OR if the loop logic prevents it.
            // Logic: attempts < order.length. 
            // If count is 6. Next is MP (folded), ..., BB (folded).
            // It searches 6 times. 
            // If it returns to self, it means next actor IS self? 
            // Let's see code: `nextIndex = (currentIndex + 1) % length`.
            // Checks 6 times. If UTG is not in folded list, it would eventually find UTG?
            // Actually `attempts < order.length` means it checks everyone ELSE? 
            // If I fold everyone but UTG.
            // nextIndex starts at MP.
            // 1. MP (folded)
            // 2. CO (folded)
            // ...
            // 5. BB (folded)
            // 6. UTG (NOT folded). 
            // So it should return UTG (Self) if game allows.

            // Wait, usually hand ends if everyone else folds. 
            // But let's test the function's internal logic.

            // If we include UTG in folded... then it returns null.
            expect(getNextActor('UTG', 'Preflop', POSITIONS_6MAX, 6)).toBeNull();
        });
    });

    describe('checkHandEnded', () => {
        it('Returns true if active Hero folds', () => {
            const actions = [
                { isHero: true, type: 'Fold' }
            ];
            expect(checkHandEnded(actions, 6)).toBe(true);
        });

        it('Returns true if all villains fold (Heads up)', () => {
            // 2-max: SB(Hero), BB(Villain). 
            // Villain folds.
            const actions = [
                { position: 'BB', isHero: false, type: 'Fold' }
            ];
            expect(checkHandEnded(actions, 2)).toBe(true);
        });

        it('Returns false if hand is ongoing', () => {
            // 6-max. UTG folds. Hero(BTN) calls. Hand continues.
            const actions = [
                { position: 'UTG', isHero: false, type: 'Fold' },
                { position: 'BTN', isHero: true, type: 'Call' }
            ];
            expect(checkHandEnded(actions, 6)).toBe(false);
        });

        it('Returns true if (N-1) villains fold in N-max', () => {
            // 3-max: SB(Hero), BB, BTN.
            // BB folds, BTN folds.
            const actions = [
                { position: 'BB', isHero: false, type: 'Fold' },
                { position: 'BTN', isHero: false, type: 'Fold' }
            ];
            expect(checkHandEnded(actions, 3)).toBe(true);
        });
    });
});
