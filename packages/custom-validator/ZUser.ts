import { z } from "zod"
import { ZLocation } from "./ZLocation"

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
  _id: z.object({}).optional(),
  firstName: z.string(),
  lastName: z.string(),
  role: ZUserRoles,
  email: z.string().email(),
  password: z.string().min(8),
  locationId: z.union([z.string(), ZLocation, z.object({})]),
  profile: ZUserProfile.nullable().optional(),
  approvedBy: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional(),
})

export const ZUserBasic = ZUser.pick({
  _id: true,
  firstName: true,
  lastName: true,
  email: true,
  locationId: true,
})

export const ZUserPassword = ZUser.pick({
  _id: true,
  password: true,
})

export type T_User = z.infer<typeof ZUser>
export type T_UserRole = z.infer<typeof ZUserRoles>
export type T_UserBasic = z.infer<typeof ZUserBasic>
export type T_UserProfile = z.infer<typeof ZUserProfile>
export type T_UserPassword = z.infer<typeof ZUserPassword>
