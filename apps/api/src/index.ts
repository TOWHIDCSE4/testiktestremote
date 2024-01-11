import express, { Application } from "express"
import cors from "cors"
import { port, origins } from "./config"
import routes from "./routes"
import "./utils/mongodb"
import * as Sentry from "@sentry/node"
import { setupSocket } from "./config/setup-socket"
import sentryConfig from "./utils/sentry.config"
import * as os from "os"
import { logStartTimeAndCountRequests } from "./middleware/requestCount"

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
app.use((req, res, next) => {
  res.locals.startTime = Date.now()
  next()
})

app.use(logStartTimeAndCountRequests)
app.get("/", (req, res) => {
  res.status(200).json({
    error: false,
    message: "server is up and running ✅ (●'◡'●)",
    data: {
      os: os.type(),
      user: os.userInfo().username,
      platform: os.platform(),
    },
  })
})
routes(app)
const server = setupSocket(app)
app.use(Sentry.Handlers.errorHandler())

server.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`)
})
