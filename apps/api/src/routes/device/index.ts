import { Router } from "express"
import {
  approveDeviceRequest,
  createDevice,
  getDeviceCheckinRequests,
  getDeviceCheckoutRequests,
  getDeviceLogs,
  getDeviceTypes,
  getDevices,
  removeDevice,
  requestDeviceUse,
  updateDevice,
} from "./default"
import isUserLoggedIn from "../../helpers/isUserloggedIn"

const router = Router()

router.get("/types", getDeviceTypes)
router.get("/", getDevices)
router.get("/:id/logs", getDeviceLogs)
router.get("/logs", getDeviceLogs)
router.get("/request/in", getDeviceCheckinRequests)
router.get("/request/out", getDeviceCheckoutRequests)
router.post("/request/:id/approve", isUserLoggedIn, approveDeviceRequest)
router.post("/", isUserLoggedIn, createDevice)
router.put("/:id", isUserLoggedIn, updateDevice)
router.delete("/:id", isUserLoggedIn, removeDevice)
router.post("/:id/request", isUserLoggedIn, requestDeviceUse)

export default router
