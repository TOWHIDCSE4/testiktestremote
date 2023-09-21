import { Request, Response } from "express"
import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import TimerLogs from "../../models/timerLogs"

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
        locationId: locationId,
        ...(factoryId && { factoryId: factoryId }),
        ...(partId && { partId: partId }),
        ...(machineId && { machineClassId: machineId }),
        ...(machineClassId && { machineClassId: machineClassId }),
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
        locationId: locationId,
        ...(factoryId && { factoryId: factoryId }),
        ...(partId && { partId: partId }),
        ...(machineId && { machineClassId: machineId }),
        ...(machineClassId && { machineClassId: machineClassId }),
        createdAt: {
          $gte: new Date(startDate as string) || undefined,
          $lt: new Date(endDate as string) || undefined,
        },
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
