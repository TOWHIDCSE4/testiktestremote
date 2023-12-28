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
import * as Sentry from "@sentry/node"

export const timer = async (req: Request, res: Response) => {
  const { locationId, timerId, page, countPerPage } = req.query
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
      const getLastDayTimer = await ControllerTimers.findOne({
        locationId: locationId,
        timerId,
        createdAt: { $gte: currentDateStart, $lte: currentDateEnd },
      }).sort({ $natural: -1 })

      if (getLastDayTimer) {
        let timerLogsCount = null
        let getTimerLogs = null
        if (page && page !== "undefined") {
          timerLogsCount = await TimerLogs.find({
            timerId,
            createdAt: {
              $gte: getLastDayTimer.createdAt,
            },
            $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
          }).countDocuments()
          getTimerLogs = await TimerLogs.find({
            timerId,
            createdAt: {
              $gte: getLastDayTimer.createdAt,
            },
            $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
          })
            .populate("partId")
            .populate("machineId")
            .populate("operator")
            .sort({
              createdAt: -1,
            })
            .skip(
              (countPerPage ? Number(countPerPage) : 3) * (Number(page) - 1)
            )
            .limit(countPerPage ? Number(countPerPage) : 3)
        } else {
          timerLogsCount = await TimerLogs.find({
            timerId,
            createdAt: {
              $gte: getLastDayTimer.createdAt,
            },
            $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
          }).countDocuments()
          getTimerLogs = await TimerLogs.find({
            timerId,
            createdAt: {
              $gte: getLastDayTimer.createdAt,
            },
            $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
          })
            .populate("partId")
            .populate("machineId")
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
}

export const timerUnitsCreatedCount = async (req: Request, res: Response) => {
  const { locationId, timerId, page, countPerPage } = req.query
  if (!locationId || !timerId) {
    return res.json({
      error: true,
      message: REQUIRED_VALUES_MISSING,
      item: null,
      itemCount: null,
    })
  }
  try {
    const location = await Locations.findOne({
      _id: locationId,
    })
    dayjs.extend(utc.default)
    dayjs.extend(timezone.default)
    const timeZone = location?.timeZone
    const currentDateStart = dayjs
      .utc(dayjs.tz(dayjs(), timeZone ? timeZone : "").startOf("day"))
      .toISOString()
    const currentDateEnd = dayjs
      .utc(dayjs.tz(dayjs(), timeZone ? timeZone : "").endOf("day"))
      .toISOString()
    const getLastDayTimer = await ControllerTimers.findOne({
      locationId: locationId,
      timerId,
      createdAt: { $gte: currentDateStart, $lte: currentDateEnd },
    }).sort({ $natural: -1 })
    if (!getLastDayTimer) {
      return res.json({
        error: false,
        item: {},
        itemCount: 0,
        message: null,
      })
    }
    const timerLogsCount = await TimerLogs.find({
      timerId,
      createdAt: {
        $gte: getLastDayTimer.createdAt,
      },
      $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      stopReason: { $in: ["Unit Created"] },
    }).countDocuments()
    res.json({
      error: false,
      item: { count: timerLogsCount },
      itemCount: timerLogsCount,
      message: null,
    })
  } catch (error) {
    return res.json({
      error: true,
      message: error,
      item: null,
      itemCount: null,
    })
  }
}

export const timerCount = async (req: Request, res: Response) => {
  const { locationId, timerId, page, countPerPage } = req.query
  if (!locationId || !timerId) {
    return res.json({
      error: true,
      message: REQUIRED_VALUES_MISSING,
      item: null,
      itemCount: null,
    })
  }
  try {
    const location = await Locations.findOne({
      _id: locationId,
    })
    dayjs.extend(utc.default)
    dayjs.extend(timezone.default)
    const timeZone = location?.timeZone
    const currentDateStart = dayjs
      .utc(dayjs.tz(dayjs(), timeZone ? timeZone : "").startOf("day"))
      .toISOString()
    const currentDateEnd = dayjs
      .utc(dayjs.tz(dayjs(), timeZone ? timeZone : "").endOf("day"))
      .toISOString()
    const getLastDayTimer = await ControllerTimers.findOne({
      locationId: locationId,
      timerId,
      createdAt: { $gte: currentDateStart, $lte: currentDateEnd },
    }).sort({ $natural: -1 })
    if (!getLastDayTimer) {
      return res.json({
        error: false,
        item: {},
        itemCount: 0,
        message: null,
      })
    }
    const timerLogsCount = await TimerLogs.find({
      timerId,
      createdAt: { $gte: getLastDayTimer.createdAt },
      $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
    }).countDocuments()
    res.json({
      error: false,
      item: { count: timerLogsCount },
      itemCount: timerLogsCount,
      message: null,
    })
  } catch (error) {
    return res.json({
      error: true,
      message: error,
      item: null,
      itemCount: null,
    })
  }
}
