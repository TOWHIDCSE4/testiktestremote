import express from "express"
const router = express.Router()
import {
  addTimerReading,
  deleteTimerReading,
  getAllTimerReadings,
  getTimerReading,
  updateTimerReading,
} from "./default"
import isUserLoggedIn from "../../helpers/isUserloggedIn"

//default
router.get("/", isUserLoggedIn, getAllTimerReadings)
router.get("/:id", isUserLoggedIn, getTimerReading)
router.post("/", isUserLoggedIn, addTimerReading)
router.patch("/:id", isUserLoggedIn, updateTimerReading)
router.delete("/:id", isUserLoggedIn, deleteTimerReading)

export default router
