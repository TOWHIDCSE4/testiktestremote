import express, { Application } from "express"
import cors from "cors"
import { port, origins } from "./config"
import routes from "./routes"
import "./utils/mongodb"

import { setupSocket } from "./config/setup-socket"

const app: Application = express()

app.use(express.json())
app.use(
  cors({
    origin: origins,
    credentials: true,
  })
)

routes(app)

const server = setupSocket(app)

server.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`)
})
