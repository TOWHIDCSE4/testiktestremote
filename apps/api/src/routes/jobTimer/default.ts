import { Request, Response } from "express"
import JobTimer from "../../models/jobTimer"
import {
  UNKNOWN_ERROR_OCCURRED,
  REQUIRED_VALUE_EMPTY,
  TIMER_READING_ALREADY_EXISTS,
  ADD_SUCCESS_MESSAGE,
  UPDATE_SUCCESS_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
} from "../../utils/constants"
import isEmpty from "lodash/isEmpty"
import { ZJobTimer } from "custom-validator"
import * as Sentry from "@sentry/node"

export const getAllJobTimer = async (req: Request, res: Response) => {
  try {
    const timerReadingCount = await JobTimer.find().countDocuments()
    const getAllJobTimer = await JobTimer.find().sort({
      createdAt: -1,
    })
    res.json({
      error: false,
      items: getAllJobTimer,
      itemCount: timerReadingCount,
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

export const getJobTimer = async (req: Request, res: Response) => {
  try {
    const getJobTimer = await JobTimer.findOne({
      _id: req.params.id,
      deletedAt: null,
    })
    res.json({
      error: false,
      item: getJobTimer,
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

export const addJobTimer = async (req: Request, res: Response) => {
  const { action, timerId } = req.body
  const parsedJobTimer = ZJobTimer.safeParse(req.body)
  if (parsedJobTimer.success) {
    try {
      const getExistingJobTimer = await JobTimer.find({
        $or: [{ action, timerId }],
        deletedAt: { $exists: false },
      })
      if (getExistingJobTimer.length === 0) {
        const newJobTimer = new JobTimer(req.body)
        const createJobTimer = await newJobTimer.save()
        res.json({
          error: false,
          item: createJobTimer,
          itemCount: 1,
          message: ADD_SUCCESS_MESSAGE,
        })
      } else {
        res.json({
          error: true,
          message: TIMER_READING_ALREADY_EXISTS,
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
      message: parsedJobTimer.error.issues,
      items: null,
      itemCount: null,
    })
  }
}

export const updateJobTimer = async (req: Request, res: Response) => {
  const getJobTimer = await JobTimer.find({
    _id: req.params.id,
    deletedAt: { $exists: false },
  })
  const condition = req.body
  if (getJobTimer.length > 0) {
    if (!isEmpty(condition)) {
      try {
        const updateJobTimer = await JobTimer.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
            updatedAt: Date.now(),
          },
          { new: true }
        )
        res.json({
          error: false,
          item: updateJobTimer,
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
        message: "Timer job cannot be found",
        items: null,
        itemCount: null,
      })
    }
  } else {
    res.json({
      error: true,
      message: "Timer reading does not exist",
      items: null,
      itemCount: null,
    })
  }
}

export const deleteJobTimer = async (req: Request, res: Response) => {
  try {
    const getJobTimer = await JobTimer.find({
      _id: req.params.id,
      deletedAt: null,
    })
    if (getJobTimer.length > 0) {
      const deleteJobTimer = await JobTimer.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      })
      const deletedJobTimer = await JobTimer.findById({
        _id: req.params.id,
      })
      res.json({
        error: false,
        item: deletedJobTimer,
        itemCount: 1,
        message: DELETE_SUCCESS_MESSAGE,
      })
    } else {
      throw new Error("Timer reading is already deleted")
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
