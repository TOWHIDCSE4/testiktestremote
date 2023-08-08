import { z } from "zod"

const SessionZodSchema = z.object({
  token: z.nullable(z.string()),
  role: z.enum([
    "Administrator",
    "Corporate",
    "Trout",
    "Production",
    "Personnel",
  ]),
  email: z.string(),
})

export default SessionZodSchema
