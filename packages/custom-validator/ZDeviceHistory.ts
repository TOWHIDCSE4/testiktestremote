import { z } from "zod"
import { ZDevice } from "./ZDevice"
import { ZUser } from "./ZUser"
import { ZLocation } from "./ZLocation"

export const ZDeviceHistory = z.object({
  _id: z.string(),
  deviceId: z.union([z.string(), ZDevice]),
  userId: z.union([z.string(), ZUser]),
  approvedBy: z.union([z.string(), ZUser]).optional(),
  locationId: z.union([z.string(), ZLocation]),
  note: z.string().optional(),
  status: z.enum(["pending", "approved", "rejected", "ended"]),
  type: z.enum(["in", "out"]),
  active: z.boolean(),
  createdAt: z.union([z.string(), z.date()]).transform((val) => {
    if (typeof val === "string") {
      return new Date(val)
    }
    return val
  }),
  updatedAt: z.union([z.string(), z.date()]).transform((val) => {
    if (typeof val === "string") {
      return new Date(val)
    }
    return val
  }),
  startAt: z
    .union([z.string(), z.date()])
    .transform((val) => {
      if (typeof val === "string") {
        return new Date(val)
      }
      return val
    })
    .optional(),
  endAt: z
    .union([z.string(), z.date()])
    .transform((val) => {
      if (typeof val === "string") {
        return new Date(val)
      }
      return val
    })
    .optional(),
})

export const ZCreateDeviceHistory = ZDeviceHistory.omit({ _id: true }).partial({
  createdAt: true,
})

export type T_DeviceHistory = z.infer<typeof ZDeviceHistory>
export type T_CreateDeviceHistory = z.infer<typeof ZCreateDeviceHistory>
