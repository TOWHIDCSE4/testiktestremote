import { Server, Socket } from "socket.io"
import { Secret, verify } from "jsonwebtoken"
import { keys } from "../config/keys"
import Users from "../models/users"
import { ioEmit } from "../config/setup-socket"

export default function chatSocket(io: Server) {
  io.on("connection", async (socket: Socket) => {
    const auth = socket.handshake.query.authorization
    const token =
      auth && !!auth?.length ? (auth as string).split(" ")[1] : undefined

    if (!token) socket.disconnect()

    const { email }: any = verify(token as string, keys.signKey as Secret, {
      ignoreExpiration: true,
    })

    const user = await Users.findOne({ email })
    if (!user) socket.disconnect()
    //@ts-expect-error
    socket["user"] = user

    console.log("User connected")
    socket.on("join-timer", (data: any) => {
      console.log(data)
      if (data.action == "emit-operator") {
        const { action, timerId, ...rest } = data
        if (timerId) {
          ioEmit(`timer-${timerId}`, { action: "update-operator", user: user })
        }
      }
    })

    socket.on("event", (message: any) => {
      // Handle chat message logic here (e.g., save to a database)
      ioEmit("event", { ...message, from: "server" }) // Broadcast the message to all clients
    })

    socket.on(
      "stop-press",
      (data: {
        action: string
        timerId: string
        message?: string
        currentUnit: number
      }) => {
        // Handle chat message logic here (e.g., save to a database)
        const { timerId } = data
        if (!timerId) {
          return ""
        }
        ioEmit(`timer-${timerId}`, data)
      }
    )

    socket.on(
      "change-job",
      (data: { action: string; timerId: string; message?: string }) => {
        // Handle chat message logic here (e.g., save to a database)
        const { timerId } = data
        if (!timerId) {
          return ""
        }
        ioEmit(`timer-${timerId}`, data)
      }
    )

    socket.on(
      "cycle-tick",
      (data: { action: string; timerId: string; second: number }) => {
        const { timerId } = data
        if (!timerId) {
          return
        }
        ioEmit(`timer-${timerId}`, data)
      }
    )

    socket.on(
      "end-controller-pressed",
      (data: { action: string; timerId: string }) => {
        const { timerId } = data
        if (!timerId) {
          return
        }
        ioEmit(`timer-${timerId}`, data)
      }
    )

    socket.on(
      "end-production-pressed",
      (data: { action: string; timerId: string }) => {
        const { timerId } = data
        if (!timerId) {
          return
        }
        ioEmit(`timer-${timerId}`, data)
      }
    )

    socket.on("disconnect", () => {
      console.log("User disconnected")
    })
  })
}
