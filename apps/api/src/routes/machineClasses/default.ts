import { Request, Response } from "express"
import MachineClasses from "../../models/machineClasses"
import {
  UNKNOWN_ERROR_OCCURRED,
  REQUIRED_VALUE_EMPTY,
  MACHINE_CLASS__ALREADY_EXISTS,
  ADD_SUCCESS_MESSAGE,
  UPDATE_SUCCESS_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
} from "../../utils/constants"
import isEmpty from "lodash/isEmpty"

export const getAllMachineClasses = async (req: Request, res: Response) => {
  try {
    const machineClassesCount = await MachineClasses.find().countDocuments()
    const getAllMachineClasses = await MachineClasses.find().sort({
      createdAt: -1,
    })
    res.json({
      items: getAllMachineClasses,
      itemCount: machineClassesCount,
      message: null,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.status(500).json({
      error: true,
      message: message,
      items: null,
      itemCount: null,
    })
  }
}

export const getMachineClass = async (req: Request, res: Response) => {
  try {
    const getMachineClass = await MachineClasses.findOne({
      _id: req.params.id,
      deletedAt: null,
    })
    res.json({
      error: false,
      item: getMachineClass,
      itemCount: 1,
      message: null,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.status(500).json({
      error: true,
      message: message,
      items: null,
      itemCount: null,
    })
  }
}

export const addMachineClass = async (req: Request, res: Response) => {
  const { name } = req.body
  if (name) {
    const newMachineClass = new MachineClasses({
      name,
      updatedAt: null,
      deletedAt: null,
    })

    try {
      const getExistingMachineClass = await MachineClasses.find({
        $or: [{ name }],
        deletedAt: { $exists: false },
      })
      if (getExistingMachineClass.length === 0) {
        const createMachineClass = await newMachineClass.save()
        res.json({
          error: false,
          item: createMachineClass,
          itemCount: 1,
          message: ADD_SUCCESS_MESSAGE,
        })
      } else {
        res.status(400).json({
          error: true,
          message: MACHINE_CLASS__ALREADY_EXISTS,
          items: null,
          itemCount: null,
        })
      }
    } catch (err: any) {
      const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
      res.status(500).json({
        error: true,
        message: message,
        items: null,
        itemCount: null,
      })
    }
  } else {
    res.status(400).json({
      error: true,
      message: REQUIRED_VALUE_EMPTY,
      items: null,
      itemCount: null,
    })
  }
}

export const updateMachineClass = async (req: Request, res: Response) => {
  const getMachineClass = await MachineClasses.find({
    _id: req.params.id,
    deletedAt: { $exists: false },
  })
  const condition = req.body
  if (getMachineClass.length === 0) {
    if (!isEmpty(condition)) {
      try {
        const updateMachineClass = await MachineClasses.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
            updatedAt: Date.now(),
          },
          { new: true }
        )
        res.json({
          error: false,
          item: updateMachineClass,
          itemCount: 1,
          message: UPDATE_SUCCESS_MESSAGE,
        })
      } catch (err: any) {
        const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
        res.status(500).json({
          error: true,
          message: message,
          items: null,
          itemCount: null,
        })
      }
    } else {
      res.status(500).json({
        error: true,
        message: "Machine class cannot be found",
        items: null,
        itemCount: null,
      })
    }
  } else {
    res.status(400).json({
      error: true,
      message: "Machine class does not exist",
      items: null,
      itemCount: null,
    })
  }
}

export const deleteMachineClass = async (req: Request, res: Response) => {
  try {
    const getMachineClass = await MachineClasses.find({
      _id: req.params.id,
      deletedAt: null,
    })
    if (getMachineClass.length > 0) {
      const deleteMachineClass = await MachineClasses.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            deletedAt: Date.now(),
          },
        }
      )
      const deletedMachineClass = await MachineClasses.findById({
        _id: req.params.id,
      })
      res.json({
        error: false,
        item: deletedMachineClass,
        itemCount: 1,
        message: DELETE_SUCCESS_MESSAGE,
      })
    } else {
      throw new Error("Machine class is already deleted")
    }
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.status(500).json({
      error: true,
      message: message,
      items: null,
      itemCount: null,
    })
  }
}
