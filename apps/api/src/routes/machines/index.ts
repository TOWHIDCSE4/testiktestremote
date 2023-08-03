import express from "express"
const router = express.Router()
import {
  addMachine,
  deleteMachine,
  getAllMachines,
  getMachine,
  updateMachine,
} from "./default"

//default
router.get("/", getAllMachines)
router.get("/:id", getMachine)
router.post("/", addMachine)
router.patch("/:id", updateMachine)
router.delete("/:id", deleteMachine)

export default router
