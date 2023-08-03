import express from "express"
const router = express.Router()
import {
  addMachineClass,
  deleteMachineClass,
  getAllMachineClasses,
  getMachineClass,
  updateMachineClass,
} from "./default"

//default
router.get("/", getAllMachineClasses)
router.get("/:id", getMachineClass)
router.post("/", addMachineClass)
router.patch("/:id", updateMachineClass)
router.delete("/:id", deleteMachineClass)

export default router
