import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import { Request, Response } from "express"
import Parts from "../../models/parts"
import mongoose, { Types } from "mongoose"
import * as Sentry from "@sentry/node"
import timerLogs from "../../models/timerLogs"

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
    const machineClassesToSearch = machineClasses
      //@ts-expect-error
      .split(",")
      //@ts-expect-error
      .map((e) => new Types.ObjectId(e))
    const locationsToSearch = locations
      //@ts-expect-error
      .split(",")
      //@ts-expect-error
      .map((e) => new Types.ObjectId(e))
    const distinctPartsIds = await timerLogs.distinct("partId")
    const filter = {
      machineClassId: { $in: machineClassesToSearch },
      locationId: { $in: locationsToSearch },
      _id: { $in: distinctPartsIds },
    }

    if (search) {
      //@ts-expect-error
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
  } catch (error) {
    console.error(error)
    Sentry.captureException(error)
  }
}
