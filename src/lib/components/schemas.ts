import { z } from "zod/v4";

export const team = z.object({
	id: z.number(),
	name: z.string(),
	city: z.string(),
	inscription: z.string(),
	phone: z.string(),
	swiss_points: z.array(z.number()),
	bracket_points: z.array(z.number()),
});

export type Team = z.infer<typeof team>;
