import { Request, Response } from "express"
import Jobs from "../../models/jobs"
import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import mongoose from "mongoose"
import TimerLogs from "../../models/timerLogs"

export const paginated = async (req: Request, res: Response) => {
  const { page, locationId, status } = req.query
  if (page && locationId) {
    try {
      const jobsCount = await Jobs.find({
        locationId: locationId,
        ...(status && { status: status }),
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      }).countDocuments()
      // const getAllJobs = await Jobs.find({
      //   locationId: locationId,
      //   ...(status && { status: status }),
      //   $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      // })
      //   .populate("partId")
      //   .populate("factoryId")
      //   .populate("userId")
      //   .sort({
      //     createdAt: -1,
      //   })
      //   .skip(5 * (Number(page) - 1))
      //   .limit(5)
      // new
      const getAllJobs = await Jobs.aggregate([
        {
          $match: {
            $and: [
              { locationId: new mongoose.Types.ObjectId(locationId as string) },
              ...(status ? [{ status }] : []),
              { $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }] },
            ],
          },
        },
        {
          $lookup: {
            from: "timerlogs",
            let: {
              jobId: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$jobId", "$$jobId"] },
                  $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
                },
              },
            ],
            as: "timerLogs",
          },
        },
        {
          $lookup: {
            from: "parts",
            localField: "partId",
            foreignField: "_id",
            as: "part",
          },
        },
        {
          $unwind: {
            path: "$part",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "factories",
            localField: "factoryId",
            foreignField: "_id",
            as: "factory",
          },
        },
        {
          $unwind: {
            path: "$factory",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true,
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: 5 * (Number(page) - 1) },
        { $limit: 5 },
      ])

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
