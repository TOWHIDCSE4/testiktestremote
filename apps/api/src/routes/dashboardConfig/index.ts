import express = require("express")
const router = express.Router()
import { getDashboardConfig, upsertDashboardConfig } from "./dashboard"
import isUserLoggedIn from "../../helpers/isUserloggedIn"

/**
 * @Api {get} /dashboard-config Get profile config
 */
router.get("/", isUserLoggedIn, getDashboardConfig)

/**
 * @Api {post} /dashboard-config upsert profile config
 */
router.post("/", isUserLoggedIn, upsertDashboardConfig)

export default router
