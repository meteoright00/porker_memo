import { describe, it, expect } from 'vitest';
import { reducer } from './use-toast';

describe('use-toast reducer', () => {
    it('ADD_TOAST adds a toast', () => {
        const state = { toasts: [] };
        const toast = { id: '1', title: 'Test', open: true };
        const newState = reducer(state, { type: 'ADD_TOAST', toast });
        expect(newState.toasts).toHaveLength(1);
        expect(newState.toasts[0]).toEqual(toast);
    });

    it('UPDATE_TOAST updates an existing toast', () => {
        const toast = { id: '1', title: 'Test', open: true };
        const state = { toasts: [toast] };
        const newState = reducer(state, {
            type: 'UPDATE_TOAST',
            toast: { id: '1', title: 'Updated' }
        });
        expect(newState.toasts[0].title).toBe('Updated');
    });

    it('DISMISS_TOAST dismisses a toast (sets open to false)', () => {
        const toast = { id: '1', title: 'Test', open: true };
        const state = { toasts: [toast] };
        const newState = reducer(state, { type: 'DISMISS_TOAST', toastId: '1' });
        expect(newState.toasts[0].open).toBe(false);
    });

    it('REMOVE_TOAST removes a toast', () => {
        const toast = { id: '1', title: 'Test', open: true };
        const state = { toasts: [toast] };
        const newState = reducer(state, { type: 'REMOVE_TOAST', toastId: '1' });
        expect(newState.toasts).toHaveLength(0);
    });

    it('DISMISS_TOAST without ID dismisses all', () => {
        const t1 = { id: '1', open: true };
        const t2 = { id: '2', open: true };
        const state = { toasts: [t1, t2] };
        const newState = reducer(state, { type: 'DISMISS_TOAST' });
        expect(newState.toasts[0].open).toBe(false);
        expect(newState.toasts[1].open).toBe(false);
    });

    it('REMOVE_TOAST without ID removes all', () => {
        const t1 = { id: '1', open: true };
        const state = { toasts: [t1] };
        const newState = reducer(state, { type: 'REMOVE_TOAST' });
        expect(newState.toasts).toHaveLength(0);
    });
});
