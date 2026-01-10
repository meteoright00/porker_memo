import { db } from './db';
import { ChipRecord, ChipRecordSchema } from '@/types/tournament';

export class ChipRecordRepository {
    static async save(record: ChipRecord): Promise<number> {
        ChipRecordSchema.parse(record);
        if (record.id) {
            await db.chipRecords.put(record);
            return record.id;
        } else {
            const id = await db.chipRecords.add(record);
            return id as number;
        }
    }

    static async getByTournamentId(tournamentId: number): Promise<ChipRecord[]> {
        return await db.chipRecords
            .where('tournamentId')
            .equals(tournamentId)
            .sortBy('timestamp');
    }

    static async getAll(): Promise<ChipRecord[]> {
        return await db.chipRecords.toArray();
    }
}
