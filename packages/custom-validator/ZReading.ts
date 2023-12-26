import { z } from "zod"
import { ZTimer } from "./ZTimer"

export const ZReading = z.object({
  _id: z.string(),
  timerId: z.union([z.string(), ZTimer]),
  createdAt: z.union([z.string(), z.date()]).transform((val) => {
    if (typeof val === "string") {
      return new Date(val)
    }
    return val
  }),
  message: z.string(),
})

export const ZCreateReading = ZReading.omit({ _id: true }).partial({
  createdAt: true,
})

export type T_Reading = z.infer<typeof ZReading>
export type T_Readings = T_Reading[]
export type T_CreateReading = z.infer<typeof ZCreateReading>
export type T_ReadingOptional = Partial<T_Reading>
