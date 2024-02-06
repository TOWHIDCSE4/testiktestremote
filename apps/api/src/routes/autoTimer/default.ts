import { Request, Response } from "express"
import AutoTimer from "../../models/autoTimer"
import Location from "../../models/location"
import { T_AutoTimer, T_CreateAutoTimer } from "custom-validator"
import {
  getCronJobList,
  setCronJob,
  startCronJob,
  stopCronJob,
} from "../../utils/cronJobManager"
import { runIndivCronJob } from "../../services/autoTimerService"

export const getAllItems = async (req: Request, res: Response) => {
  try {
    const items = await AutoTimer.find({})
    return res.json({ error: false, items: items })
  } catch (error) {
    console.log(error)
    return res.json({ error: true, message: (error as Error).message })
  }
}

export const setItem = async (req: Request, res: Response) => {
  try {
    const { locationId, machineClassId, timeM, timeH, isPM, isActive } =
      req.body as T_CreateAutoTimer

    if (!locationId || !machineClassId) {
      return res.status(400).json({
        error: true,
        message: "Invalid input",
      })
    }
    const location = await Location.findOne({ _id: locationId })
    if (!location) {
      return res.status(400).json({
        error: true,
        message: "Invalid location",
      })
    }
    const prevItem = await AutoTimer.findOne({ locationId, machineClassId })
    if (prevItem) {
      prevItem.timeM = timeM
      prevItem.timeH = timeH
      prevItem.isPM = isPM
      prevItem.isActive = isActive
      await prevItem.save()
      await runIndivCronJob(prevItem as unknown as T_AutoTimer)
      console.log(getCronJobList())
      return res.json({ error: false, item: prevItem })
    } else {
      const item = new AutoTimer({
        locationId,
        machineClassId,
        timeM,
        timeH,
        isPM,
        isActive: true,
      })
      await item.save()
      await runIndivCronJob(item as unknown as T_AutoTimer)
      console.log(getCronJobList())
      return res.json({ error: false, item })
    }
  } catch (error) {
    console.log(error)
    return res.json({ error: true, message: (error as Error).message })
  }
}
