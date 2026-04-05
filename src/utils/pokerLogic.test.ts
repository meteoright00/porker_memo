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

describe('pokerLogic', () => {
    describe('getPositionsForCount', () => {
        it('returns POSITIONS_2MAX for count <= 2', () => {
            expect(getPositionsForCount(2)).toEqual(POSITIONS_2MAX);
            expect(getPositionsForCount(1)).toEqual(POSITIONS_2MAX);
        });
        it('returns POSITIONS_6MAX for count <= 6', () => {
            expect(getPositionsForCount(6)).toEqual(POSITIONS_6MAX);
            expect(getPositionsForCount(4)).toEqual(POSITIONS_6MAX);
        });
        it('returns POSITIONS_9MAX for count <= 9', () => {
            expect(getPositionsForCount(9)).toEqual(POSITIONS_9MAX);
            expect(getPositionsForCount(8)).toEqual(POSITIONS_9MAX);
        });
        it('returns POSITIONS_10MAX for count > 9', () => {
            expect(getPositionsForCount(10)).toEqual(POSITIONS_10MAX);
            expect(getPositionsForCount(15)).toEqual(POSITIONS_10MAX);
        });
    });

    describe('getInitialActor', () => {
        it('returns UTG for Preflop in 6-max when no one folded', () => {
            expect(getInitialActor('Preflop', [], 6)).toBe('UTG');
        });
        it('returns SB for Flop in 6-max when no one folded', () => {
            expect(getInitialActor('Flop', [], 6)).toBe('SB');
        });
        it('returns BB for Flop when SB has folded', () => {
            expect(getInitialActor('Flop', ['SB'], 6)).toBe('BB');
        });
        it('returns null if everyone has folded', () => {
            expect(getInitialActor('Preflop', POSITIONS_6MAX, 6)).toBeNull();
        });
    });

    describe('getNextActor', () => {
        it('returns MP after UTG in Preflop 6-max', () => {
            expect(getNextActor('UTG', 'Preflop', [], 6)).toBe('MP');
        });
        it('returns BB after SB in Preflop 6-max', () => {
            expect(getNextActor('SB', 'Preflop', [], 6)).toBe('BB');
        });
        it('skips folded positions', () => {
            expect(getNextActor('UTG', 'Preflop', ['MP'], 6)).toBe('CO');
        });
        it('wraps around correctly', () => {
            expect(getNextActor('BB', 'Preflop', [], 6)).toBe('UTG');
        });
        it('returns null if position is not found in order', () => {
            expect(getNextActor('Unknown', 'Preflop', [], 6)).toBeNull();
        });
        it('returns the same position if everyone else is folded', () => {
            const allFoldedButUTG = ['SB', 'BB', 'MP', 'CO', 'BTN'];
            expect(getNextActor('UTG', 'Preflop', allFoldedButUTG, 6)).toBe('UTG');
        });
        it('returns null if all attempts fail (all are folded)', () => {
            // Though unlikely in real state, if all positions are folded, it returns null.
            expect(getNextActor('UTG', 'Preflop', POSITIONS_6MAX, 6)).toBeNull();
        });
    });

    describe('checkHandEnded', () => {
        it('returns true if Hero has folded', () => {
            const actions = [{ type: 'Fold', isHero: true }];
            expect(checkHandEnded(actions, 6)).toBe(true);
        });
        it('returns true if everyone else has folded (count-1 villains folded)', () => {
            const actions = [
                { position: 'SB', type: 'Fold', isHero: false },
                { position: 'BB', type: 'Fold', isHero: false },
                { position: 'UTG', type: 'Fold', isHero: false },
                { position: 'MP', type: 'Fold', isHero: false },
                { position: 'CO', type: 'Fold', isHero: false },
            ];
            expect(checkHandEnded(actions, 6)).toBe(true);
        });
        it('returns false if Hero has not folded and not enough villains folded', () => {
            const actions = [
                { position: 'SB', type: 'Fold', isHero: false },
                { position: 'BB', type: 'Fold', isHero: false },
            ];
            expect(checkHandEnded(actions, 6)).toBe(false);
        });
    });
});
