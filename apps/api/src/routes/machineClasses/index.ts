import express from "express"
const router = express.Router()
import {
  addMachineClass,
  deleteMachineClass,
  getAllMachineClasses,
  getMachineClass,
  updateMachineClass,
} from "./default"
import isUserLoggedIn from "../../helpers/isUserloggedIn"

//default
router.get("/", isUserLoggedIn, getAllMachineClasses)
router.get("/:id", isUserLoggedIn, getMachineClass)
router.post("/", isUserLoggedIn, addMachineClass)
router.patch("/:id", isUserLoggedIn, updateMachineClass)
router.delete("/:id", isUserLoggedIn, deleteMachineClass)

export default router
