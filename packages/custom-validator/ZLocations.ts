import { z } from "zod"

export const ZLocations = z.object({
  _id: z.object({}).optional(),
  name: z.string().min(2),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
})

export type T_Locations = z.infer<typeof ZLocations>
