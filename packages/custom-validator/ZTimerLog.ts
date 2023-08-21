import { z } from "zod"
import { ZUser } from "./ZUser"

export const ZTimerLogStatus = z.enum(["Gain", "Loss"])

export const ZTimerStopReason = z.enum([
  "Machine Error",
  "Machine Low",
  "Worker Break",
  "Maintenance",
  "Change Part",
])

export const ZTimerLog = z.object({
  _id: z.string().optional(),
  cycleId: z.number().int().positive(),
  partId: z.string().min(23),
  timerId: z.string().min(23),
  time: z.number().int().positive(),
  operator: z.union([z.string(), ZUser]),
  status: ZTimerLogStatus,
  stopReason: z.array(ZTimerStopReason),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
})

export type T_TimerLog = z.infer<typeof ZTimerLog>
export type T_TimerLogStatus = z.infer<typeof ZTimerLogStatus>
export type T_TimerStopReason = z.infer<typeof ZTimerStopReason>
