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
import { timer } from "./timer"
import { productInventory } from "./productInventory"
import { overallUnitTons } from "./overallUnitTons"
import { globalLogs, globalLogsMulti } from "./globalLogs"
import { groupByDate } from "./groupByDate"

//custom
router.get("/group-by-date", isUserLoggedIn, groupByDate)
router.get("/timer", isUserLoggedIn, timer)
router.get("/global", isUserLoggedIn, globalLogs)
router.get("/global/multi/filter", isUserLoggedIn, globalLogsMulti)
router.get("/inventory/:partId", isUserLoggedIn, productInventory)
router.get("/overall-unit-tons", isUserLoggedIn, overallUnitTons)

//default
router.get("/", isUserLoggedIn, getAllTimeLogs)
router.get("/:id", isUserLoggedIn, getTimeLog)
router.post("/", isUserLoggedIn, addTimeLog)
router.patch("/:id", isUserLoggedIn, updateTimeLog)
router.delete("/:id", isUserLoggedIn, deleteTimeLog)

export default router
