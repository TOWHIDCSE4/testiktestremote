import { create } from "zustand"
import { Email } from "../types/global"

const useEmail = create((set) => ({
  email: "",
  updateEmail: (email: Email["email"]) => set(() => ({ email: email })),
}))

export default useEmail
