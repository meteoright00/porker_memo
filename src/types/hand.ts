import { z } from 'zod';

export const ActionSchema = z.object({
    phase: z.enum(['Preflop', 'Flop', 'Turn', 'River']),
    actor: z.enum(['Hero', 'Villain']),
    type: z.enum(['Fold', 'Check', 'Call', 'Bet', 'Raise', 'All-in']),
    amount: z.string().optional(),
    position: z.string().optional(), // Added for Villain position
    isHero: z.boolean(),
});

export type Action = z.infer<typeof ActionSchema>;

export const HandRecordSchema = z.object({
    id: z.number().optional(),
    uuid: z.string().uuid(),
    date: z.date(),
    position: z.string(),
    holeCards: z.array(z.string()).length(2),
    board: z.array(z.string()).max(5),
    actions: z.array(ActionSchema),
    playerCount: z.number().min(2).max(10).optional(),
    potPercent: z.number().optional(),
    winLoss: z.enum(['Win', 'Lose', 'Chop']),
    tags: z.array(z.string()),
    note: z.string().optional(),
    tournamentId: z.number().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type HandRecord = z.infer<typeof HandRecordSchema>;

export interface FilterCriteria {
    startDate?: Date;
    endDate?: Date;
    tags?: string[];
    tournamentId?: number;
}
