import express from "express"
const router = express.Router()
import {
  addControllerTimer,
  getAllControllerTimers,
  getControllerTimer,
  updateControllerTimer,
} from "./default"
import isUserLoggedIn from "../../helpers/isUserloggedIn"
import { todayControllerTimer } from "./todayControllerTimer"
import { endControllerTimer } from "./endControllerTimer"

//custom
router.get("/today", isUserLoggedIn, todayControllerTimer)
router.patch("/end", isUserLoggedIn, endControllerTimer)

//default
router.get("/", isUserLoggedIn, getAllControllerTimers)
router.get("/:id", isUserLoggedIn, getControllerTimer)
router.post("/", isUserLoggedIn, addControllerTimer)
router.patch("/:id", isUserLoggedIn, updateControllerTimer)

export default router
