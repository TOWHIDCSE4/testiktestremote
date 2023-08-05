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

//default
router.get("/", getAllUsers)
router.get("/:id", isUserLoggedIn, getUser)
router.post("/", addUser)
router.patch("/:id", isUserLoggedIn, updateUser)
router.delete("/:id", isUserLoggedIn, deleteUser)

//auth
router.post("/login", auth)
router.get("/logout/:id", logout)
export default router
