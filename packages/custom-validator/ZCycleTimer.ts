import { z } from "zod"
import { ZTimer } from "./ZTimer"

export const ZCycleTimer = z.object({
  _id: z.string().optional(),
  timerId: z.union([z.string(), ZTimer]),
  createdAt: z.date().optional(),
  endAt: z.date().nullable().optional(),
  clientStartedAt: z.any().optional(),
  sessionId: z.string().optional(),
})

export type T_CycleTimer = z.infer<typeof ZCycleTimer>
