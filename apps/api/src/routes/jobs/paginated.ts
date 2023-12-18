import { Request, Response } from "express"
import Jobs from "../../models/jobs"
import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import mongoose from "mongoose"
import { groupBy, map, chain } from "lodash"
import * as Sentry from "@sentry/node"
import dayjs from "dayjs"
import { any } from "zod"

export const paginated = async (req: Request, res: Response) => {
  const { page, locationId, status, selectedjob, search } = req.query
  let { machineClassIds } = req.query
  if (page && locationId) {
    try {
      if (!machineClassIds?.length) {
        return res.json({
          error: false,
          items: [],
          itemCount: 0,
          message: null,
        })
      }
      machineClassIds = machineClassIds as string
      const machineClassidz =
        machineClassIds &&
        (machineClassIds == "all"
          ? undefined
          : machineClassIds
              .split(",")
              .map((e) => new mongoose.Types.ObjectId(e)))
      const jobsCount = await Jobs.find({
        locationId: locationId,
        ...(status && { status: status }),
        ...(selectedjob &&
          selectedjob?.length && {
            isStock: selectedjob === "STOCK" ? true : false,
          }),
        ...(machineClassIds &&
          machineClassidz &&
          machineClassidz.length > 0 && {
            machineClassId: { $in: machineClassidz },
          }),

        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
        $and: [
          {
            $or: [
              {
                name: {
                  $regex: new RegExp(search as string),
                  $options: "i",
                },
              }, // Case-insensitive name search
            ],
          },
        ],
      }).countDocuments()

      // jobs find aggregation
      const getAllJobs = await Jobs.aggregate([
        {
          $match: {
            $and: [
              {
                ...(selectedjob &&
                  selectedjob?.length && {
                    isStock: selectedjob === "STOCK" ? true : false,
                  }),
              },
              {
                ...(machineClassIds &&
                  machineClassidz &&
                  machineClassidz.length > 0 && {
                    machineClassId: { $in: machineClassidz },
                  }),
              },
              { locationId: new mongoose.Types.ObjectId(locationId as string) },
              ...(status ? [{ status }] : []),
              { $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }] },
              {
                $or: [
                  {
                    name: {
                      $regex: new RegExp(search as string),
                      $options: "i",
                    },
                  }, // Case-insensitive name search
                ],
              },
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
              {
                $lookup: {
                  from: "users",
                  localField: "operator",
                  foreignField: "_id",
                  as: "operator",
                },
              },
              {
                $unwind: {
                  path: "$operator",
                  preserveNullAndEmptyArrays: true,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "jobtimers",
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
            as: "job",
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

      const groupedData = map(getAllJobs, (item) => {
        // Group timerLogs by the date part of createdAt
        const groupedTimerLogs = groupBy(item.timerLogs, (timerLog) => {
          const createdAtDate = dayjs(new Date(timerLog.createdAt)).format(
            "YYYY-MM-DD:HH:mm"
          )
          return createdAtDate
        })

        // Create an array of objects with date and items
        const timerLogsByDate = map(groupedTimerLogs, (logs, date) => {
          return {
            date,
            items: logs,
          }
        })

        item.timerLogs = timerLogsByDate
        return item
      })

      getAllJobs.forEach((job, index) => {
        let { timerLogs } = job
        if (timerLogs.length) {
          const groupedLogs = chain(timerLogs)
            .groupBy((log) => log?.date?.split(":")[0]) // Extracting only the date part
            .mapValues((dateGroup) =>
              groupBy(
                dateGroup.flatMap((log) => log.items),
                "operatorName"
              )
            )
            .value()

          const maping = Object.values(groupedLogs)
            .map((item) => {
              const array = Object.values(item).flat()
              let [itm] = array
              if (!itm) {
                return []
              }
              const result = {
                date: dayjs(new Date(itm?.createdAt)).format(
                  "YYYY-MM-DD:HH:mm"
                ),
                items: [itm],
                operatorName: itm?.operatorName,
                count: array.length,
              }
              return result
            })
            .filter(Boolean)
          getAllJobs[index].timerLogs = maping
        }
      })

      res.json({
        error: false,
        items: getAllJobs,
        itemCount: jobsCount,
        message: null,
      })
    } catch (err: any) {
      console.log(err)
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
