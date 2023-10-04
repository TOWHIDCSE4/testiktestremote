import { Request, Response } from "express"
import Machines from "../../models/machines"
import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"

export const paginated = async (req: Request, res: Response) => {
  const { page, locationId, factoryId, machineClassId, name } = req.query
  if (page && locationId) {
    try {
      const partsCount = await Machines.find({
        locationId: locationId,
        ...(factoryId && factoryId != "all" && { factoryId: factoryId }),
        ...(machineClassId &&
          machineClassId != "all" && { machineClassId: machineClassId }),
        ...(name &&
          name != "all" && { name: { $regex: `.*${name}.*`, $options: "i" } }),
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      }).countDocuments()
      const getAllParts = await Machines.find({
        locationId: locationId,
        ...(factoryId && factoryId != "all" && { factoryId: factoryId }),
        ...(machineClassId &&
          machineClassId != "all" && { machineClassId: machineClassId }),
        ...(name &&
          name != "all" && { name: { $regex: `.*${name}.*`, $options: "i" } }),
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      })
        .sort({
          createdAt: -1,
        })
        .skip(6 * (Number(page) - 1))
        .limit(6)
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
