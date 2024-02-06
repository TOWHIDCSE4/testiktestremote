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
import { locationLastUpdate } from "./locationLastUpdate"
import { inProduction } from "./inProduction"

//custom
router.get("/today", isUserLoggedIn, todayControllerTimer)
router.get("/in-production/:locationId", isUserLoggedIn, inProduction)
router.get(
  "/location-last-update/:locationId",
  isUserLoggedIn,
  locationLastUpdate
)
router.put("/end", isUserLoggedIn, endControllerTimer)

//default
router.get("/", isUserLoggedIn, getAllControllerTimers)
router.get("/:id", isUserLoggedIn, getControllerTimer)
router.post("/", isUserLoggedIn, addControllerTimer)
router.patch("/:id", isUserLoggedIn, updateControllerTimer)

export default router
