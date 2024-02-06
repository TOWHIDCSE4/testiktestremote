import {
  API_URL_TIMER,
  API_URL_TIMER_LOGS,
  ONE_DAY,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"

export async function getProductLogs(partId: string | undefined) {
  const token = Cookies.get("tfl")
  const res = await fetch(`${API_URL_TIMER_LOGS}/inventory/${partId}`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
  return await res.json()
}

function useGetProductLogs(partId: string | undefined) {
  const query = useQuery(
    ["product-logs", partId],
    () => getProductLogs(partId),
    {
      cacheTime: ONE_DAY,
      staleTime: ONE_DAY,
      refetchOnWindowFocus: false,
      enabled: !!partId,
    }
  )
  return query
}
export default useGetProductLogs
