import { z } from "zod"

export const ZLogin = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type T_Login = z.infer<typeof ZLogin>
