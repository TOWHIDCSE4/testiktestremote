import { T_TimerLog } from "custom-validator"
import { createBaseRepository } from "./baseRepository"
import TimerLogs from "../models/timerLogs"
import { assign } from "lodash/fp"

const getUnitCreatedReportByLocations = async (
  dateStart: Date,
  dateEnd: Date
) => {
  return TimerLogs.aggregate([
    {
      $match: {
        createdAt: { $gte: dateStart, $lte: dateEnd },
        stopReason: { $in: ["Unit Created"] },
      },
    },
    {
      $group: {
        _id: "$locationId",
        total: { $count: {} },
      },
    },
    {
      $lookup: {
        from: "locations",
        localField: "_id",
        foreignField: "_id",
        as: "location",
      },
    },
    {
      $unwind: "$location",
    },
    {
      $project: {
        _id: 1,
        total: 1,
        locationName: "$location.name",
      },
    },
  ])
}

const getTonsReportByLocations = (dateStart: Date, dateEnd: Date) => {
  return TimerLogs.aggregate([
    {
      $match: {
        createdAt: { $gte: dateStart, $lte: dateEnd },
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
      $unwind: "$part",
    },
    {
      $group: {
        _id: "$locationId",
        total: { $sum: "$part.tons" },
      },
    },
  ])
}

const getPerMachinePerLocationReport = () => {}

const TimerLogsRepository = {
  ...createBaseRepository<typeof TimerLogs, T_TimerLog, T_TimerLog>(TimerLogs),
  getUnitCreatedReportByLocations,
}

export default TimerLogsRepository
