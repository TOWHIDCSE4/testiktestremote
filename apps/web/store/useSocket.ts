import { Socket, io } from "socket.io-client"
import { create } from "zustand"
import { combine } from "zustand/middleware"
import { API_URL } from "../helpers/constants"

const InitialState = {
  instance: undefined as Socket | undefined,
}

export const useSocket = create(
  combine(InitialState, (set, get) => ({
    setInstance: ({ token }: { token: string }) => {
      const storeInstance = get().instance

      if (storeInstance) return

      const url = `${API_URL}?authorization=Bearer ${token}`
      const socket = io(url, { transports: ["websocket"] })

      socket.on("connect", () => console.log("Socket Connected"))
      socket.on("disconnect", () => console.log("Socket Disconnected"))
      socket.on("connect_failed", () => {
        socket.close()
        set((state) => ({ ...state, instance: undefined }))
      })

      return set((state) => ({ ...state, instance: socket }))
    },
  }))
)
