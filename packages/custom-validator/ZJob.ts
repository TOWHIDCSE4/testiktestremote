import { z } from "zod"
import { ZMachine } from "./ZMachine"
import { ZUser } from "./ZUser"
import { ZLocation } from "./ZLocation"
import { ZFactory } from "./ZFactory"
import { ZPart } from "./ZPart"
import { ZMachineClass } from "./ZMachineClass"
import { ZTimer } from "./ZTimer"
import { ZTimerLogStatus, ZTimerStopReason } from "./ZTimerLog"

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
  userId: z.union([z.string(), ZUser]).optional(),
  name: z.string().optional(),
  locationId: z.union([z.string(), ZLocation]),
  machineClassId: z.union([z.string(), ZMachineClass]),
  factoryId: z.union([z.string(), ZFactory]).optional(),
  partId: z.union([ZPart, z.string()]),
  part: ZPart.optional(),
  factory: ZPart.optional(),
  user: ZUser.optional(),
  timerLogs: z
    .array(
      z.object({
        _id: z.string().optional(),
        cycle: z.number().positive(),
        globalCycle: z.number().positive().optional(),
        locationId: z.union([z.string(), ZLocation]),
        factoryId: z.union([z.string(), ZFactory]),
        machineId: z.union([z.string(), ZMachine]),
        machineClassId: z.union([z.string(), ZMachineClass]),
        partId: z.union([z.string(), ZPart]),
        timerId: z.union([z.string(), ZTimer]),
        time: z.number().positive(),
        operator: z.union([z.string(), ZUser]),
        status: ZTimerLogStatus,
        stopReason: z.array(ZTimerStopReason),
        createdAt: z.date().nullable().optional(),
        updatedAt: z.date().nullable().optional(),
        deletedAt: z.date().nullable().optional(),
      })
    )
    .optional(),
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

export type T_Job = z.infer<typeof ZJob>
export type T_JobStatus = z.infer<typeof ZJobStatus>
export type T_JobPriorityStatus = z.infer<typeof ZJobPriorityStatus>
