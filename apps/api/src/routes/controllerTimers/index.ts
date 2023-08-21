import express from "express"
const router = express.Router()
import {
  addControllerTimer,
  getAllControllerTimers,
  getControllerTimer,
  updateControllerTimer,
} from "./default"
import isUserLoggedIn from "../../helpers/isUserloggedIn"
import isRoleAllowed from "../../helpers/isRoleAllowed"
import { ALLOWED_ALL_ROLES } from "../../utils/constants"

//default
router.get("/", isUserLoggedIn, getAllControllerTimers)
router.get("/:id", isUserLoggedIn, getControllerTimer)
router.post("/", isUserLoggedIn, addControllerTimer)
router.patch("/:id", isUserLoggedIn, updateControllerTimer)

export default router
