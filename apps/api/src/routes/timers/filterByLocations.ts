import mongoose from "mongoose"
import Timers from "../../models/timers"
import { UNKNOWN_ERROR_OCCURRED } from "../../utils/constants"
import { Request, Response } from "express"
import * as Sentry from "@sentry/node"

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
        // {
        //   $lookup: {
        //     from: "parts",
        //     let: {
        //       locationId: "$locationId",
        //       machineClassId: "$machineClassId",
        //       factoryId: "$factoryId",
        //     },
        //     pipeline: [
        //       {
        //         $match: {
        //           $and: [
        //             {
        //               $expr: {
        //                 $and: [
        //                   { $eq: ["$locationId", "$$locationId"] },
        //                   { $eq: ["$machineClassId", "$$machineClassId"] },
        //                   { $eq: ["$factoryId", "$$factoryId"] },
        //                 ],
        //               },
        //             },
        //             {
        //               $or: [
        //                 { deletedAt: { $exists: false } },
        //                 { deletedAt: null },
        //               ],
        //             },
        //           ],
        //         },
        //       },
        //       {
        //         $project: {
        //           _id: 1,
        //           name: 1,
        //         },
        //       },
        //     ],
        //     as: "parts",
        //   },
        // },
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
      Sentry.captureException(err)
      res.json({
        error: true,
        message: message,
        items: null,
        itemCount: null,
      })
    }
  }
}
