import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import { Request, Response } from "express"
import Machines from "../../models/machines"
import timerLogs from "../../models/timerLogs"

export const byLocation = async (req: Request, res: Response) => {
  const { locationId } = req.query
  if (locationId) {
    try {
      const distinctMachineids = await timerLogs.distinct("machineId", {
        locationId,
      })
      const machinesCountByLocation = await Machines.find({
        locationId,
        _id: { $in: distinctMachineids },
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      }).countDocuments()
      const getMachineByLocation = await Machines.find({
        locationId,
        _id: { $in: distinctMachineids },
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      })
      res.json({
        error: false,
        items: getMachineByLocation,
        count: machinesCountByLocation,
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
