import express from "express"
const router = express.Router()
import {
  addLocation,
  deleteLocation,
  getAllLocations,
  getLocation,
  updateLocation,
} from "./default"

//default
router.get("/", getAllLocations)
router.get("/:id", getLocation)
router.post("/", addLocation)
router.patch("/:id", updateLocation)
router.delete("/:id", deleteLocation)

export default router
