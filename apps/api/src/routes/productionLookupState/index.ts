import express from "express"
const router = express.Router()
import {
  getProductionLookup,
  postProductionLookup,
  deleteProductionLookup,
  updateProductionLookup,
  paginatedProductionLookup,
} from "./productionLookupState"
import isUserLoggedIn from "../../helpers/isUserloggedIn"

/**
 * @Api {get} /production-lookup-state Get profile lookup state
 */
router.get("/", isUserLoggedIn, getProductionLookup)
/**
 * @Api {post} /production-lookup-state Set profile lookup state
 */
router.post("/", isUserLoggedIn, postProductionLookup)
/**
 * @Api {patch} /production-lookup-state Update profile lookup state
 */
router.patch("/", isUserLoggedIn, updateProductionLookup)

/**
 * @Api {delete} /production-lookup-state Delete profile lookup state
 */
router.delete("/", isUserLoggedIn, deleteProductionLookup)

/**
 * @Api {get} /production-lookup-state/paginated Get paginated profile lookup state
 */
router.get("/paginated", isUserLoggedIn, paginatedProductionLookup)

export default router
