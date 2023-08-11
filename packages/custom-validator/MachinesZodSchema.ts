import { z } from "zod"

const MachinesZodSchema = z.object({
  name: z.string().min(3),
  factoryId: z.string().min(23),
  machineClassId: z.string().min(23),
  files: z.string().array().nullable(),
  description: z.string().min(3),
  locationId: z.string().min(23),
})

export default MachinesZodSchema
