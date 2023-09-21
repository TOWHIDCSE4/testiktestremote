import { Request, Response } from "express"
import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import dayjs from "dayjs"
import * as timezone from "dayjs/plugin/timezone"
import * as utc from "dayjs/plugin/utc"
import Locations from "../../models/location"
import ControllerTimers from "../../models/controllerTimers"
import TimerLogs from "../../models/timerLogs"

export const totalTonsUnit = async (req: Request, res: Response) => {
  if (req.query.timerId && req.query.locationId) {
    try {
      dayjs.extend(utc.default)
      dayjs.extend(timezone.default)
      const locationId = String(req.query.locationId)
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
      const getDayController = await ControllerTimers.findOne({
        timerId: req.query.timerId,
        createdAt: { $gte: currentDateStart, $lte: currentDateEnd },
      })
      if (getDayController) {
        const getDayControllerLogs = await TimerLogs.find({
          timerId: req.query.timerId,
          stopReason: { $in: ["Unit Created"] },
          createdAt: { $gte: currentDateStart, $lte: currentDateEnd },
        }).populate("partId")
        const logTotalCount = getDayControllerLogs.length
        if (logTotalCount > 0) {
          const controllerTimerStarted = getDayController?.createdAt
          const dateControllerStarted = dayjs.tz(
            dayjs(controllerTimerStarted),
            timeZone ? timeZone : ""
          )
          const dateCurrentTime = dayjs.tz(dayjs(), timeZone ? timeZone : "")
          const hoursPass = dayjs(dateCurrentTime).diff(
            dateControllerStarted,
            "hour"
          )
          const totalHoursPass =
            typeof location?.productionTime === "number" &&
            location?.productionTime > hoursPass
              ? hoursPass
              : (location?.productionTime as number)
          const partsTotalTons = getDayControllerLogs
            ? getDayControllerLogs.reduce((acc, val) => {
                // @ts-expect-error
                return acc + (val?.partId?.tons ? val?.partId?.tons : 0)
              }, 0)
            : 0
          res.json({
            error: false,
            item: {
              tons: partsTotalTons,
              tonsPerHour:
                partsTotalTons /
                (totalHoursPass === 0 ? 1 : Math.round(totalHoursPass)),
              unitPerHour:
                logTotalCount /
                (totalHoursPass === 0 ? 1 : Math.round(totalHoursPass)),
              dailyUnits: logTotalCount,
            },
            itemCount: null,
            message: null,
          })
        } else {
          res.json({
            error: false,
            item: { tons: 0, tonsPerHour: 0, unitPerHour: 0 },
            itemCount: null,
            message: null,
          })
        }
      } else {
        res.json({
          error: false,
          item: { tons: 0, tonsPerHour: 0, unitPerHour: 0 },
          itemCount: null,
          message: null,
        })
      }
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
