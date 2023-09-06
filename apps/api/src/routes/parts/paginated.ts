import { Request, Response } from "express"
import Parts from "../../models/parts"
import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"

export const paginated = async (req: Request, res: Response) => {
  const { page, locationId, factoryId, machineClassId, name } = req.query
  if (page && locationId) {
    const isNotAssigned = factoryId === "Not Assigned"
    try {
      const partsCount = await Parts.find({
        locationId: locationId,
        ...(factoryId && !isNotAssigned ? { factoryId: factoryId } : {}),
        ...(machineClassId && { machineClassId: machineClassId }),
        ...(name && { name: { $regex: `.*${name}.*`, $options: "i" } }),
        $and: [
          { $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }] },
          ...(isNotAssigned ? [{ $or: [{ time: 0 }, { tons: 0 }] }] : []),
        ],
      }).countDocuments()
      const getAllParts = await Parts.find({
        locationId: locationId,
        ...(factoryId && !isNotAssigned ? { factoryId: factoryId } : {}),
        ...(machineClassId && { machineClassId: machineClassId }),
        ...(name && { name: { $regex: `.*${name}.*`, $options: "i" } }),
        $and: [
          { $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }] },
          ...(isNotAssigned ? [{ $or: [{ time: 0 }, { tons: 0 }] }] : []),
        ],
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
