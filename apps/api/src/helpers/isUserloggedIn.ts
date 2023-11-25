import Users from "../models/users"
import { keys } from "../config/keys"
import jwt, { Secret } from "jsonwebtoken"
import { UNKNOWN_ERROR_OCCURRED } from "../utils/constants"
import { Request, Response, NextFunction } from "express"
import redisClient from "../utils/redisClient"
import dayjs from "dayjs"

const isUserLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearerHeader = req.headers["authorization"]
  if (bearerHeader) {
    const bearer = bearerHeader.split(" ")
    const bearerToken = bearer[1]
    try {
      const { email, role }: any = jwt.verify(
        bearerToken,
        keys.signKey as Secret,
        {
          ignoreExpiration: true,
        }
      )
      const user = await Users.findOne({ email, role })
      const RD_Session = await redisClient.hGetAll(`${bearerToken}`)
      const isTokenExpired = dayjs().isAfter(RD_Session.expireIn)
      if (!RD_Session || isTokenExpired) {
        res.json({ error: true, message: "Token has been expired" })
      } else {
        if (user && user.deletedAt) {
          throw new Error("We cannot find your account in our system")
        }
        if (user && user.status === "Blocked") {
          throw new Error(
            "Your account was banned, all actions and requested data was prohibited"
          )
        }
        res.locals.user = user
        next()
      }
    } catch (err: any) {
      const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
      if (message === "jwt malformed") {
        res
          .status(401)
          .json({ error: true, message: "Invalid authentication credentials" })
      } else if (message === "jwt expired") {
        res.status(403).json({
          error: true,
          message: "Authentication is expired, please login again",
        })
      } else {
        res.status(403).json({ error: true, message: message })
      }
    }
  } else {
    res.status(401).json({
      error: true,
      message: `You are not authorized to perform this action`,
    })
  }
}

export default isUserLoggedIn
