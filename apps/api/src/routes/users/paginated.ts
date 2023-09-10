import { Request, Response } from "express"
import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import Users from "../../models/users"

export const paginated = async (req: Request, res: Response) => {
  const { page, role } = req.query
  if (page && role) {
    try {
      const usersCount = await Users.find({
        role: role,
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      }).countDocuments()
      const getAllUsers = await Users.find({
        role: role,
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      })
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
