import Users from "../../models/users"
import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import { keys } from "../../config/keys"
import CryptoJS from "crypto-js"
import jwt from "jsonwebtoken"
import { Request, Response } from "express"
import { LoginZodSchema, SessionZodSchema } from "zod-schema"
import redisClient from "../../utils/redisClient"
import dayjs from "dayjs"

export const auth = async (req: Request, res: Response) => {
  const validateUserInput = LoginZodSchema.safeParse(req.body)
  if (validateUserInput.success) {
    const { email, password } = req.body
    if (email && password) {
      try {
        const user = await Users.findOne({
          $or: [{ email }],
        })
        if (!user || (user && user.deletedAt)) {
          throw new Error("Account does not exist in our system")
        }
        if (user && user.blockedAt) {
          throw new Error("Account was prohibited to login due to violations")
        }
        const encryptPassword = CryptoJS.AES.decrypt(
          user.password as string,
          keys.encryptKey as string
        )
        const originalPassword = encryptPassword.toString(CryptoJS.enc.Utf8)
        if (originalPassword !== password) {
          throw new Error("Email or password is invalid")
        } else {
          const token = jwt.sign(
            {
              email: user.email,
              role: user.role,
            },
            keys.signKey as string
          )
          if (res.locals.user) {
            delete res.locals.user
          }
          function addHours(date: Date, hours: number) {
            date.setTime(date.getTime() + hours * 60 * 60 * 1000)
            return date
          }
          const zodParsedSession = SessionZodSchema.safeParse({
            token,
            email: user.email,
            role: user.role,
          })
          if (zodParsedSession.success) {
            const now = new Date(Date.now())
            redisClient.hSet(`${token}`, {
              expireIn: `${dayjs(addHours(now, 4)).format()}`,
            })
            res.json({
              error: false,
              message: null,
              item: zodParsedSession.data,
              itemCount: null,
            })
          } else {
            res.json({
              error: true,
              message: zodParsedSession.error,
              item: null,
              itemCount: null,
            })
          }
        }
      } catch (err: any) {
        const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
        res.json({
          error: true,
          message: message,
        })
      }
    } else {
      res.json({
        error: true,
        message: REQUIRED_VALUES_MISSING,
      })
    }
  } else {
    res.json({
      error: true,
      message: validateUserInput.error,
    })
  }
}
