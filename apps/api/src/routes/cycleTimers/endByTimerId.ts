import {
  REQUIRED_VALUE_EMPTY,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import { Request, Response } from "express"
import CycleTimers from "../../models/cycleTimers"

export const endByTimerId = async (req: Request, res: Response) => {
  const { timerId } = req.body
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
    res.json({
      error: true,
      message: message,
      item: null,
      itemCount: null,
    })
  }
}
