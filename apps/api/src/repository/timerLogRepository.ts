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

const getTonsReportByMachineAndLocation = (
  dateStart: Date,
  dateEnd: Date,
  option: { locationId?: string } = {}
) => {
  const additionalFilter: any = {}
  if (option.locationId) {
    additionalFilter.locationId = option.locationId
  }
  return TimerLogs.aggregate([
    {
      $match: {
        createdAt: { $gte: dateStart, $lte: dateEnd },
        stopReason: { $in: ["Unit Created"] },
        ...additionalFilter,
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
        _id: {
          locationId: "$locationId",
          machineId: "$machineId",
          machineClassId: "$machineClassId",
        },
        total: { $sum: "$part.tons" },
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
        from: "machines",
        localField: "_id.machineId",
        foreignField: "_id",
        as: "machine",
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
      $unwind: "$machine",
    },
    {
      $unwind: "$machineClass",
    },
    {
      $project: {
        _id: 1,
        locationName: "$location.name",
        machineName: "$machine.name",
        machineClass: "$machineClass.name",
        total: 1,
      },
    },
  ])
}

const getUnitCreatedReportByMachineAndLocation = (
  startDate: Date,
  endDate: Date,
  option: { locationId?: string } = {}
) => {
  const additionalFilter: any = {}
  if (option.locationId) {
    additionalFilter.locationId = option.locationId
  }
  return TimerLogs.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        stopReason: { $in: ["Unit Created"] },
        ...additionalFilter,
      },
    },
    {
      $group: {
        _id: {
          locationId: "$locationId",
          machineId: "$machineId",
          machineClassId: "$machineClassId",
        },
        total: { $count: {} },
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
        from: "machines",
        localField: "_id.machineId",
        foreignField: "_id",
        as: "machine",
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
      $unwind: "$machine",
    },
    {
      $unwind: "$machineClass",
    },
    {
      $project: {
        _id: 1,
        locationName: "$location.name",
        machineName: "$machine.name",
        machineClass: "$machineClass.name",
        total: 1,
      },
    },
  ])
}

const TimerLogsRepository = {
  ...createBaseRepository<typeof TimerLogs, T_TimerLog, T_TimerLog>(TimerLogs),
  getUnitCreatedReportByLocations,
  getTonsReportByLocations,
  getTonsReportByMachineAndLocation,
  getUnitCreatedReportByMachineAndLocation,
}

export default TimerLogsRepository
