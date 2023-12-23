import { T_ProductionCycle, T_ProductionCycleCreate } from "custom-validator"
import ProductionCycle from "../models/productionCycle"
import { createBaseRepository } from "./baseRepository"

const ProductionCycleRepository = {
  ...createBaseRepository<
    typeof ProductionCycle,
    T_ProductionCycle,
    T_ProductionCycleCreate
  >(ProductionCycle),
}

export default ProductionCycleRepository
