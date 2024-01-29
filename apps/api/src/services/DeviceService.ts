import { T_DeviceType, T_Device, T_User, T_DeviceLog } from "custom-validator"
import { ObjectId } from "mongoose"
import { Request } from "express"
import Device from "../models/device"
import DeviceType from "../models/deviceType"
import DeviceHistory from "../models/deviceHistory"
import DeviceLog from "../models/deviceLog"
import User from "../models/users"

const initDeviceTypes = async () => {
  const deviceTypes: T_DeviceType[] = await DeviceType.find({})
  if (!deviceTypes || deviceTypes.length == 0) {
    // adding default device types
    console.log(`Adding default device types`)
    await DeviceType.insertMany([
      {
        name: "Virtual Reality Headset",
        order: 0,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTP_tgYbIWnrvIR09OWvGT-08ndDrQJCO7EJvOqgou5fg&s",
      },
      {
        name: "Laptop",
        order: 1,
        image:
          "https://unsplash.com/photos/macbook-pro-on-white-top-zW7gkUqFA8I",
      },
      {
        name: "Mobile",
        order: 2,
        image:
          "https://unsplash.com/photos/black-android-smartphone-OYMKjv5zmGU",
      },
      {
        name: "Tablet",
        order: 3,
        image:
          "https://unsplash.com/photos/black-and-silver-laptop-computer-q8Dw_aF2_9M",
      },
    ])
  } else {
    return false
  }
}

const getDeviceTypes = async () => {
  const data: T_DeviceType[] = await DeviceType.find({})
    .sort({ order: 1 })
    .lean()
  return data
}

const getDevices = async () => {
  const data: T_Device[] = await Device.find({})
    .populate(["userId", "lastUserId", "typeId"])
    .populate({
      path: "history",
      populate: ["userId", "approvedBy", "locationId"],
    })
  return data
}

const getDeviceLogsById = async (id?: string | ObjectId) => {
  if (id) {
    const data: T_DeviceLog[] = await DeviceLog.find({
      deviceId: id,
    })
      .sort({ createdAt: -1 })
      .lean()
    return data
  } else {
    const data: T_DeviceLog[] = await DeviceLog.find({})
      .sort({ createdAt: -1 })
      .lean()
    return data
  }
}

const createDevice = async (req: Request, user: T_User) => {
  const { name, sn, typeId, note } = req.body
  const item = await Device.create({
    name,
    sn,
    typeId,
    status: "idle",
    note,
    addedAt: new Date(),
    userId: user._id,
    lastUpdatedAt: new Date(),
  })
  await DeviceLog.create({
    type: "info",
    deviceId: item._id,
    userId: user._id,
    note: `${item.name} is created by ${user.firstName} ${user.lastName}`,
  })
  return item
}

const updateDevice = async (id: string, req: Request, user: T_User) => {
  const { name, sn, typeId, note, status, lastUpdatedAt } = req.body
  const item = await Device.findOne({ _id: id })
  if (!item) throw new Error("No Device Found")
  let logNote = `${item.name} is updated by ${user.firstName} ${user.lastName}`

  if (name !== undefined) item.name = name
  if (sn !== undefined) item.sn = sn
  if (typeId !== undefined) item.typeId = typeId
  if (note !== undefined) item.note = note
  if (status !== undefined) {
    if (status == "disabled") {
      logNote = `${item.name} is disabled by ${user.firstName} ${user.lastName}`

      const history = await DeviceHistory.findOne({ _id: item.history })
      if (history)
        await history.updateOne({
          status: "ended",
          active: false,
          endAt: new Date(),
          note: `Disabled device`,
        })

      await DeviceHistory.deleteMany({
        deviceId: item._id,
        status: "pending",
      })

      // item.history = undefined
    } else if (status == "idle") {
      logNote = `${item.name} is enabled by ${user.firstName} ${user.lastName}`
    }
    item.status = status
  }
  if (lastUpdatedAt !== undefined) item.lastUpdatedAt = lastUpdatedAt
  await item.save()
  await DeviceLog.create({
    type: "info",
    deviceId: item._id,
    userId: user._id,
    note: logNote,
  })
  return item
}

const requestDeviceUse = async (
  id: string,
  props: {
    type: "in" | "out"
    userId: string | ObjectId
    locationId?: string | ObjectId
  }
) => {
  const device = await Device.findOne({ _id: id })
  if (!device) throw new Error("No Device Found")
  const user = await User.findOne({ _id: props.userId })
  if (!user) return false
  if (props.type == "out") {
    // checkout request
    if (device.status !== "idle") {
      throw new Error(`Can not checkout device: ${device.status}`)
    }
    const prevHistory = await DeviceHistory.findOne({
      deviceId: device._id,
      userId: props.userId,
      status: { $in: ["pending"] },
    })
    if (prevHistory) {
      await prevHistory.deleteOne()
      await DeviceLog.create({
        type: "info",
        deviceId: device._id,
        userId: user._id,
        note: `${device.name} check-out request is cancelled by ${user.firstName} ${user.lastName}`,
      })
      return null
      // throw new Error("Already Requested its usage")
    } else {
      const history = await DeviceHistory.create({
        deviceId: device._id,
        type: props.type,
        active: false,
        userId: props.userId,
        approvedBy: null,
        locationId: props.locationId,
        status: "pending",
        startAt: null,
        endAt: null,
      })
      await DeviceLog.create({
        type: "info",
        deviceId: device._id,
        userId: user._id,
        note: `${device.name} check-out request is created by ${user.firstName} ${user.lastName}`,
      })
      return history
    }
  } else {
    // checkin request
    if (device.status !== "using") {
      throw new Error(`Can not checkin device: ${device.status}`)
    }
    const history = await DeviceHistory.findOne({
      deviceId: device._id,
      userId: props.userId,
      status: { $in: ["pending", "approved"] },
      active: true,
    })
    if (history) {
      if (history.status == "pending") {
        // if already requested to check in
        await history.updateOne({
          status: "approved",
          active: true,
        })
        await DeviceLog.create({
          type: "info",
          deviceId: device._id,
          userId: user._id,
          note: `${device.name} check-in request is cancelled by ${user.firstName} ${user.lastName}`,
        })
        return null
        // throw new Error("Already Requested its usage")
      } else {
        // if newly requested
        await DeviceLog.create({
          type: "info",
          deviceId: device._id,
          userId: user._id,
          note: `${device.name} check-in request is created by ${user.firstName} ${user.lastName}`,
        })
        await history.updateOne({
          status: "pending",
          active: true,
        })
        return history
      }
    } else {
      throw new Error(`You are not using this device`)
    }
  }
}

const getDeviceCheckoutRequests = async () => {
  const items = await DeviceHistory.find({
    status: "pending",
    active: false,
  })
    .populate(["userId", "approvedBy", "locationId"])
    .populate({ path: "deviceId", populate: { path: "typeId" } })
  return items
}

const getDeviceCheckinRequests = async () => {
  const items = await DeviceHistory.find({
    status: "pending",
    active: true,
  })
    .populate(["userId", "approvedBy", "locationId"])
    .populate({ path: "deviceId", populate: { path: "typeId" } })
  return items
}

const approveDeviceRequest = async ({
  id,
  userId,
  cancel,
}: {
  id: string | ObjectId
  userId: string | ObjectId
  cancel?: boolean
}) => {
  const history = await DeviceHistory.findOne({
    _id: id,
  })
  const user = await User.findOne({ _id: userId })
  if (!user) return false
  if (!history || history.status !== "pending") {
    throw new Error("Request not found")
  } else {
    const device = await Device.findOne({ _id: history.deviceId })
    if (!device) {
      throw new Error("Device not found")
    }
    if (!cancel) {
      // approve request
      if (device.status == "idle") {
        // checkout
        await history.updateOne({
          approvedBy: userId,
          startAt: new Date(),
          active: true,
          status: "approved",
        })
        // Remove other request
        // FIXME: should consider if it's true
        await DeviceHistory.deleteMany({
          status: "pending",
          deviceId: history.deviceId,
        })
        await device.updateOne({
          history: history._id,
          status: "using",
        })
        await DeviceLog.create({
          type: "info",
          deviceId: device._id,
          userId: user._id,
          note: `${device.name} check-out request is approved by ${user.firstName} ${user.lastName}`,
        })
      } else if (device.status == "using") {
        // checkin
        await history.updateOne({
          status: "ended",
          active: false,
          endAt: new Date(),
        })
        await device.updateOne({
          // FIXME: should consider if it's true
          // history: null,
          status: "idle",
          lastUserId: history.userId,
        })
        await DeviceLog.create({
          type: "info",
          deviceId: device._id,
          userId: user._id,
          note: `${device.name} check-in request is rejected by ${user.firstName} ${user.lastName}`,
        })
      }
      return history
    } else {
      // cancel request
      if (history.status !== "pending") throw new Error("No Request")
      await history.deleteOne()
      await DeviceLog.create({
        type: "info",
        deviceId: device._id,
        userId: user._id,
        note: `${device.name} check-out request is cancelled by ${user.firstName} ${user.lastName}`,
      })
      return null
    }
  }
}

const removeDevice = async (id: string) => {
  await Device.deleteOne({ _id: id })
  await DeviceHistory.deleteMany({ deviceId: id })
  await DeviceLog.deleteMany({ deviceId: id })
  return true
}

const DeviceService = {
  getDeviceLogsById,
  createDevice,
  updateDevice,
  removeDevice,
  getDeviceTypes,
  getDevices,
  requestDeviceUse,
  getDeviceCheckoutRequests,
  getDeviceCheckinRequests,
  approveDeviceRequest,
  initDeviceTypes,
}

export default DeviceService
