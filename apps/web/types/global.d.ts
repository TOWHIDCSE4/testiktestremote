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
//stores
type Email = {
  email: string
}
type Action = {
  updateEmail: (email: Email["email"]) => void
}
