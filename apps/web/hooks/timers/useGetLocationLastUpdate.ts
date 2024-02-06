import {
  API_URL_CONTROLLER_TIMER,
  API_URL_TIMER,
  ONE_DAY,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function getLocationLastUpdated(locationId: string | undefined) {
  const token = Cookies.get("tfl")
  const res = await fetch(
    `${API_URL_CONTROLLER_TIMER}/location-last-update/${locationId}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return await res.json()
}

function useGetLocationLastUpdate(locationId: string | undefined) {
  const query = useQuery(
    ["location-last-updated", locationId],
    () => getLocationLastUpdated(locationId),
    {
      cacheTime: ONE_DAY,
      staleTime: ONE_DAY,
      refetchOnWindowFocus: false,
      enabled: !!locationId,
    }
  )
  return query
}
export default useGetLocationLastUpdate
