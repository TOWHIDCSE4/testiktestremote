import { z } from "zod"
import { ZPart } from "./ZPart"
import { ZMachine } from "./ZMachine"
import { ZUser } from "./ZUser"
import { ZFactory } from "./ZFactory"
import { ZLocation } from "./ZLocation"

export const ZTimer = z.object({
  _id: z.string().optional(),
  parts: ZPart.array().optional(),
  factoryId: z.union([z.string(), ZFactory]),
  machine: ZMachine.optional(),
  machineId: z.union([z.string(), ZMachine]),
  machineClassId: z.string().min(23),
  partId: z.union([z.string(), ZPart]),
  locationId: z.union([z.string(), ZLocation]),
  operator: z.string().min(23).optional(),
  createdBy: z.union([z.string(), ZUser]),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
})

export type T_Timer = z.infer<typeof ZTimer>
