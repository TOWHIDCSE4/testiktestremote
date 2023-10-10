import Users from "../../models/users"
import { REQUIRED_VALUES_MISSING } from "../../utils/constants"
import { keys } from "../../config/keys"
import jwt, { Secret } from "jsonwebtoken"
import { Request, Response } from "express"
import redisClient from "../../utils/redisClient"
import dayjs from "dayjs"
import * as Sentry from "@sentry/node"
export const verify = async (req: Request, res: Response) => {
  if (req.params.token) {
    try {
      const { email }: any = jwt.verify(
        req.params.token,
        keys.signKey as Secret
      )
      const RD_Session = await redisClient.hGetAll(req.params.token)
      const user = await Users.findOne({
        email,
      })
      const isTokenExpired = dayjs().isAfter(RD_Session.expireIn)
      if (user && !isTokenExpired) {
        res.json({
          error: false,
          message: null,
          item: {
            token: req.params.token,
            email: user.email,
            role: user.role,
          },
        })
      } else {
        res.json({
          error: true,
          message: "Authentication is expired or invalid",
          items: null,
          itemCount: null,
        })
      }
    } catch (error) {
      Sentry.captureException(error)
      res.json({
        error: true,
        message: String(error),
        items: null,
        itemCount: null,
      })
    }
  } else {
    res.json({
      error: true,
      message: REQUIRED_VALUES_MISSING,
      items: null,
      itemCount: null,
    })
  }
}
