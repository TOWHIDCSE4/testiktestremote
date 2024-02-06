import { z } from "zod"

export const ZBackendResponse = z.object({
  error: z.boolean(),
  message: z.nullable(z.union([z.string(), z.string().array()])),
  item: z.record(z.any()).optional(),
  items: z.any().array().optional(),
  itemCount: z.number().optional(),
  data: z.record(z.any()).optional(),
})

export type T_BackendResponse = z.infer<typeof ZBackendResponse>
