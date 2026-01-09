import { HandRepository } from '../data/HandRepository';

export class DataManagementService {
    static async exportData(): Promise<string> {
        const hands = await HandRepository.getAll();
        return JSON.stringify(hands, null, 2);
    }

    static async importData(json: string): Promise<void> {
        const hands = JSON.parse(json);
        for (const hand of hands) {
            // Restore Date objects
            const record = {
                ...hand,
                date: new Date(hand.date),
                createdAt: new Date(hand.createdAt),
                updatedAt: new Date(hand.updatedAt)
            };
            await HandRepository.save(record);
        }
    }
}
