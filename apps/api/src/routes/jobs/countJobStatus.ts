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

export const getAllJobsPerStatus = async (req: Request, res: Response) => {
  try {
    const jobsCount = await Jobs.find({
      locationId: req.params.locationId,
    }).countDocuments()
    const getAllPendingCounts = await Jobs.find({
      $and: [{ status: "Pending" }, { locationId: req.params.locationId }],
    }).countDocuments()
    const getAllActiveCounts = await Jobs.find({
      $and: [{ status: "Active" }, { locationId: req.params.locationId }],
    }).countDocuments()
    const getAllTestingCounts = await Jobs.find({
      $and: [{ status: "Testing" }, { locationId: req.params.locationId }],
    }).countDocuments()
    const getAllArchivedCounts = await Jobs.find({
      $and: [{ status: "Archived" }, { locationId: req.params.locationId }],
    }).countDocuments()
    const getAllDeletedCounts = await Jobs.find({
      $and: [{ status: "Deleted" }, { locationId: req.params.locationId }],
    }).countDocuments()
    res.json({
      error: false,
      items: {
        pending: getAllPendingCounts,
        active: getAllActiveCounts,
        testing: getAllTestingCounts,
        archived: getAllArchivedCounts,
        deleted: getAllDeletedCounts,
      },
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
