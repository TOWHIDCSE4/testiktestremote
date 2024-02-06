import CycleTimerRepository from "../repository/cycleTimerRepository"
import { getEndOfDayTimezone, getStartOfDayTimezone } from "../utils/date"

const getLatestRunning = async (timerId: string, timeZone: string) => {
  const currentDateStart = getStartOfDayTimezone(timeZone)
  const currentDateEnd = getEndOfDayTimezone(timeZone)
  return CycleTimerRepository.findOne({
    timerId,
    createdAt: { $gte: currentDateStart, $lte: currentDateEnd },
    endAt: null,
  })
}

const getFirstCycleFrom = async (timerId: string, time: Date) => {
  return CycleTimerRepository.findOne(
    {
      timerId,
      clientStartedAt: { $gte: time },
    },
    {
      sort: {
        $natural: 1,
      },
    }
  )
}

const endAllByTimerId = async (timerId: string, endAt = new Date()) => {
  return CycleTimerRepository.updateMany(
    {
      timerId,
      endAt: null,
    },
    {
      endAt,
    }
  )
}

const CycleTimerService = {
  getLatestRunning,
  endAllByTimerId,
  getFirstCycleFrom,
}

export default CycleTimerService
