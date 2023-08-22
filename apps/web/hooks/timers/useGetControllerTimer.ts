import {
  API_URL_CONTROLLER_TIMER,
  API_URL_TIMER,
  ONE_DAY,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse, T_ControllerTimer } from "custom-validator"
import Cookies from "js-cookie"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: T_ControllerTimer[]
}

export async function getTodayControllerTimer(timerId: string | undefined) {
  const token = Cookies.get("tfl")
  const res = await fetch(
    `${API_URL_CONTROLLER_TIMER}/today?timerId=${timerId}`,
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

function useGetControllerTimer(timerId: string) {
  const query = useQuery(
    ["controller-timer", timerId],
    () => getTodayControllerTimer(timerId),
    {
      cacheTime: ONE_DAY,
      staleTime: ONE_DAY,
      refetchOnWindowFocus: false,
      enabled: !!timerId,
    }
  )
  return query
}
export default useGetControllerTimer
