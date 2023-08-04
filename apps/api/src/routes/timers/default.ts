import { Request, Response } from "express"
import Timers from "../../models/timers"
import {
  UNKNOWN_ERROR_OCCURRED,
  REQUIRED_VALUE_EMPTY,
  TIMER__ALREADY_EXISTS,
} from "../../utils/constants"
import isEmpty from "lodash/isEmpty"

export const getAllTimers = async (req: Request, res: Response) => {
  try {
    const timersCount = await Timers.find().countDocuments()
    const getAllTimers = await Timers.find().sort({
      createdAt: -1,
    })
    res.json({
      items: getAllTimers,
      count: timersCount,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.status(500).json(message)
  }
}

export const getTimer = async (req: Request, res: Response) => {
  try {
    const getTimer = await Timers.findOne({
      _id: req.params.id,
      deletedAt: null,
    })
    res.json({
      item: getTimer,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.status(500).json(message)
  }
}

export const addTimer = async (req: Request, res: Response) => {
  const { factoryId, machineId, partId } = req.body
  if (factoryId && machineId && partId) {
    const newTimer = new Timers({
      factoryId,
      machineId,
      partId,
      updatedAt: null,
      deletedAt: null,
    })

    try {
      const getExistingTimer = await Timers.find({
        $or: [{ factoryId, machineId, partId }],
        deletedAt: { $exists: false },
      })
      if (getExistingTimer.length === 0) {
        const createTimer = await newTimer.save()
        res.json({ data: createTimer })
      } else {
        res.status(400).json(TIMER__ALREADY_EXISTS)
      }
    } catch (err: any) {
      const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
      res.status(500).json(message)
    }
  } else {
    res.status(400).json(REQUIRED_VALUE_EMPTY)
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
        res.json(updateTimer)
      } catch (err: any) {
        const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
        res.status(500).json(message)
      }
    } else {
      res.status(500).json("Timer cannot be found")
    }
  } else {
    res.status(400).json("Timer does not exist")
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
      res.json(deletedTimer)
    } else {
      throw new Error("Timer is already deleted")
    }
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.status(500).json(message)
  }
}
