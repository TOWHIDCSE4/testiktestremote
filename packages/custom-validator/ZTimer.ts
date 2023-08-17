import { z } from "zod"
import { ZPart } from "./ZPart"

export const ZTimer = z.object({
  _id: z.object({}).optional(),
  parts: ZPart.array(),
  factoryId: z.string().min(23),
  machineId: z.string().min(23),
  partId: z.string().min(23),
  locationId: z.string().min(23),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
})

export type T_Timer = z.infer<typeof ZTimer>
