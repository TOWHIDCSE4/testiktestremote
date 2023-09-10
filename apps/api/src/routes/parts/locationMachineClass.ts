import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import { Request, Response } from "express"
import Parts from "../../models/parts"

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
