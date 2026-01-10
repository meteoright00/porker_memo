import { describe, it, expect, beforeEach } from 'vitest';
import { db } from './db';
import { ChipRecordRepository } from './ChipRecordRepository';
import { ChipRecord } from '@/types/tournament';

describe('ChipRecordRepository', () => {
    beforeEach(async () => {
        await db.chipRecords.clear();
    });

    it('should save and retrieve chip records by tournamentId', async () => {
        const r1: ChipRecord = {
            tournamentId: 1,
            chipCount: 10000,
            sb: 100,
            bb: 200,
            timestamp: new Date('2023-01-01T10:00:00'),
        };
        const r2: ChipRecord = {
            tournamentId: 1,
            chipCount: 12000,
            sb: 100,
            bb: 200,
            timestamp: new Date('2023-01-01T11:00:00'),
        };
        const r3: ChipRecord = {
            tournamentId: 2, // different tournament
            chipCount: 5000,
            sb: 50,
            bb: 100,
            timestamp: new Date(),
        };

        await ChipRecordRepository.save(r1);
        await ChipRecordRepository.save(r2);
        await ChipRecordRepository.save(r3);

        const t1Records = await ChipRecordRepository.getByTournamentId(1);
        expect(t1Records).toHaveLength(2);
        // Should be sorted by timestamp? Or just retrieved.
        // Let's assume implementation sorts them or we sort here to check content.
        expect(t1Records.map(r => r.chipCount)).toContain(10000);
        expect(t1Records.map(r => r.chipCount)).toContain(12000);
    });
});
