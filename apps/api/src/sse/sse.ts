import { Request, Response } from "express"
import crypto from "crypto"
import { ioEmit } from "../config/setup-socket"

interface SSEClient {
  id: string
  res: Response
}

interface ControllerTimerEvent {
  timerId: string
  message: string
}
const clients: SSEClient[] = []

export const sseController = (req: Request, res: Response) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Content-Encoding": "none",
    Connection: "keep-alive",
    "Cache-Control": "no-cache, no-transform",
  })
  req.on("close", () => res.end("Connection Ended"))
  res.write(`data: "Connect Success"\n\n`)
  clients.push({
    id: crypto.randomUUID(),
    res,
  })
}

export const sendEventToAllClients = (data: any) => {
  clients.forEach((client) => {
    console.log(client.res, "Client send")
    client.res.write(`data: ${JSON.stringify(data)}\n\n`)
  })
}

export const sendControllerTimerEvent = (timerId: string, message: string) =>
  ioEmit("timer-event", { timerId, message })
