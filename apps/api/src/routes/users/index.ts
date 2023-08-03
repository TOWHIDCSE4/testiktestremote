import express from "express"
const router = express.Router()
import {
  addUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "./default"

//default
router.get("/", getAllUsers)
router.get("/:id", getUser)
router.post("/", addUser)
router.patch("/:id", updateUser)
router.delete("/:id", deleteUser)

export default router
