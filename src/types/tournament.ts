import { z } from 'zod';

export const TournamentStatusSchema = z.enum(['active', 'completed']);
export type TournamentStatus = z.infer<typeof TournamentStatusSchema>;

export const TournamentSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Name is required"),
    startChips: z.number().default(30000),
    startDate: z.date(),
    status: TournamentStatusSchema.default('active'),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type Tournament = z.infer<typeof TournamentSchema>;

export const ChipRecordSchema = z.object({
    id: z.number().optional(),
    tournamentId: z.number(),
    chipCount: z.number(),
    sb: z.number(),
    bb: z.number(),
    timestamp: z.date(),
});

export type ChipRecord = z.infer<typeof ChipRecordSchema>;
