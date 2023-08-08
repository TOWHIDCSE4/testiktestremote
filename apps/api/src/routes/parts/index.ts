import express from "express"
const router = express.Router()
import {
  addPart,
  deletePart,
  getAllParts,
  getPart,
  updatePart,
} from "./default"
import isUserLoggedIn from "../../helpers/isUserloggedIn"

//default
router.get("/", isUserLoggedIn, getAllParts)
router.get("/:id", isUserLoggedIn, getPart)
router.post("/", isUserLoggedIn, addPart)
router.patch("/:id", isUserLoggedIn, updatePart)
router.delete("/:id", isUserLoggedIn, deletePart)

export default router
