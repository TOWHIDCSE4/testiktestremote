import { z } from "zod"

export const ZMachineClass = z.object({
  _id: z.string().optional(),
  name: z.string().min(2),
  rowNumber: z.number().int().min(1),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
})

export type T_MachineClass = z.infer<typeof ZMachineClass>
