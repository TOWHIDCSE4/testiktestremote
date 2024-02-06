import { z } from "zod"

export const ZDeviceType = z.object({
  _id: z.string(),
  name: z.string(),
  image: z.string(),
  createdAt: z.union([z.string(), z.date()]).transform((val) => {
    if (typeof val === "string") {
      return new Date(val)
    }
    return val
  }),
})

export const ZCreateDeviceType = ZDeviceType.omit({ _id: true }).partial({
  createdAt: true,
})

export type T_DeviceType = z.infer<typeof ZDeviceType>
export type T_CreateDeviceType = z.infer<typeof ZCreateDeviceType>
