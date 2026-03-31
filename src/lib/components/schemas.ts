import { z } from "zod/v4";

export const team = z.object({
	name: z.string(),
	city: z.string(),
});

export const match = z.object({
	id: z.string().optional(),
	teamA: z.string(),
	teamB: z.string(),
	referee: z.string(),
	scoreA: z.number(),
	scoreB: z.number(),
	court: z.number(),
	phase: z.string(),
});

export type Team = z.infer<typeof team>;
export type Match = z.infer<typeof match>;
