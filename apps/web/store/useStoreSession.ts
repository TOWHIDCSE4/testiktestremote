import { T_Session } from "custom-validator"
import { T_SESSION_ACTIONS } from "../types/global"
import { create } from "zustand"
import z from "zod"

const useStoreSession = create<T_Session & T_SESSION_ACTIONS>((set) => ({
  token: null,
  role: "Personnel",
  email: "",
  update: (session: T_Session) => set(() => ({ ...session })),
  reset: () =>
    set((session) => ({
      ...session,
      token: null,
      role: "Personnel",
      email: "",
    })),
}))

export default useStoreSession
