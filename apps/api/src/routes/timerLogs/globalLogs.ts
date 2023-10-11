import { Request, Response } from "express"
import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import TimerLogs from "../../models/timerLogs"
import mongoose from "mongoose"
import parts from "../../models/parts"
import dayjs from "dayjs"
import timerLogs from "../../models/timerLogs"
import * as Sentry from "@sentry/node"

export const globalLogs = async (req: Request, res: Response) => {
  const {
    locationId,
    factoryId,
    machineId,
    machineClassId,
    partId,
    page,
    sort,
    key,
    startDate = dayjs().startOf("week"),
    endDate = dayjs().endOf("week"),
  } = req.query

  const sortObj = {}
  if (sort && key) {
    //@ts-expect-error
    sortObj[`${key}`] = sort
  } else {
    //@ts-expect-error
    sortObj["createdAt"] = "desc"
  }

  if (locationId) {
    try {
      const timerLogsCount = await TimerLogs.find({
        ...(locationId && {
          locationId: new mongoose.Types.ObjectId(locationId as string),
        }),
        ...(factoryId && {
          factoryId: new mongoose.Types.ObjectId(factoryId as string),
        }),
        ...(partId && {
          partId: new mongoose.Types.ObjectId(partId as string),
        }),
        ...(machineId && {
          machineId: new mongoose.Types.ObjectId(machineId as string),
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
        // locationId: new mongoose.Types.ObjectId(locationId as string),
        ...(locationId && {
          locationId: new mongoose.Types.ObjectId(locationId as string),
        }),
        ...(factoryId && {
          factoryId: new mongoose.Types.ObjectId(factoryId as string),
        }),
        ...(partId && {
          partId: new mongoose.Types.ObjectId(partId as string),
        }),
        ...(machineId && {
          machineId: new mongoose.Types.ObjectId(machineId as string),
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
        .sort({ ...sortObj })
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
      message: REQUIRED_VALUES_MISSING,
      items: null,
      itemCount: null,
    })
  }
}

export const globalLogsMulti = async (req: Request, res: Response) => {
  const {
    locationId,
    factoryId,
    machineId,
    machineClassId,
    partId,
    page,
    sort,
    key,
    startDate = dayjs().startOf("week"),
    endDate = dayjs().endOf("week"),
  } = req.query
  console.log(
    "🚀 ~ file: globalLogs.ts:131 ~ globalLogsMulti ~ partId:",
    partId
  )

  const sortObj = {}
  if (sort && key) {
    //@ts-expect-error
    sortObj[`${key}`] = sort
  } else {
    //@ts-expect-error
    sortObj["createdAt"] = "desc"
  }

  if (locationId && !!locationId?.length) {
    try {
      const timerLogsCount = await TimerLogs.find({
        ...(locationId &&
          !!locationId?.length && {
            locationId: {
              $in: locationId
                //@ts-expect-error
                ?.split(",")
                //@ts-expect-error
                .map((e) => new mongoose.Types.ObjectId(e)),
            },
          }),
        ...(factoryId &&
          !!factoryId?.length && {
            factoryId: {
              $in: factoryId
                //@ts-expect-error
                ?.split(",")
                //@ts-expect-error
                .map((e) => new mongoose.Types.ObjectId(e)),
            },
          }),
        ...(partId &&
          !!partId?.length && {
            partId: {
              $in: partId
                //@ts-expect-error
                ?.split(",")
                //@ts-expect-error
                .map((e) => new mongoose.Types.ObjectId(e)),
            },
          }),
        ...(machineId &&
          !!machineId?.length && {
            machineId: {
              $in: machineId
                //@ts-expect-error
                ?.split(",")
                //@ts-expect-error
                .map((e) => new mongoose.Types.ObjectId(e)),
            },
          }),
        ...(machineClassId &&
          !!machineClassId?.length && {
            machineClassId: {
              $in: machineClassId
                //@ts-expect-error
                ?.split(",")
                //@ts-expect-error
                .map((e) => new mongoose.Types.ObjectId(e)),
            },
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
        // locationId: new mongoose.Types.ObjectId(locationId as string),
        ...(locationId &&
          !!locationId?.length && {
            locationId: {
              $in: locationId
                //@ts-expect-error
                ?.split(",")
                //@ts-expect-error
                .map((e) => new mongoose.Types.ObjectId(e)),
            },
          }),
        ...(factoryId &&
          !!factoryId?.length && {
            factoryId: {
              $in: factoryId
                //@ts-expect-error
                ?.split(",")
                //@ts-expect-error
                .map((e) => new mongoose.Types.ObjectId(e)),
            },
          }),
        ...(partId &&
          !!partId?.length && {
            partId: {
              $in: partId
                //@ts-expect-error
                ?.split(",")
                //@ts-expect-error
                .map((e) => new mongoose.Types.ObjectId(e)),
            },
          }),
        ...(machineId &&
          !!machineId?.length && {
            machineId: {
              $in: machineId
                //@ts-expect-error
                ?.split(",")
                //@ts-expect-error
                .map((e) => new mongoose.Types.ObjectId(e)),
            },
          }),
        ...(machineClassId &&
          !!machineClassId?.length && {
            machineClassId: {
              $in: machineClassId
                //@ts-expect-error
                ?.split(",")
                //@ts-expect-error
                .map((e) => new mongoose.Types.ObjectId(e)),
            },
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
        .sort({ ...sortObj })
        .skip(10 * (Number(page) - 1))
        .limit(10)

      res.json({
        error: false,
        items: getTimerLogs,
        itemCount: timerLogsCount,
        message: null,
      })
    } catch (err: any) {
      console.log(err)
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
      message: REQUIRED_VALUES_MISSING,
      items: null,
      itemCount: null,
    })
  }
}
export const calculateGlobalMetrics = async (req: Request, res: Response) => {
  const {
    locationId,
    factoryId,
    machineId,
    machineClassId,
    partId,
    startDate,
    endDate,
  } = req.query
  try {
    const startTime = startDate
      ? dayjs(startDate as string)
      : dayjs().startOf("week")
    const endTime = endDate ? dayjs(endDate as string) : dayjs().endOf("week")

    // Calculate the total time in hours
    const totalTime = dayjs(endTime).diff(startTime, "hour")

    const partIds = await TimerLogs.distinct("partId")
    const aggregation = [
      {
        $match: {
          _id: { $in: partIds },
        },
      },
      {
        $group: {
          _id: null,
          totalTons: { $sum: "$tons" },
        },
      },
    ]
    if (locationId) {
      //@ts-expect-error
      const locationids = locationId
        .split(",")
        .map((e) => new mongoose.Types.ObjectId(e))
      //@ts-expect-error
      aggregation[0].$match.locationId = { $in: locationids }
    }
    if (factoryId) {
      //@ts-expect-error
      const factoryids = factoryId
        .split(",")
        .map((e) => new mongoose.Types.ObjectId(e))
      //@ts-expect-error
      aggregation[0].$match.factoryId = { $in: factoryids }
    }
    if (machineId) {
      //@ts-expect-error
      const machineids = machineId
        .split(",")
        .map((e) => new mongoose.Types.ObjectId(e))
      //@ts-expect-error
      aggregation[0].$match.machineId = { $in: machineids }
    }
    if (machineClassId) {
      //@ts-expect-error
      const machineClassids = machineClassId
        .split(",")
        .map((e) => new mongoose.Types.ObjectId(e))
      //@ts-expect-error
      aggregation[0].$match.machineClassId = { $in: machineClassids }
    }
    if (partId) {
      //@ts-expect-error
      const partids = partId
        .split(",")
        .map((e) => new mongoose.Types.ObjectId(e))
      //@ts-expect-error
      aggregation[0].$match.partId = { $in: partids }
    }
    if (startDate && endDate) {
      //@ts-expect-error
      aggregation.$match.createdAt = {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      }
    }
    const [result] = await parts.aggregate(aggregation).exec()
    const { totalTons } = result
    const totalUnits = await timerLogs.countDocuments()
    const globalUnitsPerHour = totalUnits / totalTime
    const globalTonsPerHour = totalTons / totalTime
    res.json({
      error: false,
      items: {
        totalTons,
        totalUnits,
        globalTonsPerHour,
        globalUnitsPerHour,
      },
    })
  } catch (err) {
    console.log(err)
    //@ts-expect-error
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    Sentry.captureException(err)
    return {
      error: true,
      message,
      items: null,
      itemCount: null,
    }
  }
}
