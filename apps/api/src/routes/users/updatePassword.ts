import { Request, Response } from "express"
import Users from "../../models/users"
import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
  UPDATE_SUCCESS_MESSAGE,
} from "../../utils/constants"
import CryptoJS from "crypto-js"
import { keys } from "../../config/keys"
import isEmpty from "lodash/isEmpty"
import * as Sentry from "@sentry/node"

export const updatePassword = async (req: Request, res: Response) => {
  const getUser = await Users.findById({
    _id: req.params.id,
    deletedAt: { $exists: true },
  })
  if (getUser) {
    const condition = req.body
    if (!isEmpty(condition)) {
      const encryptPassword = CryptoJS.AES.encrypt(
        req.body.password,
        keys.encryptKey as string
      ).toString()
      try {
        await Users.findByIdAndUpdate(req.params.id, {
          $set: {
            password: encryptPassword,
          },
          updatedAt: Date.now(),
        })
        res.json({
          error: false,
          message: UPDATE_SUCCESS_MESSAGE,
        })
      } catch (err: any) {
        Sentry.captureException(err)
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
      message: "User does not exist",
    })
  }
}
