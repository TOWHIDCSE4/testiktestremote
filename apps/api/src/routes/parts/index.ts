import express from "express"
const router = express.Router()
import {
  addPart,
  deletePart,
  getAllParts,
  getPart,
  updatePart,
  verifyOrUnverify,
} from "./default"
import isUserLoggedIn from "../../helpers/isUserloggedIn"
import { paginated } from "./paginated"
import { locationCount } from "./locationCount"
import {
  byLocationMachineClass,
  locationMachineClass,
} from "./locationMachineClass"
import { partByLocationFactory } from "./partByLocationFactory"

//custom
router.get("/paginated", isUserLoggedIn, paginated)
router.get("/location-factory", isUserLoggedIn, partByLocationFactory)
router.get("/location-count/:id", isUserLoggedIn, locationCount)
router.get("/location-machine-class", isUserLoggedIn, locationMachineClass)
router.get("/by/location-machine-class", isUserLoggedIn, byLocationMachineClass)
//default
router.get("/", isUserLoggedIn, getAllParts)
router.get("/:id", isUserLoggedIn, getPart)
router.post("/", isUserLoggedIn, addPart)
router.patch("/:id", isUserLoggedIn, updatePart)
router.delete("/:id", isUserLoggedIn, deletePart)
router.post("/verify/:id", isUserLoggedIn, verifyOrUnverify)

export default router
