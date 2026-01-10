import { db } from './db';
import { Tournament, TournamentSchema } from '@/types/tournament';

export class TournamentRepository {
    static async save(tournament: Tournament): Promise<number> {
        // Validation
        TournamentSchema.parse(tournament);

        if (tournament.id) {
            await db.tournaments.put(tournament);
            return tournament.id;
        } else {
            const id = await db.tournaments.add(tournament);
            return id as number;
        }
    }

    static async getById(id: number): Promise<Tournament | undefined> {
        return await db.tournaments.get(id);
    }

    static async getAll(): Promise<Tournament[]> {
        return await db.tournaments.toArray();
    }

    static async delete(id: number): Promise<void> {
        await db.tournaments.delete(id);
    }
}
