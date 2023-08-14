import { z } from "zod"

export const ZTimer = z.object({
  _id: z.object({}).optional(),
  factoryId: z.string().min(23),
  machineId: z.string().min(23),
  partId: z.string().min(23),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
})

export type T_Timer = z.infer<typeof ZTimer>
