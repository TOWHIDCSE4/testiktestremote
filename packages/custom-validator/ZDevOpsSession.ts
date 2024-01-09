import { z } from "zod"

export const ZDevOpsSession = z.object({
  noOfAlerts: z.number(),
  name: z.string().min(3),
  _id: z.string().optional(),
  duration: z.number().optional(),
  noOfTimers: z.number().optional(),
  date: z.date().nullable().optional(),
  createdAt: z.date().nullable().optional(),
  endTime: z.union([z.string(), z.date()]).optional(),
})

export type T_DevOpsSession = z.infer<typeof ZDevOpsSession>
