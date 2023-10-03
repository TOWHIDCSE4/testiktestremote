import { Request, Response } from "express"
import Parts from "../../models/parts"
import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"

export const paginated = async (req: Request, res: Response) => {
  const { page, locationId, factoryId, machineClassId, name } = req.query
  console.log("🚀 ~ file: paginated.ts:10 ~ paginated ~ name:", name)
  if (page && locationId) {
    const isNotAssigned = factoryId === "Not Assigned"
    try {
      const partsCount = await Parts.find({
        locationId: locationId,
        ...(factoryId && !isNotAssigned && factoryId != "all"
          ? { factoryId: factoryId }
          : {}),
        ...(machineClassId &&
          machineClassId != "all" && { machineClassId: machineClassId }),
        ...(name &&
          name != "all" && {
            name: { $regex: new RegExp(name as string), $options: "i" },
          }),
        $and: [
          { $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }] },
          ...(isNotAssigned ? [{ $or: [{ time: 0 }, { tons: 0 }] }] : []),
        ],
      }).countDocuments()
      const getAllParts = await Parts.find({
        locationId: locationId,
        ...(factoryId && !isNotAssigned && factoryId != "all"
          ? { factoryId: factoryId }
          : {}),
        ...(machineClassId &&
          machineClassId != "all" && { machineClassId: machineClassId }),
        ...(name &&
          name != "all" && {
            name: { $regex: new RegExp(name as string), $options: "i" },
          }),
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
      console.log(
        "🚀 ~ file: paginated.ts:47 ~ paginated ~ getAllParts:",
        getAllParts
      )
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
