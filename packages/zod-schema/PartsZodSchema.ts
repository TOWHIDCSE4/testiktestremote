import { z } from "zod"

const PartsZodSchema = z.object({
  name: z.string().min(3),
  factoryId: z.string().min(23),
  machineClassId: z.string().min(23),
  files: z.string().array().nullable(),
  punds: z.string().min(1),
  finishGoodWeight: z.boolean(),
  cageWeightActual: z.string().min(1),
  cageWeightScrap: z.string().min(1),
  locationId: z.string().min(23),
})

export default PartsZodSchema
