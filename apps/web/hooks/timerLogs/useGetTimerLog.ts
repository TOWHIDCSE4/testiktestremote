import {
  API_URL_TIMER,
  API_URL_TIMER_LOGS,
  ONE_DAY,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function getTimerLog(id: string | undefined) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_TIMER_LOGS}/${id}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useGetTimerLog(id: string | undefined) {
  const query = useQuery(["part", id], () => getTimerLog(id), {
    cacheTime: ONE_DAY,
    staleTime: ONE_DAY,
    refetchOnWindowFocus: false,
    enabled: !!id,
  })
  return query
}
export default useGetTimerLog
