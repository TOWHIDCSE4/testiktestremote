import { z } from "zod"

const TimersZodSchema = z.object({
  factoryId: z.string().min(23),
  machineId: z.string().min(23),
  partId: z.string().min(3),
})

export default TimersZodSchema
