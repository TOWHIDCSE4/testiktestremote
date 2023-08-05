import { z } from "zod"

const UserZodSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  userType: z.enum(["Admin", "Student", "School"]),
})

export default UserZodSchema
