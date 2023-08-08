import express from "express"
import { Request, Response } from "express"
import TimerLogs from "../../models/timerLogs"
import {
  UNKNOWN_ERROR_OCCURRED,
  REQUIRED_VALUE_EMPTY,
  ACCOUNT_ALREADY_EXISTS,
  TIMER_LOG_ALREADY_EXISTS,
} from "../../utils/constants"
import CryptoJS from "crypto-js"
import { keys } from "../../config/keys"
import isEmpty from "lodash/isEmpty"

export const getAllTimeLogs = async (req: Request, res: Response) => {
  try {
    const timerLogsCount = await TimerLogs.find().countDocuments()
    const getAllTimerLogs = await TimerLogs.find().sort({
      createdAt: -1,
    })
    res.json({
      error: false,
      items: getAllTimerLogs,
      count: timerLogsCount,
      errMessage: null,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.status(500).json(message)
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
      errMessage: null,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.status(500).json(message)
  }
}

export const addTimeLog = async (req: Request, res: Response) => {
  const { partId, timerId, time, operator, status, stopReason } = req.body
  if (partId && timerId && time && operator && status && stopReason) {
    const newTomerLog = new TimerLogs({
      partId,
      timerId,
      time,
      operator,
      status,
      stopReason,
      updatedAt: null,
      deletedAt: null,
    })

    try {
      const getExistingTimerLog = await TimerLogs.find({
        $and: [{ partId }, { timerId }],
        deletedAt: { $exists: false },
      })
      if (getExistingTimerLog.length === 0) {
        const createTimerLog = await newTomerLog.save()
        res.json({ error: false, data: createTimerLog, errMessage: null })
      } else {
        res.status(400).json(TIMER_LOG_ALREADY_EXISTS)
      }
    } catch (err: any) {
      const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
      res.status(500).json(message)
    }
  } else {
    res.status(400).json(REQUIRED_VALUE_EMPTY)
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
        res.json(updateTimerLog)
      } catch (err: any) {
        const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
        res.status(500).json(message)
      }
    } else {
      res.status(500).json("Timer log cannot be found")
    }
  } else {
    res.status(400).json("Timer log does not exist")
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
      res.json(deletedTimerLog)
    } else {
      throw new Error("Timer log is already deleted")
    }
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.status(500).json(message)
  }
}
