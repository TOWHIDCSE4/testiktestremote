import express from "express"
import isUserLoggedIn from "../../helpers/isUserloggedIn"
import { addSession, sessionList, timersBySession } from "./default"
const router = express.Router()

router.get("/session-list", isUserLoggedIn, sessionList)
router.post("/session-create", isUserLoggedIn, addSession)
router.get("/session-timer-list", isUserLoggedIn, timersBySession)

export default router
