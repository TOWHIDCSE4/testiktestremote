import {
  API_URL_TIMER_LOGS,
  ONE_DAY,
  REFETCH_ACTIVATED,
} from "../../helpers/constants"
import { useQuery } from "@tanstack/react-query"
import { T_BackendResponse } from "custom-validator"
import Cookies from "js-cookie"

type T_DBReturn = Omit<T_BackendResponse, "items"> & {
  items: {
    _id: string
    machine: string
    factory: string
    drawingNumber: string
    count: number
  }[]
}

export async function getLogByDate(jobId: string) {
  const token = Cookies.get("tfl")
  const res = await fetch(
    `${API_URL_TIMER_LOGS}/group-by-date?jobId=${jobId}`,
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

function useGetLogsByDate(jobId: string) {
  const query = useQuery(["logs-by-date", jobId], () => getLogByDate(jobId), {
    refetchOnWindowFocus: false,
    enabled: !!jobId,
    // refetchInterval: REFETCH_ACTIVATED ? 1000 : false,
  })
  return query
}
export default useGetLogsByDate
