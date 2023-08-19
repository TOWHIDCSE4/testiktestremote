import { Request, Response } from "express"
import Jobs from "../../models/jobs"
import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"

export const paginated = async (req: Request, res: Response) => {
  const { page, locationId, status } = req.query
  if (page && locationId) {
    try {
      const jobsCount = await Jobs.find({
        locationId: locationId,
        ...(status && { status: status }),
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      }).countDocuments()
      const getAllJobs = await Jobs.find({
        locationId: locationId,
        ...(status && { status: status }),
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      })
        .populate("partId")
        .populate("factoryId")
        .populate("userId")
        .sort({
          createdAt: -1,
        })
        .skip(10 * (Number(page) - 1))
        .limit(10)
      res.json({
        error: false,
        items: getAllJobs,
        itemCount: jobsCount,
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
