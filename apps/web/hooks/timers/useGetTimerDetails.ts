import { API_URL_TIMER, ONE_DAY } from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_Timer } from "custom-validator"
import Cookies from "js-cookie"

export async function getTimerDetails(id: string | undefined) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_TIMER}/${id}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useGetTimerDetails(
  id: string | undefined,
  onTimerDetailLoad?: (t: T_Timer) => void
) {
  const query = useQuery(["timer", id], () => getTimerDetails(id), {
    cacheTime: ONE_DAY,
    staleTime: ONE_DAY,
    onSettled: (data) => {
      if (onTimerDetailLoad) {
        onTimerDetailLoad(data.item)
      }
    },
    refetchOnWindowFocus: false,
    enabled: !!id,
  })
  return query
}
export default useGetTimerDetails
