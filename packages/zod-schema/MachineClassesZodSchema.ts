import { z } from "zod"

const MachineClassesZodSchema = z.object({
  name: z.string().min(2),
})

export default MachineClassesZodSchema
