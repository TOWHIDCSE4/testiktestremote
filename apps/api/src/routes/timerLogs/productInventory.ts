import { Request, Response } from "express"
import TimerLogs from "../../models/timerLogs"
import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import * as Sentry from "@sentry/node"

export const productInventory = async (req: Request, res: Response) => {
  if (req.params.partId) {
    try {
      const logsCount = await TimerLogs.find({
        partId: req.params.partId,
        stopReason: { $in: ["Unit Created"] },
        jobId: { $exists: true },
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      }).countDocuments()
      res.json({
        error: false,
        item: logsCount,
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
