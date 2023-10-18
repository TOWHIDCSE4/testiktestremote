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
import { timer, timerCount, timerUnitsCreatedCount } from "./timer"
import { productInventory } from "./productInventory"
import { overallUnitTons } from "./overallUnitTons"
import {
  calculateGlobalMetrics,
  globalLogs,
  globalLogsMulti,
} from "./globalLogs"
import { groupByDate } from "./groupByDate"

//custom
router.get("/group-by-date", isUserLoggedIn, groupByDate)
router.get("/timer", isUserLoggedIn, timer)
router.get("/timer/unit-created/count", isUserLoggedIn, timerUnitsCreatedCount)
router.get("/timer/count", isUserLoggedIn, timerCount)
router.get("/global", isUserLoggedIn, globalLogs)
router.get("/global/multi/filter", isUserLoggedIn, globalLogsMulti)
router.get("/inventory/:partId", isUserLoggedIn, productInventory)
router.get("/overall-unit-tons", isUserLoggedIn, overallUnitTons)
router.get("/get-global-metrics", isUserLoggedIn, calculateGlobalMetrics)

//default
router.get("/", isUserLoggedIn, getAllTimeLogs)
router.get("/:id", isUserLoggedIn, getTimeLog)
router.post("/", isUserLoggedIn, addTimeLog)
router.patch("/:id", isUserLoggedIn, updateTimeLog)
router.delete("/:id", isUserLoggedIn, deleteTimeLog)
export default router
