import { z } from "zod"

const UserZodSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(["Administrator", "Corporate", "Production", "Personnel"]),
  email: z.string().email(),
  password: z.string().min(8),
  location: z.string(),
  profile: z.union([
    z
      .object({
        photo_url: z.string(),
        profileName: z.string(),
        aboutYou: z.string(),
        realNameDisplay: z.boolean(),
        allEveryOneSeeProfile: z.boolean(),
      })
      .nullable(),
    z.string(),
  ]),
})

export default UserZodSchema
