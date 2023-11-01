import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import { Request, Response } from "express"
import Machines from "../../models/machines"
import mongoose from "mongoose"
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
      const getMachineByClass: Array<Record<string, any>> = []
      for (const locationId of locationIds) {
        for (const machineClassId of machineClassIds) {
          const query = {
            locationId: locationId,
            machineClassId: machineClassId,
            $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
          }
          getMachineByClass.push(...(await Machines.find(query)))
        }
      }
      res.json({
        error: false,
        items: getMachineByClass,
        count: getMachineByClass.length + 1,
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

export const byMachineClass = async (req: Request, res: Response) => {
  const { machineClasses } = req.query
  if (machineClasses && !!machineClasses?.length) {
    try {
      const machineClassesToSearch = machineClasses
        //@ts-expect-error
        .split(",")
        //@ts-expect-error
        .map((e) => new Types.ObjectId(e))
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
