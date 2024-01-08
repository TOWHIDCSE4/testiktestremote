import express from "express"
import isUserLoggedIn from "../../helpers/isUserloggedIn"
import {
  addSession,
  currentSessionTimers,
  getUserSessions,
  sessionList,
  timersByMachineClass,
  timersBySession,
} from "./default"
const router = express.Router()

router.get("/session-list", isUserLoggedIn, sessionList)
router.post("/session-create", isUserLoggedIn, addSession)
router.get("/user-sessions", isUserLoggedIn, getUserSessions)
router.get("/session-timer-list", isUserLoggedIn, timersBySession)
router.get("/active-session-timers", isUserLoggedIn, currentSessionTimers)
router.get("/timers-by-machineClass", isUserLoggedIn, timersByMachineClass)

export default router
