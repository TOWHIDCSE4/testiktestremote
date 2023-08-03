import path from "path"
import dotenv from "dotenv"

dotenv.config({ path: path.join(__dirname, "../.env") })

export const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 9000
export const origins = process.env.ORIGINS?.split(",") as unknown as string
export const mongoURL = process.env.MONGO_URL as unknown as string
export const redis_port = process.env.PORT
  ? parseInt(process.env.REDIS_PORT as string, 10)
  : 6379
