import express from "express"
import { Request, Response } from "express"
import TimerLogs from "../../models/timerLogs"
import {
  UNKNOWN_ERROR_OCCURRED,
  REQUIRED_VALUE_EMPTY,
  ACCOUNT_ALREADY_EXISTS,
  TIMER_LOG_ALREADY_EXISTS,
  ADD_SUCCESS_MESSAGE,
  UPDATE_SUCCESS_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
} from "../../utils/constants"
import isEmpty from "lodash/isEmpty"
import { ZTimerLog } from "custom-validator"
import Jobs from "../../models/jobs"
import * as Sentry from "@sentry/node"

export const getAllTimeLogs = async (req: Request, res: Response) => {
  try {
    const timerLogsCount = await TimerLogs.find().countDocuments()
    const getAllTimerLogs = await TimerLogs.find().sort({
      createdAt: -1,
    })
    res.json({
      error: false,
      items: getAllTimerLogs,
      itemCount: timerLogsCount,
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

export const getTimeLog = async (req: Request, res: Response) => {
  try {
    const getTimerLog = await TimerLogs.findOne({
      _id: req.params.id,
      deletedAt: null,
    })
    res.json({
      error: false,
      item: getTimerLog,
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

export const addTimeLog = async (req: Request, res: Response) => {
  const parsedTimerLog = ZTimerLog.safeParse(req.body)
  if (parsedTimerLog.success) {
    try {
      const checkIfHasData = await TimerLogs.findOne()
      const lastTimerLog = await TimerLogs.find()
        .limit(1)
        .sort({ $natural: -1 })
      if (req.body.jobId) {
        const job = await Jobs.findOne({ _id: req.body.jobId })
        const targetCountJob = job?.count
        const currCountJob = await TimerLogs.find({
          stopReason: { $in: ["Unit Created"] },
          jobId: req.body.jobId,
        }).countDocuments()
        if (targetCountJob && currCountJob === targetCountJob) {
          const getStockJob = await Jobs.findOne({
            locationId: req.body.locationId,
            partId: req.body.partId,
            factoryId: req.body.factoryId,
            isStock: true,
            $and: [
              { status: { $ne: "Deleted" } },
              { status: { $ne: "Archived" } },
            ],
            $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
          })
          if (getStockJob) {
            const newTimerLog = new TimerLogs({
              ...req.body,
              jobId: getStockJob?._id,
              globalCycle: !checkIfHasData
                ? 100000
                : (lastTimerLog[0].globalCycle
                    ? lastTimerLog[0].globalCycle
                    : 0) + 1,
            })
            await newTimerLog.save()
          }
          res.json({
            error: true,
            item: null,
            data: getStockJob,
            itemCount: null,
            message: "Target count exceeded, log was assigned to stock.",
          })
        } else {
          const newTimerLog = new TimerLogs({
            ...req.body,
            globalCycle: !checkIfHasData
              ? 100000
              : (lastTimerLog[0].globalCycle
                  ? lastTimerLog[0].globalCycle
                  : 0) + 1,
          })
          const createTimerLog = await newTimerLog.save()
          res.json({
            error: false,
            item: createTimerLog,
            itemCount: 1,
            message: ADD_SUCCESS_MESSAGE,
          })
        }
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
      message: parsedTimerLog.error.issues,
      items: null,
      itemCount: null,
    })
  }
}

export const updateTimeLog = async (req: Request, res: Response) => {
  const getTimerLog = await TimerLogs.find({
    _id: req.params.id,
    deletedAt: { $exists: false },
  })
  const condition = req.body
  if (getTimerLog.length === 0) {
    if (!isEmpty(condition)) {
      try {
        const updateTimerLog = await TimerLogs.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
            updatedAt: Date.now(),
          },
          { new: true }
        )
        res.json({
          error: false,
          item: updateTimerLog,
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
        message: "Timer log cannot be found",
        items: null,
        itemCount: null,
      })
    }
  } else {
    res.json({
      error: true,
      message: "Timer log does not exist",
      items: null,
      itemCount: null,
    })
  }
}

export const deleteTimeLog = async (req: Request, res: Response) => {
  try {
    const getTimerLog = await TimerLogs.find({
      _id: req.params.id,
      deletedAt: null,
    })
    if (getTimerLog.length > 0) {
      const deleteTimerLog = await TimerLogs.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      })
      const deletedTimerLog = await TimerLogs.findById({
        _id: req.params.id,
      })
      res.json({
        error: false,
        item: deletedTimerLog,
        itemCount: 1,
        message: DELETE_SUCCESS_MESSAGE,
      })
    } else {
      throw new Error("Timer log is already deleted")
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
