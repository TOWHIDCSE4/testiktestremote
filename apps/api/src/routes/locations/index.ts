import express from "express"
const router = express.Router()
import {
  addLocation,
  deleteLocation,
  findMachineClassByLocation,
  getAllLocations,
  getLocation,
  updateLocation,
} from "./default"
import isUserLoggedIn from "../../helpers/isUserloggedIn"

//default
router.get("/", getAllLocations)
router.get("/:id", isUserLoggedIn, getLocation)
router.post("/", isUserLoggedIn, addLocation)
router.patch("/:id", isUserLoggedIn, updateLocation)
router.delete("/:id", isUserLoggedIn, deleteLocation)
router.get(
  "/machine-class/by-location",
  isUserLoggedIn,
  findMachineClassByLocation
)

export default router
