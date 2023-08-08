import { SessionZodSchema } from "zod-schema"
import { T_SESSION_ACTIONS } from "../types/global"
import { create } from "zustand"
import z from "zod"

type T_SESSION = z.input<typeof SessionZodSchema>

const useStoreSession = create<T_SESSION & T_SESSION_ACTIONS>((set) => ({
  token: null,
  role: "Personnel",
  email: "",
  update: (session: T_SESSION) => set(() => ({ ...session })),
  reset: () =>
    set((session) => ({
      ...session,
      token: null,
      role: "Personnel",
      email: "",
    })),
}))

export default useStoreSession
