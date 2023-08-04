import { Request, Response } from "express"
import Machines from "../../models/machines"
import {
  UNKNOWN_ERROR_OCCURRED,
  REQUIRED_VALUE_EMPTY,
} from "../../utils/constants"
import isEmpty from "lodash/isEmpty"

export const getAllMachines = async (req: Request, res: Response) => {
  try {
    const machinesCount = await Machines.find().countDocuments()
    const getAllMachines = await Machines.find().sort({
      createdAt: -1,
    })
    res.json({
      items: getAllMachines,
      count: machinesCount,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.status(500).json(message)
  }
}

export const getMachine = async (req: Request, res: Response) => {
  try {
    const getMachine = await Machines.findOne({
      _id: req.params.id,
      deletedAt: null,
    })
    res.json({
      item: getMachine,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.status(500).json(message)
  }
}

export const addMachine = async (req: Request, res: Response) => {
  const { name, description, factoryId, machineClassId } = req.body
  if (name && description && factoryId && machineClassId) {
    const newMachine = new Machines({
      name,
      description,
      factoryId,
      machineClassId,
      locationId: null,
      updatedAt: null,
      deletedAt: null,
    })
    try {
      const createMachine = await newMachine.save()
      res.json({ data: createMachine })
    } catch (err: any) {
      const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
      res.status(500).json(message)
    }
  } else {
    res.status(400).json(REQUIRED_VALUE_EMPTY)
  }
}

export const updateMachine = async (req: Request, res: Response) => {
  const getMachine = await Machines.find({
    _id: req.params.id,
    deletedAt: { $exists: false },
  })
  const condition = req.body
  if (getMachine.length === 0) {
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
        res.json(updateMachine)
      } catch (err: any) {
        const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
        res.status(500).json(message)
      }
    } else {
      res.status(500).json("Machine cannot be found")
    }
  } else {
    res.status(400).json("Machine does not exist")
  }
}

export const deleteMachine = async (req: Request, res: Response) => {
  try {
    const getMachine = await Machines.find({
      _id: req.params.id,
      deletedAt: null,
    })
    if (getMachine.length > 0) {
      const deleteMachine = await Machines.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      })
      const deletedMachine = await Machines.findById({
        _id: req.params.id,
      })
      res.json(deletedMachine)
    } else {
      throw new Error("Machine is already deleted")
    }
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.status(500).json(message)
  }
}
