import factories from "../../models/factories"
import machines from "../../models/machines"
import Timers from "../../models/timers"
import { UNKNOWN_ERROR_OCCURRED } from "../../utils/constants"
import { Request, Response } from "express"
export const getAllTimersByLocationOrFactory = async (
  req: Request,
  res: Response
) => {
  try {
    let locationOrFactory = req.body.locationOrFactory
    const timersCount = await Timers.find({
      $or: [
        { locationId: locationOrFactory },
        { factoryId: locationOrFactory },
      ],
    }).countDocuments()
    const getTimerByLocationOrFactory = await Timers.find({
      $or: [
        { locationId: locationOrFactory },
        { factoryId: locationOrFactory },
      ],
    })
    res.json({
      error: false,
      items: getTimerByLocationOrFactory,
      itemCount: timersCount,
      message: null,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    res.json({
      error: true,
      message: message,
      items: null,
      itemCount: null,
    })
  }
}
