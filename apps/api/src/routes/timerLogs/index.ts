import express from "express"
const router = express.Router()
import {
  addTimeLog,
  deleteTimeLog,
  getAllTimeLogs,
  getTimeLog,
  updateTimeLog,
} from "./default"
import isUserLoggedIn from "../../helpers/isUserloggedIn"

//default
router.get("/", isUserLoggedIn, getAllTimeLogs)
router.get("/:id", isUserLoggedIn, getTimeLog)
router.post("/", isUserLoggedIn, addTimeLog)
router.patch("/:id", isUserLoggedIn, updateTimeLog)
router.delete("/:id", isUserLoggedIn, deleteTimeLog)

export default router
