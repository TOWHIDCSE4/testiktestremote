import { Request, Response } from "express"
import Locations from "../../models/location"
import {
  UNKNOWN_ERROR_OCCURRED,
  REQUIRED_VALUE_EMPTY,
  LOCATION_ALREADY_EXISTS,
  ADD_SUCCESS_MESSAGE,
  UPDATE_SUCCESS_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
} from "../../utils/constants"
import isEmpty from "lodash/isEmpty"
import { ZLocation } from "custom-validator"
import machines from "../../models/machines"
import { Types } from "mongoose"
import timerLogs from "../../models/timerLogs"
import * as Sentry from "@sentry/node"
import dayjs from "dayjs"
import redisClient from "../../utils/redisClient"

export const getAllLocations = async (req: Request, res: Response) => {
  try {
    const cacheKey = "locations"
    const cachedData = await redisClient.get(cacheKey)

    if (cachedData) {
      // Return data from cache
      res.json({
        error: false,
        items: JSON.parse(cachedData),
        count: JSON.parse(cachedData).length,
        message: "Data from cache",
      })
    } else {
      const locationsCount = await Locations.find().countDocuments()
      const getAllLocations = await Locations.find().sort({ createdAt: 1 })
      redisClient.set(cacheKey, JSON.stringify(getAllLocations), { EX: 86400 })

      res.json({
        error: false,
        items: getAllLocations,
        itemCount: locationsCount,
        message: null,
      })
    }
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

export const getLocation = async (req: Request, res: Response) => {
  try {
    const getLocation = await Locations.findOne({
      _id: req.params.id,
      deletedAt: null,
    })
    res.json({
      item: getLocation,
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

export const addLocation = async (req: Request, res: Response) => {
  const { name, productionTime, timeZone } = req.body
  if (name && productionTime && timeZone) {
    const newLocation = new Locations({
      name,
      productionTime,
      timeZone,
      updatedAt: null,
      deletedAt: null,
    })
    const parsedLocation = ZLocation.safeParse(req.body)
    if (parsedLocation.success) {
      try {
        const getExostingLocation = await Locations.find({
          $or: [{ name }],
          deletedAt: { $exists: false },
        })
        if (getExostingLocation.length === 0) {
          const createLocation = await newLocation.save()
          res.json({
            error: false,
            item: createLocation,
            itemCount: 1,
            message: ADD_SUCCESS_MESSAGE,
          })
        } else {
          res.json({
            error: true,
            message: LOCATION_ALREADY_EXISTS,
            items: null,
            itemCount: null,
          })
        }
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
        message: parsedLocation.error.issues,
        item: null,
        itemCount: null,
      })
    }
  } else {
    res.json({
      error: true,
      message: REQUIRED_VALUE_EMPTY,
      items: null,
      itemCount: null,
    })
  }
}

export const updateLocation = async (req: Request, res: Response) => {
  const getLocation = await Locations.find({
    _id: req.params.id,
    deletedAt: { $exists: false },
  })
  const condition = req.body
  if (getLocation.length === 0) {
    if (!isEmpty(condition)) {
      try {
        const updateLocation = await Locations.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
            updatedAt: Date.now(),
          },
          { new: true }
        )
        res.json({
          error: false,
          item: updateLocation,
          itemCount: 1,
          message: UPDATE_SUCCESS_MESSAGE,
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
        message: "Location cannot be found",
        items: null,
        itemCount: null,
      })
    }
  } else {
    res.json({
      error: true,
      message: "Location does not exist",
      items: null,
      itemCount: null,
    })
  }
}

export const deleteLocation = async (req: Request, res: Response) => {
  try {
    const getLocation = await Locations.find({
      _id: req.params.id,
      deletedAt: null,
    })
    if (getLocation.length > 0) {
      const deleteLocation = await Locations.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      })
      const deletedLocation = await Locations.findById({
        _id: req.params.id,
      })
      res.json({
        error: false,
        item: deletedLocation,
        itemCount: 1,
        message: DELETE_SUCCESS_MESSAGE,
      })
    } else {
      throw new Error("Location is already deleted")
    }
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

export const findMachineClassByLocation = async (
  req: Request,
  res: Response
) => {
  const { locations } = req.query

  if (!locations || !locations?.length) {
    return res.json({
      error: false,
      message: null,
      items: [],
      itemCount: 0,
    })
  }
  let { startDate, endDate } = req.query
  try {
    startDate = !startDate
      ? dayjs().startOf("week").format()
      : dayjs(startDate as string).format()
    endDate = !endDate
      ? dayjs().endOf("week").format()
      : dayjs(endDate as string).format()

    const locationToBeFound = (locations as string)
      .split(",")
      .map((e: string) => new Types.ObjectId(e))

    const distinctMachineClassesIds = (
      await timerLogs.distinct("machineClassId", {
        locationId: { $in: locationToBeFound },
        ...(startDate &&
          endDate && {
            createdAt: {
              $gte: new Date(startDate as string),
              $lt: new Date(endDate as string),
            },
          }),
      })
    ).map((e) => new Types.ObjectId(e))

    const cacheKey = `locationMachineClasses:${locations}:${distinctMachineClassesIds}`
    const cachedData = await redisClient.get(cacheKey)
    if (cachedData) {
      res.json({
        error: false,
        items: JSON.parse(cachedData),
        count: JSON.parse(cachedData).length,
        message: "Data from cache",
      })
    } else {
      const distinctMachineClasses = await machines.aggregate([
        {
          $match: {
            $and: [
              {
                locationId: { $in: locationToBeFound },
              },
              {
                machineClassId: { $in: distinctMachineClassesIds },
              },
            ],
          },
        },
        {
          $group: {
            _id: "$machineClassId",
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "machineclasses", // Replace with the actual name of your MachineClass collection
            localField: "_id",
            foreignField: "_id",
            as: "machineClass",
          },
        },
        {
          $unwind: {
            path: "$machineClass",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 0,
            machineClass: 1,
          },
        },
        { $sort: { createdAt: -1 } },
      ])

      const data = distinctMachineClasses
        .map((e) => e?.machineClass)
        .filter((i) => Boolean(i))

      redisClient.set(cacheKey, JSON.stringify(data), { EX: 480 })

      res.json({
        error: false,
        items: data,
        itemCount: data.length,
        message: "Successfully Get",
      })
    }
  } catch (err: any) {
    console.log("🚀 ~ file: default.ts:336 ~ err:", err)
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
