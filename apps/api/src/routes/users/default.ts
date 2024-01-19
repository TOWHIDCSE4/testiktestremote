import { Request, Response } from "express"
import Users from "../../models/users"
import {
  UNKNOWN_ERROR_OCCURRED,
  REQUIRED_VALUE_EMPTY,
  ACCOUNT_ALREADY_EXISTS,
  ADD_SUCCESS_MESSAGE,
  UPDATE_SUCCESS_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
  VALID_EMAIL,
} from "../../utils/constants"
import CryptoJS from "crypto-js"
import { keys } from "../../config/keys"
import isEmpty from "lodash/isEmpty"
import { ZUser } from "custom-validator"
import { pickBy } from "lodash/fp"
import * as Sentry from "@sentry/node"

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { role, machineClassId, factoryId } = req.query
    const query = { status: "Approved", role, machineClassId, factoryId }
    const filteredQuery = pickBy((v) => !isEmpty(v), query)
    const usersCounts = await Users.find(filteredQuery).countDocuments()
    const getAllUsers = await Users.find(filteredQuery).sort({ createdAt: -1 })
    res.json({
      error: false,
      items: getAllUsers,
      itemCount: usersCounts,
      message: null,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    Sentry.captureException(err)
    res.json({
      error: true,
      message: message,
      items: null,
      itemCount: null,
    })
  }
}

export const getUser = async (req: Request, res: Response) => {
  try {
    const getUser = await Users.findOne({
      _id: req.params.id,
      deletedAt: null,
    })
    res.json({
      error: false,
      item: getUser,
      itemCount: 1,
      message: null,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    Sentry.captureException(err)
    res.json({
      error: true,
      message: message,
      items: null,
      itemCount: null,
    })
  }
}

export const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const getUser = await Users.findOne({
      email: req.params.email,
      deletedAt: null,
    })
    res.json({
      error: false,
      item: getUser,
      itemCount: 1,
      message: null,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    Sentry.captureException(err)
    res.json({
      error: true,
      message: message,
    })
  }
}

export const addUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, locationId, role, status } =
    req.body
  if (password.length < 8) {
    res.status(400).json({
      error: true,
      message: "Password must be more than 8 characters",
    })
    return
  }
  if (firstName && lastName && email && password && locationId && role) {
    const encryptPassword = CryptoJS.AES.encrypt(
      password,
      keys.encryptKey as string
    ).toString()
    // const emailDomain = email.split("@")
    const newUser = new Users({
      firstName,
      lastName,
      role,
      email,
      status,
      password: encryptPassword,
      locationId,
      profile: null,
      createdAt: Date.now(),
      updatedAt: null,
      deletedAt: null,
    })
    try {
      const getExistingUser = await Users.find({
        $or: [{ email }],
        deletedAt: { $exists: true },
      })
      if (getExistingUser.length === 0) {
        const validateUserInput = ZUser.safeParse(req.body)
        if (validateUserInput.success) {
          const createUser = await newUser.save()
          res.json({
            error: false,
            item: createUser,
            itemCount: 1,
            message: ADD_SUCCESS_MESSAGE,
          })
        } else {
          res.json({ error: true, message: validateUserInput.error })
        }
      } else {
        res.json({
          error: true,
          message: ACCOUNT_ALREADY_EXISTS,
          items: null,
          itemCount: null,
        })
      }
    } catch (err: any) {
      const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
      Sentry.captureException(err)
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

export const updateUser = async (req: Request, res: Response) => {
  const getUser = await Users.findById({
    _id: req.params.id,
    deletedAt: { $exists: true },
  })

  const condition = req.body
  if (getUser) {
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
        res.json({
          error: false,
          item: updateUser,
          itemCount: 1,
          message: UPDATE_SUCCESS_MESSAGE,
        })
      } catch (err: any) {
        const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
        Sentry.captureException(err)
        res.json({
          error: true,
          message: message,
        })
      }
    } else {
      res.json({
        error: true,
        message: "User cannot be found",
      })
    }
  } else {
    res.json({
      error: true,
      message: "User does not exist",
    })
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
      res.json({
        error: false,
        item: deleteUser,
        itemCount: 1,
        message: DELETE_SUCCESS_MESSAGE,
      })
    } else {
      throw new Error("User is already deleted")
    }
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    Sentry.captureException(err)
    res.json({
      error: true,
      message: message,
      items: null,
      itemCount: null,
    })
  }
}
