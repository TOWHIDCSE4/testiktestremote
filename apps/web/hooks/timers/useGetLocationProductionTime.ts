import {
  API_URL_CONTROLLER_TIMER,
  API_URL_TIMER,
  ONE_DAY,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse } from "custom-validator"
import Cookies from "js-cookie"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  item: number
}

export async function getLocationProductionTime(
  locationId: string | undefined
) {
  const token = Cookies.get("tfl")
  const res = await fetch(
    `${API_URL_CONTROLLER_TIMER}/in-production/${locationId}`,
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

function useGetLocationProductionTime(locationId: string | undefined) {
  const query = useQuery(
    ["in-production", locationId],
    () => getLocationProductionTime(locationId),
    {
      cacheTime: ONE_DAY,
      staleTime: ONE_DAY,
      refetchOnWindowFocus: false,
      enabled: !!locationId,
    }
  )
  return query
}
export default useGetLocationProductionTime
