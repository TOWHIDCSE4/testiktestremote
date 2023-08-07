import express, { Application } from "express"
import cors from "cors"
import { port, origins } from "./config"
import routes from "./routes"
import "./utils/mongodb"

const app: Application = express()
app.use(express.json())
app.use(
  cors({
    origin: origins,
    credentials: true,
  })
)

routes(app)

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`)
})
