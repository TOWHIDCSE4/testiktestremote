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
    res.json({
      error: true,
      message: message,
      items: null,
      itemCount: null,
    })
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
        res.json({
          error: false,
          item: createTimerLog,
          itemCount: 1,
          message: ADD_SUCCESS_MESSAGE,
        })
      } else {
        res.json({
          error: true,
          message: TIMER_LOG_ALREADY_EXISTS,
          items: null,
          itemCount: null,
        })
      }
    } catch (err: any) {
      const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
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
      message: REQUIRED_VALUE_EMPTY,
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
    res.json({
      error: true,
      message: message,
      items: null,
      itemCount: null,
    })
  }
}
