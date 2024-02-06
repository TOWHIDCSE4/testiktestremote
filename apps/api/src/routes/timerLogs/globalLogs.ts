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
import machines from "../../models/machines"
import location from "../../models/location"
import factories from "../../models/factories"

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
  } = req.query
  let { startDate, endDate } = req.query
  startDate = startDate
    ? dayjs(startDate as string).format()
    : dayjs().startOf("week").format()
  endDate = endDate
    ? dayjs(endDate as string).format()
    : dayjs().endOf("week").format()
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
        .populate("locationId")
        .populate("machineClassId")
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
    limit,
    // startDate,
    // endDate,
  } = req.query
  const sortObj = {}
  if (sort && key) {
    //@ts-expect-error
    sortObj[`${key}`] = sort
  } else {
    //@ts-expect-error
    sortObj["createdAt"] = "desc"
  }
  let { startDate, endDate } = req.query
  startDate = !startDate
    ? dayjs().startOf("week").format()
    : dayjs(startDate as string).format()
  endDate = !endDate
    ? dayjs().endOf("week").format()
    : dayjs(endDate as string).format()

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
        .populate("locationId")
        .populate("machineClassId")
        .sort({ ...sortObj })
        .skip(10 * (Number(page) - 1))
        .limit(limit !== null && limit !== undefined ? Number(limit) : 10)

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
  const { locationId, factoryId, machineId, machineClassId, partId } = req.query
  let { startDate, endDate } = req.query
  try {
    // Calculate the total time in hours
    startDate = startDate
      ? dayjs(startDate as string).format()
      : dayjs().startOf("week").format()
    endDate = endDate
      ? dayjs(endDate as string).format()
      : dayjs().endOf("week").format()
    // Calculate the total time in hours
    const totalTime = dayjs(endDate).diff(startDate, "hour")
    const firstRecord = await timerLogs.find().sort({ createdAt: 1 }).limit(1)
    // const totalTime =
    //   startDate && endDate
    //     ? dayjs(String(endDate)).diff(String(startDate), "hour")
    //     : dayjs(Date.now()).diff(dayjs(firstRecord[0].createdAt), "hour")
    const query = {}

    if (locationId) {
      const locationids = locationId
        //@ts-expect-error
        .split(",")
        //@ts-expect-error
        .map((e) => new mongoose.Types.ObjectId(e))
      //@ts-expect-error
      query.locationId = { $in: locationids }
    }
    if (factoryId) {
      const factoryids = factoryId
        //@ts-expect-error
        .split(",")
        //@ts-expect-error
        .map((e) => new mongoose.Types.ObjectId(e))
      //@ts-expect-error
      query.factoryId = { $in: factoryids }
    }
    if (machineId) {
      const machineids = machineId
        //@ts-expect-error
        .split(",")
        //@ts-expect-error
        .map((e) => new mongoose.Types.ObjectId(e))
      //@ts-expect-error
      query.machineId = { $in: machineids }
    }
    if (machineClassId) {
      const machineClassids = machineClassId
        //@ts-expect-error
        .split(",")
        //@ts-expect-error
        .map((e) => new mongoose.Types.ObjectId(e))
      //@ts-expect-error
      query.machineClassId = { $in: machineClassids }
    }
    if (partId) {
      const partids = partId
        //@ts-expect-error
        .split(",")
        //@ts-expect-error
        .map((e) => new mongoose.Types.ObjectId(e))
      //@ts-expect-error
      query.partId = { $in: partids }
    }
    if (startDate && endDate) {
      //@ts-expect-error
      query.createdAt = {
        $gte: new Date(startDate as string),
        $lt: new Date(endDate as string),
      }
    }
    const partIds = await TimerLogs.distinct("partId", query)
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
    const totalUnits = await TimerLogs.find(query).countDocuments()
    const [result] = await parts.aggregate(aggregation).exec()
    const totalTons = result?.totalTons || 0
    const globalUnitsPerHour = totalUnits > 0 ? totalUnits / totalTime : 0
    const globalTonsPerHour = totalUnits > 0 ? totalTons / totalTime : 0
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
export const batchActionUpdate = async (req: Request, res: Response) => {
  const { ids, data } = req.body
  try {
    const result = await TimerLogs.updateMany(
      { _id: { $in: ids } },
      { $set: data },
      { multi: true }
    )
    res.json({
      error: false,
      items: result,
      message: null,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    Sentry.captureException(err)
    res.json({
      error: true,
      message: message,
      items: null,
    })
  }
}
export const getMetricsForAMachineClass = async (
  req: Request,
  res: Response
) => {
  try {
    const { machineClassId, locationId } = req.query
    if (!machineClassId) throw new Error("Machine class ID is required")
    if (!locationId) throw new Error("Location ID is required")
    const startDate = dayjs().startOf("day")
    const endDate = dayjs().endOf("day")

    const getMachineIds = await machines
      .find({
        machineClassId: new mongoose.Types.ObjectId(machineClassId as string),
        locationId: new mongoose.Types.ObjectId(locationId as string),
      })
      .distinct("_id")

    const hourlyStats: Record<string, Record<string, any>> = {} // Hourly stats for each machine

    for (const machineId of getMachineIds) {
      let hour = startDate.clone() // Start at 00:00

      while (hour.isBefore(endDate)) {
        const startHour = hour
        const endHour = startHour.add(1, "hour")

        const count = await TimerLogs.countDocuments({
          machineId: new mongoose.Types.ObjectId(machineId as string),
          createdAt: { $gte: startHour, $lt: endHour },
        })

        const hourString = startHour.format("HH:mm") // Use a 24-hour format

        if (!hourlyStats[hourString]) {
          hourlyStats[hourString] = {}
        }

        hourlyStats[hourString][machineId] = count // Store the count for this hour

        hour = hour.add(1, "hour") // Move to the next hour
      }
    }

    // Create the response array
    const responseArray = []
    for (const hourString in hourlyStats) {
      const hourData: Record<any, string> = { hour: hourString }
      for (const machineId of getMachineIds) {
        hourData[machineId] = hourlyStats[hourString][machineId] || 0
      }
      responseArray.push(hourData)
    }

    res.json({
      error: false,
      items: responseArray,
      message: null,
    })
  } catch (error: any) {
    console.log(error)
    Sentry.captureException(error)
    res.json({
      error: true,
      items: null,
      message: error.message,
    })
  }
}
export const getMetricsForAMachineClassAsWhole = async (
  req: Request,
  res: Response
) => {
  try {
    const { machineClassId } = req.query
    if (!machineClassId) throw new Error("Machine class ID is required")
    const locationIds = await location.find().distinct("_id") // Assuming you have a "locations" model

    const allMetrics = [] // Store metrics for all locations

    for (let hour = 0; hour < 24; hour++) {
      const startHour = dayjs().set("hour", hour).startOf("hour")
      const endHour = startHour.add(1, "hour")

      const hourMetrics: Record<string, any> = {
        hour: startHour.format("HH:mm"),
      }

      for (const locationId of locationIds) {
        const machineIds = await machines
          .find({
            machineClassId: new mongoose.Types.ObjectId(
              machineClassId as string
            ),
            locationId: new mongoose.Types.ObjectId(locationId as string),
          })
          .distinct("_id")

        let totalMachineCount = 0

        for (const machineId of machineIds) {
          const count = await TimerLogs.countDocuments({
            machineId: new mongoose.Types.ObjectId(machineId as string),
            createdAt: { $gte: startHour, $lt: endHour },
          })
          totalMachineCount += count
        }

        hourMetrics[locationId] = totalMachineCount
      }

      allMetrics.push(hourMetrics)
    }

    res.json({
      error: false,
      items: allMetrics,
      message: null,
    })
  } catch (error: any) {
    console.log(error)
    Sentry.captureException(error)
    res.json({
      error: true,
      items: null,
      message: error.message,
    })
  }
}
export const getMetricsforEveryFactoryinLocation = async (
  req: Request,
  res: Response
) => {
  try {
    const { locationId } = req.query
    if (!locationId) throw new Error("Location ID is required")
    const startDate = dayjs().startOf("week")
    const endDate = dayjs().endOf("week")

    const Factories: Array<Record<string, any>> = await factories.find()
    if (!Factories.length)
      throw new Error("No factories found for this location")

    const factoryMetrics = []

    for (let day = startDate; day.isBefore(endDate); day = day.add(1, "day")) {
      const dayStart = day.startOf("day")
      const dayEnd = day.endOf("day")

      const dailyStats: Record<string, any> = {
        Day: day.format("d"), // Using 'd' format for the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
      }

      for (const factory of Factories) {
        const factoryId = factory._id
        const count = await TimerLogs.countDocuments({
          factoryId: new mongoose.Types.ObjectId(factoryId as string),
          locationId: new mongoose.Types.ObjectId(locationId as string),
          createdAt: { $gte: dayStart, $lte: dayEnd },
        })

        dailyStats[factoryId] = count
      }

      factoryMetrics.push(dailyStats)
    }
    res.json({
      error: false,
      items: factoryMetrics,
      message: null,
    })
  } catch (error: any) {
    console.log(error)
    Sentry.captureException(error)
    res.json({
      error: true,
      items: null,
      message: error.message,
    })
  }
}
