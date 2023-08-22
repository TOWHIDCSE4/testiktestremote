import express from "express"
const router = express.Router()
import {
  addCycleTimer,
  getAllCycleTimers,
  getCycleTimer,
  updateCycleTimer,
} from "./default"
import isUserLoggedIn from "../../helpers/isUserloggedIn"
import isRoleAllowed from "../../helpers/isRoleAllowed"
import { ALLOWED_ALL_ROLES } from "../../utils/constants"
import { todayCycleTimer } from "./todayCycleTimer"
import { endAndAdd } from "./endAndAdd"
import { endByTimerId } from "./endByTimerId"

//custom
router.get("/today", isUserLoggedIn, todayCycleTimer)
router.post("/end-add", isUserLoggedIn, endAndAdd)
router.patch("/end", isUserLoggedIn, endByTimerId)

//default
router.get("/", isUserLoggedIn, getAllCycleTimers)
router.get("/:id", isUserLoggedIn, getCycleTimer)
router.post("/", isUserLoggedIn, addCycleTimer)
router.patch("/:id", isUserLoggedIn, updateCycleTimer)

export default router
