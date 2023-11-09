import { Request, Response } from "express"
import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import Users from "../../models/users"
import * as Sentry from "@sentry/node"

export const paginated = async (req: Request, res: Response) => {
  const {
    page,
    role,
    locationId,
    status,
    name,
    excludeUser,
    factories,
    machineClass,
  } = req.query
  if (page) {
    try {
      const queryFilters = []

      if (role && role !== "null") {
        if (role === "HR") {
          queryFilters.push({ role: { $in: ["HR", "HR_Director"] } })
        } else {
          queryFilters.push({ role })
        }
      }

      if (locationId) {
        queryFilters.push({ locationId })
      }

      if (status && status !== "null") {
        queryFilters.push({ status })
      }
      // if (excludeUser) {
      //   queryFilters.push({ _id: { $ne: excludeUser } })
      // }

      const factoryMachineFilter = []
      if (
        factories &&
        factories !== "" &&
        machineClass &&
        machineClass !== ""
      ) {
        factoryMachineFilter.push({
          $and: [
            //@ts-expect-error
            { factoryId: factories?.split(",").map((id: string) => id.trim()) },
            //@ts-expect-error
            {
              machineClassId: machineClass
                ?.split(",")
                .map((id: string) => id.trim()),
            },
          ],
        })
      } else {
        if (factories && factories !== "") {
          //@ts-expect-error
          const factoryIds = factories
            ?.split(",")
            .map((id: string) => id.trim())
          queryFilters.push({ factoryId: { $in: factoryIds } })
        }

        if (machineClass && machineClass !== "") {
          //@ts-expect-error
          const machineClassIds = machineClass
            ?.split(",")
            .map((id: string) => id.trim())
          queryFilters.push({ machineClassId: { $in: machineClassIds } })
        }
      }

      const orFilters = []
      if (name) {
        // @ts-expect-error
        const fullName = name?.split(" ")

        const [firstName, lastName] = fullName

        if (fullName.length == 1) {
          orFilters.push({
            $or: [
              { firstName: { $regex: `.*${firstName}.*`, $options: "i" } },
              { lastName: { $regex: `.*${firstName}.*`, $options: "i" } },
            ],
          })
        }
        if (fullName.length > 1) {
          orFilters.push({
            $and: [
              { lastName: { $regex: `.*${lastName}.*`, $options: "i" } },
              { firstName: { $regex: `.*${firstName}.*`, $options: "i" } },
            ],
          })
        }
      }

      queryFilters.push({
        $and: [
          { $or: [{ deletedAt: { $exists: false } }, { deletedAt: null }] },
          ...(orFilters.length ? [{ $or: orFilters }] : []),
          ...(factoryMachineFilter.length
            ? [{ $or: factoryMachineFilter }]
            : []),
        ],
      })

      const getAllUsers = await Users.find({ $and: queryFilters })
        .populate("locationId")
        .populate("factoryId")
        .sort({
          createdAt: -1,
        })
        .skip(7 * (Number(page) - 1))
        .limit(7)

      const usersCount = await Users.find({
        $and: queryFilters,
      }).countDocuments()

      res.json({
        error: false,
        items: getAllUsers,
        itemCount: usersCount,
        message: null,
      })
    } catch (err: any) {
      const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
      Sentry.captureException(err)
      res.json({
        error: true,
        message: message,
        items: null,
        itemCount: null,
      })
    }
  } else {
    res.json({
      error: true,
      message: REQUIRED_VALUES_MISSING,
      items: null,
      itemCount: null,
    })
  }
}
