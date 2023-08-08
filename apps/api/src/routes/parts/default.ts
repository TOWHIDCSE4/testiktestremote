import { Request, Response } from "express"
import Parts from "../../models/parts"
import {
  UNKNOWN_ERROR_OCCURRED,
  REQUIRED_VALUE_EMPTY,
  PART_ALREADY_EXISTS,
} from "../../utils/constants"
import isEmpty from "lodash/isEmpty"

export const getAllParts = async (req: Request, res: Response) => {
  try {
    const partsCount = await Parts.find().countDocuments()
    const getAllParts = await Parts.find().sort({
      createdAt: -1,
    })
    res.json({
      error: false,
      items: getAllParts,
      count: partsCount,
      errMessage: null,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.status(500).json(message)
  }
}

export const getPart = async (req: Request, res: Response) => {
  try {
    const getPart = await Parts.findOne({
      _id: req.params.id,
      deletedAt: null,
    })
    res.json({
      error: false,
      item: getPart,
      errMessage: null,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.status(500).json(message)
  }
}

export const addPart = async (req: Request, res: Response) => {
  const {
    name,
    factoryId,
    machineClassId,
    pounds,
    finishGoodWeight,
    cageWeightActual,
    cageWeightScrap,
    locationId,
  } = req.body
  if (
    name &&
    factoryId &&
    machineClassId &&
    pounds &&
    finishGoodWeight &&
    cageWeightActual &&
    cageWeightScrap &&
    locationId
  ) {
    const newPart = new Parts({
      name,
      factoryId,
      machineClassId,
      pounds,
      finishGoodWeight,
      cageWeightActual,
      cageWeightScrap,
      locationId,
      updatedAt: null,
      deletedAt: null,
    })

    try {
      const getExistingPart = await Parts.find({
        $or: [{ name }],
        deletedAt: { $exists: false },
      })
      if (getExistingPart.length === 0) {
        const createPart = await newPart.save()
        res.json({ error: false, data: createPart, errMessage: null })
      } else {
        res.status(400).json(PART_ALREADY_EXISTS)
      }
    } catch (err: any) {
      const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
      res.status(500).json(message)
    }
  } else {
    res.status(400).json(REQUIRED_VALUE_EMPTY)
  }
}

export const updatePart = async (req: Request, res: Response) => {
  const getPart = await Parts.find({
    _id: req.params.id,
    deletedAt: { $exists: false },
  })
  const condition = req.body
  if (getPart.length === 0) {
    if (!isEmpty(condition)) {
      try {
        const updatePart = await Parts.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
            updatedAt: Date.now(),
          },
          { new: true }
        )
        res.json(updatePart)
      } catch (err: any) {
        const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
        res.status(500).json(message)
      }
    } else {
      res.status(500).json("Part cannot be found")
    }
  } else {
    res.status(400).json("Part does not exist")
  }
}

export const deletePart = async (req: Request, res: Response) => {
  try {
    const getPart = await Parts.find({
      _id: req.params.id,
      deletedAt: null,
    })
    if (getPart.length > 0) {
      const deletePart = await Parts.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      })
      const deletedPart = await Parts.findById({
        _id: req.params.id,
      })
      res.json(deletedPart)
    } else {
      throw new Error("Part is already deleted")
    }
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.status(500).json(message)
  }
}
