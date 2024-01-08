import * as Sentry from "@sentry/node"
const { ObjectId } = require("mongodb")
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

export const currentSessionTimers = async (req: Request, res: Response) => {
  try {
    const currentSession = await devOpsSession
      .find({
        endTime: { $gt: Date.now() },
      })
      .populate("timers")
      .exec()
    const active = JSON.parse(JSON.stringify(currentSession))
    const sessions = active.map((session: any) => {
      const isCurrentUser =
        active && new ObjectId(session.createdBy).equals(res.locals.user._id)
      return {
        ...session,
        isCurrentUser: isCurrentUser,
      }
    })
    res.json({
      error: false,
      items: sessions,
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
    noOfTimers,
    locationId,
    startTime,
    endTimeRange,
    unitCycleTime,
    machineClassIds,
    ...rest
  } = req.body
  if (name) {
    const currentTime = new Date()
    const endTime = currentTime.setMinutes(
      currentTime.getMinutes() + endTimeRange[1]
    )
    const sessionName =
      name + "_" + res.locals.user.firstName + res.locals.user.lastName
    const duration: number = new Date(endTime).getTime() - new Date().getTime()
    const newSession = new devOpsSession({
      name: sessionName,
      endTime,
      duration,
      noOfTimers,
      createdAt: Date.now(),
      createdBy: res.locals.user._id,
      ...rest,
    })

    const parsedSession = ZDevOpsSession.safeParse(req.body)
    if (parsedSession.success) {
      try {
        const existingSession = await devOpsSession.find({ name: sessionName })
        if (existingSession.length === 0) {
          const createSession = await newSession.save()
          const results = generateDevOpsTimers({
            sessionId: newSession._id,
            locationId,
            numberOfTimers: parseInt(noOfTimers),
            machineClassIds,
            endTimeRange,
            startTime,
            unitCycleTime,
            createdBy: res.locals.user._id,
            sessionName,
          })

          const timers = await DevOpsTimers.insertMany(results)
          const timerIds = timers.map((timer) => timer._id)
          await devOpsSession.findByIdAndUpdate(newSession._id, {
            timers: timerIds,
          })

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
