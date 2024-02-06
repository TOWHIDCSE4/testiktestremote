import Cookies from "js-cookie"
import { io, Socket } from "socket.io-client"
import { NEXT_PUBLIC_API_URL } from "./constants"

let socket: Socket

export const initializeSocket = () => {
  try {
    const token = Cookies.get("tfl")

    const url = `${NEXT_PUBLIC_API_URL}?authorization=Bearer ${token}`

    socket = io(url, { transports: ["websocket"] })

    socket.on("connect", () => {
      console.log("Connected to Socket.io server")
    })

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.io server")
    })

    return socket
  } catch (error) {
    console.log("🚀 ~ file: socket.ts:25 ~ initializeSocket ~ error:", error)
  }
}
