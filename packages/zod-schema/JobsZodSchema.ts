import { z } from "zod"

const JobsZodSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(3),
  factoryId: z.object({}),
  isActive: z.boolean(),
  machineId: z.object({}),
})

export default JobsZodSchema
