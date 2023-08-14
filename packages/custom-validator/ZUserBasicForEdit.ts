import { z } from "zod"

export const UserBasicForEdit = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
})

export type T_UserBasicForEdit = z.infer<typeof UserBasicForEdit>
