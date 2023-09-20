import { Server, Socket } from "socket.io"
import { createServer, Server as HttpServer } from "http"
import { Application } from "express"
import chatSocket from "../sockets/socket-event-handlers" // Import the chatSocket handler

let io: Server
let httpServer: HttpServer

export function setupSocket(expressApp: Application) {
  httpServer = createServer(expressApp)
  io = new Server(httpServer)

  chatSocket(io)

  return httpServer
}

export function getIo(): Server {
  return io
}