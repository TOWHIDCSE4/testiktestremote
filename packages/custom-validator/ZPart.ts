import { z } from "zod"

export const ZPart = z.object({
  _id: z.string().optional(),
  name: z.string().min(3),
  factoryId: z.string().min(23),
  machineClassId: z.string().min(23),
  files: z.string().array().nullable(),
  tons: z.number(),
  time: z.number(),
  finishGoodWeight: z.number().optional(),
  cageWeightActual: z.number().optional(),
  cageWeightScrap: z.number().optional(),
  locationId: z.string().min(23),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
})

export type T_Part = z.infer<typeof ZPart>
