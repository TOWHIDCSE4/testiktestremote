import { API_URL_TIMER_LOGS } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse, T_TimerLogCount } from "custom-validator"
import Cookies from "js-cookie"

type T_DBReturn = Omit<T_BackendResponse, "item"> & {
  item: T_TimerLogCount
}

export async function getAllTimerLogsCount({
  locationId,
  timerId,
}: {
  locationId: string
  timerId: string
}) {
  const token = Cookies.get("tfl")
  const res = await fetch(
    `${API_URL_TIMER_LOGS}/timer/unit-created/count?locationId=${locationId}&timerId=${timerId}`,
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

function useGetAllTimerLogsCount({
  locationId,
  timerId,
}: {
  locationId: string
  timerId: string
}) {
  const query = useQuery(
    ["timer-logs-count", locationId, timerId],
    () => getAllTimerLogsCount({ locationId, timerId }),
    {
      enabled: !!locationId && !!timerId,
      // refetchInterval: 2000,
      refetchOnReconnect: "always",
      refetchOnMount: "always",
    }
  )

  return query
}
export default useGetAllTimerLogsCount
