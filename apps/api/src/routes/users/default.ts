import express from "express"
import { Request, Response } from "express"
import Users from "../../models/users"
import {
  UNKNOWN_ERROR_OCCURRED,
  REQUIRED_VALUE_EMPTY,
  ACCOUNT_ALREADY_EXISTS,
} from "../../utils/constants"
import CryptoJS from "crypto-js"
import { keys } from "../../config/keys"
import isEmpty from "lodash/isEmpty"
import { UsersZodSchema } from "zod-schema"

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const usersCounts = await Users.find().countDocuments()
    const getAllUsers = await Users.find().sort({ createdAt: -1 })
    res.json({
      items: getAllUsers,
      count: usersCounts,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.status(500).json(message)
  }
}

export const getUser = async (req: Request, res: Response) => {
  try {
    const getUser = await Users.findOne({
      _id: req.params.id,
      deletedAt: null,
    })
    res.json({
      item: getUser,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.status(500).json(message)
  }
}

export const addUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, location, role } = req.body
  if (firstName && lastName && email && password && location && role) {
    const encryptPassword = CryptoJS.AES.encrypt(
      password,
      keys.encryptKey as string
    )
    const newUser = new Users({
      firstName,
      lastName,
      role,
      email,
      password: encryptPassword,
      location,
    })

    try {
      const getExistingUser = await Users.find({
        $or: [{ email }],
        deletedAt: { $exists: false },
      })
      if (getExistingUser.length === 0) {
        const validateUserInput = UsersZodSchema.safeParse(newUser)
        if (validateUserInput.success) {
          const createUser = await newUser.save()
          res.json({ data: createUser })
        } else {
          res.json({ error: true, message: validateUserInput.error })
        }
      } else {
        res.status(400).json(ACCOUNT_ALREADY_EXISTS)
      }
    } catch (err: any) {
      const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
      res.status(500).json(message)
    }
  } else {
    res.status(400).json(REQUIRED_VALUE_EMPTY)
  }
}

export const updateUser = async (req: Request, res: Response) => {
  const getUser = await Users.find({
    _id: req.params.id,
    deletedAt: { $exists: false },
  })
  const condition = req.body
  if (getUser.length === 0) {
    if (!isEmpty(condition)) {
      try {
        const updateUser = await Users.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
            updatedAt: Date.now(),
          },
          { new: true }
        )
        res.json(updateUser)
      } catch (err: any) {
        const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
        res.status(500).json(message)
      }
    } else {
      res.status(500).json("User cannot be found")
    }
  } else {
    res.status(400).json("User does not exist")
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const getUser = await Users.find({
      _id: req.params.id,
      deletedAt: null,
    })
    if (getUser.length > 0) {
      const deleteUser = await Users.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      })
      res.json(deleteUser)
    } else {
      throw new Error("User is already deleted")
    }
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.status(500).json(message)
  }
}
