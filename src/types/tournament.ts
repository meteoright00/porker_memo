import { z } from 'zod';

export const TournamentStatusSchema = z.enum(['pending', 'active', 'completed']);
export type TournamentStatus = z.infer<typeof TournamentStatusSchema>;

export const StructureItemSchema = z.object({
    sb: z.number(),
    bb: z.number(),
    ante: z.number().optional(),
    duration: z.number(),
    isBreak: z.boolean().optional(),
    label: z.string().optional(),
});

export type StructureItem = z.infer<typeof StructureItemSchema>;

export const TournamentSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Name is required"),
    startChips: z.number().default(30000),
    startDate: z.date(),
    status: TournamentStatusSchema.default('active'),
    structure: z.array(StructureItemSchema).optional(),
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
