import dayjs from "dayjs"
import * as timezone from "dayjs/plugin/timezone"
import * as utc from "dayjs/plugin/utc"

dayjs.extend(utc.default)
dayjs.extend(timezone.default)

export const getStartOfDayTimezone = (timeZone = "") => {
  return dayjs.utc(dayjs.tz(dayjs(), timeZone).startOf("day")).toDate()
}

export const getEndOfDayTimezone = (timezone = "") => {
  return dayjs.utc(dayjs.tz(dayjs(), timezone).endOf("day")).toDate()
}

export const getYesterdayEndOfDayTimzeone = (timezone = "") => {
  return dayjs
    .utc(dayjs.tz(dayjs(), timezone).subtract(1, "day").endOf("day"))
    .toDate()
}

export const getHoursDifferent = (
  createdAt?: Date,
  timeZone = "",
  endAt?: Date | null
) => {
  const timerStart = dayjs.tz(dayjs(createdAt), timeZone ? timeZone : "")

  return (
    dayjs
      .tz(endAt ? dayjs(endAt) : dayjs(), timeZone ? timeZone : "")
      .diff(timerStart, "hour", true) ?? ""
  )
}

export const getSecondsDifferent = (
  createdAt?: Date,
  timeZone = "",
  endAt?: Date | null
) => {
  const timerStart = dayjs.tz(dayjs(createdAt), timeZone ? timeZone : "")

  return (
    dayjs
      .tz(endAt ? dayjs(endAt) : dayjs(), timeZone ? timeZone : "")
      .diff(timerStart, "second", true) ?? ""
  )
}
