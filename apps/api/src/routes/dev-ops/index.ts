import express from "express"
import isUserLoggedIn from "../../helpers/isUserloggedIn"
import {
  addSession,
  alertList,
  currentSessionTimers,
  getUserSessions,
  requestTracker,
  restartSession,
  sessionList,
  timersByMachineClass,
  timersBySession,
} from "./default"
const router = express.Router()

router.get("/alert-list", isUserLoggedIn, alertList)
router.get("/session-list", isUserLoggedIn, sessionList)
router.post("/session-create", isUserLoggedIn, addSession)
router.get("/user-sessions", isUserLoggedIn, getUserSessions)
router.get("/request-tracker", isUserLoggedIn, requestTracker)
router.put("/restart-simulation", isUserLoggedIn, restartSession)
router.get("/session-timer-list", isUserLoggedIn, timersBySession)
router.get("/active-session-timers", isUserLoggedIn, currentSessionTimers)
router.get("/timers-by-machineClass", isUserLoggedIn, timersByMachineClass)

export default router
