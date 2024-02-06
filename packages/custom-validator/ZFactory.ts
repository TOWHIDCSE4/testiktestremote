import { z } from "zod"

export const ZFactory = z.object({
  _id: z.string().optional(),
  name: z.string().min(2),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
})

export type T_Factory = z.infer<typeof ZFactory>
