import { T_Device, T_CreateDevice } from "custom-validator/ZDevice"
import device from "../models/device"
import { createBaseRepository } from "./baseRepository"

const DeviceRepository = {
  ...createBaseRepository<typeof device, T_Device, T_CreateDevice>(device),
}

export default DeviceRepository
