import { z } from "zod"
import { ZLocation } from "./ZLocation"
import { ZMachineClass } from "./ZMachineClass"

export const ZAutoTimer = z.object({
  _id: z.string(),
  locationId: z.union([z.string(), ZLocation]),
  machineClassId: z.union([z.string(), ZMachineClass]),
  timeM: z.number(),
  timeH: z.number(),
  isPM: z.boolean(),
  isActive: z.boolean(),
  createdAt: z.union([z.string(), z.date()]).transform((val) => {
    if (typeof val === "string") {
      return new Date(val)
    }
    return val
  }),
})

export const ZCreateAutoTimer = ZAutoTimer.omit({ _id: true }).partial({
  createdAt: true,
})

export type T_AutoTimer = z.infer<typeof ZAutoTimer>
export type T_CreateAutoTimer = z.infer<typeof ZCreateAutoTimer>
