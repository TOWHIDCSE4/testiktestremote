import { z } from "zod"

export const ZMachine = z.object({
  _id: z.object({}).optional(),
  name: z.string().min(3),
  factoryId: z.string().min(23),
  machineClassId: z.string().min(23),
  files: z.string().array().nullable(),
  description: z.string().min(3),
  locationId: z.string().min(23),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
})

export type T_Machine = z.infer<typeof ZMachine>
