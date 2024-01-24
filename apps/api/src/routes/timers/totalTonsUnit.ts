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
import * as Sentry from "@sentry/node"

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
        endAt: null,
      }).sort({ $natural: -1 })
      if (getDayController) {
        const getDayControllerLogs = await TimerLogs.find({
          timerId: req.query.timerId,
          stopReason: { $in: ["Unit Created"] },
          createdAt: { $gte: getDayController.createdAt, $lte: currentDateEnd },
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
                partsTotalTons / (hoursPass === 0 ? 1 : Math.trunc(hoursPass)),
              unitPerHour:
                logTotalCount / (hoursPass === 0 ? 1 : Math.trunc(hoursPass)),
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
      itemCount: null,
      message: REQUIRED_VALUES_MISSING,
    })
  }
}

export const globalTotalUnits = async (req: Request, res: Response) => {
  if (req.query.locationId) {
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

      const getDayControllerLogs = await TimerLogs.find({
        locationId,
        stopReason: { $in: ["Unit Created"] },
        createdAt: { $gte: currentDateStart, $lte: currentDateEnd },
      }).populate("partId")
      const logTotalUnitCount = getDayControllerLogs.length
      if (logTotalUnitCount > 0) {
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
            dailyUnits: logTotalUnitCount,
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
      itemCount: null,
      message: REQUIRED_VALUES_MISSING,
    })
  }
}

export const allLocationTotalUnits = async (req: Request, res: Response) => {
  try {
    dayjs.extend(utc.default)
    dayjs.extend(timezone.default)

    const currentDateStart = dayjs
      .utc(dayjs.tz(dayjs()).startOf("day"))
      .toISOString()
    const currentDateEnd = dayjs
      .utc(dayjs.tz(dayjs()).endOf("day"))
      .toISOString()

    const getDayControllerLogs = await TimerLogs.find({
      stopReason: { $in: ["Unit Created"] },
      createdAt: { $gte: currentDateStart, $lte: currentDateEnd },
    }).populate("partId")
    const logTotalUnitCount = getDayControllerLogs.length
    if (logTotalUnitCount > 0) {
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
          dailyUnits: logTotalUnitCount,
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
}

export const locationGroupedTotals = async (req: Request, res: Response) => {
  try {
    const locations = await Locations.find()
    const data = await Promise.all(
      locations.map(async (item: any) => {
        dayjs.extend(utc.default)
        dayjs.extend(timezone.default)

        const locationId = item._id
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

        const getDayControllerLogs = await TimerLogs.find({
          locationId,
          stopReason: { $in: ["Unit Created"] },
          createdAt: { $gte: currentDateStart, $lte: currentDateEnd },
        }).populate("partId")
        const logTotalUnitCount = getDayControllerLogs.length
        if (logTotalUnitCount > 0) {
          const partsTotalTons = getDayControllerLogs
            ? getDayControllerLogs.reduce((acc, val) => {
                // @ts-expect-error
                return acc + (val?.partId?.tons ? val?.partId?.tons : 0)
              }, 0)
            : 0
          return {
            _id: item._id,
            totalUnits: logTotalUnitCount,
            totalTons: partsTotalTons,
          }
        }
        return {
          _id: item._id,
          totalUnits: 0,
          totalTons: 0,
        }
      })
    )

    res.json({
      error: false,
      item: data,
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
}
