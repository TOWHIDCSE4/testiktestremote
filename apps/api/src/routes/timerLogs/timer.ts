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
  const { locationId, timerId, page } = req.query
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
          let timerLogsCount = null
          let getTimerLogs = null
          if (page && page !== "undefined") {
            timerLogsCount = await TimerLogs.find({
              timerId,
              createdAt: { $gte: currentDateStart, $lte: currentDateEnd },
              $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
            })
              .countDocuments()
              .sort({
                createdAt: -1,
              })
              .skip(5 * (Number(page) - 1))
              .limit(5)
            getTimerLogs = await TimerLogs.find({
              timerId,
              createdAt: { $gte: currentDateStart, $lte: currentDateEnd },
              $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
            })
              .populate("partId")
              .populate("operator")
              .sort({
                createdAt: -1,
              })
              .skip(5 * (Number(page) - 1))
              .limit(5)
          } else {
            timerLogsCount = await TimerLogs.find({
              timerId,
              createdAt: { $gte: currentDateStart, $lte: currentDateEnd },
              $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
            }).countDocuments()
            getTimerLogs = await TimerLogs.find({
              timerId,
              createdAt: { $gte: currentDateStart, $lte: currentDateEnd },
              $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
            })
              .populate("partId")
              .populate("operator")
          }
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
