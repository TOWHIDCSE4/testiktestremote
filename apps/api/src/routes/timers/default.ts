import { Request, Response } from "express"
import Timers from "../../models/timers"
import {
  UNKNOWN_ERROR_OCCURRED,
  REQUIRED_VALUE_EMPTY,
  TIMER__ALREADY_EXISTS,
  ADD_SUCCESS_MESSAGE,
  UPDATE_SUCCESS_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
} from "../../utils/constants"
import isEmpty from "lodash/isEmpty"
import { ZTimer } from "custom-validator"

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
    const getTimer = await Timers.findOne({
      _id: req.params.id,
      deletedAt: null,
    })
      .populate("partId")
      .populate("machineId")
    res.json({
      error: false,
      item: getTimer,
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

export const addTimer = async (req: Request, res: Response) => {
  const { factoryId, machineId, partId, locationId } = req.body
  if (factoryId && machineId && partId && locationId) {
    const newTimer = new Timers({
      factoryId,
      machineId,
      partId,
      locationId,
      updatedAt: null,
      deletedAt: null,
    })
    const parsedTimer = ZTimer.safeParse(req.body)
    if (parsedTimer.success) {
      try {
        const getExistingTimer = await Timers.find({
          $or: [{ factoryId, machineId, partId }],
          deletedAt: { $exists: false },
        })
        if (getExistingTimer.length === 0) {
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

export const updateTimer = async (req: Request, res: Response) => {
  const getTimer = await Timers.find({
    _id: req.params.id,
    deletedAt: { $exists: false },
  })
  const condition = req.body
  if (getTimer.length === 0) {
    if (!isEmpty(condition)) {
      try {
        const updateTimer = await Timers.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
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
    res.json({
      error: true,
      message: message,
      items: null,
      itemCount: null,
    })
  }
}
