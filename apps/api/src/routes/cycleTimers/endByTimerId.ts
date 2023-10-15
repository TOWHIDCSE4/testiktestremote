import {
  REQUIRED_VALUE_EMPTY,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import { Request, Response } from "express"
import CycleTimers from "../../models/cycleTimers"
import * as Sentry from "@sentry/node"
import { getIo } from "../../config/setup-socket"

export const endByTimerId = async (req: Request, res: Response) => {
  const io = getIo()
  const { timerId } = req.body
  io.emit(`timer-${timerId}`, { action: "pre-end" })
  try {
    if (timerId) {
      const getExistingCycleTimer = await CycleTimers.find({
        timerId,
        endAt: null,
      })
      if (getExistingCycleTimer.length > 0) {
        const endCycle = await CycleTimers.findOneAndUpdate(
          { timerId, endAt: null },
          {
            endAt: Date.now(),
          }
        )
        io.emit(`timer-${timerId}`, { action: "end", ...endCycle })
        res.json({
          error: false,
          item: endCycle,
          itemCount: 1,
          message: "Cycle ended successfully",
        })
      } else {
        res.json({
          error: true,
          message: "Cycle timer not found",
          item: null,
          itemCount: null,
        })
      }
    } else {
      res.json({
        error: true,
        message: REQUIRED_VALUE_EMPTY,
        item: null,
        itemCount: null,
      })
    }
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    Sentry.captureException(err)
    res.json({
      error: true,
      message: message,
      item: null,
      itemCount: null,
    })
  }
}
