import { UNKNOWN_ERROR_OCCURRED } from "../../utils/constants"
import { Request, Response } from "express"
import Machines from "../../models/machines"

export const getMachinesByClass = async (req: Request, res: Response) => {
  try {
    const getMachinesByClass = await Machines.find({
      machineClassId: req.params.id,
      deletedAt: null,
    })
    res.json({
      error: false,
      items: getMachinesByClass,
      itemCount: 1,
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
