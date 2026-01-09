import Dexie, { type EntityTable } from 'dexie';
import { HandRecord } from '@/types/hand';

export const db = new Dexie('PorkerMemoDB') as Dexie & {
    hands: EntityTable<HandRecord, 'id'>;
};

// Schema definition will go here later
db.version(1).stores({
    hands: '++id, uuid, date, tags' // Preliminary schema
});
