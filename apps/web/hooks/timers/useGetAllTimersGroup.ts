import {
  API_URL_TIMERS_MACHINECLASS,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"
export async function fetcherfn() {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_TIMERS_MACHINECLASS}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useGetAllTimersGroup() {
  const query = useQuery(["all-timers"], () => fetcherfn(), {})
  return query
}

export default useGetAllTimersGroup
