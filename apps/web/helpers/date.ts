import dayjs from "dayjs"
import * as timezone from "dayjs/plugin/timezone"
import * as utc from "dayjs/plugin/utc"
import moment from "moment"

export const formatDate = (
  dateFromDb: Date | null | undefined,
  formatStr = "MM/DD/YYYY"
) => {
  dayjs.extend(utc.default)
  dayjs.extend(timezone.default)
  return dayjs.tz(dayjs(dateFromDb), "America/Chicago").format(formatStr)
}

export function formatTime(seconds: string) {
  const duration = moment.duration(seconds, "seconds")
  const minutes = duration.minutes()
  const remainingSeconds = duration.seconds()

  let result = ""

  if (minutes > 0) {
    result += `${minutes} min`
  }

  if (remainingSeconds > 0) {
    if (result !== "") {
      result += ", "
    }
    result += `${remainingSeconds} sec`
  }
  return result
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
      .diff(timerStart, "seconds", true) ?? ""
  )
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
