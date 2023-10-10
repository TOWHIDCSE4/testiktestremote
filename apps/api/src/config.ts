import path from "path"
import dotenv from "dotenv"
import { existsSync } from "fs"
const devEnv = path.join(__dirname, "../../../.env")
const prodEnv = path.join(__dirname, "../../../../.env")
dotenv.config({ path: existsSync(devEnv) ? devEnv : prodEnv })

export const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 9000
export const origins = process.env.ORIGINS?.split(",") as unknown as string
export const mongoURL = process.env.MONGO_URL as unknown as string
export const redisURL = process.env.REDIS_URL as unknown as string
export const sentryDSN = process.env.SENTRY_DSN as string
