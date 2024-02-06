import {
  T_CreateDeviceHistory,
  T_DeviceHistory,
} from "custom-validator/ZDeviceHistory"
import deviceHistory from "../models/deviceHistory"
import { createBaseRepository } from "./baseRepository"

const DeviceHistoryRepository = {
  ...createBaseRepository<
    typeof deviceHistory,
    T_DeviceHistory,
    T_CreateDeviceHistory
  >(deviceHistory),
}

export default DeviceHistoryRepository
