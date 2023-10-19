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
      const query = {
        locationId: req.query.locationId,
        factoryId: req.query.factoryId,
        partId: req.query.partId,
        $and: [
          {
            $or: [{ status: "Pending" }, { status: "Active" }],
          },
          {
            $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
          },
        ],
      }
      const jobsCount = await Jobs.find(query).countDocuments()
      const getJobs = await Jobs.find(query)
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
