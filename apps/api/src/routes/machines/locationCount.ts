import { Request, Response } from "express"
import Machines from "../../models/machines"
import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"

export const locationCount = async (req: Request, res: Response) => {
  if (req.params.id) {
    try {
      const partLocationCount = await Machines.find({
        locationId: req.params.id,
        $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }],
      }).countDocuments()
      res.json({
        error: false,
        item: partLocationCount,
        itemCount: null,
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
  } else {
    res.json({
      error: true,
      message: REQUIRED_VALUES_MISSING,
      items: null,
      itemCount: null,
    })
  }
}
