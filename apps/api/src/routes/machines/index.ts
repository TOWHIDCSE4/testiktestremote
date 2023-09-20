import express from "express"
const router = express.Router()
import {
  addMachine,
  deleteMachine,
  getAllMachines,
  getMachine,
  updateMachine,
} from "./default"
import isUserLoggedIn from "../../helpers/isUserloggedIn"
import { locationCount } from "./locationCount"
import { paginated } from "./paginated"
import { byLocation } from "./byLocation"
import { locationMachineClass } from "./locationMachineClass"

//custom
router.get("/paginated", isUserLoggedIn, paginated)
router.get("/location-count/:id", isUserLoggedIn, locationCount)
router.get("/by-location", isUserLoggedIn, byLocation)
router.get("/location-machine-class", isUserLoggedIn, locationMachineClass)

//default
router.get("/", isUserLoggedIn, getAllMachines)
router.get("/:id", isUserLoggedIn, getMachine)
router.post("/", isUserLoggedIn, addMachine)
router.patch("/:id", isUserLoggedIn, updateMachine)
router.delete("/:id", isUserLoggedIn, deleteMachine)

export default router
