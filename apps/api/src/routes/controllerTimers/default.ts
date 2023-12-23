import { Request, Response } from "express"
import ControllerTimer from "../../models/controllerTimers"
import {
  UNKNOWN_ERROR_OCCURRED,
  REQUIRED_VALUE_EMPTY,
  ADD_SUCCESS_MESSAGE,
  UPDATE_SUCCESS_MESSAGE,
  CONTROLLER_TIMER_ALREADY_EXISTS,
} from "../../utils/constants"
import isEmpty from "lodash/isEmpty"
import { ZControllerTimer } from "custom-validator"
import Locations from "../../models/location"
import dayjs from "dayjs"
import * as timezone from "dayjs/plugin/timezone"
import * as utc from "dayjs/plugin/utc"
import * as Sentry from "@sentry/node"
import { ioEmit } from "../../config/setup-socket"
import CycleTimers from "../../models/cycleTimers"
import { getEndOfDayTimezone, getStartOfDayTimezone } from "../../utils/date"
import ProductionCycleService from "../../services/productionCycleServices"
import ControllerTimerService from "../../services/controllerTimerService"

export const getAllControllerTimers = async (req: Request, res: Response) => {
  try {
    const controllerTimerCount = await ControllerTimer.find().countDocuments()
    const getAllControllerTimers = await ControllerTimer.find().sort({
      createdAt: -1,
    })
    res.json({
      error: false,
      items: getAllControllerTimers,
      itemCount: controllerTimerCount,
      message: null,
    })
  } catch (err: any) {
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

export const getControllerTimer = async (req: Request, res: Response) => {
  try {
    const getControllerTimer = await ControllerTimer.findOne({
      _id: req.params.id,
      deletedAt: null,
    })
    res.json({
      error: false,
      item: getControllerTimer,
      itemCount: 1,
      message: null,
    })
  } catch (err: any) {
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

export const addControllerTimer = async (req: Request, res: Response) => {
  dayjs.extend(utc.default)
  dayjs.extend(timezone.default)
  const { timerId, locationId, newSession, clientStartedAt } = req.body
  if (timerId && locationId) {
    const parseControllerTimer = ZControllerTimer.safeParse(req.body)
    if (parseControllerTimer.success) {
      try {
        const location = await Locations.findOne({
          _id: locationId,
        })
        const timeZone = location?.timeZone || ""

        const isControllerExistToday =
          await ControllerTimerService.isRunningTodayByTimerId(
            timerId,
            timeZone
          )
        if (!isControllerExistToday || newSession) {
          const newControllerTimer = await ControllerTimerService.create({
            timerId,
            locationId,
            endAt: null,
            createdAt: new Date(),
            clientStartedAt,
          })
          res.json({
            error: false,
            item: newControllerTimer,
            itemCount: 1,
            message: ADD_SUCCESS_MESSAGE,
          })
        } else {
          res.json({
            error: true,
            message: CONTROLLER_TIMER_ALREADY_EXISTS,
            item: null,
            itemCount: null,
          })
        }
      } catch (err: any) {
        const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
        Sentry.captureException(err)
        res.json({
          error: true,
          message: message,
          item: null,
          itemCount: null,
        })
      }
    } else {
      res.json({
        error: true,
        message: parseControllerTimer.error.issues,
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
}

export const updateControllerTimer = async (req: Request, res: Response) => {
  const getControllerTimer = await ControllerTimer.findOne({
    _id: req.params.id,
    deletedAt: null,
  })
  const condition = req.body
  if (getControllerTimer) {
    if (!isEmpty(condition)) {
      try {
        const bodyCreatedAt = req.body.clientStartedAt || req.body.createdAt
        if (bodyCreatedAt) {
          const firstCycle = await CycleTimers.findOne({
            timerId: getControllerTimer.timerId,
            createdAt: { $gte: getControllerTimer.createdAt },
          })
            .sort({ $natural: 1 })
            .limit(1)
          if (firstCycle) {
            await CycleTimers.findOneAndUpdate(
              {
                _id: firstCycle.id,
              },
              {
                createdAt: bodyCreatedAt,
                clientStartedAt: bodyCreatedAt,
              }
            )
          }
          const runningByLocationId =
            await ProductionCycleService.getCurrentRunningByLocationId(
              String(getControllerTimer.locationId)
            )
          if (!runningByLocationId) {
            ProductionCycleService.startByLocation(
              String(getControllerTimer.locationId),
              bodyCreatedAt
            )
          }
        }
        const updateControllerTimer = await ControllerTimer.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
            updatedAt: Date.now(),
          },
          { new: true }
        )
        res.json({
          error: false,
          message: UPDATE_SUCCESS_MESSAGE,
          item: updateControllerTimer,
          itemCount: 1,
        })
      } catch (err: any) {
        const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
        Sentry.captureException(err)
        res.json({
          error: true,
          message: message,
          item: null,
          itemCount: null,
        })
      }
    } else {
      res.json({
        error: true,
        message: "Controller Timer cannot be found",
        item: null,
        itemCount: null,
      })
    }
  } else {
    res.json({
      error: true,
      message: "Controller Timer does not exist",
      item: null,
      itemCount: null,
    })
  }
}
