import { z } from "zod"

export const ZUserRoles = z.enum([
  "Administrator",
  "Corporate",
  "Production",
  "Personnel",
])

export const ZUserProfile = z.object({
  photo: z.string(),
  profileName: z.string(),
  aboutYou: z.string(),
  realNameDisplay: z.boolean(),
  everyoneSeeProfile: z.boolean(),
  newsletter: z.boolean(),
  newContentReleases: z.boolean(),
  productUpdate: z.boolean(),
  emailsFromTeam: z.boolean(),
  contentSuggestion: z.boolean(),
})

export const ZUser = z.object({
  _id: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  role: ZUserRoles,
  email: z.string().email(),
  password: z.string().min(8),
  location: z.string(),
  profile: ZUserProfile.nullable(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().optional(),
})

export const ZUserBasic = ZUser.pick({
  _id: true,
  firstName: true,
  lastName: true,
  email: true,
  location: true,
})

export const ZUserPassword = ZUser.pick({
  _id: true,
  password: true,
})

export type T_User = z.infer<typeof ZUser>
export type T_User_Role = z.infer<typeof ZUserRoles>
export type T_User_Basic = z.infer<typeof ZUserBasic>
export type T_User_Profile = z.infer<typeof ZUserProfile>
export type T_User_Password = z.infer<typeof ZUserPassword>
