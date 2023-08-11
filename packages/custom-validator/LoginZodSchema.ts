import { z } from "zod"

const LoginZodSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export default LoginZodSchema
