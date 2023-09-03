import mongoose from "mongoose"
import Timers from "../../models/timers"
import { UNKNOWN_ERROR_OCCURRED } from "../../utils/constants"
import { Request, Response } from "express"
export const getAllTimersByLocation = async (req: Request, res: Response) => {
  const { locationId } = req.query
  if (locationId) {
    try {
      const timersCount = await Timers.find({
        $and: [
          { locationId: locationId },
          { $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }] },
        ],
      }).countDocuments()
      const timers = await Timers.aggregate([
        {
          $match: {
            $and: [
              { locationId: new mongoose.Types.ObjectId(locationId as string) },
              { $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }] },
            ],
          },
        },
        {
          $lookup: {
            from: "parts",
            let: { locId: "$locationId" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$locationId", "$$locId"] },
                  $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
                },
              },
            ],
            as: "parts",
          },
        },
        {
          $lookup: {
            from: "machines",
            localField: "machineId",
            foreignField: "_id",
            as: "machine",
          },
        },
        {
          $unwind: {
            path: "$machine",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "operator",
            foreignField: "_id",
            as: "assignedOperator",
          },
        },
        {
          $unwind: {
            path: "$assignedOperator",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "locations",
            localField: "locationId",
            foreignField: "_id",
            as: "location",
          },
        },
        {
          $unwind: {
            path: "$location",
            preserveNullAndEmptyArrays: true,
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
