import { T_ControllerTimer, T_Timer } from "custom-validator"
import ControllerTimerRepository from "../repository/controllerTimersRepository"
import Location from "../models/location"

import {
  getEndOfDayTimezone,
  getHoursDifferent,
  getStartOfDayTimezone,
} from "../utils/date"
import MachineClass from "../models/machineClasses"
import Timer from "../models/timers"
import TimerLogs from "../models/timerLogs"
import JobTimer from "../models/jobTimer"

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

const startAllTimersByLocationMC = async (
  locationId: string,
  machineClassId: string
) => {
  const location = await Location.findOne({ _id: locationId })
  const machineClass = await MachineClass.findOne({ _id: machineClassId })
  const variantMC = await MachineClass.findOne({
    name: "Variant",
  })
  if (!location || !machineClass) return false

  console.log(`Start timers ${location.name} / ${machineClass.name}`)
  const timers = await Timer.find({
    locationId,
    machineClassId:
      machineClass.name == "Radial Press"
        ? { $in: [machineClassId, variantMC?._id] }
        : machineClassId,
    deletedAt: null,
  })

  await Promise.all(
    timers.map(async (item: any) => {
      const timer = item as unknown as T_Timer
      const isRunning = await isRunningTodayByTimerId(
        String(timer._id),
        location.timeZone ?? ""
      )
      if (!isRunning) {
        await create({
          timerId: String(timer._id ?? ""),
          locationId: String(location._id ?? ""),
          endAt: null,
          createdAt: new Date(),
          clientStartedAt: new Date(),
        })
        const checkIfHasData = await TimerLogs.findOne()
        const lastTimerLog = await TimerLogs.find()
          .limit(1)
          .sort({ $natural: -1 })

        const globalCycle = !checkIfHasData
          ? 100000
          : (lastTimerLog[0].globalCycle ? lastTimerLog[0].globalCycle : 0) + 1

        const job = await JobTimer.findOne({ timerId: timer._id })

        const log = new TimerLogs({
          stopReason: "Auto-Start",
          createdAt: new Date(),
          timerId: timer._id,
          machineId: timer.machineId,
          machineClassId: timer.machineClassId,
          locationId: timer.locationId,
          factoryId: timer.factoryId,
          partId: timer.partId,
          time: 0,
          operator: null,
          operatorName: null,
          status: "Loss",
          cycle: 0,
          globalCycle,
          // TODO: should attach proper job
          jobId: job?._id,
        })
        await log.save()
        console.log("Auto Start timer for the day", timer._id)
      } else {
        console.log("Timer is already running", timer._id)
      }
    })
  )
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
  startAllTimersByLocationMC,
}

export default ControllerTimerService
