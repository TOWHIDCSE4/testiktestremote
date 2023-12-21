import express from "express"
const router = express.Router()
import {
  profileLookup,
  getProfileLookup,
  updateProfileLookup,
  deleteProfileLookup,
} from "./profileLookupState"
import isUserLoggedIn from "../../helpers/isUserloggedIn"

/**
 * @Api {get} /profile-lookup-state Get profile lookup state
 */
router.get("/", isUserLoggedIn, getProfileLookup)
/**
 * @Api {post} /profile-lookup-state Set profile lookup state
 */
router.post("/", isUserLoggedIn, profileLookup)
/**
 * @Api {patch} /profile-lookup-state Update profile lookup state
 */
router.patch("/", isUserLoggedIn, updateProfileLookup)

/**
 * @Api {delete} /profile-lookup-state Delete profile lookup state
 */
router.delete("/", isUserLoggedIn, deleteProfileLookup)

export default router
