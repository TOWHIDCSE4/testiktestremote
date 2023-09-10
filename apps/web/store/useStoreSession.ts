import { T_Session } from "custom-validator"
import { create } from "zustand"

type T_SessionActions = {
  update: (session: T_Session) => void
  reset: () => void
}

const useStoreSession = create<T_Session & T_SessionActions>((set) => ({
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
