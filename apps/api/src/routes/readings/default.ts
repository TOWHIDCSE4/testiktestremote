import { Request, Response } from "express"
import ReadingsService from "../../services/readingService"
import * as Sentry from "@sentry/node"
import { ZCreateReading } from "custom-validator"

export const getReadings = async (req: Request, res: Response) => {
  const { timerId } = req.query
  const filter: any = {}
  if (timerId) {
    filter.timerId = timerId
  }
  try {
    const readings = await ReadingsService.get(filter)
    return res.status(200).json({
      items: readings,
      itemsCount: readings.length,
      message: "Success get readings",
      error: false,
    })
  } catch (err: any) {
    console.error(err)
    Sentry.captureException(err)
    res.status(500).json({
      error: true,
      message: err.message,
      detail: err,
    })
  }
}

export const createReadings = async (req: Request, res: Response) => {
  const parsedBody = ZCreateReading.safeParse(req.body)
  if (!parsedBody.success) {
    return res.status(400).json({
      error: true,
      message: "Invalid Request",
      detail: parsedBody.error,
    })
  }
  try {
    const newReading = await ReadingsService.create(parsedBody.data)

    return res.status(200).json({
      error: false,
      message: "Success creating reading",
      item: newReading,
    })
  } catch (err: any) {
    console.error(err)
    Sentry.captureException(err)

    return res.status(500).json({
      error: true,
      message: err.message,
      detail: err,
    })
  }
}

export const deleteReadings = async (req: Request, res: Response) => {
  const { timerId } = req.query
  const filter: any = {}
  if (timerId) {
    filter.timerId = timerId
  }
  try {
    await ReadingsService.clearReadings(filter)
  } catch (err: any) {
    console.error(err)
    Sentry.captureException(err)

    return res.status(500).json({
      error: true,
      message: err.message,
      detail: err,
    })
  }
}
