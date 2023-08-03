import express from "express"
const router = express.Router()
import {
  addTimer,
  deleteTimer,
  getAllTimers,
  getTimer,
  updateTimer,
} from "./default"

//default
router.get("/", getAllTimers)
router.get("/:id", getTimer)
router.post("/", addTimer)
router.patch("/:id", updateTimer)
router.delete("/:id", deleteTimer)

export default router
