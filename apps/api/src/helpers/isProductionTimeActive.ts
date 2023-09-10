import Locations from "../models/location"
import Timers from "../models/timers"
import dayjs from "dayjs"
import * as timezone from "dayjs/plugin/timezone"
import * as utc from "dayjs/plugin/utc"
import ControllerTimers from "../models/controllerTimers"

const isProductionTimeActive = async ({
  locationId,
}: {
  locationId: string
}) => {
  dayjs.extend(utc.default)
  dayjs.extend(timezone.default)
  const location = await Locations.findOne({
    _id: locationId,
  })
  const timeZone = location?.timeZone
  const productionTime = location?.productionTime ? location?.productionTime : 0
  const currentDateStart = dayjs
    .utc(dayjs.tz(dayjs(), timeZone ? timeZone : "").startOf("day"))
    .toISOString()
  const currentDateEnd = dayjs
    .utc(dayjs.tz(dayjs(), timeZone ? timeZone : "").endOf("day"))
    .toISOString()
  const firstControllerTimerToday = await ControllerTimers.findOne({
    createdAt: { $gte: currentDateStart, $lte: currentDateEnd },
  })
  const currentDate = dayjs.tz(dayjs(), timeZone ? timeZone : "")
  const firstTimerTodayDate = firstControllerTimerToday?.createdAt
    ? dayjs.tz(firstControllerTimerToday?.createdAt, timeZone ? timeZone : "")
    : currentDate
  const hoursLapse = currentDate.diff(firstTimerTodayDate, "hour", true)
  const isAllowed = hoursLapse < productionTime
  return isAllowed
}

export default isProductionTimeActive
