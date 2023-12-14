import { Socket, io } from "socket.io-client"
import { create } from "zustand"
import { combine } from "zustand/middleware"
import { API_URL } from "../helpers/constants"
import * as Sentry from "@sentry/nextjs"

const InitialState = {
  instance: undefined as Socket | undefined,
  isConnected: false,
}

export const useSocket = create(
  combine(InitialState, (set, get) => ({
    setInstance: ({ token }: { token: string }) => {
      const storeInstance = get().instance

      if (storeInstance) return

      const url = `${API_URL}?authorization=Bearer ${token}`
      const socket = io(url, { transports: ["websocket"] })
      let reconnectInterval: any = null

      const stopReconnectInterval = () => {
        clearInterval(reconnectInterval)
      }
      const initReconnect = () => {
        stopReconnectInterval()
        reconnectInterval = setInterval(() => {
          if (socket.connected) {
            stopReconnectInterval()
            return
          }
          socket.connect()
        }, 500)
      }
      socket.on("connect", () => {
        stopReconnectInterval()
        set((state) => ({ ...state, isConnected: true }))
        console.log("Socket connected")
      })
      socket.on("disconnect", () => {
        set((state) => ({ ...state, isConnected: false }))
        initReconnect()
        console.log("Socket Disconnection")
      })
      socket.io.on("reconnect_attempt", () => {
        console.log("Socket Atempt to reconnect")
      })
      socket.io.on("reconnect_error", () => {
        set((state) => ({ ...state, isConnected: false }))
        console.log("Error while trying to reconnect")
        initReconnect()
      })
      socket.io.on("reconnect", () => {
        set((state) => ({ ...state, isConnected: true }))
        stopReconnectInterval()
        console.log("Socket Reconnected")
      })
      socket.io.on("reconnect_failed", () => {
        set((state) => ({ ...state, isConnected: false }))
        console.log("Socket Error while trying to reconnect")
      })
      socket.on("connect_error", () => {
        set((state) => ({ ...state, isConnected: false }))
        initReconnect()
        Sentry.captureException("Warn: Connect Error Happened on Socket", {
          level: "warning",
        })
      })

      return set((state) => ({ ...state, instance: socket }))
    },
  }))
)
