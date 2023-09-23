import Users from "./models/users"
import { keys } from "./config/keys"
import jwt, { Secret } from "jsonwebtoken"
import { UNKNOWN_ERROR_OCCURRED } from "./utils/constants"
import { Request, Response, NextFunction } from "express"

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
      const { email }: any = jwt.verify(bearerToken, keys.signKey as Secret)
      const user = await Users.findOne({ email })
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
    } catch (err: any) {
      const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
      if (message === "jwt malformed") {
        res.status(401).json("Invalid authentication credentials")
      } else if (message === "jwt expired") {
        res.status(403).json("Authentication is expired, please login again")
      } else {
        res.status(403).json(message)
      }
    }
  } else {
    res.status(401).json(`You are not authorized to perform this action`)
  }
}

export default isUserLoggedIn
