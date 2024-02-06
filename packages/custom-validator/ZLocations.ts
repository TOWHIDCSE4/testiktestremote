import { z } from "zod"

export const ZLocations = z.object({
  _id: z.string().optional(),
  name: z.string().min(2),
})
export type T_Locations = z.infer<typeof ZLocations>
