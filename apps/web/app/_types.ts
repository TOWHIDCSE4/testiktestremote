import { T_BackendResponse } from "custom-validator"

export type T_DBReturn<T> = Omit<T_BackendResponse, "items"> & {
  items: T
}
