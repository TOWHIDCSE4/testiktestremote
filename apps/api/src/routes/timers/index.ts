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
import { getAllTimersByLocationOrFactory } from "./filterByLocationsOrFactories"

//default
router.get("/", isUserLoggedIn, getAllTimers)
router.get("/:id", isUserLoggedIn, getTimer)
router.post("/", addTimer)
router.patch("/:id", isUserLoggedIn, updateTimer)
router.delete("/:id", isUserLoggedIn, deleteTimer)

//filter
router.post("/find/filter", getAllTimersByLocationOrFactory)
export default router
