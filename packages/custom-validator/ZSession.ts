import { z } from "zod"

export const ZSession = z.object({
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

export type T_Session = z.infer<typeof ZSession>
