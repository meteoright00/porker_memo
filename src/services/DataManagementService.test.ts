import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DataManagementService } from './DataManagementService';
import { HandRepository } from '../data/HandRepository';
import { HandRecord } from '@/types/hand';

// Mock HandRepository
vi.mock('../data/HandRepository', () => ({
    HandRepository: {
        getAll: vi.fn(),
        save: vi.fn()
    }
}));

const mockHand: HandRecord = {
    uuid: 'test-uuid',
    date: new Date('2024-01-01'),
    position: 'BTN',
    holeCards: ['As', 'Ks'],
    board: [],
    actions: [],
    winLoss: 'Win',
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date()
};

describe('DataManagementService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('4.1. Export: Generates JSON string from all hands', async () => {
        vi.mocked(HandRepository.getAll).mockResolvedValue([mockHand]);

        const json = await DataManagementService.exportData();
        const parsed = JSON.parse(json);

        expect(parsed).toHaveLength(1);
        expect(parsed[0].uuid).toBe(mockHand.uuid);
        // Date objects become strings in JSON
        expect(parsed[0].date).toBe(mockHand.date.toISOString());
    });

    it('4.2. Import: Parses JSON and saves hands', async () => {
        const mockJson = JSON.stringify([mockHand]);

        await DataManagementService.importData(mockJson);

        expect(HandRepository.save).toHaveBeenCalledTimes(1);
        expect(HandRepository.save).toHaveBeenCalledWith(expect.objectContaining({
            uuid: mockHand.uuid,
            // Should be parsed back to Date? 
            // Repository.save expects HandRecord which has Date objects.
            // So Service must convert string dates back to Date objects BEFORE calling save.
            date: expect.any(Date)
        }));
    });
});
