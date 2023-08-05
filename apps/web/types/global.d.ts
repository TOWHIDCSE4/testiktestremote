export interface I_User {
  id?: number
  firstName?: string
  lastName?: string
  department?: string
  location?: string
  email: string
  password: string
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
