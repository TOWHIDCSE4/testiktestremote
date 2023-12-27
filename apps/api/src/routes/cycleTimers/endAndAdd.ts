import {
  ADD_SUCCESS_MESSAGE,
  CYCLE_TIMER_ALREADY_EXISTS,
  REQUIRED_VALUE_EMPTY,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import { Request, Response } from "express"
import { ZCycleTimer } from "custom-validator"
import CycleTimers from "../../models/cycleTimers"
import * as Sentry from "@sentry/node"
import { getIo, ioEmit } from "../../config/setup-socket"
import { sendControllerTimerEvent } from "../../sse/sse"

export const endAndAdd = async (req: Request, res: Response) => {
  const io = getIo()
  const { timerId, clientStartedAt, sessionId } = req.body
  try {
    ioEmit(`timer-${timerId}`, {
      action: "pre-endAndAdd",
    })
    if (timerId) {
      await CycleTimers.updateMany(
        { timerId, endAt: null },
        {
          endAt: Date.now(),
        }
      )
      const newCycleTimer = new CycleTimers({
        timerId,
        endAt: null,
        clientStartedAt: new Date(clientStartedAt),
        sessionId,
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
          sendControllerTimerEvent(timerId, "refetch")
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
    Sentry.captureException(err)
    res.json({
      error: true,
      message: message,
      item: null,
      itemCount: null,
    })
  }
}
