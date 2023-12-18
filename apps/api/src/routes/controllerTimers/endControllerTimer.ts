import {
  REQUIRED_VALUE_EMPTY,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import { Request, Response } from "express"
import CycleTimers from "../../models/cycleTimers"
import ControllerTimers from "../../models/controllerTimers"
import * as Sentry from "@sentry/node"
import dayjs from "dayjs"
import { getIo, ioEmit } from "../../config/setup-socket"
import Locations from "../../models/location"

export const endControllerTimer = async (req: Request, res: Response) => {
  const { timerId, locationId } = req.body
  try {
    const io = getIo()
    const location = await Locations.findOne({
      _id: locationId,
    })
    const timeZone = location?.timeZone
    const currentDateStart = dayjs
      .utc(dayjs.tz(dayjs(), timeZone ? timeZone : "").startOf("day"))
      .toISOString()
    const currentDateEnd = dayjs
      .utc(dayjs.tz(dayjs(), timeZone ? timeZone : "").endOf("day"))
      .toISOString()
    if (timerId) {
      const getExistingCycleTimer = await CycleTimers.find({
        timerId,
        endAt: null,
        createdAt: { $gte: currentDateStart, $lte: currentDateEnd },
      })
      if (getExistingCycleTimer.length > 0) {
        await CycleTimers.findOneAndUpdate(
          {
            timerId,
            endAt: null,
            createdAt: { $gte: currentDateStart, $lte: currentDateEnd },
          },
          {
            endAt: Date.now(),
          }
        )
      }
      const getExistingControllerTimer = await ControllerTimers.find({
        timerId,
      })
      if (getExistingControllerTimer.length > 0) {
        const endTimer = await ControllerTimers.findOneAndUpdate(
          {
            timerId,
            endAt: null,
            createdAt: { $gte: currentDateStart, $lte: currentDateEnd },
          },
          {
            endAt: Date.now(),
          },
          {
            new: true,
          }
        )

        ioEmit(`timer-${timerId}`, {
          action: "end-controller",
          route: "PATCH/controller-timers/end",
          data: endTimer,
        })
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
    Sentry.captureException(err)
    res.json({
      error: true,
      message: message,
      item: null,
      itemCount: null,
    })
  }
}
