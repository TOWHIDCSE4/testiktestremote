import { z } from "zod"

const TimerReadingsZodSchema = z.object({
  action: z.string().min(3),
  timerId: z.string().min(23),
})

export default TimerReadingsZodSchema
