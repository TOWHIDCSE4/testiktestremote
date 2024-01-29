import deviceType from "../models/deviceType"
import { T_DeviceType, T_CreateDeviceType } from "custom-validator"
import { createBaseRepository } from "./baseRepository"

const DeviceTypeRepository = {
  ...createBaseRepository<typeof deviceType, T_DeviceType, T_CreateDeviceType>(
    deviceType
  ),
}

export default DeviceTypeRepository
