import factories from "../../models/factories"
import machines from "../../models/machines"
import Timers from "../../models/timers"
import { UNKNOWN_ERROR_OCCURRED } from "../../utils/constants"
import { Request, Response } from "express"
export const getAllTimersByLocation = async (req: Request, res: Response) => {
  const { locationId } = req.query
  if (locationId) {
    try {
      const timersCount = await Timers.find({
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      }).countDocuments()
      const getTimerByLocation = await Timers.find({
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      })
      const timers = await Timers.aggregate([
        {
          $match: {
            $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
          },
        },
        {
          $lookup: {
            from: "parts",
            localField: "locationId",
            foreignField: "locationId",
            as: "parts",
          },
        },
      ])
      res.json({
        error: false,
        items: timers,
        itemCount: timersCount,
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
  }
}
