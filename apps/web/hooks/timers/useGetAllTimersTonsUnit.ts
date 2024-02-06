import {
  API_URL_TIMERS_TONSUNIT,
  API_URL_TIMER,
  ONE_DAY,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function fetcherfn() {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_TIMERS_TONSUNIT}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useGetAllTimersTonsUnit() {
  const query = useQuery(["timers-tons-unit"], () => fetcherfn(), {
    refetchOnWindowFocus: false,
  })
  return query
}

export default useGetAllTimersTonsUnit
