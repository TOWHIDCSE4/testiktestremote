import Users from "../../models/users"
import { UNKNOWN_ERROR_OCCURRED } from "../../utils/constants"
import { keys } from "../../config/keys"
import CryptoJS from "crypto-js"
import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import { createClient } from "redis"
import LoginZodSchema from "../../../../../packages/zod-schema/LoginZodSchema"

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const client = createClient()
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
          const now = new Date(Date.now())
          client.connect()
          client.hSet(`${user.email}`, {
            token: `${token}`,
            expireIn: `${addHours(now, 4)}`,
          })
          const getToken = await client.hGetAll(`${user.email}`)
          res.json({
            error: false,
            token: getToken.token,
            expireIn: getToken.expireIn,
          })
          client.quit()
        }
      } catch (err: any) {
        const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
        res.status(500).json(message)
      }
    } else {
      res.status(500).json("Required values are missing")
    }
  } else {
    res.json({
      error: true,
      errMessage: validateUserInput.error,
    })
  }
}
