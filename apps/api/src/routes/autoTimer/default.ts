import { Request, Response } from "express"
import AutoTimer from "../../models/autoTimer"
import { T_CreateAutoTimer } from "custom-validator"

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

    const prevItem = await AutoTimer.findOne({ locationId, machineClassId })
    if (prevItem) {
      prevItem.timeM = timeM
      prevItem.timeH = timeH
      prevItem.isPM = isPM
      prevItem.isActive = isActive
      await prevItem.save()
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
      return res.json({ error: false, item })
    }
  } catch (error) {
    console.log(error)
    return res.json({ error: true, message: (error as Error).message })
  }
}
