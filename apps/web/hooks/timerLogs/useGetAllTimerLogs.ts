import {
  API_URL_TIMER_LOGS,
  SIXTEEN_HOURS,
  TWELVE_HOURS,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse, T_TimerLog } from "custom-validator"
import Cookies from "js-cookie"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_TimerLog[]
}

export async function getAllTimerLogs({
  locationId,
  timerId,
}: {
  locationId: string
  timerId: string
}) {
  const token = Cookies.get("tfl")
  const res = await fetch(
    `${API_URL_TIMER_LOGS}/timer?locationId=${locationId}&timerId=${timerId}`,
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

function useGetAllTimerLogs({
  locationId,
  timerId,
}: {
  locationId: string
  timerId: string
}) {
  const query = useQuery(
    ["timer-logs", locationId, timerId],
    () => getAllTimerLogs({ locationId, timerId }),
    {
      cacheTime: SIXTEEN_HOURS,
      staleTime: TWELVE_HOURS,
      refetchOnWindowFocus: false,
      enabled: !!locationId && !!timerId,
    }
  )
  return query
}
export default useGetAllTimerLogs
