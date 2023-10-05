import { REQUIRED_VALUES_MISSING } from "../../utils/constants"
import { Request, Response } from "express"
import Machines from "../../models/machines"
import MachineClasses from "../../models/machineClasses"

export const machineClasses = async (req: Request, res: Response) => {
  if (req.params.factoryId && req.params.factoryId !== "all") {
    try {
      const getAllMachines = await Machines.distinct("machineClassId", {
        factoryId: req.params.factoryId,
      })
      const getAllMachinesClasses = await MachineClasses.find({
        _id: { $in: getAllMachines },
      })
      res.json({
        error: false,
        message: null,
        items: getAllMachinesClasses,
        itemCount: getAllMachinesClasses.length,
      })
    } catch (error) {
      res.json({
        error: true,
        message: String(error),
      })
    }
  } else if (!req?.params?.factoryId) {
    res.json({
      error: true,
      message: REQUIRED_VALUES_MISSING,
    })
  } else {
    res.json({
      error: false,
      message: null,
      items: [],
      itemCount: 0,
    })
  }
}
export const machineClassesV2 = async (req: Request, res: Response) => {
  try {
    const getAllMachinesClasses = await MachineClasses.find({})
    res.json({
      error: false,
      message: null,
      items: getAllMachinesClasses,
      itemCount: getAllMachinesClasses.length,
    })
  } catch (error) {
    res.json({
      error: true,
      message: String(error),
    })
  }
}
