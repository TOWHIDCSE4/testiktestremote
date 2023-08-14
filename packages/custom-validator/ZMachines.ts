import { z } from "zod"

export const ZMachines = z.object({
  _id: z.object({}).optional(),
  name: z.string().min(3),
  factoryId: z.object({}),
  machineClassId: z.object({}),
  files: z.string().array().nullable(),
  description: z.string().min(3),
  locationId: z.object({}).optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
})

export type T_Machines = z.infer<typeof ZMachines>
