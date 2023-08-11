import express from "express"
const router = express.Router()
import {
  addFactory,
  delteFactory,
  getAllFactories,
  getFactory,
  updateFactory,
} from "./default"
import isUserLoggedIn from "../../helpers/isUserloggedIn"
import { machineClasses } from "./machineClasses"
import isRoleAllowed from "../../helpers/isRoleAllowed"
import { ALLOWED_ALL_ROLES } from "../../utils/constants"

//default
router.get(
  "/",
  isUserLoggedIn,
  isRoleAllowed(ALLOWED_ALL_ROLES),
  getAllFactories
)
router.get("/:id", isUserLoggedIn, getFactory)
router.post("/", isUserLoggedIn, addFactory)
router.patch("/:id", isUserLoggedIn, updateFactory)
router.delete("/:id", isUserLoggedIn, delteFactory)

//custom
router.get("/machine-classes/:factoryId", isUserLoggedIn, machineClasses)

export default router
