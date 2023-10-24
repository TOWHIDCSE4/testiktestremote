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

export const getByTimerId = async (req: Request, res: Response) => {
  try {
    if (req.query.locationId && req.query.timerId) {
      const getDayJobTimer = await JobTimer.findOne({
        timerId: req.query.timerId,
      }).populate("jobId")

      //@ts-expect-error
      const targetCountJob = getDayJobTimer?.jobId?.count
      console.log(
        "🚀 ~ file: getByTimerId.ts:16 ~ getByTimerId ~ getDayJobTimer:",
        targetCountJob
      )
      console.log(
        "🚀 ~ file: getByTimerId.ts:23 ~ getDayJobTimer?.jobId?._id:",
        getDayJobTimer?.jobId?._id
      )

      const getStockJob = await Jobs.findOne({
        locationId: req.query.locationId,

        //@ts-expect-error
        partId: getDayJobTimer?.jobId?.partId,

        //@ts-expect-error
        factoryId: getDayJobTimer?.jobId?.factoryId,
        isStock: true,
        $and: [{ status: { $ne: "Deleted" } }, { status: { $ne: "Archived" } }],
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      })

      const currCountJob = await TimerLogs.find({
        stopReason: { $in: ["Unit Created"] },
        jobId: req.body.jobId,
      }).countDocuments()

      console.log(
        "🚀 ~ file: getByTimerId.ts:44 ~ getByTimerId ~ currCountJob:",
        currCountJob
      )

      if ((targetCountJob && currCountJob) === currCountJob <= targetCountJob) {
        const limitReached = currCountJob <= targetCountJob || false

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
            ? req?.body?.jobId
            : null

        if (jobToBe) {
          const updateJobTimer = await JobTimer.findOneAndUpdate(
            { _id: getDayJobTimer?._id },
            { jobId: jobToBe },
            { new: true }
          )

          if (updateJobTimer) {
            res.json({
              error: false,
              message: null,
              item: updateJobTimer,
              itemCount: null,
            })
          }
        }
      }

      res.json({
        error: false,
        message: null,
        item: getDayJobTimer,
        itemCount: null,
      })
    } else {
      res.json({
        error: true,
        itemCount: null,
        message: REQUIRED_VALUES_MISSING,
      })
    }
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
}
