import { Request, Response } from "express"
import MachineClasses from "../../models/machineClasses"
import {
  UNKNOWN_ERROR_OCCURRED,
  REQUIRED_VALUE_EMPTY,
  MACHINE_CLASS__ALREADY_EXISTS,
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
      count: machineClassesCount,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.status(500).json(message)
  }
}

export const getMachineClass = async (req: Request, res: Response) => {
  try {
    const getMachineClass = await MachineClasses.findOne({
      _id: req.params.id,
      deletedAt: null,
    })
    res.json({
      item: getMachineClass,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.status(500).json(message)
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
        res.json({ data: createMachineClass })
      } else {
        res.status(400).json(MACHINE_CLASS__ALREADY_EXISTS)
      }
    } catch (err: any) {
      const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
      res.status(500).json(message)
    }
  } else {
    res.status(400).json(REQUIRED_VALUE_EMPTY)
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
        res.json(updateMachineClass)
      } catch (err: any) {
        const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
        res.status(500).json(message)
      }
    } else {
      res.status(500).json("Machine class cannot be found")
    }
  } else {
    res.status(400).json("Machine class does not exist")
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
      res.json(deletedMachineClass)
    } else {
      throw new Error("Machine class is already deleted")
    }
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.status(500).json(message)
  }
}
