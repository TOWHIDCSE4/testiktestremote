import { Request, Response } from "express"
import TimerReadings from "../../models/timerReadings"
import {
  UNKNOWN_ERROR_OCCURRED,
  REQUIRED_VALUE_EMPTY,
  TIMER_READING_ALREADY_EXISTS,
  ADD_SUCCESS_MESSAGE,
  UPDATE_SUCCESS_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
} from "../../utils/constants"
import isEmpty from "lodash/isEmpty"

export const getAllTimerReadings = async (req: Request, res: Response) => {
  try {
    const timerReadingCount = await TimerReadings.find().countDocuments()
    const getAllTimerReadings = await TimerReadings.find().sort({
      createdAt: -1,
    })
    res.json({
      error: false,
      items: getAllTimerReadings,
      itemCount: timerReadingCount,
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

export const getTimerReading = async (req: Request, res: Response) => {
  try {
    const getTimerReading = await TimerReadings.findOne({
      _id: req.params.id,
      deletedAt: null,
    })
    res.json({
      error: false,
      item: getTimerReading,
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

export const addTimerReading = async (req: Request, res: Response) => {
  const { action, timerId } = req.body
  if (action && timerId) {
    const newTimerReading = new TimerReadings({
      action,
      timerId,
      updatedAt: null,
      deletedAt: null,
    })

    try {
      const getExistingTimerReading = await TimerReadings.find({
        $or: [{ action, timerId }],
        deletedAt: { $exists: false },
      })
      if (getExistingTimerReading.length === 0) {
        const createTimerReading = await newTimerReading.save()
        res.json({
          error: false,
          item: createTimerReading,
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

export const updateTimerReading = async (req: Request, res: Response) => {
  const getTimerReading = await TimerReadings.find({
    _id: req.params.id,
    deletedAt: { $exists: false },
  })
  const condition = req.body
  if (getTimerReading.length === 0) {
    if (!isEmpty(condition)) {
      try {
        const updateTimerReading = await TimerReadings.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
            updatedAt: Date.now(),
          },
          { new: true }
        )
        res.json({
          error: false,
          item: updateTimerReading,
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
        message: "Timer reading cannot be found",
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

export const deleteTimerReading = async (req: Request, res: Response) => {
  try {
    const getTimerReading = await TimerReadings.find({
      _id: req.params.id,
      deletedAt: null,
    })
    if (getTimerReading.length > 0) {
      const deleteTimerReading = await TimerReadings.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            deletedAt: Date.now(),
          },
        }
      )
      const deletedTimerReading = await TimerReadings.findById({
        _id: req.params.id,
      })
      res.json({
        error: false,
        item: deletedTimerReading,
        itemCount: 1,
        message: DELETE_SUCCESS_MESSAGE,
      })
    } else {
      throw new Error("Timer reading is already deleted")
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
