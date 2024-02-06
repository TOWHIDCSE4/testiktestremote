import express from "express"
import { getAllItems, setItem } from "./default"

const router = express.Router()

router.get("/", getAllItems)

router.post("/", setItem)

export default router
