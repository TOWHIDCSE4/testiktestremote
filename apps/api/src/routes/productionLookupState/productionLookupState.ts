import { Request, Response } from "express"
import productionLookupState from "../../models/productionLookupState"
import { error } from "console"

/**
 * post the production lookup state
 * @param {Request} req
 * @param {Response} res
 */
export const postProductionLookup = async (req: Request, res: Response) => {
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
    await productionLookupState.create({
      userId: user._id,
      locations,
      machineClasses,
      machines,
      parts,
      startDate,
      endDate,
      includeCycles,
    })
    return res.status(200).json({ message: "production lookup state updated" })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

/**
 *  get the production lookup state
 * @param {Request} req
 * @param {Response} res
 */
export const getProductionLookup = async (req: Request, res: Response) => {
  const { user } = res.locals
  try {
    const productionLookup = await productionLookupState
      .find({
        userId: user._id,
      })
      .populate("userId")
    if (!productionLookup) {
      return res.status(404).json({
        error: true,
        message: "No production lookup state found",
      })
    }
    return res.status(200).json({ productionLookup })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

/**
 * update the production lookup state
 * @param {Request} req
 * @param {Response} res
 */
export const updateProductionLookup = async (req: Request, res: Response) => {
  const { id } = req.params
  const { user } = res.locals
  try {
    await productionLookupState
      .findOneAndUpdate(
        { _id: id, userId: user._id },
        { $set: { ...req.body } }
      )
      .populate("userId")
    return res.status(200).json({ message: "production lookup state updated" })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

/**
 * delete the production lookup state
 * @param {Request} req
 * @param {Response} res
 */
export const deleteProductionLookup = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    await productionLookupState.deleteOne({ _id: id })
    return res.status(200).json({ message: "production lookup state deleted" })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

/**
 * Paiginated production lookup state
 * @param {Request} req
 * @param {Response} res
 */
export const paginatedProductionLookup = async (
  req: Request,
  res: Response
) => {
  const { user } = res.locals
  const { page, limit } = req.query
  try {
    const productionLookup = await productionLookupState
      .find({ userId: user._id })
      .limit(Number(limit))
      .populate("userId")
      .skip((Number(page) - 1) * Number(limit))
    // if (!productionLookup || productionLookup?.length === 0) {
    //   return res.status(404).json({
    //     error: true,
    //     message: "No production lookup state found",
    //   })
    // }
    return res.status(200).json({
      error: false,
      items: productionLookup,
      itemCount: productionLookup?.length,
    })
  } catch (error: any) {
    return res.status(500).json({ error: true, message: error.message })
  }
}
