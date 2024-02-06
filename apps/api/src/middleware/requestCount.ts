// middleware/logger.ts
import { Request, Response, NextFunction } from "express"
import mongoose from "mongoose"

export interface EndpointStats {
  totalTime: number
  requestCount: number
  averageResponseTime: number
  requestTime: number
  queries: string[]
}

const endpointStats: Record<string, EndpointStats> = {}

export const logStartTimeAndCountRequests = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const endpoint = req.path
  const startTime = Date.now()

  if (!endpointStats[endpoint]) {
    endpointStats[endpoint] = {
      totalTime: 0,
      requestCount: 0,
      averageResponseTime: 0,
      requestTime: 0,
      queries: [],
    }
  }

  endpointStats[endpoint].requestCount += 1

  res.locals.startTime = startTime

  mongoose.set(
    "debug",
    (collectionName: string, method: string, query: string) => {
      if (!endpointStats[endpoint].queries.includes(collectionName)) {
        endpointStats[endpoint].queries.push(collectionName)
      }
    }
  )

  res.on("finish", () => {
    const endTime = Date.now()
    const responseTime = endTime - startTime
    endpointStats[endpoint].totalTime += responseTime
    endpointStats[endpoint].requestTime = responseTime
    endpointStats[endpoint].averageResponseTime = +(
      endpointStats[endpoint].totalTime / endpointStats[endpoint].requestCount
    ).toFixed(2)

    mongoose.set("debug", false)
  })

  next()
}

export const getEndpointStats = () => endpointStats
