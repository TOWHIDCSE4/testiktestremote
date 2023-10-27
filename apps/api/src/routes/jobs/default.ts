import { Request, Response } from "express"
import Jobs from "../../models/jobs"
import {
  UNKNOWN_ERROR_OCCURRED,
  ADD_SUCCESS_MESSAGE,
  UPDATE_SUCCESS_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
  REQUIRED_VALUES_MISSING,
} from "../../utils/constants"
import { ZJob } from "custom-validator"
import Parts from "../../models/parts"
import * as Sentry from "@sentry/node"

export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const jobsCount = await Jobs.find().countDocuments()
    const getAllJobs = await Jobs.find({
      $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
    }).sort({
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
    Sentry.captureException(err)
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
      $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
    }).populate("partId")
    res.json({
      error: false,
      message: null,
      item: getJob,
      itemCount: 1,
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

export const addJob = async (req: Request, res: Response) => {
  const parsedJob = ZJob.safeParse(req.body)
  if (parsedJob.success) {
    const part = await Parts.findOne({
      _id: req.body.partId,
    })
    const { status, drawingNumber, ...rest } = req.body
    const newJob = new Jobs({
      ...rest,
      status: req.body.isStock ? "Active" : req.body.status,
      drawingNumber: req.body.isStock ? undefined : req.body.drawingNumber,
      factoryId: part?.factoryId,
    })
    try {
      if (req.body.isStock) {
        const getStockJob = await Jobs.findOne({
          locationId: req.body.locationId,
          partId: req.body.partId,
          factoryId: part?.factoryId,
          isStock: true,
          $and: [
            { status: { $ne: "Deleted" } },
            { status: { $ne: "Archived" } },
            { status: { $ne: "Testing" } }, //TODO: discuss with jamiel
          ],
          $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
        })
        if (!getStockJob) {
          newJob.name = `(Stock) ${part?.name}`
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
            message: "Stock job already exists",
            items: null,
            itemCount: null,
          })
        }
      } else {
        const getStockJob = await Jobs.findOne({
          locationId: req.body.locationId,
          partId: req.body.partId,
          factoryId: part?.factoryId,
          isStock: true,
          $and: [
            { status: { $ne: "Deleted" } },
            { status: { $ne: "Archived" } },
          ],
          $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
        })
        if (!getStockJob) {
          const newStockJob = new Jobs({
            locationId: req.body.locationId,
            partId: req.body.partId,
            factoryId: part?.factoryId,
            name: `(Stock) ${part?.name}`,
            drawingNumber: req.body.drawingNumber,
            userId: req.body.userId,
            status: "Active",
            isStock: true,
          })
          await newStockJob.save()
        }
        const createJob = await newJob.save()
        res.json({
          error: false,
          message: ADD_SUCCESS_MESSAGE,
          item: createJob,
          itemCount: 1,
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
      message: JSON.parse(parsedJob.error.message),
    })
  }
}

export const updateJob = async (req: Request, res: Response) => {
  if (req.params.id) {
    try {
      const getJob = await Jobs.find({
        _id: req.params.id,
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      })
      if (getJob.length > 0) {
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
      } else {
        res.json({
          error: true,
          message: "Job does not exist",
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
      message: REQUIRED_VALUES_MISSING,
      items: null,
      itemCount: null,
    })
  }
}

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const getJob = await Jobs.find({
      _id: req.params.id,
      $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
    })
    if (getJob.length > 0) {
      const deleteJob = await Jobs.findByIdAndUpdate(req.params.id, {
        $set: {
          status: "Deleted",
        },
      })
      res.json({
        error: false,
        message: DELETE_SUCCESS_MESSAGE,
        item: deleteJob,
        itemCount: 1,
      })
    } else {
      throw new Error("Job is already deleted")
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
