import {
  API_URL_TIMER,
  SIXTEEN_HOURS,
  TWELVE_HOURS,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse, T_Locations, T_Timer } from "custom-validator"
import Cookies from "js-cookie"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_Timer[]
}

export async function getTimerByLocationOrFactory(id: string) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_TIMER}/find/filter`, {
    method: "POST",
    body: JSON.stringify({
      locationOrFactory: id,
    }),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return (await res.json()) as T_DBReturn
}

function useTimersByFactoryOrLocation(id: string) {
  const query = useQuery(["timers"], () => getTimerByLocationOrFactory(id), {
    cacheTime: SIXTEEN_HOURS,
    staleTime: TWELVE_HOURS,
    refetchOnWindowFocus: false,
  })
  return query
}
export default useTimersByFactoryOrLocation
