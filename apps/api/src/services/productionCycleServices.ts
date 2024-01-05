import { T_ProductionCycle, T_ProductionCycleCreate } from "custom-validator"
import ProductionCycleRepository from "../repository/productionCycleRepository"
import {
  getStartOfDayTimezone,
  getYesterdayEndOfDayTimzeone,
} from "../utils/date"

const isProductionCycleExistsInLocation = async (
  locationId: string,
  timeZone: string
) => {
  const currentDayStart = getStartOfDayTimezone(timeZone)
  const productionToday = await ProductionCycleRepository.findOne(
    {
      locationId,
      createdAt: { $gte: currentDayStart },
      endAt: null,
    },
    {
      sort: {
        $natural: -1,
      },
    }
  )

  if (!productionToday) {
    return false
  }

  return true
}

const create = async (param: T_ProductionCycleCreate) => {
  return ProductionCycleRepository.create(param)
}
const startByLocation = async (locationId: string, clientStartedAt: Date) => {
  return ProductionCycleRepository.create({
    locationId,
    createdAt: clientStartedAt,
  })
}
const getCurrentByLocation = async ({
  locationId,
}: Pick<T_ProductionCycle, "locationId">) => {
  return ProductionCycleRepository.findOne(
    {
      locationId,
    },
    {
      sort: { $natural: -1 },
    }
  )
}

const endByLocationId = async (locationId: string) => {
  return ProductionCycleRepository.updateMany(
    {
      locationId,
    },
    {
      endAt: new Date(),
    }
  )
}

const getCurrentRunningByLocationId = async (
  locationId: string,
  timeZone: string = "America/Chicago"
) => {
  const currentDayStart = getStartOfDayTimezone(timeZone)
  const yesterdayEndDay = getYesterdayEndOfDayTimzeone(timeZone)
  await ProductionCycleRepository.updateMany(
    {
      createdAt: { $lte: yesterdayEndDay },
      endAt: null,
    },
    {
      endAt: yesterdayEndDay,
    }
  )

  return ProductionCycleRepository.findOne(
    {
      locationId,
      createdAt: { $gte: currentDayStart },
      endAt: null,
    },
    {
      sort: {
        $natural: -1,
      },
    }
  )
}

const ProductionCycleService = {
  isProductionCycleExistsInLocation,
  create,
  startByLocation,
  getCurrentByLocation,
  endByLocationId,
  getCurrentRunningByLocationId,
}

export default ProductionCycleService
