import { Request, Response } from "express"
import { UNKNOWN_ERROR_OCCURRED } from "../../utils/constants"
import ControllerTimers from "../../models/controllerTimers"
import dayjs from "dayjs"
import * as timezone from "dayjs/plugin/timezone"
import * as utc from "dayjs/plugin/utc"
import Locations from "../../models/location"
import * as Sentry from "@sentry/node"
import CycleTimers from "../../models/cycleTimers"
import ProductionCycleService from "../../services/productionCycleServices"
import { getSecondsDifferent } from "../../utils/date"

export const inProduction = async (req: Request, res: Response) => {
  dayjs.extend(utc.default)
  dayjs.extend(timezone.default)
  try {
    const locationId = String(req.params.locationId)
    const location = await Locations.findOne({
      _id: locationId,
    })
    const timeZone = location?.timeZone

    const productionCycle =
      await ProductionCycleService.getCurrentRunningByLocationId(locationId)

    if (productionCycle) {
      const diffSeconds = getSecondsDifferent(
        productionCycle.createdAt,
        timeZone
      )
      return res.json({
        error: false,
        item: {
          seconds: diffSeconds,
          started: true,
          createdAt: productionCycle.createdAt,
        },
        itemCount: null,
        message: null,
      })
    } else {
      return res.json({
        error: false,
        item: {
          seconds: 0,
          started: false,
          createdAt: null,
        },
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
