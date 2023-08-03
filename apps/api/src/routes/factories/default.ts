import express from "express"
import { Request, Response } from "express"
import Factories from "../../models/factories"
import {
  UNKNOWN_ERROR_OCCURRED,
  REQUIRED_VALUE_EMPTY,
  ACCOUNT_ALREADY_EXISTS,
  FACTORY_ALREADY_EXISTS,
} from "../../utils/constants"
import CryptoJS from "crypto-js"
import { keys } from "../../config/keys"
import isEmpty from "lodash/isEmpty"

export const getAllFactories = async (req: Request, res: Response) => {
  try {
    const factoriesCount = await Factories.find().countDocuments()
    const getAllFactories = await Factories.find().sort({ createdAt: -1 })
    res.json({
      items: getAllFactories,
      count: factoriesCount,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.status(500).json(message)
  }
}

export const getFactory = async (req: Request, res: Response) => {
  try {
    const getFactory = await Factories.findOne({
      _id: req.params.id,
      deletedAt: null,
    })
    res.json({
      item: getFactory,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.status(500).json(message)
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
        res.json({ data: createFactory })
      } else {
        res.status(400).json(FACTORY_ALREADY_EXISTS)
      }
    } catch (err: any) {
      const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
      res.status(500).json(message)
    }
  } else {
    res.status(400).json(REQUIRED_VALUE_EMPTY)
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
        res.json(updateFactory)
      } catch (err: any) {
        const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
        res.status(500).json(message)
      }
    } else {
      res.status(500).json("Factory cannot be found")
    }
  } else {
    res.status(400).json("Factory does not exist")
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
      res.json(deleteFactory)
    } else {
      throw new Error("Factory is already deleted")
    }
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.status(500).json(message)
  }
}
