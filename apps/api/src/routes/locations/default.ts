import { Request, Response } from "express"
import Locations from "../../models/location"
import {
  UNKNOWN_ERROR_OCCURRED,
  REQUIRED_VALUE_EMPTY,
  ACCOUNT_ALREADY_EXISTS,
  LOCATION_ALREADY_EXISTS,
} from "../../utils/constants"
import isEmpty from "lodash/isEmpty"

export const getAllLocations = async (req: Request, res: Response) => {
  try {
    const locationsCount = await Locations.find().countDocuments()
    const getAllLocations = await Locations.find().sort({ createdAt: -1 })
    res.json({
      items: getAllLocations,
      count: locationsCount,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.status(500).json(message)
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
    res.status(500).json(message)
  }
}

export const addLocation = async (req: Request, res: Response) => {
  const { name } = req.body
  if (name) {
    const newLocation = new Locations({
      name,
      updatedAt: null,
      deletedAt: null,
    })

    try {
      const getExostingLocation = await Locations.find({
        $or: [{ name }],
        deletedAt: { $exists: false },
      })
      if (getExostingLocation.length === 0) {
        const createLocation = await newLocation.save()
        res.json({ data: createLocation })
      } else {
        res.status(400).json(LOCATION_ALREADY_EXISTS)
      }
    } catch (err: any) {
      const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
      res.status(500).json(message)
    }
  } else {
    res.status(400).json(REQUIRED_VALUE_EMPTY)
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
        res.json(updateLocation)
      } catch (err: any) {
        const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
        res.status(500).json(message)
      }
    } else {
      res.status(500).json("Location cannot be found")
    }
  } else {
    res.status(400).json("Location does not exist")
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
      res.json(deletedLocation)
    } else {
      throw new Error("Location is already deleted")
    }
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.status(500).json(message)
  }
}
