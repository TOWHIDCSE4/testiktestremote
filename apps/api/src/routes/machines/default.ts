import { Request, Response } from "express"
import Machines from "../../models/machines"
import {
  UNKNOWN_ERROR_OCCURRED,
  REQUIRED_VALUE_EMPTY,
  ADD_SUCCESS_MESSAGE,
  UPDATE_SUCCESS_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
} from "../../utils/constants"
import isEmpty from "lodash/isEmpty"
import { ZMachine } from "custom-validator"
import mongoose from "mongoose"

export const getAllMachines = async (req: Request, res: Response) => {
  try {
    const machinesCount = await Machines.find().countDocuments()
    const getAllMachines = await Machines.find({
      $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
    }).sort({
      createdAt: -1,
    })
    res.json({
      error: false,
      items: getAllMachines,
      itemCount: machinesCount,
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

export const getMachine = async (req: Request, res: Response) => {
  try {
    const getMachine = await Machines.findOne({
      _id: req.params.id,
      $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
    })
    res.json({
      error: false,
      item: getMachine,
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

export const addMachine = async (req: Request, res: Response) => {
  const { name, description, factoryId, machineClassId, locationId, files } =
    req.body
  if (name && description && factoryId && machineClassId && locationId) {
    const newMachine = new Machines({
      name,
      description,
      factoryId,
      machineClassId,
      files,
      locationId,
      updatedAt: null,
      deletedAt: null,
    })
    const parsedMachine = ZMachine.safeParse(req.body)
    if (parsedMachine.success) {
      try {
        const createMachine = await newMachine.save()
        res.json({
          error: false,
          item: createMachine,
          itemCount: 1,
          message: ADD_SUCCESS_MESSAGE,
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
        message: parsedMachine.error.issues,
        items: null,
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

export const updateMachine = async (req: Request, res: Response) => {
  const getMachine = await Machines.find({
    _id: req.params.id,
    deletedAt: { $exists: false },
  })
  const condition = req.body
  //TODO: investigate this
  // if (getMachine.length === 0) {
  if (!isEmpty(condition)) {
    try {
      const updateMachine = await Machines.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
          updatedAt: Date.now(),
        },
        { new: true }
      )
      res.json({
        error: false,
        item: updateMachine,
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
      message: "Machine cannot be found",
      items: null,
      itemCount: null,
    })
  }
  // } else {
  //   res.json({
  //     error: true,
  //     message: "Machine does not exist",
  //     items: null,
  //     itemCount: null,
  //   })
  // }
}

export const deleteMachine = async (req: Request, res: Response) => {
  try {
    const getMachine = await Machines.find({
      _id: req.params.id,
      $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
    })
    if (getMachine.length > 0) {
      const deleteMachine = await Machines.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      })
      res.json({
        error: false,
        item: deleteMachine,
        itemCount: 1,
        message: DELETE_SUCCESS_MESSAGE,
      })
    } else {
      throw new Error("Machine is already deleted")
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
    if (!id) throw new Error("Machine id is required")
    let isVerified = false
    const getMachine = await Machines.findOne({
      _id: id,
      $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
    })
    if (!getMachine) throw new Error("Machine not found")
    const verified = getMachine?.verified
    if (!verified) {
      isVerified = true
    }
    await Machines.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: { verified: isVerified } }
    )
    res.json({
      error: false,
      message: `Machine ${isVerified ? "verified" : "unverfied"} successfully`,
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
