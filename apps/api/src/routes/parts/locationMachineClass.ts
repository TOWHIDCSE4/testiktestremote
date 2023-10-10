import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import { Request, Response } from "express"
import Parts from "../../models/parts"
import { Types } from "mongoose"
import * as Sentry from "@sentry/node"

export const locationMachineClass = async (req: Request, res: Response) => {
  const { locationId, machineClassId } = req.query
  if (locationId && machineClassId) {
    try {
      const partsCountByClass = await Parts.find({
        locationId,
        machineClassId,
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      }).countDocuments()
      const getPartByClass = await Parts.find({
        locationId,
        machineClassId,
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      })
      res.json({
        error: false,
        items: getPartByClass,
        count: partsCountByClass,
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
    const filter = {
      machineClassId: { $in: machineClassesToSearch },
      locationId: { $in: locationsToSearch },
    }

    if (search) {
      //@ts-expect-error
      filter.name = { $regex: search, $options: "i" } // Case-insensitive search
    }

    const distinctParts = await Parts.find(filter)
      .skip(6 * (Number(page) - 1))
      .limit(6)
      .exec()

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
