import { z } from "zod"

const BackendResponseZodSchema = z.object({
  error: z.boolean(),
  message: z.nullable(z.string()),
  item: z.nullable(z.union([z.record(z.any()), z.any().array()])),
  itemCount: z.nullable(z.number()),
})

export default BackendResponseZodSchema
