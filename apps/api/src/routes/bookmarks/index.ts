import express from "express"
const router = express.Router()
import {
  addBookmark,
  deleteBookmark,
  getAllBookmarks,
  getBookmark,
} from "./default"
import isUserLoggedIn from "../../helpers/isUserloggedIn"

//default
router.get("/", isUserLoggedIn, getAllBookmarks)
router.get("/:id", isUserLoggedIn, getBookmark)
router.post("/", isUserLoggedIn, addBookmark)
router.delete("/:id", isUserLoggedIn, deleteBookmark)

export default router
