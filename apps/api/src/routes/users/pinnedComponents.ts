import { Request, Response } from "express"
import { z } from "zod"
import { ZUserPinnedComponents } from "custom-validator/ZUser"
import User from "../../models/users"
import * as Sentry from "@sentry/node"

export const updatePinnedComponentsDashboard = async (
  req: Request,
  res: Response
) => {
  const bodyValidator = z.object({
    userId: z.string(),
    pinnedComponentsDashboard: z.array(ZUserPinnedComponents),
  })
  const validated = bodyValidator.safeParse(req.body)

  if (!validated.success) {
    res.status(400).json({
      error: true,
      message: "invalid body",
      detail: validated.error,
    })
    return
  }
  try {
    const user = await User.findByIdAndUpdate(
      validated.data.userId,
      {
        pinnedComponentsDashboard: validated.data.pinnedComponentsDashboard,
      },
      { new: true }
    )
    res.status(200).json({
      error: false,
      message: "Success",
      item: user,
    })
  } catch (err: any) {
    Sentry.captureException(err)
    res.status(500).json({
      error: true,
      message: "Server Error",
      detail: err,
    })
  }
}
export const updatePinnedComponentsPopup = async (
  req: Request,
  res: Response
) => {
  const bodyValidator = z.object({
    userId: z.string(),
    pinnedComponentsPopup: z.array(ZUserPinnedComponents),
  })
  const validated = bodyValidator.safeParse(req.body)

  if (!validated.success) {
    res.status(400).json({
      error: true,
      message: "invalid body",
      detail: validated.error,
    })
    return
  }
  try {
    const user = await User.findByIdAndUpdate(
      validated.data.userId,
      {
        pinnedComponentsPopup: validated.data.pinnedComponentsPopup,
      },
      { new: true }
    )
    res.status(200).json({
      error: false,
      item: user,
      message: "Success",
    })
  } catch (err: any) {
    Sentry.captureException(err)
    res.status(500).json({
      error: true,
      message: "Server Error",
      detail: err,
    })
  }
}
