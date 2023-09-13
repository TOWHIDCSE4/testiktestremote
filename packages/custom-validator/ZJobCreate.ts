import { z } from "zod"
import { ZMachine } from "./ZMachine"
import { ZUser } from "./ZUser"
import { ZLocation } from "./ZLocation"
import { ZFactory } from "./ZFactory"
import { ZPart } from "./ZPart"

export const ZJobStatus = z.enum([
  "Pending",
  "Active",
  "Testing",
  "Archived",
  "Deleted",
])

export const ZJobPriorityStatus = z.enum(["High", "Medium", "Low"])

export const ZJobCreate = z.object({
  _id: z.string().optional(),
  userId: z.union([z.string(), ZUser]),
  name: z.string().min(2),
  locationId: z.union([z.string(), ZLocation]),
  factoryId: z.union([z.string(), ZFactory]),
  partId: z.union([ZPart, z.string()]),
  machine: ZMachine.optional(),
  status: ZJobStatus,
  drawingNumber: z.string(),
  count: z.number().int().positive().optional(),
  dueDate: z.union([z.string(), z.date()]).nullable(),
  isStock: z.boolean().optional(),
  priorityStatus: ZJobPriorityStatus.optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
})

export type T_Job = z.infer<typeof ZJobCreate>
export type T_JobStatus = z.infer<typeof ZJobStatus>
export type T_JobPriorityStatus = z.infer<typeof ZJobPriorityStatus>
