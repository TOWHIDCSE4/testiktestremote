import express from "express"
const router = express.Router()
import {
  addPart,
  deletePart,
  getAllParts,
  getPart,
  updatePart,
} from "./default"

//default
router.get("/", getAllParts)
router.get("/:id", getPart)
router.post("/", addPart)
router.patch("/:id", updatePart)
router.delete("/:id", deletePart)

export default router
