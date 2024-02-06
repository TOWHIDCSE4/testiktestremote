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
        keys.signKey as Secret,
        {
          ignoreExpiration: true,
        }
      )
      const user = await Users.findOne({
        email,
      })
      if (user) {
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
        res.status(401).json({
          error: true,
          message: "Authentication is expired or invalid",
          items: null,
          itemCount: null,
        })
      }
    } catch (error) {
      Sentry.captureException(error)
      res.status(401).json({
        error: true,
        message: String(error),
        items: null,
        itemCount: null,
      })
    }
  } else {
    res.status(401).json({
      error: true,
      message: REQUIRED_VALUES_MISSING,
      items: null,
      itemCount: null,
    })
  }
}
