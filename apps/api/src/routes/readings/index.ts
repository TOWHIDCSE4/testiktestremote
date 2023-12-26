import { Router } from "express"
import { createReadings, getReadings } from "./default"

const router = Router()

router.get("/", getReadings)
router.post("/", createReadings)

export default router
