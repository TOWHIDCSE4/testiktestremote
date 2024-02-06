import mongoose from "mongoose"
import Timers from "../../models/timers"
import { UNKNOWN_ERROR_OCCURRED } from "../../utils/constants"
import { Request, Response } from "express"
import * as Sentry from "@sentry/node"

export const getAllTimersByMachineClass = async (
  req: Request,
  res: Response
) => {
  try {
    const timersCount = await Timers.find({
      $and: [{ $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }] }],
    }).countDocuments()
    const timers = await Timers.aggregate([
      {
        $match: {
          $and: [
            { $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }] },
          ],
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
        $group: {
          _id: {
            locationId: "$locationId",
            machineClassId: "$machineClassId",
          },
          timers: { $push: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "locations",
          localField: "_id.locationId",
          foreignField: "_id",
          as: "location",
        },
      },
      {
        $lookup: {
          from: "machineclasses",
          localField: "_id.machineClassId",
          foreignField: "_id",
          as: "machineClass",
        },
      },
      {
        $unwind: "$location",
      },
      {
        $unwind: "$machineClass",
      },
      {
        $project: {
          locationId: "$location._id",
          machineClassId: "$machineClass._id",
          location: 1,
          machineClass: 1,
          timers: 1,
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
    ]).sort({ rowNumber: 1 })

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