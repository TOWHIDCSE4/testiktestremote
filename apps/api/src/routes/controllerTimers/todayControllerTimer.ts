import { Request, Response } from "express"
import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import ControllerTimers from "../../models/controllerTimers"
import dayjs from "dayjs"
import * as timezone from "dayjs/plugin/timezone"
import * as utc from "dayjs/plugin/utc"
import isProductionTimeActive from "../../helpers/isProductionTimeActive"
import Locations from "../../models/location"
import Timers from "../../models/timers"
import * as Sentry from "@sentry/node"
import { getIo, ioEmit } from "../../config/setup-socket"
import roleMatrix from "../../helpers/roleMatrix"

export const todayControllerTimer = async (req: Request, res: Response) => {
  dayjs.extend(utc.default)
  dayjs.extend(timezone.default)
  const io = getIo()
  const user = res.locals.user
  const { id, timerId } = req.query
  if (id || timerId) {
    try {
      const timer = await Timers.findOne({
        _id: timerId,
      })
      const locationId = String(timer?.locationId)
      const isAllowed =
        (await isProductionTimeActive({ locationId })) ||
        roleMatrix.controller.start_when_production_ended.includes(user.role)
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
      if (isAllowed) {
        const getAllActiveControllerTimerToday = await ControllerTimers.find({
          ...(timerId && { timerId: timerId }),
          ...(id && { _id: id }),
          createdAt: { $gte: currentDateStart, $lte: currentDateEnd },
        })
          .sort({ $natural: -1 })
          .limit(1)
        let firstCycle = null
        if (getAllActiveControllerTimerToday.length) {
          const [controllerTimer] = getAllActiveControllerTimerToday
          firstCycle = await ControllerTimers.findOne({
            createdAt: { $gte: controllerTimer.clientStartedAt },
            endAt: null,
          })
            .sort({ $natural: 1 })
            .limit(1)
        }
        res.json({
          error: false,
          items: getAllActiveControllerTimerToday,
          controllerStartedAt: firstCycle ? firstCycle.clientStartedAt : null,
          itemCount: null,
          message: null,
        })
      } else {
        const getAllActiveControllerTimerToday = await ControllerTimers.find({
          ...(timerId && { timerId: timerId }),
          ...(id && { _id: id }),
          createdAt: { $gte: currentDateStart, $lte: currentDateEnd },
        })
          .sort({ $natural: -1 })
          .limit(1)

        res.status(401).json({
          error: false,
          items: getAllActiveControllerTimerToday,
          itemCount: null,
          message:
            "Production has ended for this machine, please notify a supervisor or proceed on next working day.",
        })
      }
    } catch (err: any) {
      const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
      Sentry.captureException(err)
      res.status(500).json({
        error: true,
        message: message,
        items: null,
        itemCount: null,
      })
    }
  } else {
    res.status(500).json({
      error: true,
      message: REQUIRED_VALUES_MISSING,
      items: null,
      itemCount: null,
    })
  }
}
