import { Server, Socket } from "socket.io"
import { getIo } from "../config/setup-socket"

// Helper function to send a message to a specific user
export function sendMessageToUser(userId: string, message: any) {
  const io = getIo()
  const userSocket = findUserSocket(io, userId)
  if (userSocket) {
    userSocket.emit("event", message)
  }
}

// Helper function to broadcast a message to all connected clients
export function broadcastMessage(message: any) {
  const io = getIo()
  io.emit("event", message)
}

// Helper function to find a socket by user ID
function findUserSocket(io: Server, userId: string): Socket | null {
  const connectedSockets = Array.from(io.sockets.sockets.values())
  for (const socket of connectedSockets) {
    //@ts-expect-error
    if (socket.user && socket.user._id.toString() === userId) {
      return socket
    }
  }
  return null
}
