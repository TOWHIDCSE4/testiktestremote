import {
  REQUIRED_VALUE_EMPTY,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import { Request, Response } from "express"
import CycleTimers from "../../models/cycleTimers"
import ControllerTimers from "../../models/controllerTimers"

export const endControllerTimer = async (req: Request, res: Response) => {
  const { timerId } = req.body
  try {
    if (timerId) {
      const getExistingCycleTimer = await CycleTimers.find({
        timerId,
        endAt: null,
      })
      if (getExistingCycleTimer.length > 0) {
        await CycleTimers.findOneAndUpdate(
          { timerId, endAt: null },
          {
            endAt: Date.now(),
          }
        )
      }
      const getExistingControllerTimer = await ControllerTimers.find({
        timerId,
        endAt: null,
      })
      if (getExistingControllerTimer.length > 0) {
        const endTimer = await ControllerTimers.findOneAndUpdate(
          { timerId, endAt: null },
          {
            endAt: Date.now(),
          }
        )
        res.json({
          error: false,
          item: endTimer,
          itemCount: 1,
          message: "Timer ended successfully",
        })
      } else {
        res.json({
          error: true,
          message: "Timer controller not found",
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
