import Users from "../../models/users"
import { UNKNOWN_ERROR_OCCURRED } from "../../utils/constants"
import { Request, Response } from "express"
import redisClient from "../../utils/redisClient"
import jwt, { Secret } from "jsonwebtoken"
import { keys } from "../../config/keys"
import * as Sentry from "@sentry/node"

export const logout = async (req: Request, res: Response) => {
  try {
    const { email }: any = jwt.verify(req.body.token, keys.signKey as Secret, {
      ignoreExpiration: true,
    })
    const logoutUser = await Users.findOneAndUpdate(
      { email },
      {
        lastLoggedOut: Date.now(),
      }
    )
    if (logoutUser) {
      //TODO removing this temporarily
      // if (logoutUser) {
      res.json({
        error: false,
        message: "User has been logged out",
        items: null,
        itemCount: null,
      })
    } else {
      res.json({
        error: true,
        message: "Error while logging out user",
        items: null,
        itemCount: null,
      })
    }
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    Sentry.captureException(err)
    res.json({
      error: true,
      message: message,
      items: null,
      itemCount: null,
    })
  }
}
