import { z } from "zod"
import { ZMachine } from "./ZMachine"

export const ZJobStatus = z.enum([
  "Pending",
  "Active",
  "Testing",
  "Archived",
  "Deleted",
])

export const ZJobPriorityStatus = z.enum(["High", "Medium", "Low"])

export const ZJob = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  name: z.string().min(2),
  locationId: z.string(),
  factoryId: z.string(),
  partId: z.string(),
  machine: ZMachine,
  status: ZJobStatus,
  drawingNumber: z.string(),
  count: z.number().int().positive().optional(),
  dueDate: z.date().nullable(),
  isStock: z.boolean().optional(),
  priorityStatus: ZJobPriorityStatus.optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
})

export type T_Job = z.infer<typeof ZJob>
export type T_JobStatus = z.infer<typeof ZJobStatus>
export type T_JobPriorityStatus = z.infer<typeof ZJobPriorityStatus>
