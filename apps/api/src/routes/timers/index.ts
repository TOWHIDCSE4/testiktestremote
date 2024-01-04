import express from "express"
const router = express.Router()
import {
  addTimer,
  createDevOpsTimers,
  createDevOpsTimersUnit,
  deleteTimer,
  getAllTimers,
  getDevOpsTimers,
  getTimer,
  updateTimer,
} from "./default"
import isUserLoggedIn from "../../helpers/isUserloggedIn"
import { getAllTimersByFactory } from "./filterByFactories"
import { getAllTimersByLocation } from "./filterByLocations"
import { countByMachineClass } from "./countByMachineClass"
import { assignJob } from "./assignJob"
import { timerJobs } from "./timerJobs"
import { totalTonsUnit } from "./totalTonsUnit"

router.get("/count-machine-class", isUserLoggedIn, countByMachineClass)
router.get("/timer-jobs", isUserLoggedIn, timerJobs)
router.get("/total-tons-unit", isUserLoggedIn, totalTonsUnit)
router.post("/assign-job", isUserLoggedIn, assignJob)

//default
router.get("/dev-ops", isUserLoggedIn, getDevOpsTimers)
router.get("/", isUserLoggedIn, getAllTimers)
router.get("/:id", isUserLoggedIn, getTimer)
router.post("/", addTimer)
router.post("/dev-ops-timers", isUserLoggedIn, createDevOpsTimers)
router.post("/dev-ops-timers-unit", createDevOpsTimersUnit)
router.patch("/:id", isUserLoggedIn, updateTimer)
router.delete("/:id", isUserLoggedIn, deleteTimer)

//filter
router.get("/find/filter/factory", getAllTimersByFactory)
router.get("/find/filter/location", getAllTimersByLocation)

export default router
