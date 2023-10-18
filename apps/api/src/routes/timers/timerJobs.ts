import { Request, Response } from "express"
import Jobs from "../../models/jobs"
import {
  UNKNOWN_ERROR_OCCURRED,
  REQUIRED_VALUES_MISSING,
} from "../../utils/constants"
import * as Sentry from "@sentry/node"

export const timerJobs = async (req: Request, res: Response) => {
  if (req.query.locationId && req.query.partId && req.query.factoryId) {
    try {
      const jobsCount = await Jobs.find({
        locationId: req.query.locationId,
        factoryId: req.query.factoryId,
        partId: req.query.partId,
        status: "Testing",
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      }).countDocuments()
      const getJobs = await Jobs.find({
        locationId: req.query.locationId,
        factoryId: req.query.factoryId,
        partId: req.query.partId,
        status: "Testing",
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      })
      res.json({
        error: false,
        message: null,
        items: getJobs,
        itemCount: jobsCount,
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
      itemCount: null,
      message: REQUIRED_VALUES_MISSING,
    })
  }
}
