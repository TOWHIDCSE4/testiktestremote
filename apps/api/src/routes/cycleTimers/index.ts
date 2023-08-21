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

//default
router.get("/", getAllCycleTimers)
router.get("/:id", isUserLoggedIn, getCycleTimer)
router.post("/", isUserLoggedIn, addCycleTimer)
router.patch("/:id", isUserLoggedIn, updateCycleTimer)

export default router
