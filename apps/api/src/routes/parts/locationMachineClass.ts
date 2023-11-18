import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import { Request, Response } from "express"
import Parts from "../../models/parts"
import mongoose, { FilterQuery, Types, Models, Document } from "mongoose"
import * as Sentry from "@sentry/node"
import timerLogs from "../../models/timerLogs"
import dayjs from "dayjs"

export const locationMachineClass = async (req: Request, res: Response) => {
  let { locationId, machineClassId } = req.query
  if (locationId && machineClassId) {
    try {
      locationId = locationId as string
      const locationIds = locationId
        .split(",")
        .map((e) => new mongoose.Types.ObjectId(e))
      machineClassId = machineClassId as string
      const machineClassIds = machineClassId
        .split(",")
        .map((e) => new mongoose.Types.ObjectId(e))
      const getPartByPartsClass: Array<Record<string, any>> = []
      for (const locationId of locationIds) {
        for (const machineClassId of machineClassIds) {
          const query = {
            locationId: locationId,
            machineClassId: machineClassId,
            $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
          }
          getPartByPartsClass.push(...(await Parts.find(query)))
        }
      }
      res.json({
        error: false,
        items: getPartByPartsClass,
        count: getPartByPartsClass.length + 1,
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

export const byLocationMachineClass = async (req: Request, res: Response) => {
  const { machineClasses, locations, search, page } = req.query
  let { startDate, endDate } = req.query
  if (
    !machineClasses ||
    !machineClasses?.length ||
    !locations ||
    !locations?.length
  ) {
    return res.json({
      error: true,
      message: REQUIRED_VALUES_MISSING,
      items: null,
      itemCount: null,
    })
  }

  try {
    startDate = !startDate
      ? dayjs().startOf("week").format()
      : dayjs(startDate as string).format()
    endDate = !endDate
      ? dayjs().endOf("week").format()
      : dayjs(endDate as string).format()

    const machineClassesToSearch = (machineClasses as string)
      .split(",")
      .map((e) => new Types.ObjectId(e))

    const locationsToSearch = (locations as string)
      .split(",")
      .map((e) => new Types.ObjectId(e))

    const distinctPartsIds = (
      await timerLogs.distinct("partId", {
        ...(startDate &&
          endDate && {
            createdAt: {
              $gte: new Date(startDate as string),
              $lt: new Date(endDate as string),
            },
          }),
      })
    ).map((e) => new mongoose.Types.ObjectId(e))

    // const distinctPartsIds = await timerLogs.distinct("partId")

    const filter: FilterQuery<Document> = {
      machineClassId: { $in: machineClassesToSearch },
      locationId: { $in: locationsToSearch },
      _id: { $in: distinctPartsIds },
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" } // Case-insensitive search
    }

    const distinctParts = await Parts.find(filter).exec()
    const partsCount = await Parts.find(filter).countDocuments()

    // return distinctParts;
    res.json({
      error: false,
      items: distinctParts,
      count: partsCount,
      message: null,
    })
  } catch (error: any) {
    console.error(error)
    Sentry.captureException(error)
  }
}
