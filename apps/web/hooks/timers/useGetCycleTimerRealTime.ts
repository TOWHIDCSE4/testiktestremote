import {
  API_URL_CONTROLLER_TIMER,
  API_URL_CYCLE_TIMER,
  API_URL_EVENTS,
  API_URL_TIMER,
  ONE_DAY,
  REFETCH_ACTIVATED,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import {
  T_BackendResponse,
  T_ControllerTimer,
  T_CycleTimer,
} from "custom-validator"
import Cookies from "js-cookie"
import { useEffect } from "react"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_CycleTimer[]
}

export async function getCycleTimer(timerId: string | undefined) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_CYCLE_TIMER}/today?timerId=${timerId}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return (await res.json()) as T_DBReturn
}

function useGetCycleTimerRealTime(timerId: string) {
  const query = useQuery(
    ["cycle-timer-real-time", timerId],
    () => getCycleTimer(timerId),
    {
      // refetchInterval: REFETCH_ACTIVATED ? 1000 : false,
      refetchInterval: 2000,
      refetchOnReconnect: "always",
      refetchOnMount: "always",
      enabled: !!timerId,
    }
  )

  return query
}
export default useGetCycleTimerRealTime
