import { Request, Response } from "express"
import JobTimer from "../../models/jobTimer"
import {
  UNKNOWN_ERROR_OCCURRED,
  UPDATE_SUCCESS_MESSAGE,
} from "../../utils/constants"
import isEmpty from "lodash/isEmpty"
import TimerLogs from "../../models/timerLogs"
import Jobs from "../../models/jobs"
import * as Sentry from "@sentry/node"

export const updateController = async (req: Request, res: Response) => {
  const condition = req.body
  if (!isEmpty(condition)) {
    try {
      const getJobTimer = await JobTimer.findOne({
        _id: req.params.id,
        deletedAt: { $exists: false },
      })
      if (getJobTimer) {
        const jobTimers = await JobTimer.find({
          jobId: getJobTimer?.jobId?.toString(),
        })
        const job = await Jobs.findOne({ _id: getJobTimer?.jobId?.toString() })
        const targetCount = job?.count || 0
        const currLogCount = await TimerLogs.find({
          stopReason: { $in: ["Unit Created"] },
          jobId: getJobTimer?.jobId?.toString(),
        }).countDocuments()
        await Jobs.findOneAndUpdate(
          { _id: getJobTimer?.jobId?.toString() },
          {
            $set: {
              status:
                !job?.isStock && currLogCount >= targetCount
                  ? "Testing"
                  : jobTimers.length === 1
                  ? "Pending"
                  : "Active",
            },
          }
        )
        if (req.body?.jobId) {
          await Jobs.findOneAndUpdate(
            { _id: req.body?.jobId },
            { $set: { status: "Active" } }
          )
        }
        const updateJobTimer = await JobTimer.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
            updatedAt: Date.now(),
          },
          { new: true }
        )
        res.json({
          error: false,
          item: updateJobTimer,
          itemCount: 1,
          message: UPDATE_SUCCESS_MESSAGE,
        })
      } else {
        res.status(404).json({
          error: true,
          message: "Timer reading does not exist",
          items: null,
          itemCount: null,
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
  } else {
    res.json({
      error: true,
      message: "Timer job cannot be found",
      items: null,
      itemCount: null,
    })
  }
}
