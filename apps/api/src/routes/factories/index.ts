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
import { machineClasses, machineClassesV2 } from "./machineClasses"
import isRoleAllowed from "../../helpers/isRoleAllowed"
import { ALLOWED_ALL_ROLES } from "../../utils/constants"
import { verifyOrUnverify } from "../machines/default"

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
router.put("/:id", isUserLoggedIn, verifyOrUnverify)

//custom
router.get("/machine-classes-all/v2", isUserLoggedIn, machineClassesV2)
router.get("/machine-classes/:factoryId", isUserLoggedIn, machineClasses)
verifyOrUnverify
export default router
