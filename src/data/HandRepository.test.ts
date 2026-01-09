import { describe, it, expect, beforeEach } from 'vitest';
import { HandRepository } from './HandRepository';
import { db } from './db';
import { HandRecord } from '@/types/hand';
import 'fake-indexeddb/auto';

const mockHand: HandRecord = {
    uuid: crypto.randomUUID(),
    date: new Date(),
    position: 'BTN',
    holeCards: ['As', 'Ks'],
    board: ['2h', '3h', '4h'],
    actions: [],
    winLoss: 'Win',
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date()
};

describe('HandRepository', () => {
    beforeEach(async () => {
        await db.hands.clear();
    });

    it('1.1. Save and Retrieve: Can save a new valid HandRecord and retrieve it by ID', async () => {
        const newHand: Omit<HandRecord, 'id' | 'createdAt' | 'updatedAt'> = {
            uuid: '550e8400-e29b-41d4-a716-446655440000',
            date: new Date('2024-01-01T10:00:00'),
            position: 'BTN',
            holeCards: ['As', 'Ks'],
            board: ['Ah', 'Kd', 'Td'],
            actions: [],
            winLoss: 'Win',
            tags: ['Test'],
        };

        const id = await HandRepository.save(newHand);
        const retrieved = await HandRepository.getById(id);

        expect(retrieved).toBeDefined();
        expect(retrieved?.id).toBe(id);
        expect(retrieved?.uuid).toBe(newHand.uuid);
        expect(retrieved?.createdAt).toBeInstanceOf(Date);
    });

    it('1.2. Update: Can update an existing record', async () => {
        // 1. Save initial record
        const newHand: Omit<HandRecord, 'id' | 'createdAt' | 'updatedAt'> = {
            uuid: '550e8400-e29b-41d4-a716-446655440001',
            date: new Date('2024-01-02T10:00:00'),
            position: 'SB',
            holeCards: ['Qh', 'Qd'],
            board: [],
            actions: [],
            winLoss: 'Lose',
            tags: [],
        };
        const id = await HandRepository.save(newHand);

        // 2. Modify and Save (Update)
        const saved = await HandRepository.getById(id);
        if (!saved) throw new Error('Failed to save initial record');

        const updatedHand: HandRecord = {
            ...saved,
            note: 'Updated Note',
            tags: ['UpdatedTag'],
        };

        await new Promise(resolve => setTimeout(resolve, 10)); // Ensure time passes
        await HandRepository.save(updatedHand);

        // 3. Verify
        const retrieved = await HandRepository.getById(id);
        expect(retrieved?.note).toBe('Updated Note');
        expect(retrieved?.tags).toContain('UpdatedTag');
        expect(retrieved?.updatedAt.getTime()).toBeGreaterThan(saved.updatedAt.getTime());
    });

    it('1.3. Delete: Can delete a record by ID', async () => {
        const newHand: Omit<HandRecord, 'id' | 'createdAt' | 'updatedAt'> = {
            uuid: '550e8400-e29b-41d4-a716-446655440002',
            date: new Date(),
            position: 'UTG',
            holeCards: ['7h', '7c'],
            board: [],
            actions: [],
            winLoss: 'Win',
            tags: [],
        };
        const id = await HandRepository.save(newHand);

        // Delete
        await HandRepository.delete(id);

        // Verify
        const retrieved = await HandRepository.getById(id);
        expect(retrieved).toBeUndefined();
    });

    it('1.4. Delete (alternative): deletes a hand', async () => {
        const id = await HandRepository.save(mockHand);
        await HandRepository.delete(id);
        const hands = await HandRepository.getAll();
        expect(hands).toHaveLength(0);
    });

    it('1.5. Query: queries hands by date range', async () => {
        const hand1 = { ...mockHand, uuid: crypto.randomUUID(), date: new Date('2023-01-01') };
        const hand2 = { ...mockHand, uuid: crypto.randomUUID(), date: new Date('2023-01-15') };
        const hand3 = { ...mockHand, uuid: crypto.randomUUID(), date: new Date('2023-02-01') };

        await HandRepository.save(hand1);
        await HandRepository.save(hand2);
        await HandRepository.save(hand3);

        const results = await HandRepository.query({
            startDate: new Date('2023-01-01'),
            endDate: new Date('2023-01-31')
        });

        expect(results).toHaveLength(2);
        // Convert dates to ISO strings for reliable comparison
        expect(results.map(h => h.date.toISOString().split('T')[0])).toEqual([
            hand1.date.toISOString().split('T')[0],
            hand2.date.toISOString().split('T')[0]
        ]);
    });

    it('1.6. Query: queries hands by tags', async () => {
        const hand1 = { ...mockHand, uuid: crypto.randomUUID(), tags: ['TagA', 'TagB'] };
        const hand2 = { ...mockHand, uuid: crypto.randomUUID(), tags: ['TagB', 'TagC'] };
        const hand3 = { ...mockHand, uuid: crypto.randomUUID(), tags: ['TagA'] }; // Match TagA

        await HandRepository.save(hand1);
        await HandRepository.save(hand2);
        await HandRepository.save(hand3);

        const results = await HandRepository.query({
            tags: ['TagA']
        });

        expect(results).toHaveLength(2);
        const uuids = results.map(h => h.uuid);
        expect(uuids).toContain(hand1.uuid);
        expect(uuids).toContain(hand3.uuid);
        expect(uuids).not.toContain(hand2.uuid);
    });

    it('1.8. Combined Query: queries hands by filter (Date + Tags)', async () => {
        const hand1 = { ...mockHand, uuid: crypto.randomUUID(), date: new Date('2023-01-01'), tags: ['TagA'] };
        const hand2 = { ...mockHand, uuid: crypto.randomUUID(), date: new Date('2023-01-01'), tags: ['TagB'] };
        const hand3 = { ...mockHand, uuid: crypto.randomUUID(), date: new Date('2023-02-01'), tags: ['TagA'] };

        await HandRepository.save(hand1);
        await HandRepository.save(hand2);
        await HandRepository.save(hand3);

        const results = await HandRepository.query({
            startDate: new Date('2023-01-01'),
            endDate: new Date('2023-01-31'),
            tags: ['TagA']
        });

        expect(results).toHaveLength(1);
        expect(results[0].uuid).toBe(hand1.uuid);
    });

    it('1.7. Get All: Can retrieve all saved records', async () => {
        await db.hands.clear();
        await HandRepository.save({ uuid: '550e8400-e29b-41d4-a716-446655440003', date: new Date(), position: 'BTN', holeCards: ['Ah', 'Ad'], board: [], actions: [], winLoss: 'Win', tags: [] as string[] });
        await HandRepository.save({ uuid: '550e8400-e29b-41d4-a716-446655440004', date: new Date(), position: 'SB', holeCards: ['Ks', 'Kd'], board: [], actions: [], winLoss: 'Lose', tags: [] as string[] });
        await HandRepository.save({ uuid: '550e8400-e29b-41d4-a716-446655440005', date: new Date(), position: 'BB', holeCards: ['Qh', 'Qd'], board: [], actions: [], winLoss: 'Chop', tags: [] as string[] });

        const all = await HandRepository.getAll();
        expect(all).toHaveLength(3);
        expect(all[0].uuid).toBe('550e8400-e29b-41d4-a716-446655440003');
        expect(all[2].uuid).toBe('550e8400-e29b-41d4-a716-446655440005');
    });

    it('2.1. Validation: Throws error on invalid data', async () => {
        const invalidHand = {
            uuid: 'invalid',
            // Missing required fields
        };
        // @ts-expect-error - Testing runtime validation
        await expect(HandRepository.save(invalidHand)).rejects.toThrow();
    });
});
