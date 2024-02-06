import { z } from "zod"
import { ZLocation } from "./ZLocation"
import { Optional, DeepPartial } from "utility-types"

export const ZProductionCycle = z.object({
  _id: z.string(),
  locationId: z.union([z.string(), ZLocation]),
  createdAt: z.date(),
  endAt: z.date(),
})

export type T_ProductionCycle = z.infer<typeof ZProductionCycle>
export type T_ProductionCycleCreate = Optional<
  T_ProductionCycle,
  "createdAt" | "endAt" | "_id"
>
export type T_ProductionCycleFilter = DeepPartial<T_ProductionCycle>
