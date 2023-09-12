import { Request, Response } from "express"
import Jobs from "../../models/jobs"
import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import mongoose from "mongoose"
import * as _ from "lodash"

export const paginated = async (req: Request, res: Response) => {
  const { page, locationId, status } = req.query
  if (page && locationId) {
    try {
      const jobsCount = await Jobs.find({
        locationId: locationId,
        ...(status && { status: status }),
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      }).countDocuments()

      const getAllJobs = await Jobs.aggregate([
        {
          $match: {
            locationId: new mongoose.Types.ObjectId(locationId as string),
            ...(status && { status: status }),
            $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
          },
        },
        {
          $lookup: {
            from: "timerlogs",
            localField: "_id",
            foreignField: "jobId",
            as: "timerLogs",
            pipeline: [
              {
                $match: {
                  stopReason: "Unit Created",
                },
              },
              {
                $lookup: {
                  from: "machines",
                  localField: "machineId",
                  foreignField: "_id",
                  as: "machineId",
                },
              },
              {
                $unwind: "$machineId",
              },
            ],
          },
        },
        {
          $lookup: {
            from: "factories",
            localField: "factoryId",
            foreignField: "_id",
            as: "factoryId",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userId",
          },
        },
        {
          $lookup: {
            from: "parts",
            localField: "partId",
            foreignField: "_id",
            as: "partId",
          },
        },
        {
          $unwind: "$partId",
        },
        {
          $unwind: "$userId",
        },
        {
          $unwind: "$factoryId",
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $skip: 4 * (Number(page) - 1),
        },
        {
          $limit: 4,
        },
      ])
      const groupedData = _.map(getAllJobs, (item) => {
        // Group timerLogs by the date part of createdAt
        const groupedTimerLogs = _.groupBy(item.timerLogs, (timerLog) => {
          const createdAtDate = new Date(
            timerLog.createdAt
          ).toLocaleDateString()
          return createdAtDate
        })

        // Create an array of objects with date and items
        const timerLogsByDate = _.map(groupedTimerLogs, (logs, date) => {
          return {
            date,
            items: logs,
          }
        })

        item.timerLogs = timerLogsByDate
        return item
      })

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
