import { createClient } from "redis"

const redisClient = createClient({
  url: process.env.REDIS_URL,
})

redisClient.connect()

redisClient.on("connect", function () {
  console.log("REDIS database connected")
})

redisClient.on("reconnecting", function () {
  console.log("REDIS client reconnecting")
})

redisClient.on("ready", function () {
  console.log("REDIS client is ready")
})

redisClient.on("error", function (err) {
  console.log("REDIS something went wrong " + err)
})

redisClient.on("end", function () {
  console.log("\nREDIS client disconnected")
  console.log("REDIS server is going down now...")
  process.exit()
})

export default redisClient
