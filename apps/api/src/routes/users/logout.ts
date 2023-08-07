import Users from "../../models/users"
import { UNKNOWN_ERROR_OCCURRED } from "../../utils/constants"
import { Request, Response, NextFunction } from "express"
import redisClient from "../../utils/redisClient"

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const logoutUser = await Users.findOneAndUpdate(
      { email: req.params.email },
      {
        lastLoggedOut: Date.now(),
      },
      { new: true }
    )
    redisClient.del(`${logoutUser?.email}`)
    res.json({
      error: false,
      message: "User has been logged out",
      item: null,
      itemCount: null,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.status(500).json(message)
  }
}
