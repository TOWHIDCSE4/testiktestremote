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
import machineClasses from "../../models/machineClasses"
import machines from "../../models/machines"
import { Types } from "mongoose"

export const getAllLocations = async (req: Request, res: Response) => {
  try {
    const locationsCount = await Locations.find().countDocuments()
    const getAllLocations = await Locations.find().sort({ createdAt: 1 })
    res.json({
      error: false,
      items: getAllLocations,
      itemCount: locationsCount,
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

  //@ts-expect-error
  const locationToBeFound = locations
    .split(",")
    .map((e: string) => new Types.ObjectId(e))
  try {
    const distinctMachineClasses = await machines.aggregate([
      {
        $match: {
          // locationId:  new Types.ObjectId(locationId as string),
          locationId: { $in: locationToBeFound },
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
    ])
    res.json({
      error: false,
      item: distinctMachineClasses,
      itemCount: distinctMachineClasses.length,
      message: "Successfully Get",
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
