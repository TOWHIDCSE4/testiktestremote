import {
  API_URL_TIMER,
  ONE_DAY,
  REFETCH_ACTIVATED,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse } from "custom-validator"
import Cookies from "js-cookie"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  item: {
    tons: number
    tonsPerHour: number
    unitPerHour: number
    dailyUnits: number
  }
}

export async function getTotalTonsUnit({
  locationId,
  timerId,
}: {
  locationId: string | undefined
  timerId: string | undefined
}) {
  const token = Cookies.get("tfl")
  const res = await fetch(
    `${API_URL_TIMER}/total-tons-unit?locationId=${locationId}&timerId=${timerId}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return (await res.json()) as T_DBReturn
}

function useTotalTonsUnit({
  locationId,
  timerId,
}: {
  locationId: string | undefined
  timerId: string | undefined
}) {
  const query = useQuery(
    ["total-tons-unit", locationId, timerId],
    () => getTotalTonsUnit({ locationId, timerId }),
    {
      refetchOnWindowFocus: false,
      enabled: !!locationId && !!timerId,
      refetchInterval: REFETCH_ACTIVATED ? 1000 : false,
    }
  )
  return query
}
export default useTotalTonsUnit
