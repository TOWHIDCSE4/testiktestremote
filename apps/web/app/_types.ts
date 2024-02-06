import { T_BackendResponse } from "custom-validator"

export type T_DBReturn<T> = Omit<T_BackendResponse, "items"> & {
  items: T
}

export type T_Endpoint = {
  message: string
  endpointStats: {
    [endpoint: string]: {
      queries: string[]
      requestCount: number
      averageResponseTime: number
    }
  }
}
