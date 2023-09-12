import { Request, Response } from "express"
import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import Users from "../../models/users"

export const paginated = async (req: Request, res: Response) => {
  const { page, role, locationId, status, name, excludeUser } = req.query
  if (page) {
    try {
      const usersCount = await Users.find({
        ...(role && role !== "null" ? { role: role } : {}),
        ...(locationId && { locationId: locationId }),
        ...(status && status !== "null" ? { status: status } : {}),
        _id: { $ne: excludeUser },
        role: { $ne: "Super" },
        $and: [
          { $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }] },
          ...(name
            ? [
                {
                  $or: [
                    { firstName: { $regex: `.*${name}.*`, $options: "i" } },
                    { lastName: { $regex: `.*${name}.*`, $options: "i" } },
                  ],
                },
              ]
            : []),
        ],
      }).countDocuments()
      const getAllUsers = await Users.find({
        ...(role && role !== "null" ? { role: role } : {}),
        ...(locationId && { locationId: locationId }),
        ...(status && status !== "null" ? { status: status } : {}),
        _id: { $ne: excludeUser },
        role: { $ne: "Super" },
        $and: [
          { $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }] },
          ...(name
            ? [
                {
                  $or: [
                    { firstName: { $regex: `.*${name}.*`, $options: "i" } },
                    { lastName: { $regex: `.*${name}.*`, $options: "i" } },
                  ],
                },
              ]
            : []),
        ],
      })
        .populate("locationId")
        .populate("factoryId")
        .sort({
          createdAt: -1,
        })
        .skip(5 * (Number(page) - 1))
        .limit(5)
      res.json({
        error: false,
        items: getAllUsers,
        itemCount: usersCount,
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
