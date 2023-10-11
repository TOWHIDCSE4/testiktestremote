import express, { Application } from "express"
import cors from "cors"
import { port, origins } from "./config"
import routes from "./routes"
import "./utils/mongodb"
import * as Sentry from "@sentry/node"
import { setupSocket } from "./config/setup-socket"
import sentryConfig from "./utils/sentry.config"

const app: Application = express()
Sentry.init(sentryConfig)
app.use(Sentry.Handlers.requestHandler({ user: true }))
app.use(Sentry.Handlers.tracingHandler())
app.use(express.json())
app.use(
  cors({
    origin: origins,
    credentials: true,
  })
)
routes(app)
const server = setupSocket(app)
app.use(Sentry.Handlers.errorHandler())

server.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`)
})
