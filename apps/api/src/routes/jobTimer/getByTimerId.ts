import { Request, Response } from "express"
import Jobs from "../../models/jobs"
import {
  UNKNOWN_ERROR_OCCURRED,
  REQUIRED_VALUES_MISSING,
} from "../../utils/constants"
import JobTimer from "../../models/jobTimer"

export const getByTimerId = async (req: Request, res: Response) => {
  if (req.query.locationId && req.query.timerId) {
    try {
      const getDayJobTimer = await JobTimer.findOne({
        timerId: req.query.timerId,
      })
      res.json({
        error: false,
        message: null,
        item: getDayJobTimer,
        itemCount: null,
      })
    } catch (err: any) {
      const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
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
