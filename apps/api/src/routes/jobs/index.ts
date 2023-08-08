import express from "express"
const router = express.Router()
import { addJob, deleteJob, getAllJobs, getJob, updateJob } from "./default"
import isUserLoggedIn from "../../helpers/isUserloggedIn"

//default
router.get("/", isUserLoggedIn, getAllJobs)
router.get("/:id", isUserLoggedIn, getJob)
router.post("/", isUserLoggedIn, addJob)
router.patch("/:id", isUserLoggedIn, updateJob)
router.delete("/:id", isUserLoggedIn, deleteJob)

export default router
