import { z } from "zod"
import { ZDevice } from "./ZDevice"
import { ZUser } from "./ZUser"

export const ZDeviceLog = z.object({
  _id: z.string(),
  deviceId: z.union([z.string(), ZDevice]),
  userId: z.union([z.string(), ZUser]),
  note: z.string().optional(),
  type: z.enum(["danger", "warning", "info"]),
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

export type T_DeviceLog = z.infer<typeof ZDeviceLog>
