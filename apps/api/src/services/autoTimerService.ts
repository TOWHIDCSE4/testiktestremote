import { T_AutoTimer } from "custom-validator"
import AutoTimer from "../models/autoTimer"
import Location from "../models/location"
import MachineClass from "../models/machineClasses"
import ControllerTimerService from "./controllerTimerService"
import ProductionCycleService from "./productionCycleServices"
import {
  generateCronTabExp,
  setCronJob,
  startCronJob,
  stopCronJob,
} from "../utils/cronJobManager"

export const runIndivCronJob = async (item: T_AutoTimer) => {
  const isActive = item.isActive
  const locationId = item.locationId
  const machineClassId = item.machineClassId
  const location = await Location.findOne({ _id: locationId })
  const machineClass = await MachineClass.findOne({ _id: machineClassId })
  if (!location || !machineClass) return false
  const exp = generateCronTabExp({
    h: item.timeH,
    m: item.timeM,
    pm: item.isPM,
  })
  setCronJob(
    String(item._id),
    {
      h: item.timeH,
      m: item.timeM,
      pm: item.isPM,
    },
    async () => {
      // console.log(`Fire Cron Job! ${location?.name} / ${machineClass?.name}`)
      await ProductionCycleService.startProductionCycleByLocation(
        String(location._id)
      )
      await ControllerTimerService.startAllTimersByLocationMC(
        String(location._id),
        String(machineClass._id)
      )
    },
    location?.timeZone
  )
  if (isActive) {
    console.log(
      `Start cron job ${location?.name} / ${machineClass?.name} ${location?.timeZone} ${exp}`
    )
    startCronJob(String(item._id))
  } else {
    console.log(
      `Stop cron job ${location?.name} / ${machineClass?.name} ${location?.timeZone} ${exp}`
    )
    stopCronJob(String(item._id))
  }
}

export const initAllCronJobs = async () => {
  const items = await AutoTimer.find({})
  if (items) {
    await Promise.all(
      items.map(async (item) => {
        return await runIndivCronJob(item as unknown as T_AutoTimer)
      })
    )
    return true
  } else {
    return false
  }
}
