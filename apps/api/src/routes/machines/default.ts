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

export const getAllMachines = async (req: Request, res: Response) => {
  try {
    const machinesCount = await Machines.find().countDocuments()
    const getAllMachines = await Machines.find().sort({
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
      deletedAt: null,
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
  } else {
    res.json({
      error: true,
      message: "Machine does not exist",
      items: null,
      itemCount: null,
    })
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
      res.json({
        error: false,
        item: deletedMachine,
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
