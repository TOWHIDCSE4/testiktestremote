import express from "express"
const router = express.Router()
import {
  addTimer,
  deleteTimer,
  getAllTimers,
  getTimer,
  updateTimer,
} from "./default"
import isUserLoggedIn from "../../helpers/isUserloggedIn"
import { getAllTimersByFactory } from "./filterByFactories"
import { getAllTimersByLocation } from "./filterByLocations"
import { countByMachineClass } from "./countByMachineClass"
import { assignJob } from "./assignJob"
import { timerJobs } from "./timerJobs"

router.get("/count-machine-class", isUserLoggedIn, countByMachineClass)
router.get("/timer-jobs", isUserLoggedIn, timerJobs)
router.post("/assign-job", isUserLoggedIn, assignJob)

//default
router.get("/", isUserLoggedIn, getAllTimers)
router.get("/:id", isUserLoggedIn, getTimer)
router.post("/", addTimer)
router.patch("/:id", isUserLoggedIn, updateTimer)
router.delete("/:id", isUserLoggedIn, deleteTimer)

//filter
router.get("/find/filter/factory", getAllTimersByFactory)
router.get("/find/filter/location", getAllTimersByLocation)

export default router
