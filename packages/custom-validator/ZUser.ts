import { z } from "zod"
import { ZLocation } from "./ZLocation"
import { ZFactory } from "./ZFactory"

export const ZUserRoles = z.enum([
  "Administrator",
  "Corporate",
  "Production",
  "Personnel",
  "HR",
  "Accounting",
  "Sales",
  "Super",
])

export const ZUserStatus = z.enum([
  "Approved",
  "Rejected",
  "Archived",
  "Blocked",
  "Pending",
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
  isGlobalFactory: z.boolean().optional(),
  locationId: z.union([z.string(), ZLocation]),
  factoryId: z.union([z.string(), ZFactory]).nullable().optional(),
  profile: ZUserProfile.nullable().optional(),
  approvedBy: z.string().optional(),
  status: ZUserStatus,
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
export type T_UserStatus = z.infer<typeof ZUserStatus>
export type T_UserRole = z.infer<typeof ZUserRoles>
export type T_UserBasic = z.infer<typeof ZUserBasic>
export type T_UserProfile = z.infer<typeof ZUserProfile>
export type T_UserPassword = z.infer<typeof ZUserPassword>
