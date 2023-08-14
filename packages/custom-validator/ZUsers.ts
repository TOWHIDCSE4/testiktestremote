import { z } from "zod"

export const ZUsers = z.object({
  _id: z.object({}).optional(),
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
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
})

export type T_Users = z.infer<typeof ZUsers>
