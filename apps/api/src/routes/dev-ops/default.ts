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
import machineClasses from "../../models/machineClasses"
import { EndpointStats, getEndpointStats } from "../../middleware/requestCount"

export const sessionList = async (req: any, res: Response) => {
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

export const restartSession = async (req: Request, res: Response) => {
  try {
    let updatedSession
    const { sessionId } = req.body
    const session = await devOpsSession.findOne({ _id: sessionId })
    if (session) {
      const currentTime = new Date()
      const endTime = currentTime.getTime() + (session.duration ?? 0)
      session.createdAt = currentTime
      session.endTime = endTime.toString()
      await session.save()
      await devOpsTimers.deleteMany({ sessionId })
      await devOpsSession.updateOne(
        { _id: sessionId },
        { $unset: { timers: 1 } }
      )
      const results = generateDevOpsTimers({
        sessionId,
        locationId: session.locationId ?? "",
        numberOfTimers: session.noOfTimers ?? 1,
        machineClassIds: session.machineClassIds,
        endTimeRange: session.endTimeRange,
        startTime: session.startTime ?? 1,
        unitCycleTime: session.unitCycleTime,
        createdBy: res.locals.user._id,
        sessionName: session.name ?? "",
      })

      const timers = await DevOpsTimers.insertMany(results)
      const timerIds = timers.map((timer) => timer._id)
      updatedSession = await devOpsSession
        .findByIdAndUpdate(sessionId, { timers: timerIds }, { new: true })
        .populate("timers")
    }
    res.json({
      error: false,
      items: updatedSession,
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

export const timersByMachineClass = async (req: Request, res: Response) => {
  try {
    const session = await devOpsSession
      .findOne({ _id: req.query.sessionId })
      .populate("timers")
    const machines = await machineClasses.find()
    const timersByMachineClass: Record<string, number> = {}

    if (session?.timers) {
      for (const timer of session.timers) {
        //@ts-expect-error
        const machineClassId = timer.machineClassId
        const machineClass = machines.find(
          (machine) => machine._id.toString() === machineClassId.toString()
        )

        const machineClassName: string =
          (machineClass ? machineClass.name : "Unknown") ?? ""

        // Count occurrences of the machine class
        timersByMachineClass[machineClassName] =
          (timersByMachineClass[machineClassName] || 0) + 1
      }
    }

    res.json({
      error: false,
      items: timersByMachineClass,
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
        active &&
        session.createdBy?.toString() === res.locals?.user?._id?.toString()
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
    const timers = noOfTimers * locationId.split(",").length
    const newSession = new devOpsSession({
      name: sessionName,
      endTime,
      duration,
      locationId,
      startTime,
      endTimeRange,
      unitCycleTime,
      machineClassIds,
      noOfTimers: timers,
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

export const requestTracker = (req: Request, res: Response) => {
  try {
    const filteredEndpointStats = getFilteredEndpointStats()
    res.json({
      message: "Endpoint Details",
      endpointStats: filteredEndpointStats,
    })
  } catch (error: any) {
    res.json({
      message: error.message,
    })
  }
}

export const getFilteredEndpointStats = () => {
  const fullStats = getEndpointStats()

  // Create a copy of the stats without the 'totalTime' and 'requestTime' properties
  const filteredStats: Record<
    string,
    Omit<EndpointStats, "totalTime" | "requestTime">
  > = {}

  for (const endpoint in fullStats) {
    const { totalTime, requestTime, ...statsWithoutTotalAndRequestTime } =
      fullStats[endpoint]
    filteredStats[endpoint] = statsWithoutTotalAndRequestTime
  }

  return filteredStats
}
