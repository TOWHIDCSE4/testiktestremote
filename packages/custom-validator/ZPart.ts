import { z } from "zod"

export const ZPart = z.object({
  _id: z.string().optional(),
  name: z.string().min(3),
  factoryId: z.string().min(23),
  machineClassId: z.string().min(23),
  files: z.string().array().nullable(),
  pounds: z.number(),
  time: z.number(),
  finishGoodWeight: z.number(),
  cageWeightActual: z.number(),
  cageWeightScrap: z.number(),
  locationId: z.string().min(23),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().optional(),
})

export type T_Part = z.infer<typeof ZPart>
