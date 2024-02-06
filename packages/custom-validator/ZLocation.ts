import { z } from "zod"

export const ZLocation = z.object({
  _id: z.string().optional(),
  name: z.string().min(2),
  productionTime: z.number().lte(24).gt(0),
  timeZone: z.string().min(2),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
})

export type T_Location = z.infer<typeof ZLocation>
