import { T_ControllerTimer } from "custom-validator"
import ControllerTimerRepository from "../repository/controllerTimersRepository"
import {
  getEndOfDayTimezone,
  getHoursDifferent,
  getStartOfDayTimezone,
} from "../utils/date"

const create = async (data: T_ControllerTimer) => {
  return ControllerTimerRepository.create(data)
}

const endAllByTimerId = async (timerId: string, endAt = new Date()) => {
  return ControllerTimerRepository.updateMany(
    { timerId, endAt: null },
    {
      endAt,
    },
    {
      sort: { $natural: -1 },
    }
  )
}

const getAllRunningByTimerId = async (timerId: string) => {
  return ControllerTimerRepository.find(
    {
      timerId,
      endAt: null,
    },
    {
      sort: {
        $natural: -1,
      },
    }
  )
}
const getAllRunningTodayByTimerId = async (
  timerId: string,
  timeZone: string
) => {
  const currentDateStart = getStartOfDayTimezone(timeZone)
  const currentDateEnd = getEndOfDayTimezone(timeZone)
  return ControllerTimerRepository.find({
    timerId,
    createdAt: { $gte: currentDateStart, $lte: currentDateEnd },
  })
}

const getCurrentRunningTodayByTimerId = async (
  timerId: string,
  timeZone: string
) => {
  const currentDateStart = getStartOfDayTimezone(timeZone)
  const currentDateEnd = getEndOfDayTimezone(timeZone)
  return ControllerTimerRepository.findOne(
    {
      timerId,
      createdAt: { $gte: currentDateStart, $lte: currentDateEnd },
      endAt: null,
    },
    {
      sort: {
        $natural: -1,
      },
    }
  )
}

const getTodayByTimerId = async (timerId: string, timeZone: string) => {
  const currentDateStart = getStartOfDayTimezone(timeZone)
  const currentDateEnd = getEndOfDayTimezone(timeZone)
  return ControllerTimerRepository.findOne(
    {
      timerId,
      createdAt: { $gte: currentDateStart, $lte: currentDateEnd },
    },
    {
      sort: {
        $natural: -1,
      },
    }
  )
}

const isRunningTodayByTimerId = async (timerId: string, timeZone: string) => {
  const allRunning = await getAllRunningTodayByTimerId(timerId, timeZone)
  return allRunning.length > 0
}

const getAllRunningByLocationId = async (
  locationId: string,
  timeZone: string
) => {
  const currentDateStart = getStartOfDayTimezone(timeZone)
  const currentDateEnd = getEndOfDayTimezone(timeZone)
  return ControllerTimerRepository.find({
    locationId,
    createdAt: { $gte: currentDateStart, $lte: currentDateEnd },
    endAt: null,
  })
}

const getProductionHourByTimerId = async (
  timerId: string,
  timeZone: string
) => {
  const current = await getCurrentRunningTodayByTimerId(timerId, timeZone)
  if (!current) {
    return 0
  }
  return getHoursDifferent(current.createdAt)
}

const ControllerTimerService = {
  endAllByTimerId,
  getAllRunningByTimerId,
  getAllRunningByLocationId,
  getAllRunningTodayByTimerId,
  isRunningTodayByTimerId,
  create,
  getCurrentRunningTodayByTimerId,
  getProductionHourByTimerId,
  getTodayByTimerId,
}

export default ControllerTimerService
