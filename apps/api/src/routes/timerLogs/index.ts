import express from "express"
const router = express.Router()
import {
  addTimeLog,
  deleteTimeLog,
  getAllTimeLogs,
  getTimeLog,
  updateTimeLog,
} from "./default"

//default
router.get("/", getAllTimeLogs)
router.get("/:id", getTimeLog)
router.post("/", addTimeLog)
router.patch("/:id", updateTimeLog)
router.delete("/:id", deleteTimeLog)

export default router
