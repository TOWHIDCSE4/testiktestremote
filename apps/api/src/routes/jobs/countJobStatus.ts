import { Request, Response } from "express"
import Jobs from "../../models/jobs"
import {
  UNKNOWN_ERROR_OCCURRED,
  ADD_SUCCESS_MESSAGE,
  UPDATE_SUCCESS_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
  REQUIRED_VALUES_MISSING,
} from "../../utils/constants"
import { ZJob } from "custom-validator"
import * as Sentry from "@sentry/node"

export const getAllJobsPerStatus = async (req: Request, res: Response) => {
  const { locationId, status } = req.query
  if (locationId && status) {
    try {
      const statusCount = await Jobs.find({
        $and: [{ locationId: locationId }, { status: status }],
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      }).countDocuments()

      res.json({
        error: false,
        item: statusCount,
        itemCount: null,
        message: null,
      })
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
  } else {
    res.json({
      error: true,
      message: REQUIRED_VALUES_MISSING,
      items: null,
      itemCount: null,
    })
  }
}
