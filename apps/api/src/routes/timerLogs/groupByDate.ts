import { Request, Response } from "express"
import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import TimerLogs from "../../models/timerLogs"
import mongoose from "mongoose"
import * as Sentry from "@sentry/node"

export const groupByDate = async (req: Request, res: Response) => {
  const { jobId } = req.query
  if (jobId) {
    try {
      const getGroupJobLog = await TimerLogs.aggregate([
        {
          $match: {
            $and: [
              { jobId: new mongoose.Types.ObjectId(jobId as string) },
              { stopReason: { $in: ["Unit Created"] } },
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
            from: "jobs",
            localField: "jobId",
            foreignField: "_id",
            as: "job",
          },
        },
        {
          $unwind: {
            path: "$job",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%m/%d/%Y", date: "$createdAt" } },
            machine: {
              $first: "$machine.name",
            },
            factory: {
              $first: "$factory.name",
            },
            drawingNumber: {
              $first: "$job.drawingNumber",
            },
            count: {
              $count: {},
            },
          },
        },
      ])
      res.json({
        error: false,
        items: getGroupJobLog,
        itemCount: getGroupJobLog.length,
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
