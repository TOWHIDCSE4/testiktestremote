import {
  API_URL_TIMER,
  REFETCH_ACTIVATED,
  REFETCH_TIME,
  SIXTEEN_HOURS,
  TWELVE_HOURS,
} from "../../helpers/constants"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { T_BackendResponse, T_Locations, T_Timer } from "custom-validator"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_Timer[]
}

export async function getTimerByLocation(locationId: string) {
  const token = Cookies.get("tfl")
  const res = await fetch(
    `${API_URL_TIMER}/find/filter/location?locationId=${locationId}`,
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

export const usePrefetchTimersByLocation = () => {
  const queryClient = useQueryClient()
  const prefetch = (locationId: string) =>
    queryClient.prefetchQuery({
      queryKey: ["timers-location", locationId],
      queryFn: () => getTimerByLocation(locationId),
    })

  return { prefetch }
}

function useTimersByLocation() {
  const [locationId, setLocationId] = useState("")
  const query = useQuery(
    ["timers-location", locationId],
    () => getTimerByLocation(locationId),
    {
      refetchInterval: REFETCH_ACTIVATED ? Number(REFETCH_TIME) : false,
      refetchOnWindowFocus: false,
      enabled: !!locationId,
    }
  )

  return { ...query, setLocationId, locationId }
}
export default useTimersByLocation
