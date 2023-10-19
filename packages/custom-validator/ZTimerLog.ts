import { z } from "zod"
import { ZUser } from "./ZUser"
import { ZMachine } from "./ZMachine"
import { ZPart } from "./ZPart"
import { ZTimer } from "./ZTimer"
import { ZJob } from "./ZJob"
import { ZMachineClass } from "./ZMachineClass"
import { ZLocation } from "./ZLocation"
import { ZFactory } from "./ZFactory"

export const ZTimerLogStatus = z.enum(["Gain", "Loss"])

export const ZTimerStopReason = z.enum([
  "Unit Created",
  "Machine Error",
  "Material Low",
  "Worker Break",
  "Maintenance",
  "Change Part",
  "Production Ended",
])

export const ZTimerLog = z.object({
  _id: z.string().optional(),
  cycle: z.number().positive(),
  globalCycle: z.number().positive().optional(),
  locationId: z.union([z.string(), ZLocation]),
  factoryId: z.union([z.string(), ZFactory]),
  machineId: z.union([z.string(), ZMachine]),
  machineClassId: z.union([z.string(), ZMachineClass]),
  jobId: z.union([z.string(), ZJob]).nullable(),
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

export const ZTimerLogCount = z.object({
  count: z.number(),
})

export type T_TimerLogCount = z.infer<typeof ZTimerLogCount>
export type T_TimerLog = z.infer<typeof ZTimerLog>
export type T_TimerLogStatus = z.infer<typeof ZTimerLogStatus>
export type T_TimerStopReason = z.infer<typeof ZTimerStopReason>
