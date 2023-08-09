import z from "zod"
import { BackendResponse, LoginZodSchema } from "zod-schema"

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
//stores
type Email = {
  email: string
}
type Action = {
  updateEmail: (email: Email["email"]) => void
}

export type T_LOGIN = z.input<typeof LoginZodSchema>
export type T_LOGOUT = { token: string }
export type T_BACKEND_RESPONSE = z.input<typeof BackendResponse>

export type T_SESSION_ACTIONS = {
  update: (session: T_SESSION) => void
  reset: () => void
}
