import Users from "../../models/users"
import { UNKNOWN_ERROR_OCCURRED } from "../../utils/constants"
import { Request, Response } from "express"
import redisClient from "../../utils/redisClient"
import jwt, { Secret } from "jsonwebtoken"
import { keys } from "../../config/keys"

export const logout = async (req: Request, res: Response) => {
  try {
    const { email }: any = jwt.verify(req.body.token, keys.signKey as Secret)
    const logoutUser = await Users.findOneAndUpdate(
      { email },
      {
        lastLoggedOut: Date.now(),
      }
    )
    const RD_DeleteAuh = await redisClient.del(`${req.body.token}`)
    if (logoutUser && RD_DeleteAuh) {
      res.json({
        error: false,
        message: "User has been logged out",
      })
    } else {
      res.json({
        error: true,
        message: "Error while logging out user",
      })
    }
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.json({
      error: true,
      message,
    })
  }
}
