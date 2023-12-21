import { Request, Response } from "express"
import profileLookupState from "../../models/profileLookupState"

/**
 * post the profile lookup state
 * @param {Request} req
 * @param {Response} res
 */
export const profileLookup = async (req: Request, res: Response) => {
  const { user } = res.locals
  const {
    locations,
    machineClasses,
    machines,
    parts,
    startDate,
    endDate,
    includeCycles,
  } = req.body
  try {
    if (!locations || !machineClasses || !machines || !parts)
      return res.status(400).json({ message: "Missing required fields" })
    await profileLookupState.updateOne(
      { userId: user._id },
      {
        $set: {
          userId: user._id,
          locations,
          machineClasses,
          machines,
          parts,
          startDate,
          endDate,
          includeCycles,
        },
      },
      { upsert: true }
    )
    return res.status(200).json({ message: "Profile lookup state updated" })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

/**
 *  get the profile lookup state
 * @param {Request} req
 * @param {Response} res
 */
export const getProfileLookup = async (req: Request, res: Response) => {
  const { user } = res.locals
  console.log(user._id)
  try {
    const profileLookup = await profileLookupState.findOne({ userId: user._id })
    console.log("profileLookup", profileLookup)
    if (!profileLookup) {
      return res.status(404).json({ message: "Profile lookup state not found" })
    }
    return res.status(200).json({ profileLookup })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

/**
 * update the profile lookup state
 * @param {Request} req
 * @param {Response} res
 */
export const updateProfileLookup = async (req: Request, res: Response) => {
  const { user } = res.locals
  try {
    await profileLookupState.findOneAndUpdate(
      { profileId: user._id },
      { $set: { ...req.body } }
    )
    return res.status(200).json({ message: "Profile lookup state updated" })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

/**
 * delete the profile lookup state
 * @param {Request} req
 * @param {Response} res
 */
export const deleteProfileLookup = async (req: Request, res: Response) => {
  const { user } = res.locals
  try {
    await profileLookupState.findOneAndDelete({
      profileId: user._id,
    })
    return res.status(200).json({ message: "Profile lookup state deleted" })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}
