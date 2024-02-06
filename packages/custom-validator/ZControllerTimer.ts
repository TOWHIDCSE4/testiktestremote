import { z } from "zod"
import { ZTimer } from "./ZTimer"
import { ZLocation } from "./ZLocation"

export const ZControllerTimer = z.object({
  _id: z.string().optional(),
  timerId: z.union([z.string(), ZTimer]),
  locationId: z.union([z.string(), ZLocation]),
  createdAt: z.date().optional(),
  endAt: z.date().nullable().optional(),
  clientStartedAt: z.any().optional(),
  additionalTime: z.number().optional(),
})

export type T_ControllerTimer = z.infer<typeof ZControllerTimer>
