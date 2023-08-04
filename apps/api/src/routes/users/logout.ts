import Users from "../../models/users"
import { UNKNOWN_ERROR_OCCURRED } from "../../utils/constants"
import { keys } from "../../config/keys"
import CryptoJS from "crypto-js"
import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import { createClient } from "redis"

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const client = createClient()
  client.connect()
  try {
    const logoutUser = await Users.findByIdAndUpdate(
      req.params.id,
      {
        lastLoggedOut: Date.now(),
      },
      { new: true }
    )
    client.del(`${logoutUser?.email}`)
    res.json({ message: `User ${logoutUser?.email} has been logout` })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.status(500).json(message)
  }
}
