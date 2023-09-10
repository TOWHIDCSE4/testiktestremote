import { Request, Response } from "express"
import Jobs from "../../models/jobs"
import {
  UNKNOWN_ERROR_OCCURRED,
  REQUIRED_VALUES_MISSING,
} from "../../utils/constants"
import dayjs from "dayjs"
import * as timezone from "dayjs/plugin/timezone"
import * as utc from "dayjs/plugin/utc"
import Locations from "../../models/location"
import JobTimer from "../../models/jobTimer"

export const getByTimerId = async (req: Request, res: Response) => {
  if (req.query.locationId && req.query.timerId) {
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
      const getDayJobTimer = await JobTimer.findOne({
        timerId: req.query.timerId,
        createdAt: { $gte: currentDateStart, $lte: currentDateEnd },
      })
      res.json({
        error: false,
        message: null,
        item: getDayJobTimer,
        itemCount: null,
      })
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
