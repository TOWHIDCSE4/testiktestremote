import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import { Request, Response } from "express"
import Machines from "../../models/machines"
import mongoose from "mongoose"
import timerLogs from "../../models/timerLogs"
import redisClient from "../../utils/redisClient"
import dayjs from "dayjs"

export const locationMachineClass = async (req: Request, res: Response) => {
  let { locationId, machineClassId } = req.query
  if (
    locationId !== null &&
    locationId !== "undefined" &&
    machineClassId !== null &&
    machineClassId !== "undefined" &&
    machineClassId !== ""
  ) {
    let { startDate, endDate } = req.query
    try {
      startDate = !startDate
        ? dayjs().startOf("week").format()
        : dayjs(startDate as string).format()
      endDate = !endDate
        ? dayjs().endOf("week").format()
        : dayjs(endDate as string).format()

      locationId = locationId as string
      const locationIds = locationId
        .split(",")
        .map((e) => new mongoose.Types.ObjectId(e))

      machineClassId = machineClassId as string
      const machineClassIds = machineClassId
        .split(",")
        .map((e) => new mongoose.Types.ObjectId(e))

      const distinctMachineIds = (
        await timerLogs.distinct("machineId", {
          ...(startDate &&
            endDate && {
              createdAt: {
                $gte: new Date(startDate as string),
                $lt: new Date(endDate as string),
              },
            }),
        })
      ).map((e) => new mongoose.Types.ObjectId(e))

      const cacheKey = `locationMachineClass:${locationId}:${machineClassId}:${distinctMachineIds}`
      const cachedData = await redisClient.get(cacheKey)

      if (cachedData) {
        // Return data from cache
        res.json({
          error: false,
          items: JSON.parse(cachedData),
          count: JSON.parse(cachedData).length,
          message: "Data from cache",
        })
      } else {
        let query: any = {
          _id: { $in: distinctMachineIds },
          locationId: { $in: locationIds },
          $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
        }

        query.machineClassId = { $in: machineClassIds }

        const getMachineByClass: Array<Record<string, any>> =
          await Machines.find(query)
        redisClient.set(cacheKey, JSON.stringify(getMachineByClass), {
          EX: 240,
        })

        res.json({
          error: false,
          items: getMachineByClass,
          count: getMachineByClass.length,
          message: null,
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
      message: REQUIRED_VALUES_MISSING,
      items: null,
      itemCount: null,
    })
  }
}

export const byMachineClass = async (req: Request, res: Response) => {
  const { machineClasses } = req.query
  if (machineClasses && !!machineClasses?.length) {
    try {
      const machineClassesToSearch = machineClasses
        //@ts-expect-error
        .split(",")
        //@ts-expect-error
        .map((e) => new mongoose.Types.ObjectId(e))
      const distinctMachineIds = await timerLogs.distinct("machineId")
      const machinesCountByClass = await Machines.distinct("_id", {
        machineClassId: { $in: machineClassesToSearch },
        machineId: { $in: distinctMachineIds },
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      }).countDocuments()
      const getMachineId = await Machines.distinct("_id", {
        machineClassId: { $in: machineClassesToSearch },
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      })
      const getMachineByClass = await Machines.find({
        _id: { $in: getMachineId },
      })
      res.json({
        error: false,
        items: getMachineByClass,
        count: machinesCountByClass,
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
