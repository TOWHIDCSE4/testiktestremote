import { Server, Socket } from "socket.io"
import { createServer, Server as HttpServer } from "http"
import { Application } from "express"
import chatSocket from "../sockets/socket-event-handlers" // Import the chatSocket handler

let io: Server
let httpServer: HttpServer

export function setupSocket(expressApp: Application) {
  httpServer = createServer(expressApp)
  io = new Server(httpServer, {
    connectionStateRecovery: {
      // the backup duration of the sessions and the packets
      maxDisconnectionDuration: 2 * 60 * 1000,
      // whether to skip middlewares upon successful recovery
      skipMiddlewares: true,
    },
  })

  chatSocket(io)

  return httpServer
}

export async function ioEmit(topic: string, message: any) {
  const sockets = await io.fetchSockets()
  sockets.forEach((s) => {
    s.emit(topic, {
      ...message,
      socketId: s.id,
    })
  })
}

export function getIo(): Server {
  return io
}
