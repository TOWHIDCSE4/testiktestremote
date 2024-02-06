import { Request, Response } from "express"
import dashboardConfig from "../../models/dashboardConfig"

/**
 * get the profile config
 * @param {Request} req
 * @param {Response} res
 */
export const getDashboardConfig = async (req: Request, res: Response) => {
  const { user } = res.locals
  try {
    const getdashboardConfig = await dashboardConfig.findOne({
      userId: user._id,
    })
    if (!getdashboardConfig) {
      return res.status(404).json({
        error: true,
        message: "No dashboard config found",
      })
    }
    return res.status(200).json({
      error: false,
      items: getdashboardConfig,
      itemCount: 1,
    })
  } catch (error: any) {
    return res.status(500).json({ error: true, message: error.message })
  }
}

/**
 * upsert the profile config
 * @param {Request} req
 * @param {Response} res
 */
export const upsertDashboardConfig = async (req: Request, res: Response) => {
  const { user } = res.locals
  try {
    const upsert = await dashboardConfig.updateOne(
      { userId: user._id },
      { $set: { userId: user._id, ...req.body } },
      { upsert: true }
    )
    if (upsert.acknowledged) {
      const getdashboardConfig = await dashboardConfig.findOne({
        userId: user._id,
      })
      return res.status(200).json({
        error: false,
        item: getdashboardConfig,
        itemCount: 1,
      })
    }
  } catch (error: any) {
    return res.status(500).json({ error: true, message: error.message })
  }
}
