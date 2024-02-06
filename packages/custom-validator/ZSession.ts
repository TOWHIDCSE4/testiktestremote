import { z } from "zod"
import { ZUserRoles } from "./ZUser"

export const ZSession = z.object({
  token: z.nullable(z.string()),
  role: ZUserRoles,
  email: z.string(),
})

export type T_Session = z.infer<typeof ZSession>
