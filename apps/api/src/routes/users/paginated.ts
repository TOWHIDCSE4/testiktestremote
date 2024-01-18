import { Request, Response } from "express"
import {
  REQUIRED_VALUES_MISSING,
  UNKNOWN_ERROR_OCCURRED,
} from "../../utils/constants"
import Users from "../../models/users"
import * as Sentry from "@sentry/node"
import mongoose from "mongoose"

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
    key,
    sort,
  } = req.query
  if (page) {
    try {
      const queryFilters = []

      if (role && role !== "null") {
        if (role === "HR") {
          queryFilters.push({ role: { $in: ["HR", "HR_Director"] } })
        } else if (role === "Corporate") {
          queryFilters.push({
            role: {
              $in: [
                "Accounting",
                "Sales",
                "Corporate",
                "Accounting_Director",
                "Sales_Director",
                "Corporate_Director",
              ],
            },
          })
        } else {
          queryFilters.push({ role })
        }
      }
      // if the locationId is not provided then return empty array
      if (!locationId || locationId === "") {
        return res.json({
          error: false,
          items: [],
          itemCount: 0,
          message: null,
        })
      }
      queryFilters.push({
        locationId: {
          $in: String(locationId)
            .split(",")
            .map((id: string) => new mongoose.Types.ObjectId(id)),
        },
      })

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
            {
              $or: [
                {
                  factoryId: (factories as string)
                    ?.split(",")
                    .map((id: string) => id.trim()),
                },
                { factoryId: { $exists: false } },
              ],
            },
            {
              $or: [
                {
                  machineClassId: (machineClass as string)
                    ?.split(",")
                    .map((id: string) => id.trim()),
                },
                {
                  machineClassId: { $exists: false },
                },
              ],
            },
          ],
        })
      } else {
        if (factories && factories !== "") {
          const factoryIds = factories
            //@ts-expect-error
            ?.split(",")
            .map((id: string) => id.trim())
          queryFilters.push({
            $or: [
              { factoryId: { $exists: false } },
              { factoryId: { $in: factoryIds } },
            ],
          })
        }

        if (machineClass && machineClass !== "") {
          const machineClassIds = machineClass
            //@ts-expect-error
            ?.split(",")
            .map((id: string) => id.trim())
          queryFilters.push({
            $or: [
              { machineClassId: { $exists: false } },
              { machineClassId: { $in: machineClassIds } },
            ],
          })
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

      const sorting: any = {}
      if (key && sort) {
        sorting[`${key}`] = sort
      } else {
        sorting["createdAt"] = -1
      }

      const getAllUsers = await Users.find({ $and: queryFilters })
        .populate("locationId")
        .populate("factoryId")
        .populate("archivedBy")
        .sort(sorting)
        .skip(7 * (Number(page) - 1))
        .limit(7)
      const archivedUsersCount = await Users.find({
        $and: queryFilters.map((i) => {
          if (i.status) {
            return {
              ...i,
              status: "Archived",
            }
          }
          return i
        }),
      }).countDocuments()

      const usersCount = await Users.find({
        $and: queryFilters,
      }).countDocuments()

      return res.json({
        error: false,
        items: getAllUsers,
        itemCount: usersCount,
        archivedUsersCount,
        message: null,
      })
    } catch (err: any) {
      const message = err.message ? err.message : UNKNOWN_ERROR_OCCURRED
      Sentry.captureException(err)
      return res.json({
        error: true,
        message: message,
        items: null,
        itemCount: null,
      })
    }
  } else {
    return res.json({
      error: true,
      message: REQUIRED_VALUES_MISSING,
      items: null,
      itemCount: null,
    })
  }
}
