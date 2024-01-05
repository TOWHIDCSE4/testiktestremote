import * as Sentry from "@sentry/node"
import { Request, Response } from "express"
import devOpsSession from "../../models/devOpsSession"
import {
  ADD_SUCCESS_MESSAGE,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import { ZDevOpsSession } from "custom-validator"
import DevOpsTimers from "../../models/devOpsTimers"
import { generateDevOpsTimers } from "../../utils/utils"
import devOpsTimers from "../../models/devOpsTimers"

export const sessionList = async (req: Request, res: Response) => {
  try {
    const sessionList = await devOpsSession
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
    res.json({
      error: false,
      items: sessionList,
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

export const timersBySession = async (req: Request, res: Response) => {
  try {
    const sessionList = await devOpsTimers.find({ sessionName: req.query.name })
    res.json({
      error: false,
      items: sessionList,
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

export const getUserSessions = async (req: Request, res: Response) => {
  try {
    const sessionList = await devOpsTimers.find({
      createdBy: res.locals.user._id,
    })
    res.json({
      error: false,
      items: sessionList,
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

export const addSession = async (req: Request, res: Response) => {
  const {
    name,
    endTime,
    noOfTimers,
    locationId,
    startTime,
    endTimeRange,
    unitCycleTime,
    machineClassIds,
    ...rest
  } = req.body
  if (name) {
    const sessionName =
      name + "_" + res.locals.user.firstName + res.locals.user.lastName
    const duration = Date.now() - new Date(endTime).getSeconds()
    const newSession = new devOpsSession({
      name: sessionName,
      duration: duration,
      createdAt: Date.now(),
      noOfTimers,
      ...rest,
    })

    const parsedSession = ZDevOpsSession.safeParse(req.body)
    if (parsedSession.success) {
      try {
        const existingSession = await devOpsSession.find({
          $or: [{ sessionName }],
        })
        if (existingSession.length === 0) {
          const createSession = await newSession.save()
          const results = generateDevOpsTimers({
            locationId,
            numberOfTimers: parseInt(noOfTimers),
            machineClassIds,
            endTimeRange,
            startTime,
            unitCycleTime,
            createdBy: res.locals.user._id,
            sessionName,
          })

          await DevOpsTimers.insertMany(results)
          res.json({
            error: false,
            item: createSession,
            itemCount: 1,
            message: ADD_SUCCESS_MESSAGE,
          })
        } else {
          res.json({
            error: true,
            message: "Record already exists",
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
        message: parsedSession.error.issues,
        item: null,
        itemCount: null,
      })
    }
  } else {
    res.json({
      error: true,
      message: "Required values are empty",
      item: null,
      itemCount: null,
    })
  }
}
