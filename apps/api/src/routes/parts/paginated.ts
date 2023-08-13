import { Request, Response } from "express"
import Parts from "../../models/parts"
import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"

export const paginated = async (req: Request, res: Response) => {
  const { page, locationId } = req.query
  if (page && locationId) {
    try {
      const getAllParts = await Parts.find({
        locationId: locationId,
      })
        .sort({
          createdAt: -1,
        })
        .skip(6 * (Number(page) - 1))
      res.json({
        error: false,
        items: getAllParts,
        itemCount: getAllParts.length,
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
