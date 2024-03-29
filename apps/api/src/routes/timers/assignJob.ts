import { Request, Response } from "express"
import {
  JOB_ACTION,
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import Jobs from "../../models/jobs"
import JobTimer from "../../models/jobTimer"
import * as Sentry from "@sentry/node"
import { getJobTimer } from "../jobTimer/default"

export const assignJob = async (req: Request, res: Response) => {
  if (
    req.body.locationId &&
    req.body.partId &&
    req.body.factoryId &&
    req.body.timerId
  ) {
    try {
      const getDayJobTimer = await JobTimer.findOne({
        timerId: req.body.timerId,
      })
      const job = await Jobs.findOne({
        _id: getDayJobTimer?.jobId,
        $and: [
          {
            $or: [{ status: "Pending" }, { status: "Active" }],
          },
          {
            $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
          },
        ],
      })
      if (!getDayJobTimer) {
        const jobs = await Jobs.find({
          locationId: req.body.locationId,
          factoryId: req.body.factoryId,
          partId: req.body.partId,
          status: "Pending",
          isStock: false,
        })
        if (jobs?.length > 0) {
          // TODO: ADD SORTING FOR DATES
          const highPriorityJobs = jobs.filter(
            (job) => job.priorityStatus === "High"
          )
          const mediumPriorityJobs = jobs.filter(
            (job) => job.priorityStatus === "Medium"
          )
          const lowPriorityJobs = jobs.filter(
            (job) => job.priorityStatus === "Low"
          )
          let selectedJobId = null
          if (highPriorityJobs.length > 0) {
            selectedJobId = highPriorityJobs[0]._id
          } else if (mediumPriorityJobs.length > 0) {
            selectedJobId = mediumPriorityJobs[0]._id
          } else if (lowPriorityJobs.length > 0) {
            selectedJobId = lowPriorityJobs[0]._id
          }
          const newJobTimer = new JobTimer({
            timerId: req.body.timerId,
            jobId: selectedJobId,
          })
          const createJobTimer = await newJobTimer.save()
          if (createJobTimer) {
            await Jobs.findByIdAndUpdate(
              selectedJobId,
              {
                $set: {
                  status: "Active",
                },
                updatedAt: Date.now(),
              },
              { new: true }
            )
          }
          res.json({
            error: false,
            item: createJobTimer,
            itemCount: null,
            message: null,
          })
        } else {
          const stockJob = await Jobs.findOne({
            locationId: req.body.locationId,
            factoryId: req.body.factoryId,
            partId: req.body.partId,
            status: { $in: ["Pending", "Active"] },
            isStock: true,
          })
          if (stockJob) {
            const newJobTimer = new JobTimer({
              timerId: req.body.timerId,
              jobId: stockJob._id,
            })
            const createJobTimer = await newJobTimer.save()
            res.json({
              error: false,
              item: createJobTimer,
              itemCount: null,
              message: null,
            })
          } else {
            res.json({
              error: false,
              item: null,
              itemCount: null,
              message: null,
            })
          }
        }
      } else if (getDayJobTimer && !job) {
        const jobs = await Jobs.find({
          locationId: req.body.locationId,
          factoryId: req.body.factoryId,
          partId: req.body.partId,
          status: { $in: ["Pending", "Active"] },
          isStock: false,
        })
        if (jobs?.length > 0) {
          // TODO: ADD SORTING FOR DATES
          const highPriorityJobs = jobs.filter(
            (job) => job.priorityStatus === "High"
          )
          const mediumPriorityJobs = jobs.filter(
            (job) => job.priorityStatus === "Medium"
          )
          const lowPriorityJobs = jobs.filter(
            (job) => job.priorityStatus === "Low"
          )
          let selectedJobId = null
          if (highPriorityJobs.length > 0) {
            selectedJobId = highPriorityJobs[0]._id
          } else if (mediumPriorityJobs.length > 0) {
            selectedJobId = mediumPriorityJobs[0]._id
          } else if (lowPriorityJobs.length > 0) {
            selectedJobId = lowPriorityJobs[0]._id
          }
          if (selectedJobId) {
            const updateDayJobTimer = await JobTimer.updateOne(
              { _id: getDayJobTimer._id },
              { timerId: req.body.timerId, jobId: selectedJobId },
              { new: true }
            )
            const timerJob = await JobTimer.findOne({ _id: getDayJobTimer._id })
            await Jobs.findByIdAndUpdate(
              selectedJobId,
              {
                $set: {
                  status: "Active",
                },
                updatedAt: Date.now(),
              },
              { new: true }
            )
            return res.json({
              error: false,
              item: timerJob,
              recommendation: JOB_ACTION.SWITCH,
              itemCount: null,
              message: null,
            })
          } else {
            return res.json({
              error: true,
              item: null,
              recommendation: JOB_ACTION.STOP,
              itemCount: null,
              message: "Job not found please create a new job",
            })
          }
        }
      } else {
        const stockJob = await Jobs.findOne({
          locationId: req.body.locationId,
          factoryId: req.body.factoryId,
          partId: req.body.partId,
          status: { $in: ["Pending", "Active"] },
          isStock: true,
        })
        if (stockJob) {
          const newJobTimer = new JobTimer({
            timerId: req.body.timerId,
            jobId: stockJob._id,
          })
          const createJobTimer = await newJobTimer.save()
          return res.json({
            error: false,
            item: createJobTimer,
            itemCount: null,
            message: null,
          })
        } else {
          return res.json({
            error: true,
            item: getDayJobTimer,
            itemCount: null,
            message: "Job already assigned",
          })
        }
      }
    } catch (err: any) {
      const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
      Sentry.captureException(err)
      return res.json({
        error: true,
        message: message,
        items: null,
        itemCount: null,
      })
    }
  } else {
    return res.json({
      error: true,
      itemCount: null,
      message: REQUIRED_VALUES_MISSING,
    })
  }
}
