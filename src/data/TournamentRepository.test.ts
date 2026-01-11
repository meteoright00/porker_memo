import { describe, it, expect, beforeEach } from 'vitest';
import { db } from './db';
import { TournamentRepository } from './TournamentRepository';
import { Tournament } from '@/types/tournament';

describe('TournamentRepository', () => {
    beforeEach(async () => {
        await db.tournaments.clear();
    });

    it('should save and retrieve a tournament', async () => {
        const tournament: Tournament = {
            name: 'Weekly Poker',
            startDate: new Date(),
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const id = await TournamentRepository.save(tournament);
        expect(id).toBeDefined();

        const retrieved = await TournamentRepository.getById(id);
        expect(retrieved).toBeDefined();
        expect(retrieved?.name).toBe('Weekly Poker');
        expect(retrieved?.status).toBe('active');
        expect(retrieved?.id).toBe(id);
    });

    it('should retrieve all tournaments', async () => {
        const t1: Tournament = {
            name: 'T1',
            startDate: new Date(),
            status: 'completed',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const t2: Tournament = {
            name: 'T2',
            startDate: new Date(),
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await TournamentRepository.save(t1);
        await TournamentRepository.save(t2);

        const all = await TournamentRepository.getAll();
        expect(all).toHaveLength(2);
    });

    it('should update an existing tournament', async () => {
        const tournament: Tournament = {
            name: 'Original Name',
            startDate: new Date(),
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const id = await TournamentRepository.save(tournament);

        const toUpdate = await TournamentRepository.getById(id);
        if (!toUpdate) throw new Error('Tournament not found');

        toUpdate.name = 'Updated Name';
        await TournamentRepository.save(toUpdate);

        const updated = await TournamentRepository.getById(id);
        expect(updated?.name).toBe('Updated Name');
    });

    it('should delete a tournament', async () => {
        const tournament: Tournament = {
            name: 'To Delete',
            startDate: new Date(),
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const id = await TournamentRepository.save(tournament);

        await TournamentRepository.delete(id);

        const deleted = await TournamentRepository.getById(id);
        expect(deleted).toBeUndefined();
    });
});
