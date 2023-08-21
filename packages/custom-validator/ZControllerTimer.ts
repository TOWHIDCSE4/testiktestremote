import { z } from "zod"
import { ZTimer } from "./ZTimer"

export const ZControllerTimer = z.object({
  _id: z.string().optional(),
  timerId: z.union([z.string(), ZTimer]),
  createdAt: z.date(),
  endAt: z.date().nullable().optional(),
})

export type T_ControllerTimer = z.infer<typeof ZControllerTimer>
