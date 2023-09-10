import express from "express"
const router = express.Router()
import {
  addJobTimer,
  deleteJobTimer,
  getAllJobTimer,
  getJobTimer,
  updateJobTimer,
} from "./default"
import isUserLoggedIn from "../../helpers/isUserloggedIn"
import { getByTimerId } from "./getByTimerId"

router.get("/timer", isUserLoggedIn, getByTimerId)

//default
router.get("/", isUserLoggedIn, getAllJobTimer)
router.get("/:id", isUserLoggedIn, getJobTimer)
router.post("/", isUserLoggedIn, addJobTimer)
router.patch("/:id", isUserLoggedIn, updateJobTimer)
router.delete("/:id", isUserLoggedIn, deleteJobTimer)

export default router
