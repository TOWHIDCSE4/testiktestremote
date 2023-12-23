import {
  REQUIRED_VALUE_EMPTY,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import { Request, Response } from "express"
import * as Sentry from "@sentry/node"
import CycleTimerService from "../../services/cycleTimerService"
import ControllerTimerService from "../../services/controllerTimerService"
import ProductionCycleService from "../../services/productionCycleServices"
import Location from "../../models/location"

export const endControllerTimer = async (req: Request, res: Response) => {
  const { timerId, locationId } = req.body
  const location = await Location.findById(locationId)
  try {
    if (timerId) {
      const runningControllerTimer =
        await ControllerTimerService.getAllRunningByTimerId(timerId)

      if (runningControllerTimer.length > 0) {
        const endTimer = await ControllerTimerService.endAllByTimerId(timerId)
        await CycleTimerService.endAllByTimerId(timerId)
        const locationRunningControllers =
          await ControllerTimerService.getAllRunningByLocationId(
            locationId,
            location?.timeZone || ""
          )
        const isLocationHaveRunningController =
          locationRunningControllers.length > 0

        if (!isLocationHaveRunningController) {
          await ProductionCycleService.endByLocationId(locationId)
        }
        res.json({
          error: false,
          item: endTimer.length ? endTimer[0] : null,
          itemCount: 1,
          message: "Timer ended successfully",
        })
      } else {
        res.status(404).json({
          error: true,
          message: "Starting Timer controller not found",
          item: null,
          itemCount: null,
        })
      }
    } else {
      res.json({
        error: true,
        message: REQUIRED_VALUE_EMPTY,
        item: null,
        itemCount: null,
      })
    }
  } catch (err: any) {
    console.log(err)
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    Sentry.captureException(err)
    res.json({
      error: true,
      message: message,
      item: null,
      itemCount: null,
    })
  }
}
