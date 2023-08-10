import z from "zod"
import {
  BackendResponseZodSchema,
  LoginZodSchema,
  UserBasicForEdit,
} from "zod-schema"

export interface I_User {
  id?: number
  firstName?: string
  lastName?: string
  role?: string
  location?: string
  email: string
  password: string
  profile: object
  createdAt?: string
  deletedAt?: string
  updatedAt?: string
}

export interface I_UserUpdate {
  id?: string
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  createdAt?: string
  deletedAt?: string
  updatedAt?: string
}

export interface I_Part {
  name: string
  factoryId: string
  machineClassId: string
  pounds: number
  time: number
  finishGoodWeight: number
  cageWeightActual: number
  cageWeightScrap: number
  locationId: string
}

export interface I_FACTORY {
  _id: string
  name: string
}
//stores
type Email = {
  email: string
}
type Action = {
  updateEmail: (email: Email["email"]) => void
}

export type T_LOGIN = z.input<typeof LoginZodSchema>
export type T_LOGOUT = { token: string }
export type T_BACKEND_RESPONSE = z.input<typeof BackendResponseZodSchema>
export type T_USER_FOR_EDIT = z.input<typeof UserBasicForEdit>

export type T_SESSION_ACTIONS = {
  update: (session: T_SESSION) => void
  reset: () => void
}
