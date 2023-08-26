import {
  API_URL_TIMER_LOGS,
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

export async function getAllTimerLogs({
  locationId,
  timerId,
  page,
}: {
  locationId: string
  timerId: string
  page?: number
}) {
  const token = Cookies.get("tfl")
  const res = await fetch(
    `${API_URL_TIMER_LOGS}/timer?locationId=${locationId}&timerId=${timerId}&page=${page}`,
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
  paginated = false,
}: {
  locationId: string
  timerId: string
  paginated?: boolean
}) {
  const [page, setPage] = useState(paginated ? 1 : undefined)
  const query = useQuery(
    ["timer-logs", locationId, timerId, page],
    () => getAllTimerLogs({ locationId, timerId, page }),
    {
      cacheTime: SIXTEEN_HOURS,
      staleTime: TWELVE_HOURS,
      refetchOnWindowFocus: false,
      enabled: !!locationId && !!timerId,
    }
  )
  useEffect(() => {
    if (paginated && page && page > 1) {
      query.refetch()
    }
  }, [page])
  return { ...query, page, setPage }
}
export default useGetAllTimerLogs
