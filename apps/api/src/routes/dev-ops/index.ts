import express from "express"
import isUserLoggedIn from "../../helpers/isUserloggedIn"
import { addSession, sessionList } from "./default"
const router = express.Router()

router.get("/session-list", isUserLoggedIn, sessionList)
router.post("/session-create", isUserLoggedIn, addSession)

export default router
