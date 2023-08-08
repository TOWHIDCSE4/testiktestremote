import express from "express"
const router = express.Router()
import {
  addUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "./default"
import isUserLoggedIn from "../../helpers/isUserloggedIn"
import { auth } from "./login"
import { logout } from "./logout"
import { verify } from "./verify"

//default
router.get("/", isUserLoggedIn, getAllUsers)
router.get("/:id", isUserLoggedIn, getUser)
router.post("/", addUser)
router.patch("/:id", isUserLoggedIn, updateUser)
router.delete("/:id", isUserLoggedIn, deleteUser)

//auth
router.post("/login", auth)
router.post("/logout", logout)
router.get("/verify/:token", verify)
export default router
