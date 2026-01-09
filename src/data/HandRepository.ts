import { db } from './db';
import { HandRecord, HandRecordSchema, FilterCriteria } from '@/types/hand';

export class HandRepository {
    static async save(hand: HandRecord | Omit<HandRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
        const now = new Date();

        if ('id' in hand && hand.id !== undefined) {
            // Update
            const existing = await db.hands.get(hand.id);

            const toSave: HandRecord = {
                ...existing, // defaults (handle undefined if existing is missing)
                ...hand,     // overrides
                updatedAt: now,
                // If existing is found, use its createdAt. If handled passed one, use it. Else now.
                createdAt: (hand as HandRecord).createdAt || existing?.createdAt || now,
            } as HandRecord;

            // Validation
            HandRecordSchema.parse(toSave);

            await db.hands.put(toSave);
            return hand.id;
        } else {
            // Create
            const newRecord: HandRecord = {
                ...hand,
                createdAt: now,
                updatedAt: now,
            } as HandRecord;

            // Validation
            HandRecordSchema.parse(newRecord);

            const id = await db.hands.add(newRecord) as number;
            return id;
        }
    }

    static async getById(id: number): Promise<HandRecord | undefined> {
        return await db.hands.get(id);
    }

    static async delete(id: number): Promise<void> {
        await db.hands.delete(id);
    }

    static async getAll(): Promise<HandRecord[]> {
        return await db.hands.toArray();
    }

    static async query(criteria: FilterCriteria): Promise<HandRecord[]> {
        let collection = db.hands.toCollection();

        if (criteria.startDate || criteria.endDate) {
            collection = collection.filter(hand => {
                let matches = true;
                if (criteria.startDate) {
                    matches = matches && hand.date >= criteria.startDate;
                }
                if (criteria.endDate) {
                    // Include the end date fully (up to end of day if needed, but here assuming strict comparison)
                    // Usually end date in filters implies inclusive.
                    // For now strict comparison to simplified logic.
                    // If user selects "Jan 1" to "Jan 31", simplified inputs usually are Date objects at 00:00.
                    // So we probably want date <= endDate (inclusive).
                    matches = matches && hand.date <= criteria.endDate;
                }
                return matches;
            });
        }

        if (criteria.tags && criteria.tags.length > 0) {
            collection = collection.filter(hand => {
                if (!hand.tags) return false;
                // Check if ALL selected tags are present (AND logic)
                return criteria.tags!.every(tag => hand.tags.includes(tag));
            });
        }

        return await collection.toArray();
    }

    static async getUniqueTags(): Promise<string[]> {
        const hands = await db.hands.toArray();
        const tagSet = new Set<string>();
        hands.forEach(hand => {
            if (hand.tags) {
                hand.tags.forEach(tag => tagSet.add(tag));
            }
        });
        return Array.from(tagSet).sort();
    }
}
