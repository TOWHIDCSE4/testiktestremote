import { Request, Response } from "express"
import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import ControllerTimers from "../../models/controllerTimers"
import dayjs from "dayjs"
import * as timezone from "dayjs/plugin/timezone"
import * as utc from "dayjs/plugin/utc"
import Locations from "../../models/location"
import TimerLogs from "../../models/timerLogs"

export const timer = async (req: Request, res: Response) => {
  const { locationId, timerId } = req.query
  if (locationId && timerId) {
    dayjs.extend(utc.default)
    dayjs.extend(timezone.default)
    try {
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
      const getDayFirstTimer = await ControllerTimers.findOne({
        locationId: locationId,
        createdAt: { $gte: currentDateStart, $lte: currentDateEnd },
      })
      if (getDayFirstTimer) {
        const createdAtTZ = dayjs.tz(
          dayjs(getDayFirstTimer?.createdAt),
          timeZone ? timeZone : ""
        )
        const currentDateTZ = dayjs.tz(dayjs(), timeZone ? timeZone : "")
        const diffHours = currentDateTZ.diff(createdAtTZ, "hour")
        if (location?.productionTime && location?.productionTime > diffHours) {
          const timerLogsCount = await TimerLogs.find({
            timerId,
            $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
          }).countDocuments()
          const getTimerLogs = await TimerLogs.find({
            timerId,
            $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
          })
          res.json({
            error: false,
            items: getTimerLogs,
            itemCount: timerLogsCount,
            message: null,
          })
        } else {
          res.json({
            error: false,
            items: [],
            itemCount: 0,
            message: null,
          })
        }
      } else {
        res.json({
          error: false,
          items: [],
          itemCount: 0,
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
      message: REQUIRED_VALUES_MISSING,
      items: null,
      itemCount: null,
    })
  }
}
