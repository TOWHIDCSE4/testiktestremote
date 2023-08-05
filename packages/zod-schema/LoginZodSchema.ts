import { z } from "zod"

const LoginZodSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export default LoginZodSchema
