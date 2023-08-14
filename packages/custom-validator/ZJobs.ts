import { z } from "zod"

export const ZJobs = z.object({
  _id: z.object({}).optional(),
  name: z.string().min(2),
  description: z.string().min(3),
  factoryId: z.object({}),
  isActive: z.boolean(),
  machineId: z.object({}),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
})

export type T_Jobs = z.infer<typeof ZJobs>
