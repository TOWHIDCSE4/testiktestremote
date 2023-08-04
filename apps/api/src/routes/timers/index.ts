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

//default
router.get("/", isUserLoggedIn, getAllTimers)
router.get("/:id", isUserLoggedIn, getTimer)
router.post("/", isUserLoggedIn, addTimer)
router.patch("/:id", isUserLoggedIn, updateTimer)
router.delete("/:id", isUserLoggedIn, deleteTimer)

export default router
