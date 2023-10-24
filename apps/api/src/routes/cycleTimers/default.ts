import { Request, Response } from "express"
import CycleTimer from "../../models/cycleTimers"
import {
  UNKNOWN_ERROR_OCCURRED,
  REQUIRED_VALUE_EMPTY,
  ADD_SUCCESS_MESSAGE,
  UPDATE_SUCCESS_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
  CYCLE_TIMER_ALREADY_EXISTS,
} from "../../utils/constants"
import isEmpty from "lodash/isEmpty"
import { ZCycleTimer } from "custom-validator"
import { date } from "zod"
import * as Sentry from "@sentry/node"
import { getIo } from "../../config/setup-socket"

export const getAllCycleTimers = async (req: Request, res: Response) => {
  try {
    const cycleTimerCount = await CycleTimer.find().countDocuments()
    const getAllCycleTimers = await CycleTimer.find().sort({ createdAt: -1 })
    res.json({
      error: false,
      items: getAllCycleTimers,
      itemCount: cycleTimerCount,
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

export const getCycleTimer = async (req: Request, res: Response) => {
  try {
    const getCycleTimer = await CycleTimer.findOne({
      _id: req.params.id,
      deletedAt: null,
    })
    res.json({
      error: false,
      item: getCycleTimer,
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

export const addCycleTimer = async (req: Request, res: Response) => {
  const io = getIo()
  const { timerId } = req.body
  io.emit(`timer-${timerId}`, { action: "pre-add" })
  if (timerId) {
    const newCycleTimer = new CycleTimer({
      timerId,
      endAt: null,
      createdAt: Date.now(),
    })
    const parseCycleTimer = ZCycleTimer.safeParse(req.body)
    if (parseCycleTimer.success) {
      try {
        const getExistingCycleTimer = await CycleTimer.find({
          $or: [{ timerId }],
          endAt: null,
        })
        if (getExistingCycleTimer.length === 0) {
          const createCycleTimer = await newCycleTimer.save()
          io.emit(`timer-${timerId}`, { action: "add", ...createCycleTimer })
          res.json({
            error: false,
            item: createCycleTimer,
            itemCount: 1,
            message: ADD_SUCCESS_MESSAGE,
          })
        } else {
          res.json({
            error: true,
            message: CYCLE_TIMER_ALREADY_EXISTS,
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
        message: parseCycleTimer.error.issues,
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

export const updateCycleTimer = async (req: Request, res: Response) => {
  const getCycleTimer = await CycleTimer.find({
    _id: req.params.id,
    deletedAt: null,
  })
  const condition = req.body
  if (getCycleTimer.length !== 0) {
    if (!isEmpty(condition)) {
      try {
        const updateCycleTimer = await CycleTimer.findByIdAndUpdate(
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
          item: updateCycleTimer,
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
        message: "Cycle Timer cannot be found",
        item: null,
        itemCount: null,
      })
    }
  } else {
    res.json({
      error: true,
      message: "Cycle Timer does not exist",
      item: null,
      itemCount: null,
    })
  }
}
