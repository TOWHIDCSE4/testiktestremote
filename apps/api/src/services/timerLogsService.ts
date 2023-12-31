import { T_TimerLog } from "custom-validator"
import TimerLogsRepository from "../repository/timerLogRepository"
import {
  getEndOfDayTimezone,
  getStartOfDayTimezone,
  getYesterdayEndOfDayTimzeone,
} from "../utils/date"

const getReportByLocation = async () => {
  const currentDayStart = getStartOfDayTimezone("America/Chicago")
  const endDayStart: Date = getEndOfDayTimezone("America/Chicago")
  const units = await TimerLogsRepository.getUnitCreatedReportByLocations(
    currentDayStart,
    endDayStart
  )
  const tons = await TimerLogsRepository.getTonsReportByLocations(
    currentDayStart,
    endDayStart
  )

  return {
    units,
    tons,
  }
}

const getReportByMachineAndLocation = async () => {
  const currentDayStart = getStartOfDayTimezone("America/Chicago")
  const endDayStart: Date = getEndOfDayTimezone("America/Chicago")
  const units =
    await TimerLogsRepository.getUnitCreatedReportByMachineAndLocation(
      currentDayStart,
      endDayStart
    )

  const tons = await TimerLogsRepository.getTonsReportByMachineAndLocation(
    currentDayStart,
    endDayStart
  )

  return {
    units,
    tons,
  }
}

const TimerLogsService = {
  getReportByLocation,
  getReportByMachineAndLocation,
}

export default TimerLogsService
