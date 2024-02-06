import { Request, Response } from "express"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import TimerLogs from "../../models/timerLogs"
import timezone from "dayjs/plugin/timezone"
import Sentry from "@sentry/node"

dayjs.extend(utc)
dayjs.extend(timezone)

export const timerTonsUnits = async (req: Request, res: Response) => {
  try {
    const currentDateStart = dayjs
      .utc(dayjs.tz(dayjs()).startOf("day"))
      .toISOString()
    const currentDateEnd = dayjs
      .utc(dayjs.tz(dayjs()).endOf("day"))
      .toISOString()
    const timers = await TimerLogs.distinct("timerId", {
      stopReason: { $in: ["Unit Created"] },
      createdAt: { $gte: currentDateStart, $lte: currentDateEnd },
    }).populate("partId")

    const timerData = await Promise.all(
        timers.map(async (timer) => ({
          _id: timer._id,
          ...(await calculateTonsUnits(timer._id, currentDateStart, currentDateEnd)),
        }))
      );

    res.json({
      error: false,
      items: timerData,
      itemCount: timerData.length,
      message: null,
    })
  } catch (err: any) {
    const message = err.message ? err.message : "Unknown error occurred."
    Sentry.captureException(err)
    res.json({
      error: true,
      message: message,
      items: null,
      itemCount: null,
    })
  }
}

async function calculateTonsUnits(
  timerId: string,
  startDate: string,
  endDate: string
) {
  const getDayControllerLogs = await TimerLogs.find({
    timerId,
    stopReason: { $in: ["Unit Created"] },
    createdAt: { $gte: startDate, $lte: endDate },
  }).populate("partId")

  const logTotalUnitCount = getDayControllerLogs.length
  if (logTotalUnitCount > 0) {
    const partsTotalTons = getDayControllerLogs
      ? getDayControllerLogs.reduce((acc, val) => {
          // @ts-expect-error
          return acc + (val?.partId?.tons ? val?.partId?.tons : 0)
        }, 0)
      : 0

    return {
      tons: partsTotalTons,
      units: logTotalUnitCount,
    }
  }
}