import { Request, Response } from "express"
import Users from "../../models/users"
import {
  UNKNOWN_ERROR_OCCURRED,
  UPDATE_SUCCESS_MESSAGE,
} from "../../utils/constants"
import * as Sentry from "@sentry/node"

export const acceptUser = async (req: Request, res: Response) => {
  const getUser = await Users.findById({
    _id: req.params.id,
    deletedAt: { $exists: true },
  })

  const userId = req.body.userId
  if (getUser) {
    if (userId) {
      try {
        const updateUser = await Users.findByIdAndUpdate(
          req.params.id,
          {
            approvedBy: userId,
            updatedAt: Date.now(),
          },
          { new: true }
        )
        res.json({
          error: false,
          item: updateUser,
          itemCount: 1,
          message: UPDATE_SUCCESS_MESSAGE,
        })
      } catch (err: any) {
        const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
        Sentry.captureException(err)
        res.json({
          error: true,
          message: message,
        })
      }
    } else {
      res.json({
        error: true,
        message: "User cannot be found",
      })
    }
  } else {
    res.json({
      error: true,
      message: "User does not exist",
    })
  }
}
