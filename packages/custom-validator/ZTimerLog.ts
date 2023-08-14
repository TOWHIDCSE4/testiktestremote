import { z } from "zod"

export const ZTimerLog = z.object({
  _id: z.object({}).optional(),
  partId: z.string().min(23),
  timerId: z.string().min(23),
  time: z.string().min(1),
  operator: z.string().min(3),
  status: z.string().min(3),
  stopReason: z.string().min(3),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
})

export type T_TimerLog = z.infer<typeof ZTimerLog>
