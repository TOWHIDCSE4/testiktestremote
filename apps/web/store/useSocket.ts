import { Socket, io } from "socket.io-client"
import { create } from "zustand"
import { combine } from "zustand/middleware"
import { NEXT_PUBLIC_API_URL } from "../helpers/constants"
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

      const url = `${NEXT_PUBLIC_API_URL}?authorization=Bearer ${token}`
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
        console.log("Socket connected")
        set((state) => ({ ...state, instance: socket, isConnected: true }))
      })
      socket.on("disconnect", () => {
        initReconnect()
        console.log("Socket Disconnection")
        set((state) => ({ ...state, instance: socket, isConnected: false }))
      })
      socket.io.on("reconnect_attempt", () => {
        console.log("Socket Atempt to reconnect")
      })
      socket.io.on("reconnect_error", () => {
        console.log("Error while trying to reconnect")
        initReconnect()
        set((state) => ({ ...state, instance: socket, isConnected: false }))
      })
      socket.io.on("reconnect", () => {
        stopReconnectInterval()
        console.log("Socket Reconnected")
        set((state) => ({ ...state, instance: socket, isConnected: true }))
      })
      socket.io.on("reconnect_failed", () => {
        console.log("Socket Error while trying to reconnect")
        set((state) => ({ ...state, instance: socket, isConnected: false }))
      })
      socket.on("connect_error", () => {
        initReconnect()
        set((state) => ({ ...state, instance: socket, isConnected: false }))
        Sentry.captureException("Warn: Connect Error Happened on Socket", {
          level: "warning",
        })
      })

      return set((state) => ({ ...state, instance: socket }))
    },
  }))
)
