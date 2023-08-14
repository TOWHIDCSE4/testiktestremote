import { z } from "zod"

export const ZTimerReading = z.object({
  _id: z.object({}).optional(),
  action: z.string().min(3),
  timerId: z.string().min(23),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
})

export type T_TimerReading = z.infer<typeof ZTimerReading>
