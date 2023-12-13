import { Request, Response } from "express"
import Users from "../../models/users"
import { UNKNOWN_ERROR_OCCURRED } from "../../utils/constants"
import * as Sentry from "@sentry/node"

export const getOperatorList = async (req: Request, res: Response) => {
  try {
    const { machineClassId, locationId } = req.query
    const query = {
      status: "Approved",
      machineClassId,
      locationId,
      role: { $ne: "Administrator" },
    }
    const usersCounts = await Users.find(query).countDocuments()
    const operatorList = await Users.find(query).sort({ createdAt: -1 })
    res.json({
      error: false,
      items: operatorList,
      itemCount: usersCounts,
      message: null,
    })
  } catch (err: any) {
    const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
    Sentry.captureException(err)
    res.json({
      error: true,
      message: message,
      items: null,
      itemCount: null,
    })
  }
}
