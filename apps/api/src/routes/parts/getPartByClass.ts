import { UNKNOWN_ERROR_OCCURRED } from "../../utils/constants"
import { Request, Response } from "express"
import Parts from "../../models/parts"

export const getPartByClass = async (req: Request, res: Response) => {
  try {
    const partsCountByClass = await Parts.find({
      machineClassId: req.params.id,
      deletedAt: null,
    }).countDocuments()
    const getPartByClass = await Parts.find({
      machineClassId: req.params.id,
      deletedAt: null,
    })
    res.json({
      error: false,
      items: getPartByClass,
      count: partsCountByClass,
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
