import { Request, Response } from "express"
import Bookmark from "../../models/bookmarks"
import * as Sentry from "@sentry/node"
import {
  UNKNOWN_ERROR_OCCURRED,
  UPDATE_SUCCESS_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
} from "../../utils/constants"
import { getModel } from "../../utils/models"

export const getAllBookmarks = async (req: Request, res: Response) => {
  try {
    const getAllBookmarks = await Bookmark.find({})
    const bookmark = getAllBookmarks[0]
    const Model = await getModel(bookmark.modelName as string)

    const timersArray = []
    for (const item of getAllBookmarks) {
      const timers = await Model.aggregate([
        { $match: { _id: item.modelId } },
        {
          $lookup: {
            from: "timers",
            localField: "_id",
            foreignField: "machineClassId",
            as: "timers",
          },
        },
        { $unwind: "$timers" }, // unwind the timers array
        {
          $lookup: {
            from: "machines",
            localField: "timers.machineId",
            foreignField: "_id",
            as: "machines",
          },
        },
        {
          $project: {
            name: 1,
            "timers._id": 1,
            "timers.operatorName": 1,
            "machines.name": 1,
          },
        },
      ])

      if (timers.length === 0) {
        const machineClass = await Model.findById(item.modelId).select(
          "_id name"
        )

        timersArray.push([
          {
            _id: machineClass?._id,
            name: machineClass?.name,
            timers: [],
            machines: [],
          },
        ])
      } else {
        timersArray.push(timers)
      }
    }

    res.json({
      error: false,
      items: timersArray,
      itemCount: timersArray.length,
      message: null,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    Sentry.captureException(err)
    res.json({
      error: true,
      message: message,
      item: null,
      itemCount: null,
    })
  }
}

export const getBookmark = async (req: Request, res: Response) => {
  try {
    const getBookmark = await Bookmark.findOne({
      _id: req.params.id,
      deletedAt: null,
    })
    res.json({
      error: false,
      item: getBookmark,
      itemCount: 1,
      message: null,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    Sentry.captureException(err)
    res.json({
      error: true,
      message: message,
      item: null,
      itemCount: null,
    })
  }
}

export const addBookmark = async (req: Request, res: Response) => {
  try {
    const bookmark = new Bookmark(req.body)
    await bookmark.save()

    res.json({
      error: false,
      message: "Added to console successfully!",
      item: bookmark,
      itemCount: 1,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    Sentry.captureException(err)
    res.json({
      error: true,
      message: message,
      item: null,
      itemCount: null,
    })
  }
}

export const deleteBookmark = async (req: Request, res: Response) => {
  try {
    const deleted = await Bookmark.findOneAndDelete({ modelId: req.params.id })

    res.json({
      error: false,
      message: DELETE_SUCCESS_MESSAGE,
      item: [],
      itemCount: 0,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    Sentry.captureException(err)
    res.json({
      error: true,
      message: message,
      item: null,
      itemCount: null,
    })
  }
}
