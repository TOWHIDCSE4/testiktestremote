import { Request, Response } from "express"
import Jobs from "../../models/jobs"
import {
  UNKNOWN_ERROR_OCCURRED,
  REQUIRED_VALUES_MISSING,
  JOB_ACTION,
} from "../../utils/constants"
import JobTimer from "../../models/jobTimer"
import * as Sentry from "@sentry/node"
import TimerLogs from "../../models/timerLogs"
import mongoose from "mongoose"

export const getByTimerId = async (req: Request, res: Response) => {
  try {
    if (req.query.locationId && req.query.timerId) {
      const getDayJobTimer = await JobTimer.findOne({
        timerId: req.query.timerId,
      })

      const job = await Jobs.findOne({
        _id: new mongoose.Types.ObjectId(getDayJobTimer?.jobId),
      })

      const targetCountJob = job?.count
      const getStockJob = await Jobs.findOne({
        locationId: req.query.locationId,
        partId: job?.partId,
        factoryId: job?.factoryId,
        isStock: true,
        $and: [
          {
            $or: [{ status: "Pending" }, { status: "Active" }],
          },
          {
            $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
          },
        ],
      })

      const currCountJob = await TimerLogs.find({
        stopReason: { $in: ["Unit Created"] },
        jobId: getDayJobTimer?.jobId,
      }).countDocuments()

      if (targetCountJob && currCountJob && currCountJob <= targetCountJob) {
        const limitReached = currCountJob >= targetCountJob || false

        const recommendation =
          getStockJob && limitReached
            ? JOB_ACTION.SWITCH
            : !getStockJob && limitReached
            ? JOB_ACTION.STOP
            : JOB_ACTION.CONTINUE

        const jobToBe =
          recommendation === JOB_ACTION.SWITCH
            ? getStockJob?._id
            : recommendation === JOB_ACTION.CONTINUE
            ? getDayJobTimer?.jobId
            : null

        if (jobToBe) {
          const updateJobTimer = await JobTimer.findOneAndUpdate(
            { _id: getDayJobTimer?._id },
            { jobId: jobToBe },
            { new: true }
          )

          if (updateJobTimer) {
            return res.json({
              error: false,
              message: null,
              meta: {
                currCountJob,
                targetCountJob,
                recommendation,
              },
              item: updateJobTimer,
              itemCount: null,
            })
          }
        }
      }

      return res.json({
        error: false,
        message: null,
        item: getDayJobTimer,
        itemCount: null,
      })
    } else {
      return res.json({
        error: true,
        itemCount: null,
        message: REQUIRED_VALUES_MISSING,
      })
    }
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    Sentry.captureException(err)
    return res.json({
      error: true,
      message: message,
      items: null,
      itemCount: null,
    })
  }
}
