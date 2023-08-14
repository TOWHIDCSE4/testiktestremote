import { Request, Response } from "express"
import Jobs from "../../models/jobs"
import {
  UNKNOWN_ERROR_OCCURRED,
  REQUIRED_VALUE_EMPTY,
  JOB_ALREADY_EXISTS,
  ADD_SUCCESS_MESSAGE,
  UPDATE_SUCCESS_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
} from "../../utils/constants"
import isEmpty from "lodash/isEmpty"
import { ZJob } from "custom-validator"

export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const jobsCount = await Jobs.find().countDocuments()
    const getAllJobs = await Jobs.find().sort({
      createdAt: -1,
    })
    res.json({
      error: false,
      items: getAllJobs,
      itemCount: jobsCount,
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

export const getJob = async (req: Request, res: Response) => {
  try {
    const getJob = await Jobs.findOne({
      _id: req.params.id,
      deletedAt: null,
    })
    res.json({
      error: false,
      message: null,
      item: getJob,
      itemCount: 1,
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

export const addJob = async (req: Request, res: Response) => {
  const { name, description, factoryId, isActive, machineId } = req.body
  if (name && description && factoryId && isActive && machineId) {
    const newJob = new Jobs({
      name,
      description,
      factoryId,
      isActive,
      machineId,
      updatedAt: null,
      deletedAt: null,
    })
    const parsedJob = ZJob.safeParse(req.body)
    if (parsedJob.success) {
      try {
        const getExistingJob = await Jobs.find({
          $or: [{ name, description }],
          deletedAt: { $exists: true },
        })
        if (getExistingJob.length === 0) {
          const createJob = await newJob.save()
          res.json({
            error: false,
            message: ADD_SUCCESS_MESSAGE,
            item: createJob,
            itemCount: 1,
          })
        } else {
          res.json({
            error: true,
            message: JOB_ALREADY_EXISTS,
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
        message: JSON.parse(parsedJob.error.message),
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

export const updateJob = async (req: Request, res: Response) => {
  const getJob = await Jobs.find({
    _id: req.params.id,
    deletedAt: { $exists: false },
  })
  const condition = req.body
  if (getJob.length === 0) {
    if (!isEmpty(condition)) {
      try {
        const updateJob = await Jobs.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
            updatedAt: Date.now(),
          },
          { new: true }
        )
        res.json({
          error: false,
          item: updateJob,
          message: UPDATE_SUCCESS_MESSAGE,
          itemCount: 1,
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
        message: "Job cannot be found",
        items: null,
        itemCount: null,
      })
    }
  } else {
    res.json({
      error: true,
      message: "Job does not exist",
      items: null,
      itemCount: null,
    })
  }
}

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const getJob = await Jobs.find({
      _id: req.params.id,
      deletedAt: null,
    })
    if (getJob.length > 0) {
      const deleteJob = await Jobs.findByIdAndUpdate(req.params.id, {
        $set: {
          deletedAt: Date.now(),
        },
      })
      const deletedJob = await Jobs.findById({
        _id: req.params.id,
      })
      res.json({
        error: false,
        message: DELETE_SUCCESS_MESSAGE,
        item: deletedJob,
        itemCount: 1,
      })
    } else {
      throw new Error("Job is already deleted")
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
