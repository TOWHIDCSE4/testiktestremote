import { Request, Response } from "express"
import Factories from "../../models/factories"
import {
  UNKNOWN_ERROR_OCCURRED,
  REQUIRED_VALUE_EMPTY,
  ACCOUNT_ALREADY_EXISTS,
  FACTORY_ALREADY_EXISTS,
  ADD_SUCCESS_MESSAGE,
  UPDATE_SUCCESS_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
} from "../../utils/constants"
import isEmpty from "lodash/isEmpty"

export const getAllFactories = async (req: Request, res: Response) => {
  try {
    const factoriesCount = await Factories.find().countDocuments()
    const getAllFactories = await Factories.find().sort({ createdAt: -1 })
    res.json({
      error: false,
      items: getAllFactories,
      itemCount: factoriesCount,
      message: null,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.json({
      error: true,
      message: message,
      item: null,
      itemCount: null,
    })
  }
}

export const getFactory = async (req: Request, res: Response) => {
  try {
    const getFactory = await Factories.findOne({
      _id: req.params.id,
      deletedAt: null,
    })
    res.json({
      error: false,
      item: getFactory,
      itemCount: 1,
      message: null,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.json({
      error: true,
      message: message,
      item: null,
      itemCount: null,
    })
  }
}

export const addFactory = async (req: Request, res: Response) => {
  const { name } = req.body
  if (name) {
    const newFactory = new Factories({
      name,
      updatedAt: null,
      deletedAt: null,
    })

    try {
      const getExistingFactory = await Factories.find({
        $or: [{ name }],
        deletedAt: { $exists: false },
      })
      if (getExistingFactory.length === 0) {
        const createFactory = await newFactory.save()
        res.json({
          error: false,
          item: createFactory,
          itemCount: 1,
          message: ADD_SUCCESS_MESSAGE,
        })
      } else {
        res.json({
          error: true,
          message: FACTORY_ALREADY_EXISTS,
          item: null,
          itemCount: null,
        })
      }
    } catch (err: any) {
      const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
      res.json({
        error: true,
        message: message,
        item: null,
        itemCount: null,
      })
    }
  } else {
    res.json({
      error: true,
      message: REQUIRED_VALUE_EMPTY,
      item: null,
      itemCount: null,
    })
  }
}

export const updateFactory = async (req: Request, res: Response) => {
  const getFactory = await Factories.find({
    _id: req.params.id,
    deletedAt: { $exists: false },
  })
  const condition = req.body
  if (getFactory.length === 0) {
    if (!isEmpty(condition)) {
      try {
        const updateFactory = await Factories.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
            updatedAt: Date.now(),
          },
          { new: true }
        )
        res.json({
          error: false,
          message: UPDATE_SUCCESS_MESSAGE,
          item: updateFactory,
          itemCount: 1,
        })
      } catch (err: any) {
        const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
        res.json({
          error: true,
          message: message,
          item: null,
          itemCount: null,
        })
      }
    } else {
      res.json({
        error: true,
        message: "Factory cannot be found",
        item: null,
        itemCount: null,
      })
    }
  } else {
    res.json({
      error: true,
      message: "Factory does not exist",
      item: null,
      itemCount: null,
    })
  }
}

export const delteFactory = async (req: Request, res: Response) => {
  try {
    const getFactory = await Factories.find({
      _id: req.params.id,
      deletedAt: null,
    })
    if (getFactory.length > 0) {
      const deleteFactory = await Factories.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      })
      res.json({
        error: false,
        message: DELETE_SUCCESS_MESSAGE,
        item: deleteFactory,
        itemCount: null,
      })
    } else {
      throw new Error("Factory is already deleted")
    }
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.json({
      error: true,
      message: message,
      item: null,
      itemCount: null,
    })
  }
}
