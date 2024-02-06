import { Request, Response } from "express"
import Timers from "../../models/timers"
import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import * as Sentry from "@sentry/node"

export const countByMachineClass = async (req: Request, res: Response) => {
  if (req.query.locationId && req.query.machineClassId) {
    try {
      const timerLocationCount = await Timers.find({
        locationId: req.query.locationId,
        machineClassId: req.query.machineClassId,
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      }).countDocuments()
      res.json({
        error: false,
        item: timerLocationCount,
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
