import { z } from "zod"

const PartsZodSchema = z.object({
  name: z.string().min(3),
  factoryId: z.string().min(23),
  machineClassId: z.string().min(23),
  files: z.string().array().nullable(),
  punds: z.string().min(1),
  time: z.number(),
  finishGoodWeight: z.number(),
  cageWeightActual: z.number(),
  cageWeightScrap: z.number(),
  locationId: z.string().min(23),
})

export default PartsZodSchema
