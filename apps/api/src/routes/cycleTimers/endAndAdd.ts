import {
  ADD_SUCCESS_MESSAGE,
  CYCLE_TIMER_ALREADY_EXISTS,
  REQUIRED_VALUE_EMPTY,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import { Request, Response } from "express"
import { ZCycleTimer } from "custom-validator"
import CycleTimers from "../../models/cycleTimers"

export const endAndAdd = async (req: Request, res: Response) => {
  const { timerId } = req.body
  try {
    if (timerId) {
      await CycleTimers.findOneAndUpdate(
        { timerId, endAt: null },
        {
          endAt: Date.now(),
        }
      )
      const newCycleTimer = new CycleTimers({
        timerId,
        endAt: null,
        createdAt: Date.now(),
      })
      const parseCycleTimer = ZCycleTimer.safeParse(req.body)
      if (parseCycleTimer.success) {
        const getExistingCycleTimer = await CycleTimers.find({
          timerId,
          endAt: null,
        })
        if (getExistingCycleTimer.length === 0) {
          const createCycleTimer = await newCycleTimer.save()
          res.json({
            error: false,
            item: createCycleTimer,
            itemCount: 1,
            message: ADD_SUCCESS_MESSAGE,
          })
        } else {
          res.json({
            error: true,
            message: CYCLE_TIMER_ALREADY_EXISTS,
            item: null,
            itemCount: null,
          })
        }
      } else {
        res.json({
          error: true,
          message: parseCycleTimer.error.issues,
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
