import { Request, Response } from "express"
import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import CycleTimers from "../../models/cycleTimers"
import dayjs from "dayjs"
import * as timezone from "dayjs/plugin/timezone"
import * as utc from "dayjs/plugin/utc"
import Locations from "../../models/location"
import Timers from "../../models/timers"
import isProductionTimeActive from "../../helpers/isProductionTimeActive"
import * as Sentry from "@sentry/node"
import { getIo, ioEmit } from "../../config/setup-socket"
import mongoose from "mongoose"
import roleMatrix from "../../helpers/roleMatrix"
import CycleTimerService from "../../services/cycleTimerService"

export const todayCycleTimer = async (req: Request, res: Response) => {
  try {
    const io = getIo()
    dayjs.extend(utc.default)
    dayjs.extend(timezone.default)
    const { timerId } = req.query
    if (timerId) {
      try {
        const user = res.locals.user
        const timer = await Timers.findOne({
          _id: new mongoose.Types.ObjectId(timerId as string),
        })
        const locationId = String(timer?.locationId)
        const location = await Locations.findOne({
          _id: new mongoose.Types.ObjectId(locationId),
        })
        const timeZone = location?.timeZone || ""
        const latestCycleTimer = await CycleTimerService.getLatestRunning(
          timerId as string,
          timeZone
        )

        res.json({
          error: false,
          items: latestCycleTimer ? [latestCycleTimer] : [],
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
  } catch (error) {
    Sentry.captureException(error)
    return res.json({
      error: true,
      message: error,
      items: null,
      itemCount: null,
    })
  }
}
