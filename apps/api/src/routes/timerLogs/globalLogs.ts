import { Request, Response } from "express"
import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import TimerLogs from "../../models/timerLogs"
import mongoose from "mongoose"

export const globalLogs = async (req: Request, res: Response) => {
  const {
    locationId,
    factoryId,
    machineId,
    machineClassId,
    partId,
    page,
    startDate,
    endDate,
  } = req.query

  if (locationId) {
    try {
      const timerLogsCount = await TimerLogs.find({
        locationId: new mongoose.Types.ObjectId(locationId as string),
        ...(factoryId && {
          factoryId: new mongoose.Types.ObjectId(factoryId as string),
        }),
        ...(partId && {
          partId: new mongoose.Types.ObjectId(partId as string),
        }),
        ...(machineId && {
          machineClassId: new mongoose.Types.ObjectId(machineId as string),
        }),
        ...(machineClassId && {
          machineClassId: new mongoose.Types.ObjectId(machineClassId as string),
        }),
        ...(startDate &&
          endDate && {
            createdAt: {
              $gte: new Date(startDate as string),
              $lt: new Date(endDate as string),
            },
          }),
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      }).countDocuments()

      const getTimerLogs = await TimerLogs.find({
        locationId: new mongoose.Types.ObjectId(locationId as string),
        ...(factoryId && {
          factoryId: new mongoose.Types.ObjectId(factoryId as string),
        }),
        ...(partId && {
          partId: new mongoose.Types.ObjectId(partId as string),
        }),
        ...(machineId && {
          machineClassId: new mongoose.Types.ObjectId(machineId as string),
        }),
        ...(machineClassId && {
          machineClassId: new mongoose.Types.ObjectId(machineClassId as string),
        }),
        ...(startDate &&
          endDate && {
            createdAt: {
              $gte: new Date(startDate as string),
              $lt: new Date(endDate as string),
            },
          }),
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      })
        .populate("partId")
        .populate("operator")
        .populate("machineId")
        .sort({ createdAt: -1 })
        .skip(5 * (Number(page) - 1))
        .limit(5)

      res.json({
        error: false,
        items: getTimerLogs,
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
  } else {
    res.json({
      error: true,
      message: REQUIRED_VALUES_MISSING,
      items: null,
      itemCount: null,
    })
  }
}
