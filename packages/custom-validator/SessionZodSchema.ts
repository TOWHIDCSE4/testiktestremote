import { z } from "zod"
import { ZUserRoles } from "./ZUser"

const SessionZodSchema = z.object({
  token: z.nullable(z.string()),
  role: ZUserRoles,
  email: z.string(),
})

export default SessionZodSchema
