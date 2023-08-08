import { Request, Response } from "express"
import Jobs from "../../models/jobs"
import {
  UNKNOWN_ERROR_OCCURRED,
  REQUIRED_VALUE_EMPTY,
  JOB_ALREADY_EXISTS,
} from "../../utils/constants"
import isEmpty from "lodash/isEmpty"
import { JobsZodSchema } from "zod-schema"

export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const jobsCount = await Jobs.find().countDocuments()
    const getAllJobs = await Jobs.find().sort({
      createdAt: -1,
    })
    res.json({
      error: false,
      items: getAllJobs,
      count: jobsCount,
      errMessage: null,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.status(500).json(message)
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
      item: getJob,
      errMessage: null,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.status(500).json(message)
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
    const validateJobInput = JobsZodSchema.safeParse(newJob)
    if (validateJobInput.success) {
      try {
        const getExistingJob = await Jobs.find({
          $or: [{ name, description }],
          deletedAt: { $exists: true },
        })
        if (getExistingJob.length === 0) {
          const createJob = await newJob.save()
          res.json({ error: false, data: createJob, errMessage: null })
        } else {
          res.status(400).json(JOB_ALREADY_EXISTS)
        }
      } catch (err: any) {
        const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
        res.status(500).json(message)
      }
    } else {
      res.json({
        error: true,
        errorMessage: JSON.parse(validateJobInput.error.message),
      })
    }
  } else {
    res.status(400).json(REQUIRED_VALUE_EMPTY)
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
        res.json(updateJob)
      } catch (err: any) {
        const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
        res.status(500).json(message)
      }
    } else {
      res.status(500).json("Job cannot be found")
    }
  } else {
    res.status(400).json("Job does not exist")
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
      res.json(deletedJob)
    } else {
      throw new Error("Job is already deleted")
    }
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.status(500).json(message)
  }
}
