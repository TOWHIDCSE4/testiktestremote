import { z } from "zod"

const TimerLogsZodSchema = z.object({
  partId: z.string().min(23),
  timerId: z.string().min(23),
  time: z.string().min(1),
  operator: z.string().min(3),
  status: z.string().min(3),
  stopReason: z.string().min(3),
})

export default TimerLogsZodSchema
