import { Request, Response } from "express"
import * as Sentry from "@sentry/node"
import TimerLogsService from "../../services/timerLogsService"
export const getReportByLocation = async (req: Request, res: Response) => {
  try {
    const report = await TimerLogsService.getReportByLocation()

    res.status(200).json({
      error: false,
      message: "Success",
      ...report,
    })
  } catch (err: any) {
    Sentry.captureException(err)
    res.status(500).json({
      error: true,
      message: err.message,
    })
  }
}

export const getReportByMachineAndLocation = async (
  req: Request,
  res: Response
) => {
  try {
    const report = await TimerLogsService.getReportByMachineAndLocation({
      locationId: req.query.locationId as string,
    })

    res.status(200).json({
      error: false,
      message: "Success",
      ...report,
    })
  } catch (err: any) {
    Sentry.captureException(err)
    res.status(500).json({
      error: true,
      message: err.message,
    })
  }
}
