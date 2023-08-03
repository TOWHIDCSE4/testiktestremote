import express from "express"
const router = express.Router()
import {
  addFactory,
  delteFactory,
  getAllFactories,
  getFactory,
  updateFactory,
} from "./default"

//default
router.get("/", getAllFactories)
router.get("/:id", getFactory)
router.post("/", addFactory)
router.patch("/:id", updateFactory)
router.delete("/:id", delteFactory)

export default router
