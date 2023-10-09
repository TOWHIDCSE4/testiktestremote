import { Request, Response } from "express"
import Parts from "../../models/parts"
import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"

export const paginated = async (req: Request, res: Response) => {
  const { page, locationId, factoryId, machineClassId, name } = req.query
  console.log("🚀 ~ file: paginated.ts:10 ~ paginated ~ factoryId:", factoryId)
  console.log(
    "🚀 ~ file: paginated.ts:10 ~ paginated ~ locationId:",
    locationId
  )
  if (page && locationId) {
    // const isNotAssigned = factoryId === "Not Assigned"
    const isNotAssigned =
      (factoryId as string)?.toLowerCase() === "not verified"
    console.log(
      "🚀 ~ file: paginated.ts:18 ~ paginated ~ isNotAssigned:",
      isNotAssigned
    )
    const verified = !((factoryId as string)?.toLowerCase() === "not verified")
    console.log("🚀 ~ file: paginated.ts:16 ~ paginated ~ verified:", verified)
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
          // ...(isNotAssigned ? [{ $or: [{ time: 0 }, { tons: 0 }] }] : []),
          ...(verified
            ? [{ verified: true }]
            : [
                {
                  $or: [{ verified: { $exists: false } }, { verified: false }],
                },
              ]),
        ],
      }).countDocuments()
      console.log(6 * (Number(page) - 1), "page")
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
          // ...(isNotAssigned ? [{ $or: [{ time: 0 }, { tons: 0 }] }] : []),
          //verified condition starts from here
          ...(verified
            ? [{ verified: true }]
            : [
                {
                  $or: [{ verified: { $exists: false } }, { verified: false }],
                },
              ]),
        ],
      })
        .sort({
          createdAt: -1,
          _id: 1,
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
