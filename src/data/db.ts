import Dexie, { type EntityTable } from 'dexie';
import { HandRecord } from '@/types/hand';
import { Tournament, ChipRecord } from '@/types/tournament';

export const db = new Dexie('PorkerMemoDB') as Dexie & {
    hands: EntityTable<HandRecord, 'id'>;
    tournaments: EntityTable<Tournament, 'id'>;
    chipRecords: EntityTable<ChipRecord, 'id'>;
};

// Schema definition
db.version(1).stores({
    hands: '++id, uuid, date, tags'
});

db.version(2).stores({
    tournaments: '++id, name, status, startDate',
    chipRecords: '++id, tournamentId, timestamp'
});

db.version(3).stores({
    hands: '++id, uuid, date, tags, tournamentId'
});
