import factories from "../../models/factories"
import machines from "../../models/machines"
import Timers from "../../models/timers"
import { UNKNOWN_ERROR_OCCURRED } from "../../utils/constants"
import { Request, Response } from "express"
export const getAllTimersByFactory = async (req: Request, res: Response) => {
  const { factoryId } = req.query
  if (factoryId) {
    try {
      const timersCount = await Timers.find({
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      }).countDocuments()
      const getTimerByFactory = await Timers.find({
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
            localField: "factoryId",
            foreignField: "factoryId",
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
