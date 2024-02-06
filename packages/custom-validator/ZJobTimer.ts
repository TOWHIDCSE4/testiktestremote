import { z } from "zod"

export const ZJobTimer = z.object({
  _id: z.string().optional(),
  timerId: z.string(),
  jobId: z.string(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
})

export type T_JobTimer = z.infer<typeof ZJobTimer>
