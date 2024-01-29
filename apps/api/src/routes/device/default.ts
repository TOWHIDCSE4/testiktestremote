import { Request, Response } from "express"
import DeviceService from "../../services/DeviceService"

export const getDeviceTypes = async (req: Request, res: Response) => {
  try {
    const deviceTypes = await DeviceService.getDeviceTypes()
    return res.status(200).json({
      error: false,
      message: "success",
      items: deviceTypes,
    })
  } catch (error: any) {
    console.log(error)
    return res.status(500).json({
      error: true,
      message: error.message,
    })
  }
}

export const getDevices = async (req: Request, res: Response) => {
  try {
    const items = await DeviceService.getDevices()
    return res.status(200).json({
      error: false,
      message: "success",
      items: items,
    })
  } catch (error: any) {
    console.log(error)
    return res.status(500).json({
      error: true,
      message: error.message,
    })
  }
}

export const createDevice = async (req: Request, res: Response) => {
  try {
    const { user } = res.locals
    const item = await DeviceService.createDevice(req, user)
    return res.status(200).json({
      error: false,
      message: "success",
      item: item,
    })
  } catch (error: any) {
    console.log(error)
    return res.status(500).json({
      error: true,
      message: error.message,
    })
  }
}

export const updateDevice = async (req: Request, res: Response) => {
  try {
    const { user } = res.locals
    const { id } = req.params
    const item = await DeviceService.updateDevice(id, req, user)
    return res.status(200).json({
      error: false,
      message: "success",
      item: item,
    })
  } catch (error: any) {
    console.log(error)
    return res.status(500).json({
      error: true,
      message: error.message,
    })
  }
}

export const requestDeviceUse = async (req: Request, res: Response) => {
  try {
    const { user } = res.locals
    const { id } = req.params
    const { type, locationId } = req.body
    const props = {
      type,
      userId: user._id,
      locationId,
    }
    const item = await DeviceService.requestDeviceUse(id, props)
    return res.status(200).json({
      error: false,
      message:
        type == "out"
          ? item
            ? "Request check-out"
            : "Canceled check-out"
          : item
          ? "Request check-in"
          : "Canceled check-in",
      item: item,
    })
  } catch (error: any) {
    console.log(error)
    return res.status(500).json({
      error: true,
      message: error.message,
    })
  }
}

export const approveDeviceRequest = async (req: Request, res: Response) => {
  try {
    const { user } = res.locals
    const { id } = req.params
    const { cancel } = req.body
    const item = await DeviceService.approveDeviceRequest({
      id,
      userId: user._id,
      cancel,
    })
    return res.status(200).json({
      error: false,
      item,
      message: "Success",
    })
  } catch (error: any) {
    console.log(error)
    return res.status(500).json({
      error: true,
      message: error.message,
    })
  }
}

export const getDeviceCheckoutRequests = async (
  req: Request,
  res: Response
) => {
  try {
    const items = await DeviceService.getDeviceCheckoutRequests()
    return res.status(200).json({
      error: false,
      message: "success",
      items,
    })
  } catch (error: any) {
    console.log(error)
    return res.status(500).json({
      error: true,
      message: error.message,
    })
  }
}

export const getDeviceCheckinRequests = async (req: Request, res: Response) => {
  try {
    const items = await DeviceService.getDeviceCheckinRequests()
    return res.status(200).json({
      error: false,
      message: "success",
      items,
    })
  } catch (error: any) {
    console.log(error)
    return res.status(500).json({
      error: true,
      message: error.message,
    })
  }
}

export const getDeviceLogs = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const items = await DeviceService.getDeviceLogsById(id)
    return res.status(200).json({
      error: false,
      message: "success",
      items,
    })
  } catch (error: any) {
    console.log(error)
    return res.status(500).json({
      error: true,
      message: error.message,
    })
  }
}
