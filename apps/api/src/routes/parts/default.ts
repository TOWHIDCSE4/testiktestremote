import { Request, Response } from "express"
import Parts from "../../models/parts"
import {
  UNKNOWN_ERROR_OCCURRED,
  REQUIRED_VALUE_EMPTY,
  PART_ALREADY_EXISTS,
  ADD_SUCCESS_MESSAGE,
  UPDATE_SUCCESS_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
} from "../../utils/constants"
import isEmpty from "lodash/isEmpty"
import { ZPart } from "custom-validator"
import mongoose from "mongoose"

export const getAllParts = async (req: Request, res: Response) => {
  try {
    const partsCount = await Parts.find().countDocuments()
    const getAllParts = await Parts.find({
      $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
    }).sort({
      createdAt: -1,
    })
    res.json({
      error: false,
      items: getAllParts,
      itemCount: partsCount,
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

export const getPart = async (req: Request, res: Response) => {
  try {
    const getPart = await Parts.findOne({
      _id: req.params.id,
      $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
    })
    res.json({
      error: false,
      item: getPart,
      itemCount: 1,
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

export const addPart = async (req: Request, res: Response) => {
  const {
    name,
    factoryId,
    machineClassId,
    files,
    tons,
    time,
    finishGoodWeight,
    cageWeightActual,
    cageWeightScrap,
    locationId,
  } = req.body
  const parsedPart = ZPart.safeParse(req.body)
  if (parsedPart.success) {
    const newPart = new Parts({
      name,
      factoryId,
      machineClassId,
      tons,
      time,
      files,
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
        res.json({
          error: false,
          item: createPart,
          itemCount: 1,
          message: ADD_SUCCESS_MESSAGE,
        })
      } else {
        res.json({
          error: true,
          message: PART_ALREADY_EXISTS,
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
      message: "Data is not valid",
      items: null,
      itemCount: null,
    })
  }
}

export const updatePart = async (req: Request, res: Response) => {
  const getPart = await Parts.find({
    _id: req.params.id,
    $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
  })
  const condition = req.body
  if (getPart.length > 0) {
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
        res.json({
          error: false,
          item: updatePart,
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
        message: "Part cannot be found",
        items: null,
        itemCount: null,
      })
    }
  } else {
    res.json({
      error: true,
      message: "Part does not exist",
      items: null,
      itemCount: null,
    })
  }
}

export const deletePart = async (req: Request, res: Response) => {
  try {
    const getPart = await Parts.find({
      _id: req.params.id,
      $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
    })
    if (getPart.length > 0) {
      const deletePart = await Parts.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      })
      res.json({
        error: false,
        item: deletePart,
        itemCount: 1,
        message: DELETE_SUCCESS_MESSAGE,
      })
    } else {
      throw new Error("Part is already deleted")
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
export const verifyOrUnverify = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    if (!id) throw new Error("part Id is required")
    let isVerified = false
    const getPart = await Parts.findOne({
      _id: id,
      $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
    })
    if (!getPart) throw new Error("Part not found")
    const verified = getPart?.verified
    if (!verified) {
      isVerified = true
    }
    await Parts.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: { verified: isVerified } }
    )
    res.json({
      error: false,
      message: `Part ${isVerified ? "verfied" : "unverfied"} successfully`,
      data: {
        verified: isVerified,
      },
      item: null,
      itemCount: null,
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
