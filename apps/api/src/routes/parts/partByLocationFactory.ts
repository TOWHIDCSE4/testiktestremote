import { Request, Response } from "express"
import Parts from "../../models/parts"
import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"

export const partByLocationFactory = async (req: Request, res: Response) => {
  const { locationId, factoryId, machineClassId } = req.query
  if (locationId && factoryId) {
    try {
      const partsCount = await Parts.find({
        locationId: locationId,
        ...(factoryId && { factoryId: factoryId }),
        ...(machineClassId && { machineClassId: machineClassId }),
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      }).countDocuments()
      const getAllParts = await Parts.find({
        locationId: locationId,
        ...(factoryId && { factoryId: factoryId }),
        ...(machineClassId && { machineClassId: machineClassId }),
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      }).sort({
        createdAt: -1,
      })
      res.json({
        error: false,
        items: getAllParts,
        itemCount: partsCount,
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
