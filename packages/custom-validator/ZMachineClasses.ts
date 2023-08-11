import { z } from "zod"

export const ZMachineClasses = z.object({
  _id: z.string().optional(),
  name: z.string().min(2),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().optional(),
})

export type T_MachineClasses = z.infer<typeof ZMachineClasses>
