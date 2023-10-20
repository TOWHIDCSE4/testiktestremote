import { Server, Socket } from "socket.io"
import { Secret, verify } from "jsonwebtoken"
import { keys } from "../config/keys"
import Users from "../models/users"

export default function chatSocket(io: Server) {
  io.on("connection", async (socket: Socket) => {
    const auth = socket.handshake.query.authorization
    const token =
      auth && !!auth?.length ? (auth as string).split(" ")[1] : undefined

    if (!token) socket.disconnect()

    const { email }: any = verify(token as string, keys.signKey as Secret)

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
          io.emit(`timer-${timerId}`, { action: "update-operator", user: user })
        }
      }
    })

    socket.on("event", (message: any) => {
      // Handle chat message logic here (e.g., save to a database)
      io.emit("event", { ...message, from: "server" }) // Broadcast the message to all clients
    })

    socket.on("disconnect", () => {
      console.log("User disconnected")
    })
  })
}
