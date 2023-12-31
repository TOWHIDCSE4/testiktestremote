import { Router } from "express"
import { getReportByLocation, getReportByMachineAndLocation } from "./default"

const router = Router()

router.get("/per-location", getReportByLocation)
router.get("/per-location-machine", getReportByMachineAndLocation)

export default router
