import { Request, Response } from "express"
import Timers from "../../models/timers"
import DevOpsTimers from "../../models/devOpsTimers"
import {
  UNKNOWN_ERROR_OCCURRED,
  REQUIRED_VALUE_EMPTY,
  TIMER__ALREADY_EXISTS,
  ADD_SUCCESS_MESSAGE,
  UPDATE_SUCCESS_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
  JOB_ACTION,
} from "../../utils/constants"
import isEmpty from "lodash/isEmpty"
import { ZTimer } from "custom-validator"
import * as Sentry from "@sentry/node"
import JobTimer from "../../models/jobTimer"
import { timer } from "../timerLogs/timer"
import TimerLogs from "../../models/timerLogs"
import Jobs from "../../models/jobs"
import { getIo, ioEmit } from "../../config/setup-socket"
import { generateDevOpsTimers } from "../../utils/utils"
import machineClasses from "../../models/machineClasses"
import { ObjectId } from "mongoose"

export const getAllTimers = async (req: Request, res: Response) => {
  try {
    const timersCount = await Timers.find().countDocuments()
    const getAllTimers = await Timers.find().sort({
      createdAt: -1,
    })
    res.json({
      error: false,
      items: getAllTimers,
      itemCount: timersCount,
      message: null,
    })
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

export const getTimer = async (req: Request, res: Response) => {
  try {
    const io = getIo()
    const getTimer = await Timers.findOne({
      _id: req.params.id,
      deletedAt: null,
    })
      .populate("factoryId")
      .populate("locationId")
      .populate("partId")
      .populate("machineId")
      .populate("machineClassId")
      .populate("operator")
      .populate("createdBy")

    const timerJob = await JobTimer.findOne({
      timerId: req.params.id,
      deletedAt: null,
    })

    const jobId = timerJob?.jobId
    const job = await Jobs.findOne({ _id: jobId })
    const getStockJob = !job?.isStock
      ? await Jobs.findOne({
          locationId: getTimer?.locationId?._id,
          partId: getTimer?.partId?._id,
          factoryId: getTimer?.factoryId?._id,
          isStock: true,
          $and: [
            { status: { $ne: "Deleted" } },
            { status: { $ne: "Archived" } },
          ],
          $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
        })
      : job

    const targetCountJob = !job?.isStock ? job?.count : "unlimited"

    const currCountJob = !job?.isStock
      ? await TimerLogs.find({
          stopReason: { $in: ["Unit Created"] },
          jobId: jobId,
        }).countDocuments()
      : null

    const limitReached = currCountJob === targetCountJob || false
    const recommendation =
      getStockJob && limitReached
        ? JOB_ACTION.SWITCH
        : !getStockJob && limitReached
        ? JOB_ACTION.STOP
        : JOB_ACTION.CONTINUE
    const jobToBe =
      recommendation === JOB_ACTION.SWITCH
        ? getStockJob?._id
        : recommendation === JOB_ACTION.CONTINUE
        ? jobId
        : null
    if (
      recommendation === JOB_ACTION.STOP ||
      recommendation === JOB_ACTION.SWITCH
    ) {
      ioEmit(`timer-${req.body.timerId}`, {
        action: `job-change`,
        route: "GET//timers",
        data: {
          completed: limitReached,
          recommendation,
          jobToBe,
          data: getStockJob,
        },
      })
    }
    //@ts-expect-error
    const { _doc } = getTimer
    const { operator, operatorName, ...rest } = _doc
    res.json({
      error: false,
      completed: limitReached,
      recommendation,
      jobToBe,
      item: {
        ...rest,
        operator: operator
          ? operator
          : { firstName: operatorName, lastName: "" },
      },
      itemCount: 1,
      message: null,
    })
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

export const addTimer = async (req: Request, res: Response) => {
  const { factoryId, machineId, machineClassId, partId, locationId } = req.body
  if (factoryId && machineId && machineClassId && partId && locationId) {
    const parsedTimer = ZTimer.safeParse(req.body)
    if (parsedTimer.success) {
      try {
        const getExistingTimer = await Timers.find({
          $or: [{ locationId, machineId }],
          deletedAt: { $exists: false },
        })
        if (getExistingTimer.length === 0) {
          const newTimer = new Timers(req.body)
          const createTimer = await newTimer.save()
          res.json({
            error: false,
            item: createTimer,
            itemCount: 1,
            message: ADD_SUCCESS_MESSAGE,
          })
        } else {
          res.json({
            error: true,
            message: TIMER__ALREADY_EXISTS,
            items: null,
            itemCount: null,
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
    } else {
      res.json({
        error: true,
        message: parsedTimer.error.issues,
        items: null,
        itemCount: null,
      })
    }
  } else {
    res.json({
      error: true,
      message: REQUIRED_VALUE_EMPTY,
      items: null,
      itemCount: null,
    })
  }
}

export const getDevOpsTimers = async (req: Request, res: Response) => {
  const locations = req.query?.locations as string
  const locationsIds = locations?.split(",")

  const timers = await DevOpsTimers.aggregate([
    { $match: { createdBy: res.locals.user._id } },
    { $group: { _id: "$sessionName", timers: { $push: "$$ROOT" } } },
  ])

  const totalOfTimers = await DevOpsTimers.find({
    createdBy: res.locals.user._id,
  }).countDocuments()

  try {
    res.json({
      error: false,
      items: timers,
      itemCount: totalOfTimers,
      message: null,
    })
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

export const createDevOpsTimers = async (req: Request, res: Response) => {
  const {
    locationId,
    numberOfTimers,
    startTime,
    endTimeRange,
    unitCycleTime,
    selectedMachineClasses,
    sessionName,
  } = req.body
  try {
    await DevOpsTimers.deleteMany({ createdBy: res.locals.user._id })

    const results = generateDevOpsTimers({
      locationId,
      numberOfTimers: parseInt(numberOfTimers),
      machineClassIds: selectedMachineClasses,
      endTimeRange,
      startTime,
      unitCycleTime,
      createdBy: res.locals.user._id,
      sessionName,
    })

    await DevOpsTimers.insertMany(results)

    res.json({
      error: false,
      item: "Timers hase been created.",
      itemCount: 1,
      message: ADD_SUCCESS_MESSAGE,
    })
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

export const createDevOpsTimersUnit = async (req: Request, res: Response) => {
  const { timerId } = req.body
  try {
    await DevOpsTimers.findByIdAndUpdate(timerId, { $inc: { units: 1 } })

    res.json({
      error: false,
      item: "Unit has been added.",
      itemCount: 1,
      message: ADD_SUCCESS_MESSAGE,
    })
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

export const updateTimer = async (req: Request, res: Response) => {
  const getTimer = await Timers.find({
    _id: req.params.id,
    $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
  })
  console.log(getTimer)
  const condition = req.body
  if (getTimer.length > 0) {
    if (!isEmpty(condition)) {
      try {
        const { operatorName, operator, ...rest } = req.body
        const updateTimer = await Timers.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              ...rest,
              operatorName: operatorName ? operatorName : null,
              operator: operator ? operator : null,
            },
            updatedAt: Date.now(),
          },
          { new: true }
        )
        res.json({
          error: false,
          item: updateTimer,
          itemCount: 1,
          message: UPDATE_SUCCESS_MESSAGE,
        })
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
    } else {
      res.json({
        error: true,
        message: "Timer cannot be found",
        items: null,
        itemCount: null,
      })
    }
  } else {
    res.json({
      error: true,
      message: "Timer does not exist",
      items: null,
      itemCount: null,
    })
  }
}

export const deleteTimer = async (req: Request, res: Response) => {
  try {
    const getTimer = await Timers.find({
      _id: req.params.id,
      deletedAt: null,
    })
    if (getTimer.length > 0) {
      const deleteTimer = await Timers.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      })
      const deletedTimer = await Timers.findById({
        _id: req.params.id,
      })
      res.json({
        error: false,
        item: deletedTimer,
        itemCount: 1,
        message: DELETE_SUCCESS_MESSAGE,
      })
    } else {
      throw new Error("Timer is already deleted")
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
