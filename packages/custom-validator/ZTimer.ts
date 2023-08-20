import { z } from "zod"
import { ZPart } from "./ZPart"
import { ZMachine } from "./ZMachine"
import { ZUser } from "./ZUser"

export const ZTimer = z.object({
  _id: z.string().optional(),
  parts: ZPart.array().optional(),
  factoryId: z.string().min(23),
  machineId: z.union([z.string(), ZMachine]),
  machineClassId: z.string().min(23),
  partId: z.union([z.string(), ZPart]),
  locationId: z.string().min(23),
  operator: z.string().min(23).optional(),
  createdBy: z.union([z.string(), ZUser]),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
})

export type T_Timer = z.infer<typeof ZTimer>
