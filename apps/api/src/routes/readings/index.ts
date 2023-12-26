import { Router } from "express"
import { createReadings, deleteReadings, getReadings } from "./default"

const router = Router()

router.get("/", getReadings)
router.post("/", createReadings)
router.delete("/", deleteReadings)

export default router
