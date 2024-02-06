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
import CycleTimers from "../../models/cycleTimers"
import {
  getEndOfDayTimezone,
  getHoursDifferent,
  getStartOfDayTimezone,
} from "../../utils/date"
import ControllerTimerService from "../../services/controllerTimerService"
import CycleTimerService from "../../services/cycleTimerService"
import ProductionCycleService from "../../services/productionCycleServices"

export const todayControllerTimer = async (req: Request, res: Response) => {
  dayjs.extend(utc.default)
  dayjs.extend(timezone.default)
  const io = getIo()
  const user = res.locals.user
  const { timerId } = req.query
  if (timerId) {
    try {
      const timer = await Timers.findOne({
        _id: timerId,
      })
      const locationId = String(timer?.locationId)

      const location = await Locations.findOne({
        _id: locationId,
      })
      if (!location) {
        throw new Error("Location Not Found")
      }
      const controllerTimer = await ControllerTimerService.getTodayByTimerId(
        timerId as string,
        location?.timeZone || ""
      )
      const timeZone = location?.timeZone || ""

      const controllerProductionHour = controllerTimer
        ? getHoursDifferent(controllerTimer.clientStartedAt, timeZone)
        : 0

      const isAllowed =
        controllerProductionHour < location.productionTime! ||
        roleMatrix.controller.start_when_production_ended.includes(user.role)

      if (isAllowed && controllerTimer) {
        const firstCycle = await CycleTimerService.getFirstCycleFrom(
          timerId as string,
          controllerTimer.clientStartedAt
        )
        const productionTime = location?.productionTime || 0
        const additionalTime = controllerTimer?.additionalTime || 0
        const totalProductionTime = productionTime + additionalTime
        let controllerShouldEndAt = null
        let hourToEnd = null
        if (firstCycle?.clientStartedAt) {
          controllerShouldEndAt = dayjs
            .utc(firstCycle.clientStartedAt)
            .add(totalProductionTime, "hour")
            .toISOString()

          hourToEnd = getHoursDifferent(
            new Date(),
            timeZone,
            dayjs.utc(controllerShouldEndAt).toDate()
          )
        }

        if (hourToEnd && hourToEnd < 0) {
          await ControllerTimerService.endAllByTimerId(timerId as string)
          await CycleTimerService.endAllByTimerId(timerId as string)

          const currentRunningLocation =
            await ControllerTimerService.getAllRunningByLocationId(
              locationId,
              timeZone
            )
          if (!currentRunningLocation.length) {
            await ProductionCycleService.endByLocationId(locationId)
          }
        }

        res.json({
          error: false,
          items: controllerTimer ? [controllerTimer] : [],
          // controllerStartedAt: controllerTimer.createdAt,
          controllerStartedAt: firstCycle ? firstCycle.clientStartedAt : null,
          controllerShouldEndAt,
          totalProductionTime,
          hourToEnd,
          itemCount: null,
          message: null,
        })
      } else if (!controllerTimer) {
        res.json({
          error: true,
          items: [],
          message: null,
        })
      } else {
        res.status(401).json({
          error: false,
          items: [controllerTimer],
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
