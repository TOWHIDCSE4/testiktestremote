import express from "express"
const router = express.Router()
import {
  addUser,
  deleteUser,
  getAllUsers,
  getUser,
  getUserByEmail,
  updateUser,
} from "./default"
import isUserLoggedIn from "../../helpers/isUserloggedIn"
import { auth } from "./login"
import { logout } from "./logout"
import { verify } from "./verify"
import { updatePassword } from "./updatePassword"
import { roleCount } from "./roleCount"
import { paginated } from "./paginated"
import { acceptUser } from "./accept"
import { getOperatorList } from "./operator"
import {
  updatePinnedComponentsDashboard,
  updatePinnedComponentsPopup,
} from "./pinnedComponents"

//custom
router.get("/paginated", isUserLoggedIn, paginated)
router.get("/role-count/:role", isUserLoggedIn, roleCount)
router.patch("/password/:id", isUserLoggedIn, updatePassword)
router.patch("/accept/:id", isUserLoggedIn, acceptUser)

//default
router.post("/", addUser)
router.get("/:id", isUserLoggedIn, getUser)
router.get("/", isUserLoggedIn, getAllUsers)
router.get("/operator-list", isUserLoggedIn, getOperatorList)
router.get("/profile/:email", isUserLoggedIn, getUserByEmail)
router.patch("/:id", isUserLoggedIn, updateUser)
router.delete("/:id", isUserLoggedIn, deleteUser)

//auth
router.post("/login", auth)
router.post("/logout", logout)
router.get("/verify/:token", verify)

// pinned comp
router.patch("/pinned-components/dashboard", updatePinnedComponentsDashboard)
router.patch("/pinned-components/popup", updatePinnedComponentsPopup)

export default router
