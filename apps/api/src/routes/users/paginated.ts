import { Request, Response } from "express"
import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import Users from "../../models/users"
import * as Sentry from "@sentry/node"
export const paginated = async (req: Request, res: Response) => {
  const { page, role, locationId, status, name, excludeUser } = req.query
  console.log("🚀 ~ file: paginated.ts:10 ~ paginated ~ role:", role)
  if (page) {
    try {
      const usersCount = await Users.find({
        ...(role && role !== "null" ? { role: role } : {}),
        ...(locationId && locationId !== undefined
          ? { locationId: locationId }
          : {}),
        ...(status && status !== "null" ? { status: status } : {}),
        _id: { $ne: excludeUser },
        role: { $ne: "Super" },
        $and: [
          { $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }] },
          ...(name && name !== ""
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
      const query = {
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
      }

      console.log(JSON.stringify(query))

      const getAllUsers = await Users.find({
        ...(role && role !== "null" ? { role: role } : {}),
        ...(locationId && { locationId: locationId }),
        ...(status && status !== "null" ? { status: status } : {}),
        _id: { $ne: excludeUser },
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
        .skip(10 * (Number(page) - 1))
        .limit(10)
      res.json({
        error: false,
        items: getAllUsers,
        itemCount: usersCount,
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
