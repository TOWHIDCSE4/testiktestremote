import { Request, Response } from "express"
import { UNKNOWN_ERROR_OCCURRED } from "../../utils/constants"
import ControllerTimers from "../../models/controllerTimers"
import dayjs from "dayjs"
import * as timezone from "dayjs/plugin/timezone"
import * as utc from "dayjs/plugin/utc"
import Locations from "../../models/location"
import * as Sentry from "@sentry/node"
import CycleTimers from "../../models/cycleTimers"

export const inProduction = async (req: Request, res: Response) => {
  dayjs.extend(utc.default)
  dayjs.extend(timezone.default)
  try {
    const locationId = String(req.params.locationId)
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
      endAt: null,
    }).sort({ $natural: 1 })
    const firstCycle = getDayFirstTimer
      ? await CycleTimers.findOne({
          createdAt: { $gte: getDayFirstTimer.createdAt },
        })
      : null

    if (firstCycle) {
      const createdAtTZ = dayjs.tz(
        dayjs(firstCycle?.clientStartedAt),
        timeZone ? timeZone : ""
      )
      const currentDateTZ = dayjs.tz(dayjs(), timeZone ? timeZone : "")
      const diffHours = currentDateTZ.diff(createdAtTZ, "hour")
      if (location?.productionTime && location?.productionTime > diffHours) {
        const diffSeconds = currentDateTZ.diff(createdAtTZ, "second")
        res.json({
          error: false,
          item: {
            seconds: diffSeconds,
            started: true,
            createdAt: firstCycle?.clientStartedAt,
          },
          itemCount: null,
          message: null,
        })
      } else {
        res.json({
          error: false,
          item: {
            seconds: 0,
            started: false,
            createdAt: firstCycle?.clientStartedAt,
          },
          itemCount: null,
          message: null,
        })
      }
    } else {
      res.json({
        error: false,
        item: {
          seconds: 0,
          started: false,
        },
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
