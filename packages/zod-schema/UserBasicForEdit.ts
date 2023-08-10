import { z } from "zod"

const UserBasicForEdit = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
})

export default UserBasicForEdit
