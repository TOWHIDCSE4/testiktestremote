import { z } from "zod"
import { ZDeviceType } from "./ZDeviceType"
import { ZLocation } from "./ZLocation"
import { ZUser } from "./ZUser"

export const ZDevice = z.object({
  _id: z.string(),
  name: z.string(),
  sn: z.string(),
  typeId: z.union([z.string(), ZDeviceType]),
  status: z.enum(["idle", "using", "disabled", "lost", "broken"]),
  locationId: z.union([z.string(), ZLocation]).nullable().optional(),
  userId: z.union([z.string(), ZUser]).nullable().optional(),
  lastUserId: z.union([z.string(), ZUser]).nullable().optional(),
  note: z.string().optional(),
  history: z
    .union([
      z.string(),
      z.object({
        _id: z.string(),
        userId: z.union([z.string(), ZUser]),
        approvedBy: z.union([z.string(), ZUser]).optional(),
        locationId: z.union([z.string(), ZLocation]),
        note: z.string().optional(),
        status: z.enum(["pending", "approved", "rejected", "ended"]),
        type: z.enum(["in", "out"]),
        startAt: z
          .union([z.string(), z.date()])

          .optional()
          .transform((val) => {
            if (typeof val === "string") {
              return new Date(val)
            }
            return val
          }),
      }),
    ])
    .optional(),
  addedAt: z
    .union([z.string(), z.date()])
    .transform((val) => {
      if (typeof val === "string") {
        return new Date(val)
      }
      return val
    })
    .optional(),
  lastUpdatedAt: z
    .union([z.string(), z.date()])
    .transform((val) => {
      if (typeof val === "string") {
        return new Date(val)
      }
      return val
    })
    .optional(),
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
})

export const ZCreateDevice = ZDevice.omit({ _id: true }).partial({
  createdAt: true,
  updatedAt: true,
})

export type T_Device = z.infer<typeof ZDevice>
export type T_CreateDevice = z.infer<typeof ZCreateDevice>
