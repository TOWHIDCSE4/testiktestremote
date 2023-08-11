import { z } from "zod"

const FactoriesZodSchema = z.object({
  name: z.string().min(2),
})

export default FactoriesZodSchema
