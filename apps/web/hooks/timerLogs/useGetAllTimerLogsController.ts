import {
  API_URL_TIMER_LOGS,
  REFETCH_ACTIVATED,
  REFETCH_TIME,
  SIXTEEN_HOURS,
  TWELVE_HOURS,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse, T_TimerLog } from "custom-validator"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_TimerLog[]
}

export async function getAllTimerLogsController({
  locationId,
  timerId,
}: {
  locationId: string
  timerId: string
  page?: number
  countPerPage?: number
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

// timer logs only for controller page
function useGetAllTimerLogsController({
  locationId,
  timerId,
}: {
  locationId: string
  timerId: string
  paginated?: boolean
  countPerPage?: number
}) {
  const query = useQuery(
    ["timer-logs-controller", locationId, timerId],
    () => getAllTimerLogsController({ locationId, timerId }),
    {
      refetchOnWindowFocus: false,
      enabled: !!locationId && !!timerId,
      cacheTime: 1000 * 60 * 60 * 24,
    }
  )
  return query
}
export default useGetAllTimerLogsController
